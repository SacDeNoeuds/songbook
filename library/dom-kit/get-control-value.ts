import { flow, isInstanceOf } from '../std/functions'

type ElementWithValue =
  | typeof HTMLInputElement
  | typeof HTMLSelectElement
  | typeof HTMLTextAreaElement
const getControlValue = <T extends ElementWithValue>(Element: T) =>
  flow(getControl(Element), (control) => control?.value ?? '')

const getControl = <T extends ElementWithValue>(Element: T) => {
  const isElement = isInstanceOf(Element)
  return (event: Event) => (isElement(event.target) ? event.target : undefined)
}
export const getInputFromEvent = getControl(HTMLInputElement)
export const getSelectFromEvent = getControl(HTMLSelectElement)
export const getTextareaFromEvent = getControl(HTMLTextAreaElement)

export const getSelectValueFromEvent = getControlValue(HTMLSelectElement)
export const getInputValueFromEvent = getControlValue(HTMLInputElement)
export const getTextareaValueFromEvent = getControlValue(HTMLTextAreaElement)
