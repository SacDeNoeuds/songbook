import { curry2 } from "@std/functions"
import { x } from "unhoax"

// export type SongId = Tagged<'SongId', number>
// export const SongId = D.NumberId<SongId>()

export type Song = {
  // id: SongId
  artist: string
  title: string
  links: string[]
  notes?: string
}

export const Song = x.typed<Song>().object({
  // id: SongId,
  artist: x.string,
  title: x.string,
  // TODO: refine string as `URL`
  links: x.array(x.string)
    .map((links) => links.filter(Boolean))
    .size({ max: 20 }),
  notes: x.string
    .size({ min: 0, max: 100_000 })
    .map((value) => value || undefined)
    .optional(),
})

export const isSameSong = curry2((a: Song, b: Song) => {
  return (
    a.artist.toLowerCase() === b.artist.toLowerCase() &&
    a.title.toLowerCase() === b.title.toLowerCase()
  )
})
