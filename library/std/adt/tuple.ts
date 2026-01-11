export namespace tuple {
  export type Of<T> = [T, ...T[]]
  export const of = <T extends [any, ...any[]]>(...values: T): T => values
}
