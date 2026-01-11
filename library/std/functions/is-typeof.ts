export const isObject = (
  input: unknown,
): input is Record<PropertyKey, unknown> => {
  return (
    input !== null &&
    typeof input === 'object' &&
    Object.getPrototypeOf(input) === Object.prototype
  )
}

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export const isBigInt = (value: unknown): value is bigint =>
  typeof value === 'bigint'


export type AnyFunction = (...args: any[]) => any
export const isFunction = (value: unknown): value is AnyFunction =>
  typeof value === 'function'
