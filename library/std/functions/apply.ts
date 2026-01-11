export const apply =
  <Params extends any[], Result>(...params: Params) =>
  (fn: (...params: Params) => Result): Result =>
    fn(...params)
