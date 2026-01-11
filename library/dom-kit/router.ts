import { struct } from '../std/adt/struct'
import { Context } from '../std/context'
import { pipe } from '../std/functions'
import {
  effect,
  Signal,
  untrack,
  type ReadonlySignal,
} from '../std/signal'
import type { PathParameters } from '../std/types'
import type { History } from './history'

export type Router<Route> = {
  current: ReadonlySignal<Route | undefined>
  push: History['push']
  replace: History['replace']
  back: History['back']
}

export type RouteProxy = {
  proxyRoute: (options: {
    matched: string
    url: URL
  }) => <Fn extends (...args: any[]) => any>(fn: Fn) => Fn
}

export const [provideRouteProxy, useRouteProxy] =
  Context<RouteProxy>('router-proxy')

export const Router =
  <Route>({
    history,
    basePath = '',
  }: {
    history: History
    basePath?: string
  }) =>
  <Paths extends string>(routes: {
    [Key in Paths]: (options: {
      url: URL
      pathname: string
      params: PathParameters<Key>
    }) => Route
  }) => {
    const { proxyRoute } = useRouteProxy()
    const resolve = (url: URL): Route | undefined => {
      return pipe(
        routes,
        struct.findFirstMap((makeRoute, pathname) => {
          const pathWithBase = `${basePath}${pathname}`
          const pattern = new URLPattern({ pathname: pathWithBase })
          const result = pattern.exec(url)
          const params = result?.pathname.groups
          const make =
            params && proxyRoute({ matched: pathWithBase, url })(makeRoute)
          const route = make?.({ url, pathname, params: params as any })
          return route
        }),
      )
    }

    let isFirstEffect = true
    const current = Signal(resolve(untrack(history.current)))
    effect(() => {
      const url = history.current() // subscribe
      if (isFirstEffect) isFirstEffect = false
      else current.set(resolve(url))
    })

    const router: Router<Route> = {
      current,
      push: (path) => history.push(`${basePath}${path}`),
      replace: (path) => history.replace(`${basePath}${path}`),
      back: history.back,
    }

    return router
  }
