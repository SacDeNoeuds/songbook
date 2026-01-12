import { maybe } from "@std/adt/maybe"
import { flow, preventDefault } from "@std/functions"
import { getInputFromEvent } from "dom-kit/get-control-value"
import type { ComponentProps } from "dom-kit/jsx/jsx-runtime"
import { ImportSongbookModel } from "./import-songbook-model"

type NativeProps = Omit<ComponentProps<"form">, "onsubmit">
interface Props extends NativeProps {
  model: ImportSongbookModel
}

export const ImportSongbookSubmitButton = (
  props: Omit<ComponentProps<"button">, "form" | "type">,
) => {
  return (
    <button {...props} type="submit" form="import-songbook-form">
      {props.children ?? "Import"}
    </button>
  )
}

export const ImportSongbookForm = ({ model, ...rest }: Props) => {
  return (
    <form
      {...rest}
      a-stacker
      id="import-songbook-form"
      onsubmit={preventDefault(model.import)}
      disabled={model.isFormDisabled}
    >
      <fieldset>
        <label for="import-songbook">Load the file content here</label>

        <input
          type="file"
          onchange={flow(
            getInputFromEvent,
            maybe.map((input) => input.files?.[0]),
            model.file.set,
          )}
        />

        <small>
          {() => model.error() || "All good ✅"}
        </small>
      </fieldset>
    </form>
  )
}
