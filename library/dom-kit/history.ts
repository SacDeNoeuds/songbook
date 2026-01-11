import { Context } from '../std/context'
import { apply, pipe } from '../std/functions'
import { Signal } from '../std/signal'

export type History = {
  current: Signal<URL>
  block: (hook: () => Promise<void>) => { unblock: () => void }
  push: (path: string) => void
  replace: (path: string) => void
  back: () => void
  destroy: () => void
}

export const [provideHistory, useHistory] = Context<History>('history')

const defaultHref = () =>
  typeof window === 'undefined' ? '/' : window.location.href

const isSameUrl = (a: URL, b: URL) => a.href === b.href

export const BrowserHistory = ({ href = defaultHref() } = {}) => {
  let removePopStateListener = () => {}
  const baseHref =
    typeof window === 'undefined' ? 'http://localhost' : window.location.href

  const blockers = new Set<() => Promise<void>>()
  const afterBlock = (fn: () => void) => {
    pipe(
      blockers.size === 0
        ? Promise.resolve()
        : Promise.all(Array.from(blockers).map(apply())),
      (p) => p.then(fn),
    )
  }
  const history: History = {
    current: Signal(new URL(href, baseHref), { equals: isSameUrl }),
    block: (fn) => {
      blockers.add(fn)
      return { unblock: () => void blockers.delete(fn) }
    },
    push: (path) => {
      const url = new URL(path, baseHref)
      afterBlock(() => {
        window.history.pushState(null, '', url)
        history.current.set(url)
      })
    },
    replace: (path) => {
      const url = new URL(path, baseHref)
      afterBlock(() => {
        window.history.replaceState(null, '', url)
        history.current.set(url)
      })
    },
    back: () => window.history.back(),
    destroy: () => {
      removePopStateListener()
    },
  }
  if (typeof window !== 'undefined') {
    const listener = () => history.current.set(new URL(window.location.href))
    window.addEventListener('popstate', listener)
    removePopStateListener = () =>
      window.removeEventListener('popstate', listener)
  }
  return history
}

export const MemoryHistory = ({
  href = '/',
  baseHref = 'http://localhost',
}: { href?: string; baseHref?: string } = {}) => {
  const memory: URL[] = []
  const blockers = new Set<() => Promise<void>>()
  const afterBlock = (fn: () => void) => {
    pipe(
      blockers.size === 0
        ? Promise.resolve()
        : Promise.all(Array.from(blockers).map(apply())),
      (p) => p.then(fn),
    )
  }
  const history: History = {
    current: Signal(new URL(href, baseHref), { equals: isSameUrl }),
    block: (fn) => {
      blockers.add(fn)
      return { unblock: () => void blockers.delete(fn) }
    },
    destroy: () => {},
    push: (path) => setCurrent(path),
    replace: (path) => setCurrent(path),
    back: () => {
      const previous = memory.pop()
      if (!previous) return
      history.current.set(previous)
    },
  }

  const setCurrent = (path: string) => {
    afterBlock(() => {
      memory.push(history.current())
      history.current.set(new URL(path, baseHref))
    })
  }
  return history
}
