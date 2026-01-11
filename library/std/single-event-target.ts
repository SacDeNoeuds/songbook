import { apply } from './functions'

export type Unsubscribe = {
  kind: 'unsubscribe'
  (): void
}
const Unsubscribe = (fn: () => void) =>
  Object.assign(() => fn(), { kind: 'unsubscribe' }) as Unsubscribe

export type SingleEventTarget<T> = {
  listen: (listener: (next: T) => unknown) => Unsubscribe
  notify: (value: T) => void
  dispose: () => void
}

export const SingleEventTarget = <T>(): SingleEventTarget<T> => {
  const listeners = new Set<(next: T) => unknown>()
  return {
    listen: (listener): Unsubscribe => {
      listeners.add(listener)
      return Unsubscribe(() => listeners.delete(listener))
    },
    notify: (value) => listeners.forEach(apply(value)),
    dispose: () => listeners.clear(),
  }
}

export const listenOnce = <T>(
  target: SingleEventTarget<T>,
  listener: (value: T) => unknown,
): Unsubscribe => {
  const unsubscribe = target.listen(proxy)
  function proxy(value: T) {
    listener(value)
    unsubscribe()
  }
  return unsubscribe
}

export type Subscriptions = Set<Unsubscribe>
export const unsubscribeAll = (subscriptions: Set<Unsubscribe>) =>
  subscriptions.forEach(apply())
export const UnsubscribeAll = (subscriptions: Set<Unsubscribe>) =>
  Unsubscribe(() => unsubscribeAll(subscriptions))
