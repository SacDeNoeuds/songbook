import { isNotNil } from '../functions'

type Maybe<T> = NonNullable<T> | undefined

export namespace maybe {
  export const refine: {
    <T, U extends T>(refiner: (value: T) => value is NonNullable<U>): (
      value: T,
    ) => Maybe<U>
    <T>(predicate: (value: T) => unknown): (value: T) => Maybe<T>
  } = (refiner: any) => (value: any) => refiner(value) ? value : undefined
  
  export const fold =
    <Value, A, B>(mappers: { undefined: () => A; value: (value: Value) => B }) =>
    (value: Maybe<Value>): A | B =>
      isNotNil(value) ? mappers.value(value) : mappers.undefined()
  
  export const or =
    <T, U>(fallback: () => U) =>
    (value: Maybe<T>): T | U =>
      (value ?? fallback() ?? undefined) as T | U // U may be `undefined` or `null` :shrug:
  
  export const defaultTo = <T, U>(fallback: U) => or<T, U>(() => fallback)
  
  export const map =
    <T, U>(mapper: (value: T) => U) =>
    (value: Maybe<T>) =>
      (value && mapper(value)) ?? undefined
  
  export const tap = <T>(mapper: (value: T) => unknown) =>
    map<T, T>((value) => (mapper(value), value))
}

