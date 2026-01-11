import { isFunction, type AnyFunction } from '../std/functions'
import { effect } from '../std/signal'
import { renderChildren, type Children } from './create-node'
import type { HTMLElements } from './jsx/jsx'
import { onDisconnected } from './lifecycle'

export type ElementProps<Tag extends keyof HTMLElements> = {
  [Key in keyof HTMLElements[Tag]]?: Key extends `on${string}`
    ? HTMLElements[Tag][Key]
    : HTMLElements[Tag][Key] | (() => HTMLElements[Tag][Key])
} & {
  ref?: (
    element: HTMLElementTagNameMap[Extract<Tag, keyof HTMLElementTagNameMap>],
  ) => unknown
}

// let lastId = 1
// const nextId = () => ++lastId

export const createElement =
  <Tag extends keyof HTMLElements>(tag: Tag) =>
  (attributes: ElementProps<Tag>) =>
  (...children: Children[]) => {
    const element =
      reuseElementWithId(attributes.id, tag) ||
      document.createElement(tag as keyof HTMLElementTagNameMap)

    // element.dataset.id ??= String(nextId()) // nextId is not called when dataset.id is defined

    renderChildren(element, ...children)
    for (const [key, value] of Object.entries(attributes)) {
      key === 'ref'
        ? (value as any)(element)
        : isEventHandler(key, value)
        ? setEventHandler(element, key, value)
        : isFunction(value)
        ? setSignalAttribute(element, key, value)
        : setAttribute(element, key, value)
    }
    return element
  }

const reuseElementWithId = (
  id: unknown,
  tag: keyof HTMLElements,
): HTMLElement | undefined => {
  if (typeof id !== 'string') return undefined
  const element = document.getElementById(id)
  if (
    element &&
    element.isConnected &&
    element.nodeName.toLowerCase() !== tag
  ) {
    throw new Error(`an element already exists with id "${element}"`)
  }
  return element ?? undefined
}

const isEventHandler = (key: string, value: unknown): value is AnyFunction => {
  // NOTE: no native attributes starts with `on_`, therefore no conflict.
  return isFunction(value) && key.startsWith('on')
}

const setEventHandler = (
  element: HTMLElement,
  event: string,
  handler: (event: any) => any,
) => {
  const eventName = event.replace('on', '').toLowerCase()
  element.addEventListener(eventName, handler)
}

const setAttribute = (element: HTMLElement, key: string, value: unknown) => {
  if (key === 'checked') return ((element as any)[key] = value)
  if (key === 'value')
    return ((element as any)[key] = ((value ?? '') as string)
      .replaceAll('\u00A0', ' ')
      .replace(/ $/, '\u00A0'))
  if (typeof value === 'boolean') element.toggleAttribute(key, value)
  else element.setAttribute(key, String(value))
}

const setSignalAttribute = (
  element: HTMLElement,
  key: string,
  value: () => unknown,
) => {
  const { dispose } = effect(() => {
    setAttribute(element, key, value())
  })
  onDisconnected(element, dispose)
}
