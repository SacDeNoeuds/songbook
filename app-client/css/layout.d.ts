declare module './layout.css' {
  declare global {
    namespace JSX {
      interface IntrinsicAttributes {
        'a-grid'?: GridColumns | `${GridColumns} ${Gap}`
        'a-grid-span'?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
        'is-padded'?: Padding
        /** `(inline) ({gap}) ({justify}/{align})` */
        'a-stacker'?:
          | true
          | StackInlineOptions
          | `${StackInlineOptions} ${StackOptions}`
          | StackOptions
        resize?: 'inline' | 'block'
      }
    }
  }

  type PaddingBlockPosition = 'block' | 'block-end'
  type PaddingInlinePosition = 'inline'
  type PaddingPosition =
    | PaddingInlinePosition
    | PaddingBlockPosition
    | `${PaddingInlinePosition} ${PaddingBlockPosition}`
  type PaddingSize = 's' | 'l'
  type Padding =
    | true
    | PaddingSize
    | PaddingPosition
    | `${PaddingSize} ${PaddingPosition}`
  type GridColumns = 2 | 3 | 4 | 5 | 6 | 7 | 8
  type Gap = 'no-gap' | 'gap-s' | 'gap-l'

  type StackJustify = 'center' | 'start' | 'end' | 'stretch' | 'between'
  type StackAlign = 'center' | 'start' | 'end' | 'stretch' | 'between'
  type StackShorthand = 'center' | 'start' | 'end' | 'stretch' | 'between'
  type StackPlace = StackShorthand | `${StackJustify}/${StackAlign}`
  type StackInlineOptions = 'inline' | 'inline nowrap'
  type StackOptions = Gap | StackPlace | `${Gap} ${StackPlace}`
}
