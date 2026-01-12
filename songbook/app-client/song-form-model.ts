import { Signal } from '@std/signal'
import type { x } from 'unhoax'
import { Song } from '../entities/song'
import type { SongbookIndexedDbStore } from './store'

export type SongFormModel = {
  values: {
    artist: Signal<string>
    title: Signal<string>
    links: Signal<string[]>
    notes: Signal<string>
  }
  issues: Signal<ReadonlyArray<x.ParseIssue> | undefined>
  submit: () => Promise<void>
}

type Deps = {
  store: SongbookIndexedDbStore
  onDone?: () => void
  song?: Song
}

export const SongFormModel = ({
  song: initial,
  store,
  onDone,
}: Deps): SongFormModel => {
  const model: SongFormModel = {
    issues: Signal<ReadonlyArray<x.ParseIssue> | undefined>(undefined),
    values: {
      artist: Signal<string>(initial?.artist.toString() ?? ''),
      title: Signal<string>(initial?.title.toString() ?? ''),
      links: Signal(initial?.links ?? ['']),
      notes: Signal(initial?.notes?.toString() ?? ''),
    },
    submit: async () => {
      const result = Song.parse({
        artist: model.values.artist(),
        title: model.values.title(),
        links: model.values.links(),
        notes: model.values.notes(),
      })
      if (!result.success) return model.issues.set(result.issues)
      model.issues.set(undefined);
      await store.save(result.value);
      onDone?.()
    },
  }

  return model
}
