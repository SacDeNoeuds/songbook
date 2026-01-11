// import { test } from '../test'
// import { SingleEventTarget, listenOnce } from './single-event-target'

// test.suite('SingleEventTarget', () => {
//   test.that({
//     because: 'listenOnce() calls listener once',
//     expect: 1,
//     when: () => {
//       const target = SingleEventTarget<number>()
//       let n = 0
//       listenOnce(target, (number) => (n = number))
//       target.notify(1)
//       target.notify(2)
//       return n
//     },
//   })
// })
