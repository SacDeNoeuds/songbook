// import { TaggedValue } from '../adt'
// import { test } from '../test'
// import { hash } from './hash'

// test.suite('hash', () => {
//   test.that({
//     because: 'it hashes strings',
//     expect: hash('hello world!'),
//     when: () => hash('hello world!'),
//   })

//   test.that({
//     because: 'trimmed and untrimmed strings hashes are different',
//     expect: false,
//     when: hash('hey') === hash('hey '),
//   })

//   test.that({
//     because: 'it hashes null',
//     expect: 0,
//     when: () => hash(null),
//   })

//   test.that({
//     because: 'it hashes undefined',
//     expect: 1,
//     when: () => hash(undefined),
//   })

//   test.that({
//     because: 'it hashes numbers',
//     expect: hash(1),
//     when: () => hash(1),
//   })

//   test.that({
//     because: 'it hashes dates',
//     expect: hash(new Date('2024-01-01T00:00:00Z')),
//     when: () => hash(new Date('2024-01-01T00:00:00Z')),
//   })

//   test.that({
//     because: 'it hashes arrays of primitive',
//     expect: hash([1, 2, 3, 4]),
//     when: () => hash([1, 2, 3, 4]),
//   })

//   test.that({
//     because: 'it hashes a Set of primitives',
//     expect: hash(new Set([1, 2, 3, 4])),
//     when: () => hash(new Set([1, 2, 3, 4])),
//   })

//   test.that({
//     because: 'hash of Sets and Arrays are different',
//     expect: false,
//     when: () => hash([1, 2]) === hash(new Set([1, 2])),
//   })

//   const obj1 = { a: 1, b: 2 }
//   const obj2 = { b: 2, a: 1 }
//   test.that({
//     because: 'it hashes shuffled objects',
//     expect: hash(obj1),
//     when: () => hash(obj2),
//   })

//   test.that({
//     because: 'it hashes Maps',
//     expect: hash(new Map(Object.entries(obj1))),
//     when: () => hash(new Map(Object.entries(obj2))),
//   })

//   const now = new Date()
//   test.that({
//     because: 'it hashes dates',
//     expect: hash(now),
//     when: hash(now),
//   })

//   test.that({
//     because: 'it hashes arrays of shuffled object',
//     expect: hash([obj1, obj2]),
//     when: () => hash([obj2, obj1]),
//   })

//   type Just = TaggedValue<'Just', number>
//   const Just = (n: number): Just => TaggedValue('Just', n)
//   test.that({
//     because: 'it hashes identical Tagged value',
//     expect: true,
//     when: () => hash(Just(1)) === hash(Just(1)),
//   })

//   test.that({
//     because: 'it hashes different Maybe-s',
//     expect: false,
//     when: () => hash(Just(1)) === hash(Just(2)),
//   })

//   test.that({
//     because: 'Same RegExp produces same hash',
//     expect: hash(/hello/),
//     when: hash(/hello/),
//   })
//   test.that({
//     because: 'Different RegExp produces different hash',
//     expect: false,
//     when: hash(/\/hello\//) === hash(/hello/),
//   })
// })
