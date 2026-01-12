import { array } from "@std/adt/array"
import { iterable } from "@std/adt/iterable"
import { maybe } from "@std/adt/maybe"
import { flow, pipe, preventDefault } from "@std/functions"
import { mapArray } from "@std/signal"
import type { Except } from "@std/types"
import { getInputValueFromEvent, getTextareaValueFromEvent } from "dom-kit"
import type { ComponentProps } from "dom-kit/jsx/jsx-runtime"
import type { SongFormModel } from "./song-form-model"

type NativeProps = Except<ComponentProps<"form">, "onsubmit" | "id">
interface Props extends NativeProps {
  model: SongFormModel
}

export const SongFormSubmitButton = (
  props: Except<ComponentProps<"button">, "type" | "form">,
) => (
  <button {...props} type="submit" form="song-form">
    {props.children ?? "Save"}
  </button>
)

export const SongForm = ({ model, ...props }: Props) => {
  return (
    <form
      a-stacker
      {...props}
      id="song-form"
      onsubmit={pipe(model.submit, preventDefault)}
    >
      <fieldset>
        <label for="artist-control">Artist</label>
        <input
          type="text"
          id="artist-control"
          value={model.values.artist}
          oninput={flow(getInputValueFromEvent, model.values.artist.set)}
        />
        <Issue field="artist" />
      </fieldset>

      <fieldset>
        <label for="title-control">Title</label>
        <input
          type="text"
          id="title-control"
          value={model.values.title}
          oninput={flow(getInputValueFromEvent, model.values.title.set)}
        />
        <Issue field="title" />
      </fieldset>

      <div a-stacker="gap-s">
        <div class="label" a-stacker="inline start/center">
          <h4>Links</h4>
          <button
            type="button"
            onclick={() => model.values.links.update(array.append(""))}
          >
            Add
          </button>
        </div>
        {mapArray(model.values.links, (link, index) => {
          return (
            <fieldset id={`link-group-${index + 1}`}>
              <label for={`link-control-${index + 1}`}>Link #{index + 1}</label>

              <div a-stacker="inline gap-s start/stretch">
                <input
                  type="url"
                  id={`link-control-${index + 1}`}
                  value={link}
                  oninput={flow(getInputValueFromEvent, (value) =>
                    model.values.links.update(array.setAt(index, value)),
                  )}
                />
                <button
                  type="button"
                  aria-label="Remove"
                  style="aspect-ratio: 1"
                  onclick={preventDefault(() => {
                    model.values.links.update(array.removeAt(index))
                  })}
                >
                  ×
                </button>
              </div>
            </fieldset>
          )
        })}
        <Issue field="links" />
      </div>

      <fieldset>
        <label for="notes-control">Notes</label>
        <textarea
          id="notes-control"
          value={model.values.notes}
          oninput={flow(getTextareaValueFromEvent, model.values.notes.set)}
          rows={10}
        />
      </fieldset>
    </form>
  )

  function getIssue(field: string) {
    return flow(
      model.issues,
      maybe.map(iterable.findFirst((issue) => issue.path[0] === field)),
    )
  }
  function Issue(props: { field: string }) {
    return (
      <>
        {flow(
          getIssue(props.field),
          maybe.map(() => <small>This field is required</small>),
        )}
      </>
    )
  }
}
