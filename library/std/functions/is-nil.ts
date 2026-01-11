export const isNil = (value: unknown): value is null | undefined =>
  value === undefined || value === null

export const isNotNil = <T>(
  value: T | null | undefined,
): value is NonNullable<T> => !isNil(value)

export const assertNotNil = <T>(
  value: T | undefined | null,
  msg: string,
): asserts value is T => {
  if (isNil(value)) throw new Error(msg)
}
