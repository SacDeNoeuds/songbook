import { flow } from '../../std/functions'
import { childToNodes, rawHtml } from '../create-node'
import type { Children, Component } from './jsx-runtime'

export type { Children, Component }

export const RawHtml = (props: { children?: string }) => {
  return childToNodes(rawHtml(props.children ?? ''))
}

export const Show: Component<{ when: () => unknown }> = (props) => {
  return <>{flow(props.when, (when) => (when ? props.children : null))}</>
}
