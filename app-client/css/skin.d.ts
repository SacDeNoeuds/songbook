declare module './skin.css' {
  declare global {
    namespace JSX {
      interface IntrinsicAttributes {
        'is-rounded'?:
          | true
          | RadiusSize
          | BorderPlacement
          | `${RadiusSize} ${BorderPlacement}`
        'is-bordered'?:
          | true
          | BorderSize
          | BorderPlacement
          | `${BorderSize} ${BorderPlacement}`
        'is-shadowed'?: true | 's'
      }
    }
  }
  type RadiusSize = 'l'
  type BorderSize = 'thick'
  type BorderPlacement =
    | 'block-end'
    // | 'block-start'
    // | 'inline-start'
    | 'inline-end'
  // | `${'start' | 'end'}-${'start' | 'end'}`
}
