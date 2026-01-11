export const call =
  <Params extends any[], Result>(fn: (...params: Params) => Result) =>
  (params: Params): Result =>
    fn(...params)

export const callMethod =
  <T extends Record<PropertyKey, any> & object, Method extends keyof T>(
    method: Method,
    ...args: Parameters<T[Method]>
  ) =>
  (object: T): ReturnType<T[Method]> =>
    object[method](...args)
