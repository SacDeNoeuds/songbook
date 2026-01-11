export type Curry2<T extends (...args: any[]) => any> = T extends (
  a: infer A,
  b: infer B,
) => infer R
  ? (a: A) => (b: B) => R
  : never

export function curry2<Fn extends (a: any, b: any) => any>(fn: Fn) {
  return function curried() {
    return arguments.length === 2
      ? fn(arguments[0], arguments[1])
      : // @ts-ignore
        (a) => fn(a, arguments[0])
  } as unknown as Fn & Curry2<Fn>
}

type Uncurry2<T> = T extends (b: infer B) => (a: infer A) => infer R
  ? (a: A, b: B) => R
  : never

export function uncurry2<A, B, R>(fn: (b: B) => (a: A) => R) {
  return function () {
    switch (arguments.length) {
      case 1:
        return fn(arguments[0])
      case 2:
        return fn(arguments[1])(arguments[0])
    }
  } as Uncurry2<(b: B) => (a: A) => R>
}
