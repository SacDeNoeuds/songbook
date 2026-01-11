// import { array } from '../adt'
// import { test } from '../test'
// import { Signal, effect, internalComputed, mapArray, untrack } from './signal'

// test.suite('Signal', () => {
//   test.that({
//     because: 'Signal<T> is writable',
//     expect: 'world',
//     when: () => {
//       const string = Signal('hello')
//       string.set('world')
//       return string()
//     },
//   })

//   test.that({
//     because: 'Effect is executed at declaration',
//     expect: 'hello 42',
//     when: () => {
//       const string = Signal('hello')
//       const number = Signal(42)
//       let output = ''
//       effect(() => {
//         output = `${string()} ${number()}`
//       })
//       return output
//     },
//   })

//   test.that({
//     because: 'Effect is re-executed when signal is updated',
//     expect: 'goodbye 10',
//     when: () => {
//       const string = Signal('hello')
//       const number = Signal(42)
//       let output = ''
//       effect(() => {
//         output = `${string()} ${number()}`
//       })
//       string.set('goodbye')
//       number.set(10)
//       return output
//     },
//   })

//   test.that({
//     because: 'Effect is disposable',
//     expect: 'hello 42',
//     when: () => {
//       const string = Signal('hello')
//       const number = Signal(42)
//       let output = ''
//       const { dispose } = effect(() => {
//         output = `${string()} ${number()}`
//       })
//       dispose()
//       string.set('goodbye')
//       number.set(10)
//       return output
//     },
//   })

//   test.that({
//     because:
//       'Effect is re-executed when a signal-hidden-behind-a-condition is updated',
//     expect: 2,
//     when: () => {
//       const boolean = Signal(false)
//       const number = Signal(1)
//       let output = 0
//       effect(() => {
//         output = boolean() ? number() : -1
//       })
//       boolean.set(true)
//       number.set(2)
//       return output
//     },
//   })
// })

// test.suite('computed', () => {
//   const tag = (n: number, tag: string): number & { tag: string } =>
//     Object.assign(n, { tag })

//   test.that({
//     because: 'it computes the value',
//     expect: 42,
//     when: () => {
//       const number = Signal(21)
//       const doubled = internalComputed(() => number() * 2)
//       return doubled()
//     },
//   })

//   test.that({
//     because: 'it returns previous value when next is equal',
//     expect: 'first',
//     when: () => {
//       const first = tag(42, 'first')
//       const second = tag(42, 'second')
//       const s1 = Signal(first)
//       const s2 = internalComputed(() => s1(), { equals: () => true })
//       s2()
//       s1.set(second)
//       return s2().tag
//     },
//   })

//   test.that({
//     because: 'I should get the first array when length are same',
//     expect: [1, 2],
//     when: () => {
//       const s1 = Signal([1, 2])
//       const s2 = internalComputed(() => s1(), {
//         equals: (a, b) => a.length === b.length,
//       })
//       s2()
//       s1.set([3, 4])
//       return s2()
//     },
//   })
// })

// test.suite('untrack', () => {
//   test.that({
//     because: 'untrack does not track changes',
//     expect: { calls: 1, result: 42 },
//     when: () => {
//       let calls = 0
//       let result = 0
//       const signal = Signal(41)
//       effect(() => {
//         calls++
//         result = untrack(signal) + 1
//       })
//       signal.set(42)
//       return { calls, result }
//     },
//   })
// })

// test.suite('mapArray', () => {
//   test.that({
//     because: 'it does not re-render when the array length is the same',
//     expect: { mapperCalls: 3 },
//     when: () => {
//       const numbers = Signal([1, 2, 3])
//       let mapperCalls = 0
//       const copy = mapArray(numbers, (x, index) => {
//         mapperCalls++
//         return x() * 2
//       })
//       effect(() => {
//         copy() // subscribe
//       })
//       numbers.set([2, 2, 3])
//       return { mapperCalls }
//     },
//   })

//   test.that({
//     because: 'it maps only the new items when length changes',
//     expect: { mapCalls: 4, mapped: [2, 4, 6, 8] },
//     when: () => {
//       let mapCalls = 0
//       const numbers = Signal([1, 2, 3])
//       const doubled = mapArray(numbers, (number) => {
//         mapCalls++
//         return number() * 2
//       })
//       effect(() => doubled())
//       numbers.update(array.append(4))
//       return { mapCalls, mapped: doubled() }
//     },
//   })

//   test.that({
//     because: 're-rendering a single item without changing the length should not rerun the mapper',
//     expect: { callsAfterInit: 0 },
//     when: () => {
//       let calls = 0
//       let effects = 0

//       const numbers = Signal([1])
//       const test = mapArray(numbers, (n) => {
//         calls++
//         console.debug('map array', calls)
//         n() // subscribe to prove mapper is not re-executed
//       })
//       effect(() => {
//         effects++;
//         console.debug('effect', effects)
//         test()
//       })
//       numbers.set([2])
//       return { callsAfterInit: calls - 1 }
//     }
//   })
// })
