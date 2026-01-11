export type UnionToIntersection<T> = (
  T extends any ? (x: T) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never