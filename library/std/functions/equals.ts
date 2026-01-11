import { curry2 } from './curry'
import { hash } from './hash'

export const strictEquals = curry2(
  Object.is as (a: unknown, b: unknown) => boolean,
)
export const deepEquals = curry2(
  (a: unknown, b: unknown) => hash(a) === hash(b),
)
