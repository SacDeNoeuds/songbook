import { Signal, type ReadonlySignal } from './index'

export type ActionToConfirm<Args extends any[], Output> = {
  trigger: (...args: Args) => void
  confirm: ReadonlySignal<{ args: Args; run: () => Output } | undefined>
  cancel: () => void
}

export const ActionToConfirm = <Args extends any[], Output>(
  action: (...args: Args) => Output,
): ActionToConfirm<Args, Output> => {
  const thunk = Signal<Args | undefined>(undefined)
  return {
    trigger: (...args) => thunk.set(args),
    cancel: () => thunk.set(undefined),
    confirm: () => {
      const args = thunk()
      return (
        args && {
          args,
          run: () => (thunk.set(undefined), action(...args)),
        }
      )
    },
  }
}
