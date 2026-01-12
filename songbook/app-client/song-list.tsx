import { array } from '@std/adt/array'
import { iterable } from '@std/adt/iterable'
import { maybe } from '@std/adt/maybe'
import { record } from '@std/adt/record'
import { struct } from '@std/adt/struct'
import { flow } from '@std/functions'
import { Signal } from '@std/signal'
import { Dialog, Table } from '@ui-kit/app-client'
import { getInputValueFromEvent } from 'dom-kit'
import type { Song } from '../entities/song'

type Props = {
  songs: Song[]
  onEdit?: (song: Song) => void
  onDelete?: (song: Song, index: number) => void
}

export const SongList = ({ songs, onEdit, onDelete }: Props) => {
  const search = Signal('')
  const openedSongLinks = Signal<Song | undefined>(undefined)
  const openedSongNotes = Signal<Song | undefined>(undefined)
  const list = songs.map((s, i) => ({ ...s, index: i }))
  const filtered = () => {
    const s = search().toLowerCase()
    return list.filter((song) => {
      return (
        song.title.toLowerCase().includes(s) ||
        song.artist.toLowerCase().includes(s) ||
        song.notes?.toLowerCase().includes(s)
      )
    })
  }

  return (
    <div a-stacker>
      <fieldset a-card>
        <label for="search">Search</label>
        <input
          type="text"
          id="search"
          value={search}
          oninput={flow(getInputValueFromEvent, search.set)}
        />
        <small>You can search by artist and/or title, even notes!</small>
      </fieldset>

      <OpenedNotesDialog song={openedSongNotes} />
      <OpenedLinksDialog song={openedSongLinks} />

      <div
        style="overflow-x: auto; max-inline-size: calc(100vi - var(--space-m)*4);"
        is-padded="block-end"
      >
        <Table
          columns={['min', 'flex', 'min']}
          variant="striped"
          a-card
          is-bordered
        >
          <thead>
            <tr>
              <th style="text-align: left;">Artist</th>
              <th style="text-align: left; border-inline: var(--border-thin);">
                Title
              </th>
              <th style="text-align: left;">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flow(
                filtered,
                iterable.groupBy((song) => song.artist),
                record.entries,
                array.sort(([a], [b]) => a.localeCompare(b)),
                array.map(([_, songs]) => songs),
                array.map(array.sort((a, b) => a.title.localeCompare(b.title))),
                array.map(
                  array.map((song, index, songs) => {
                    return (
                      <SongRow
                        song={song}
                        isFirstRowOfArtist={index === 0}
                        artistSongCount={songs.length}
                        onOpenLinks={openedSongLinks.set}
                        onOpenNotes={openedSongNotes.set}
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                    )
                  }),
                ),
                array.toNonEmpty,
                maybe.or(() => (
                  <tr>
                    <td colspan={3} a-stacker="inline center">
                      {search()
                        ? 'No results'
                        : 'You don’t have any songs yet.'}
                    </td>
                  </tr>
                )),
              )}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

interface SongRowProps {
  song: Song & { index: number }
  isFirstRowOfArtist: boolean
  artistSongCount: number
  onOpenLinks: (song: Song) => void
  onOpenNotes: (song: Song) => void
  onEdit?: (song: Song) => void
  onDelete?: (song: Song, index: number) => void
}
const SongRow = (props: SongRowProps) => {
  return (
    <tr>
      {props.isFirstRowOfArtist && (
        <td rowspan={props.artistSongCount} a-stacker="inline start/center">
          {props.song.artist}
        </td>
      )}
      <td
        a-stacker="inline start/center"
        style="border-inline: var(--border-thin);"
      >
        {props.song.title}
      </td>
      <td class="small" a-stacker="inline nowrap gap-s center/end">
        <button
          type="button"
          class="icon"
          aria-label="Show Links"
          onclick={() => props.onOpenLinks(props.song)}
        >
          🔗
        </button>
        {props.onEdit && (
          <button
            type="button"
            class="icon"
            aria-label="Edit"
            onclick={() => props.onEdit?.(props.song)}
          >
            ✏️
          </button>
        )}
        {props.onDelete && (
          <button
            type="button"
            class="icon"
            aria-label="Delete"
            onclick={() => props.onDelete?.(props.song, props.song.index)}
          >
            🗑️
          </button>
        )}
        <button
          type="button"
          class="icon"
          aria-label="Open Notes"
          disabled={!props.song.notes}
          onclick={() => props.onOpenNotes(props.song)}
        >
          🗒️
        </button>
      </td>
    </tr>
  )
}

interface OpenedNotesDialogProps {
  song: Signal<Song | undefined>
}
const OpenedNotesDialog = ({ song }: OpenedNotesDialogProps) => {
  return (
    <Dialog opened={() => !!song()} onClose={() => song.set(undefined)}>
      <header>
        <h3>
          {() => song()?.artist}
          {' – '}
          {() => song()?.title}
        </h3>
      </header>

      <div>{() => song()?.notes}</div>

      <footer a-stacker="inline end/center">
        <button type="button" onclick={() => song.set(undefined)}>
          Close
        </button>
      </footer>
    </Dialog>
  )
}

interface OpenedLinksDialogProps {
  song: Signal<Song | undefined>
}
const OpenedLinksDialog = ({ song }: OpenedLinksDialogProps) => {
  return (
    <Dialog
      class="narrow"
      opened={() => !!song()}
      onClose={() => song.set(undefined)}
    >
      <header>
        <h3>
          {() => {
            const { artist = '', title = '' } = song() ?? {}
            return `${artist} – ${title}`
          }}
        </h3>
      </header>
      <div a-stacker="gap-s" is-padded="l block">
        {flow(
          song,
          maybe.map(struct.get('links')),
          maybe.map(
            array.map((link, index) => (
              <div a-stacker="inline between/center">
                <span>Link #{index + 1}</span>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onclick={() => song.set(undefined)}
                >
                  {new URL(link).host}
                </a>
              </div>
            )),
          ),
        )}
      </div>
      <footer a-stacker="inline gap-s end/center">
        <button type="button" onclick={() => song.set(undefined)}>
          Close
        </button>
      </footer>
    </Dialog>
  )
}
