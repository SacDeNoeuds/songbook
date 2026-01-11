import { identity } from './identity'

export const cast = identity as <A, B extends A>(a: A) => B
