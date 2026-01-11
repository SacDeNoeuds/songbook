import {
  apply as applyFn,
  callMethod,
  flow,
  hash,
  identity,
} from '../functions'
import { iterable as I } from './iterable'

export type NonEmptyArray<T> = T[] & { 0: T }

export namespace array {
  export const fromIterable = <T>(iterable: Iterable<T>): T[] => [...iterable]
  export const empty = flow(I.empty, fromIterable)
  
  export function of<T>(value: T, ...rest: T[]): NonEmptyArray<T>
  export function of<T>(...value: T[]): T[] {
    return value
  }
  
  export const fromMaybe = <T>(maybe: T | undefined) =>
    (maybe ? empty : [maybe]) as T[]
  
  export function filter<T>(
    predicate: (value: T, index: number) => unknown,
  ): (value: T[]) => T[]
  export function filter<T, U extends T>(
    predicate: (value: T, index: number) => value is U,
  ): (value: T[]) => U[]
  export function filter(predicate: (value: any, index: number) => unknown) {
    return (array: any[]) => array.filter(predicate)
  }
  
  type Mapper<T, Output> = (value: T, index: number, self: T[]) => Output
  
  export const map: {
    <T, U>(mapper: Mapper<T, U>): (array: T[]) => U[]
    <T, U>(mapper: Mapper<T, U>): (array: NonEmptyArray<T>) => NonEmptyArray<U>
  } =
    (mapper) =>
    (array): any =>
      array.map(mapper)
  
  export const flatMap: {
    <T, U>(mapper: Mapper<T, NonEmptyArray<U>>): (array: T[]) => NonEmptyArray<U>
    <T, U>(mapper: Mapper<T, U[]>): (array: T[]) => U[]
  } =
    (mapper) =>
    (array): any =>
      array.flatMap(mapper)
  
  export const filterMap = <T, U>(
    mapper: (value: T, index: number, self: T[]) => U | undefined,
  ) => flatMap<T, U>(flow(mapper, fromMaybe))
  
  export const compact: <T>(array: (T | undefined)[]) => T[] = filterMap(identity)
  
  export const apply = <T, U>(params: T) =>
    map<(params: T) => U, U>(applyFn(params))
  
  export const concat: {
    <T>(b: NonEmptyArray<T>): (a: T[]) => NonEmptyArray<T>
    <T>(b: T[]): (a: NonEmptyArray<T>) => NonEmptyArray<T>
    <T>(b: T[]): (a: T[]) => T[]
  } =
    (b) =>
    (a): any =>
      a.concat(b)
  
  export const insertAt =
    (index: number) =>
    <T>(value: T) =>
      flow(I.insertAt(index)(value), fromIterable)
  
  export const setAt =
    <T>(index: number, value: T) =>
    (array: T[]) => {
      const copy = [...array]
      copy[index] = value
      return copy
    }
  
  export const removeAt = (index: number): (<T>(a: T[]) => T[]) =>
    filter((_, i) => i !== index)
  
  export const append = <T>(value: T) => concat([value])
  export const prepend = insertAt(0)
  
  export const shuffle = <T>(array: T[]): T[] => {
    const copy = [...array]
    const result: T[] = []
    while (copy.length > 0) {
      const randomIndex = Math.floor(Math.random() * copy.length)
      result.push(copy.splice(randomIndex, 1)[0]!)
    }
    return result
  }
  
  export const size = (array: any[]) => array.length
  export const isEmpty = <T>(array: T[]): array is [] => array.length === 0
  export const isNonEmpty = <T>(array: readonly T[]): array is NonEmptyArray<T> =>
    array.length > 0
  
  export const toNonEmpty = <T>(array: T[]): NonEmptyArray<T> | undefined =>
    isNonEmpty(array) ? array : undefined
  
  export const sort = <T>(sortFn: (a: T, b: T) => number) =>
    callMethod('sort', sortFn) as (array: T[]) => T[]
  
  export const unique = <T>(array: T[]) => {
    return array.filter((a, index) => {
      return index === array.findIndex((b) => hash(a) === hash(b))
    })
  }
}
