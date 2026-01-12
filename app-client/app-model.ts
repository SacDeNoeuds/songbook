import { SongbookModel } from '@app-client/songbook/songbook-model'
import { SongbookIndexedDbStore } from '@app-client/songbook/store'

export type AppModel = {
  songbook: SongbookModel
}

export type AppView =
  | SongbookView

type SongbookView = {
  view: 'songbook'
}

export const AppModel = (): AppModel => {
  return {
    songbook: SongbookModel({
      store: SongbookIndexedDbStore(),
    }),
  }
}
