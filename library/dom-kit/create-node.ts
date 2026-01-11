import { absurd, isFunction, isInstanceOf } from '../std/functions'
import { effect, type ReadonlySignal } from '../std/signal'
import { onDisconnected } from './lifecycle'

const raw = Symbol('RawHTML')
type RawHtml = {
  [raw]: string
}

export type Children = Child | Child[] | SignalChild
type SignalChild = ReadonlySignal<Child | Child[]>
type Child = string | number | boolean | null | undefined | Node | RawHtml

export const rawHtml = (html: string): RawHtml => ({ [raw]: html })

/**
 * Here is the distingo between Children and ChildList:
 * renderChildren(textChild, childList) // children = ...[textChild, childList]
 */

export const renderChildren = (
  element: Element | DocumentFragment,
  ...children: Children[]
) => {
  children.flat(5).forEach((child) => {
    isFunction(child)
      ? renderSignalChild(element, child)
      : renderChild(element, child)
  })
}

const renderChild = (element: Element | DocumentFragment, child: Child) => {
  const nodes = childToNodes(child)
  nodes.forEach((node) => {
    if (!element.contains(node)) element.append(node)
  })
}

const renderSignalChild = (
  element: Element | DocumentFragment,
  child: SignalChild,
) => {
  let previousNodes: Node[] = []
  // let previousNode: Node;
  // TODO: use an anchor with `display: contents` to do fragments ?
  // const anchor = document.createElement('span')
  // anchor.style.display = 'contents';
  // element.append(anchor)
  const { dispose } = effect(() => {
    const childOrList = child()
    const asList = Array.isArray(childOrList) ? childOrList : [childOrList]
    const nodes = asList.flat(2).flatMap(childToNodes)
    // anchor.replaceChildren(...nodes)
    const anchor = previousNodes[0]

    if (!anchor || anchor.parentElement !== element) element.append(...nodes)
    else {
      // the anchor is usually part of the list.
      const anchorCopy = document.createTextNode('')
      element.insertBefore(anchorCopy, anchor)
      previousNodes.forEach((node) => element.removeChild(node))
      nodes.forEach((node) => element.insertBefore(node, anchorCopy))
      element.removeChild(anchorCopy)
    }
    previousNodes = nodes
  })
  onDisconnected(element, dispose)
}

// const renderChildList = (
//   element: Element | DocumentFragment,
//   list: Child[] | SignalChild[],
// ) => {
//   // TODO: Replace elements one by one instead of whole list.
//   // const previous = previousList.get(element) ?? [];
//   element.replaceChildren()
//   list.forEach((child) => {
//     renderChildren(element, child)
//   })
// }

const isNode = isInstanceOf(Node)
export const childToNodes = (child: Child | SignalChild): Node[] => {
  if (isNode(child)) return [child]
  if (child === undefined || child === null)
    return [document.createTextNode('')]
  if (typeof child === 'boolean') return [document.createTextNode('')]
  if (typeof child === 'number') return [document.createTextNode(String(child))]
  if (typeof child === 'string') return [document.createTextNode(child)]
  if (typeof child === 'object' && raw in child) {
    const node = document.createElement('div')
    node.outerHTML = child[raw]
    return [node]
  }
  if (isFunction(child)) {
    const childOrList = child()
    return Array.isArray(childOrList)
      ? childOrList.flatMap(childToNodes)
      : childToNodes(childOrList)
  }
  absurd(child)
}
