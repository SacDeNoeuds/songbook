import { cast, parseJson } from "@std/functions"
import { Signal, type ReadonlySignal } from "@std/signal"
import { x } from "unhoax"
import { SongbookSnapshot, type SongbookStore } from "./store"

export type ImportSongbookModel = {
  value: Signal<string>
  result: ReadonlySignal<x.ParseResult<SongbookSnapshot>>
  import: () => Promise<void>
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
  const value = Signal("")
  const result = (): x.ParseResult<SongbookSnapshot> => {
    return SongbookSnapshotFromJson.parse(value())
  }
  return {
    value,
    result,
    import: async () => {
      const data = result()
      if (!data.success) {
        return alert('cannot import because parsing from json failed')
      }

      await store.import(data.value)
      onSuccess?.()
    },
  }
}
