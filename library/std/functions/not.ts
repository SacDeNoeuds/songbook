// export const not: {
//   <T, U extends T>(predicate: (value: T) => value is U): <Value extends T>(
//     value: Value,
//   ) => value is Exclude<Value, U>
//   <T>(predicate: (value: T) => boolean): (value: T) => boolean
// } = (predicate: any) => (value: any) => !predicate(value)
export function not<T, U extends T>(
  predicate: (value: T) => value is U,
): <Value extends T>(value: Value) => value is Exclude<Value, U>
export function not<T>(predicate: (value: T) => unknown): (value: T) => boolean
export function not(predicate: any) {
  return (value: any) => !predicate(value)
}
