// import { test } from '../test'
// import { hashEquals } from '../test/expect'
// import { parseJson, stringifyJson } from './json'
// import { pipe } from './pipe'

// test.suite('json', () => {
//   const demo = {
//     n: 42,
//     s: 'world',
//     big: BigInt(42),
//     date: new Date(),
//     array: ['toto', 'jack'],
//     object: { max: 'la menace' },
//     map: new Map([
//       ['a', new Set([new Map([['a', 'b']])])],
//       ['b', new Set([new Map([['a', 'b']])])],
//     ]),
//     set: new Set([1, 2, 3]),
//     regexp: /^hello(?:(world|42))$/g,
//   }

//   test.that({
//     because: 'stringify then parse is idempotent',
//     expect: hashEquals(demo),
//     when: pipe(demo, stringifyJson, parseJson),
//   })
// })
