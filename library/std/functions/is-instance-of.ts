export type AnyConstructor = new (...args: any[]) => any

export const isInstanceOf =
  <T extends AnyConstructor>(Class: T) =>
  (value: unknown): value is InstanceType<T> =>
    value instanceof Class
