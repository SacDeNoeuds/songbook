// https://devv.ai/search?threadId=dlo5qjpvp3b4

const caches = {
  objects: new WeakMap<object, number>(),
  primitives: new Map<unknown, number>(),
}

const cached =
  <
    T,
    Cache extends {
      get: (value: T) => number | undefined
      set: (value: T, hash: number) => void
    },
  >(
    cache: Cache,
    fn: (value: T) => number,
  ) =>
  (value: T) => {
    const cached = cache.get(value)
    if (cached !== undefined) return cached
    const hash = fn(value)
    cache.set(value, hash)
    return hash
  }

export { hashValue as hash }

// Define a function that takes any value and returns a hash number
function hashValue(value: unknown): number {
  if (typeof value !== 'object' || value === null) return hashPrimitive(value)
  else if (isIterable(value)) return hashIterable(value)
  else if (value instanceof Date)
    return hashObject({ _type: 'date', value: value.valueOf() })
  else if (value instanceof RegExp) return hashString(value.toString())
  return hashObject(value)
}

const hashString = (str: string): number => {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

// Helper function to hash different types of values
const hashPrimitive = cached(caches.primitives, (value: unknown): number => {
  if (value === null) {
    return 0 // Return a unique hash for null
  } else if (value === undefined) {
    return 1 // Return a unique hash for undefined
  } else if (typeof value === 'string') {
    return hashString(value.length.toString() + value) // Hash based on string length and content
  } else {
    return hashString(value.toString()) // Default hashing for other types
  }
})

const isIterable = (value: unknown): value is Iterable<unknown> =>
  value !== null && typeof (value as any)[Symbol.iterator] === 'function'

// Helper function to hash an iterable
const hashIterable = cached(
  caches.objects,
  (iterable: Iterable<unknown>): number => {
    let hash = hashString(iterable.constructor.name)
    for (const element of iterable) {
      hash = hash ^ hashValue(element)
    }
    return hash
  },
)

// Helper function to hash an object
const hashObject = cached(
  caches.objects,
  (obj: { [key: string | symbol]: any }): number => {
    let hash = 0
    const keys = Object.getOwnPropertyNames(obj).sort() // Sort keys to ensure consistent hashing
    // sort symbols to ensure consistent hashing
    const symbols = Object.getOwnPropertySymbols(obj).sort((a, b) =>
      String(a).localeCompare(String(b)),
    )

    for (const key of keys) {
      hash = hash ^ (hashPrimitive(key) + hashValue(obj[key]))
    }
    for (const symbol of symbols) {
      hash = hash ^ (hashPrimitive(symbol) + hashValue(obj[symbol]))
    }
    return hash
  },
)
