import { cast, parseJson } from "@std/functions"
import { Signal, type ReadonlySignal } from "@std/signal"
import { readFile } from 'dom-kit/read-file'
import { x } from "unhoax"
import { SongbookSnapshot, type SongbookStore } from "./store"

export type ImportSongbookModel = {
  file: Signal<File | undefined>
  error: ReadonlySignal<string | undefined>
  import: () => Promise<void>
  isFormDisabled: ReadonlySignal<boolean>
}

const SongbookSnapshotFromJson = x.string
  .size({ min: 2, max: 1_000_000 })
  .map((str) => {
    try {
      return parseJson(str)
    } catch (error) {
      return new Error("failed to parse json", { cause: error })
    }
  })
  .convertTo(SongbookSnapshot, cast)

type Deps = {
  store: SongbookStore
  onSuccess?: () => void
}
export const ImportSongbookModel = ({
  store,
  onSuccess,
}: Deps): ImportSongbookModel => {
  const error = Signal<string | undefined>(undefined)
  const model: ImportSongbookModel = {
    file: Signal<File | undefined>(undefined),
    error,
    isFormDisabled: () => !model.file() || !!model.error(),
    import: async () => {
      const file = model.file()
      if (!file) return
      const value = await readFile(file)
      const result = SongbookSnapshotFromJson.parse(value)
      error.set(result.success ? undefined : 'cannot import because parsing from json failed')

      if (!result.success) return

      await store.import(result.value)
      onSuccess?.()
    },
  }
  return model
}
