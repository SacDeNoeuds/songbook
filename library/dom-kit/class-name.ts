type Input = string | false | null | undefined | 0
export const cn = (...classNames: Array<Input | (() => Input)>) =>
  classNames
    .map((v) => (typeof v === 'function' ? v() : v))
    .filter(Boolean)
    .join(' ')
