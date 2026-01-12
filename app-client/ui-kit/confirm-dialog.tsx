import { maybe } from '@std/adt/maybe'
import { flow } from '@std/functions'
import type { ActionToConfirm } from '@std/signal/action-to-confirm'
import type { Children } from 'dom-kit/jsx/jsx-runtime'
import { Dialog } from './dialog'

type Props<Args extends any[], Output> = {
  action: ActionToConfirm<Args, Output>
  message: (...args: Args) => Children
  heading: Children
  cancel?: Children
  confirm?: Children
}

export const ConfirmDialog = <Args extends any[], Output>(
  props: Props<Args, Output>,
) => {
  return (
    <Dialog
      opened={flow(props.action.confirm, Boolean)}
      onClose={props.action.cancel}
    >
      <header>
        <h3>{props.heading}</h3>
      </header>
      {flow(
        props.action.confirm,
        maybe.map(({ args }) => props.message(...args)),
        maybe.defaultTo(null),
      )}
      {flow(
        props.action.confirm,
        maybe.map(({ run }) => (
          <footer a-stacker="inline gap-s end/center">
            <button type="button" onclick={props.action.cancel}>
              {props.cancel ?? 'Cancel'}
            </button>

            <button type="button" class="discrete" onclick={run}>
              {props.confirm ?? 'Confirm'}
            </button>
          </footer>
        )),
        maybe.defaultTo(null),
      )}
    </Dialog>
  )
}
