import { apply as applyFn, flow, identity } from '../functions'
import { iterable as I } from './iterable'
import { tuple } from './tuple'

type AnyRecord = Record<string | number, any>

export namespace record {
  export type Values<T extends Record<any, any>> = T[keyof T]
  
  export function empty<Key extends string | number, Value>(): Record<
    Key,
    Value
  > {
    return {} as Record<Key, Value>
  }
  
  export const fromIterable: <Key extends string | number, Value>(
    entries: Iterable<readonly [Key, Value], any, any>,
  ) => Record<Key, Value> = Object.fromEntries
  
  const applyEntry =
    <Key extends string | number, Value, Output>(
      fn: (value: Value, key: Key) => Output,
    ) =>
    ([key, value]: [Key, Value]) =>
      fn(value, key)
  
  // const mapEntry =
  //   <Key extends string | number, T, U>(mapper: (value: T, key: Key) => U) =>
  //   ([key, value]: [Key, T]): [Key, U] =>
  //     [key, mapper(value, key)]
  
  export const entries: <Key extends string | number, Value>(
    record: Record<Key, Value>,
  ) => Array<[Key, Value]> = Object.entries
  
  export const values: <Values>(record: Record<any, Values>) => Values[] =
    Object.values
  
  export const keys: <Key extends string | number>(
    record: Record<Key, any>,
  ) => Key[] = Object.getOwnPropertyNames as any
  
  export const isEmpty = flow(keys, (keys) => keys.length === 0)
  
  export const has =
    <P extends string>(property: P) =>
    <R extends AnyRecord>(struct: R): struct is R & { [Key in P]: unknown } =>
      Object.hasOwn(struct, property)
  
  export const get =
    <P extends string>(property: P) =>
    <R extends AnyRecord>(record: R) =>
      record[property] ?? undefined
  
  export const reduce = <Key extends string | number, Value, Output>(
    initial: Output,
    reducer: (acc: Output, value: Value, key: Key) => Output,
  ) =>
    flow(
      entries<Key, Value>,
      I.reduce(initial, (acc, [key, value]) => reducer(acc, value, key)),
    )
  
  export const flatMap = <Key extends string | number, Value>(
    mapper: (value: Value, key: Key) => Record<Key, Value>,
  ) =>
    flow(
      entries<Key, Value>,
      I.flatMap(flow(applyEntry(mapper), entries)),
      fromIterable<Key, Value>,
    )
  export const map = <Key extends string | number, T, U>(
    mapper: (value: T, key: Key) => U,
  ) =>
    flow(
      entries<Key, T>,
      I.map(([key, value]) => tuple.of(key, mapper(value, key))),
      fromIterable<Key, U>,
    )
  
  // export const filterMap2 = <Key extends string, T, U>(mapper: (value: T, key: Key) => Maybe<U>) => flatMap(flow(applyEntry(mapper), matchMaybe({ Nothing: empty<Key, U>, Just: of })));
  export const filterMap = <Key extends string | number, T, U>(
    mapper: (value: T, key: Key) => U | undefined,
  ) =>
    flow(
      entries<Key, T>,
      I.filterMap(([key, value]) => {
        const next = mapper(value, key)
        return next && tuple.of(key, next)
      }),
      fromIterable<Key, U>,
    )
  
  export function filter<Key extends string | number, T, U extends T>(
    predicate: (value: T, key: Key) => value is U,
  ): (record: Record<Key, T>) => Record<Key, U>
  export function filter<Key extends string, T>(
    predicate: (value: T, key: Key) => unknown,
  ): (record: Record<Key, T>) => Record<Key, T>
  export function filter(predicate: (value: any, key: PropertyKey) => unknown) {
    return flow(entries, I.filter(applyEntry(predicate)), fromIterable)
  }
  
  export const pick = <Key extends string, T>(...keys: Key[]) =>
    filter<Key, T>((_, key) => keys.includes(key))
  
  export const omit = <Key extends string, T>(...keys: Key[]) =>
    filter<Key, T>((_, key) => !keys.includes(key))
  
  export const compact: <Key extends string, T>(
    record: Record<Key, T | undefined>,
  ) => Record<Key, T> = filterMap(identity)
  
  export const apply = <Key extends string, T, U>(value: T) =>
    map<Key, (value: T) => U, U>(applyFn(value))
  
  export const concat =
    <Key extends PropertyKey, Value>(b: Record<Key, Value>) =>
    (a: Record<Key, Value>): Record<Key, Value> => ({ ...a, ...b })
}
