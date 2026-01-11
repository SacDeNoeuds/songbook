import { isInstanceOf } from '../../std/functions'
import { useHistory } from '../history'
import type { ComponentProps } from './jsx-runtime'

const isElement = isInstanceOf(HTMLAnchorElement)

export const Link = (props: ComponentProps<'a'>) => {
  const history = useHistory()
  return (
    <a
      {...props}
      onclick={(event) => {
        event.preventDefault()
        if (!isElement(event.currentTarget)) return
        const isDisabled =
          event.currentTarget.getAttribute('aria-disabled') === 'true'
        if (isDisabled) return // abort navigation

        history.push(event.currentTarget.href)
        if (props?.onclick) (props as any).onclick(event)
      }}
    />
  )
}
