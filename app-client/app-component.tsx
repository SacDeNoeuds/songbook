import { SongbookPage } from '@app-client/songbook/songbook-page'
import type { AppModel } from './app-model'

type Props = {
  model: AppModel
}

export const App = ({ model }: Props) => {
  return (
    <div
      a-stacker
      style="background: var(--primary-background); min-block-size: 100vh"
    >
      <SongbookPage model={model.songbook} />
    </div>
  )
}

// const PageCard = (props: ComponentProps<'div'>) => {
//   return (
//     <div
//       {...props}
//       a-card
//       is-padded
//       style="inline-size: min(30rem, 95vi); margin: auto"
//     />
//   )
// }
