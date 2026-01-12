import { stringifyJson } from '@std/functions'
import { MimeType } from '@std/mime-types'
import {
  Signal,
  type ReadonlySignal,
} from '@std/signal'
import { ActionToConfirm } from '@std/signal/action-to-confirm'
import type { Song } from '../entities/song'
import { ImportSongbookModel } from './import-songbook-model'
import { SongFormModel } from './song-form-model'
import type { SongbookStore } from './store'

export type SongbookModel = {  
  songFormModel: ReadonlySignal<SongFormModel | undefined>
  closeSongForm: () => void
  songs: ReadonlySignal<Song[]>
  editSong: (song: Song) => void
  addSong: () => void
  deleteSongActionToConfirm: ActionToConfirm<[song: Song], void>
  export: () => Promise<void>

  importFormModel: Signal<ImportSongbookModel | undefined>
  openImportForm: () => void
  closeImportForm: () => void
  asViewer: Signal<boolean>
}

type Deps = {
  store: SongbookStore
}

export const SongbookModel = ({ store }: Deps): SongbookModel => {
  const songFormModel = Signal<SongFormModel | undefined>(undefined)
  const closeSongForm = () => songFormModel.set(undefined)
  const asViewer = Signal(true) // default
  const deleteSong = ActionToConfirm((song: Song) => {
    store.delete(song)
  })
  const importFormModel = Signal<ImportSongbookModel | undefined>(undefined)
  const closeImportForm = () => importFormModel.set(undefined)

  return {
    importFormModel,
    asViewer,
    songFormModel,
    deleteSongActionToConfirm: deleteSong,
    songs: store.songs,
    openImportForm: () => {
      const model = ImportSongbookModel({
        store,
        onSuccess: closeImportForm
      })
      importFormModel.set(model)
    },
    closeImportForm,
    closeSongForm,
    addSong: () => {
      songFormModel.set(SongFormModel({ store, onDone: closeSongForm }))
    },
    editSong: (song) => {
      songFormModel.set(SongFormModel({ store, song, onDone: closeSongForm }))
    },
    export: async () => {
      const anchor = document.createElement('a')
      anchor.download = 'songbook.json'
      const json = stringifyJson(await store.export(), 2)
      const blob = new Blob([json], { type: MimeType.Json })
      const url = URL.createObjectURL(blob)
      anchor.href = url
      anchor.click()
    },
  }
}
