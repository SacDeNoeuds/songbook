import { flow, preventDefault } from "@std/functions"
import { getTextareaValueFromEvent } from "dom-kit"
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
      disabled={() => !model.result().success}
    >
      <fieldset>
        <label for="import-songbook">Copy-paste the file content here</label>

        <textarea
          value={model.value}
          oninput={flow(getTextareaValueFromEvent, model.value.set)}
          rows={10}
        />

        <small>
          {() =>
            model.result().success ? "Invalid JSON snapshot" : "All good ✅"
          }
        </small>
      </fieldset>
    </form>
  )
}
