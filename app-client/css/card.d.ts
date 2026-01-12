declare module './card.css' {
  declare global {
    namespace JSX {
      interface IntrinsicAttributes {
        'a-card'?: true
      }
    }
  }
}
