import { Signal, type ReadonlySignal } from "@std/signal"
import { openObjectDatabase } from "dom-kit/indexed-db"
import { x } from "unhoax"
import { Song } from "../entities/song"

export interface SongbookSnapshot {
  version: 1
  songs: Song[]
}

export const SongbookSnapshot = x.typed<SongbookSnapshot>().object({
  version: x.literal(1),
  songs: x.array(Song).size({ min: 1 }),
})

export interface SongbookStore {
  // FIXME: turn into a ReadonlySignal<RemoteData<unknown, Song[]>>, RemoteData to define.
  songs: ReadonlySignal<Song[]>
  save: (...songs: Song[]) => Promise<void>
  delete: (song: Song) => Promise<void>
  import: (snapshot: SongbookSnapshot) => Promise<void>
  export: () => Promise<SongbookSnapshot>
}

type SongKey = [Song["artist"], Song["title"]]
const SongKey = (song: Song): SongKey => [song.artist, song.title] as const

export const SongbookIndexedDbStore = (): SongbookStore => {
  const db = openObjectDatabase<SongKey, Song>({
    database: "Songbook",
    store: "songs",
    version: 1,
  })
  const songs = Signal<Song[]>([])
  const store: SongbookStore = {
    songs,
    save: async (...songs) => {
      for (const song of songs) await db.set(SongKey(song), song)
      await loadSongs()
    },
    delete: async (song) => {
      await db.remove(SongKey(song))
      await loadSongs()
    },
    import: async (snapshot) => {
      await store.save(...snapshot.songs)
      await loadSongs()
    },
    export: async () => {
      const songs = await db.list()
      return { version: 1, songs }
    },
  }
  void loadSongs()
  return store

  async function loadSongs() {
    songs.set(await db.list())
  }
}
