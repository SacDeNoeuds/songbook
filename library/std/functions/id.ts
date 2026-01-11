const createRandomStringId = () => Date.now().toString(36).slice(2, 10)

export const StringId: () => string =
  globalThis.crypto?.randomUUID.bind(globalThis.crypto) ?? createRandomStringId

export const NumberId = Date.now
