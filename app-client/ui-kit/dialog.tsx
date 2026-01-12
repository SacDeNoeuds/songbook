import { effect, type Signal } from '@std/signal'
import type { Except } from '@std/types'
import { onDisconnected } from 'dom-kit'
import type { ComponentProps } from 'dom-kit/jsx/jsx-runtime'

type LocalProps =
  | { opened: Signal<boolean>; onClose?: undefined }
  | { opened: () => boolean; onClose: () => void }

type Props = Except<ComponentProps<'dialog'>, 'open' | 'ref' | 'onclick'> &
  LocalProps
export const Dialog = ({ opened, onClose, children, ...rest }: Props) => {
  const mount = (dialog: HTMLDialogElement) => {
    const { dispose } = effect(() => {
      const isOpened = opened()
      requestAnimationFrame(() => {
        isOpened ? dialog.showModal() : dialog.close()
      })
    })
    onDisconnected(dialog, dispose)
    dialog.addEventListener('click', onClickAway, { capture: true })
  }

  const onClickAway = (event: MouseEvent) => {
    const dialog = event.currentTarget as HTMLDialogElement
    const target = event.target
    if (!opened() || !(target instanceof Node)) return

    const isInDialog = dialog.contains(target)
    if (!isInDialog && opened()) close()
  }

  const close = () => {
    'set' in opened ? opened.set(false) : onClose!()
  }

  return (
    <dialog {...rest} ref={mount} open={opened()} onclose={close}>
      {children}
    </dialog>
  )
}
