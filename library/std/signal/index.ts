import { NumberId, deepEquals, flow, strictEquals } from '../functions'
import {
  SingleEventTarget,
  unsubscribeAll,
  type Unsubscribe,
} from '../single-event-target'

export type Signal<T> = {
  (): T
  readonly set: (next: T) => void
  readonly update: (updater: (current: T) => T) => void
}

export type ReadonlySignal<T> = {
  (): T
}

export type ComputedSignal<T> = {
  (): T
  readonly dispose: () => void
}

type ExecutionContext = {
  listener: () => void
  id: number
  subscribers: Set<Unsubscribe>
}
let context: ExecutionContext | undefined = undefined

export const Signal = <T>(
  initial: T,
  options?: { equals?: (a: T, b: T) => boolean },
): Signal<T> => {
  const equals = options?.equals ?? deepEquals
  const { listen, notify } = SingleEventTarget<T>()
  const read = () => {
    if (context) context.subscribers.add(listen(context.listener))
    return initial
  }

  const update = (updater: (current: T) => T) => {
    const next = updater(initial)
    if (equals(initial, next)) return
    initial = next
    notify(initial)
  }
  const set = (next: T) => update(() => next)

  return Object.assign(read, { set, update }) as Signal<T>
}

const none: unique symbol = Symbol()
export const internalComputed = <T>(
  fn: () => T,
  options?: { equals?: (a: T, b: T) => boolean },
): ComputedSignal<T> => {
  const equals = options?.equals ?? strictEquals
  const ctx: ExecutionContext = {
    id: NumberId(),
    listener: fnWithContext,
    subscribers: new Set(),
  }
  let previousResult: T | typeof none = none
  function fnWithContext() {
    context = ctx
    const result = fn()
    context = undefined
    const toReturn =
      previousResult === none || !equals(previousResult, result)
        ? result
        : previousResult
    return (previousResult = toReturn)
  }
  const dispose = () => unsubscribeAll(ctx.subscribers)
  return Object.assign(fnWithContext, { dispose }) as ComputedSignal<T>
}

export const effect = (callback: () => void): ComputedSignal<void> => {
  const fn = 'dispose' in callback ? callback : internalComputed(callback)
  fn()
  return fn as ComputedSignal<void>
}

export const untrack = <T>(signal: ReadonlySignal<T>) => {
  const ctx = context
  context = undefined
  const result = signal()
  context = ctx
  return result
}

export const mapArray = <T, U>(
  array: ReadonlySignal<T[]>,
  mapper: (value: ReadonlySignal<T>, index: number) => U,
  equals: (a: T, b: T) => boolean = deepEquals,
): ReadonlySignal<U[]> => {
  const signals: Signal<T>[] = []
  const arrayLength = Signal(untrack(array).length)
  const cache: U[] = []
  const effects: { dispose: () => void }[] = []

  effect(() => {
    const arr = array()

    // dispose of out-of-bounds effects
    effects.slice(signals.length).map(({ dispose }) => dispose())
    effects.length = arr.length // remove out-of-bound-values

    signals.length = arr.length // remove out-of-bound values
    cache.length = arr.length // remove out-of-bound values

    arr.forEach((value, index) => {
      const item = signals[index]
      if (item) return item.set(value)
      const nextSignal = Signal(value, { equals })
      signals[index] = nextSignal
      effects[index] = effect(() => {
        // mapper functions will likely use `nextSignal()`, which we
        // should not track to update the cache, precisely because it
        // is delegated to the caller.
        // Hence the usage of `untrack`
        cache[index] = untrack(() => mapper(nextSignal, index))
      })
    })
    if (untrack(arrayLength)) arrayLength.set(arr.length)
  })
  return () => {
    arrayLength() // re-render full array only when length changes
    return cache
  }
}

export const mapSignal = <T, U>(
  signal: ReadonlySignal<T>,
  mapper: (value: T) => U,
): ReadonlySignal<U> => {
  const copy = Signal<U>(mapper(untrack(signal)))
  // the copy is going through the `equals` which will dedupe.
  effect(flow(signal, mapper, copy.set))
  return copy
}
