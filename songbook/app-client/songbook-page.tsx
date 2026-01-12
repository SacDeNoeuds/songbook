import { maybe } from '@std/adt/maybe'
import { flow } from '@std/functions'
import { ConfirmDialog, Dialog } from '@ui-kit/app-client'
import {
  ImportSongbookForm,
  ImportSongbookSubmitButton,
} from './import-songbook-component'
import { SongForm, SongFormSubmitButton } from './song-form'
import { SongList } from './song-list'
import type { SongbookModel } from './songbook-model'

interface Props {
  model: SongbookModel
}

export const SongbookPage = ({ model }: Props) => {
  return (
    <div>
      <Header model={model} />

      <div a-stacker="inline center/center" is-padded="inline block-end">
        <div a-card is-padded style="min-inline-size: min(40rem, 100%);">
          {() => {
            if (model.asViewer()) return <SongList songs={model.songs()} />
            return (
              <SongList
                songs={model.songs()}
                onEdit={model.editSong}
                onDelete={model.deleteSongActionToConfirm.trigger}
              />
            )
          }}
        </div>
      </div>

      <Dialog opened={() => !!model.songFormModel()} onClose={model.closeSongForm}>
        <header>
          <h3>Song Form</h3>
        </header>

        {flow(
          model.songFormModel,
          maybe.map((model) => <SongForm model={model} />),
        )}

        <footer a-stacker="inline end/center">
          <button type="button" class="discrete" onclick={model.closeSongForm}>
            Cancel
          </button>
          <SongFormSubmitButton />
        </footer>
      </Dialog>

      <ConfirmDialog
        action={model.deleteSongActionToConfirm}
        heading="Delete Song?"
        message={(song) =>
          `Are you sure you want to delete ${song.artist} – ${song.title}?`
        }
      />

      <Dialog
        opened={() => !!model.importFormModel()}
        onClose={model.closeImportForm}
        onclose={model.closeImportForm}
      >
        <header>
          <h3>Import Songbook</h3>
        </header>

        {() => {
          const form = model.importFormModel()
          if (!form) return undefined
          return <ImportSongbookForm model={form} />
        }}

        <footer a-stacker="inline gap-s end/center">
          <button
            type="button"
            class="discrete"
            onclick={model.closeImportForm}
          >
            Cancel
          </button>
          <ImportSongbookSubmitButton />
        </footer>
      </Dialog>
    </div>
  )
}

const Header = ({ model }: Props) => {
  return (
    <header is-padded a-stacker="gap-s">
      <div a-stacker="inline gap-s center">
        <button
          class="discrete"
          onclick={() => model.asViewer.update((v) => !v)}
        >
          {() => (model.asViewer() ? 'As editor' : 'As viewer')}
        </button>

        <button class="discrete" onclick={model.addSong}>
          New Song
        </button>

        <button class="discrete button" onclick={model.openImportForm}>
          Import
        </button>

        <button class="discrete" onclick={model.export}>
          Download
        </button>
      </div>

      <hr />
    </header>
  )
}
