import { onDisconnected } from './lifecycle'

export const onClickAway = (handler: () => void) => (element: HTMLElement) => {
  const handleEvent = (event: MouseEvent) => {
    if (element !== event.target && !element.contains(event.target as Node))
      handler()
  }
  document.addEventListener('click', handleEvent)
  onDisconnected(element, () => {
    document.removeEventListener('click', handleEvent)
  })
}
