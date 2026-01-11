import { panic } from './functions'

const none = Symbol('none')
export const Context = <T>(name: string) => {
  let context: typeof none | T = none
  const provide = (provided: T) => (context = provided)

  const use = (): T => {
    if (context === none) panic(`context "${name}" not provided`)
    return context as T
  }

  const clear = () => {
    context = none
  }
  return [provide, use, clear] as const
}
