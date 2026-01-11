import { flow } from '../std/functions'

export const stylesheet = (css: TemplateStringsArray): CSSStyleSheet => {
  const stylesheet = new CSSStyleSheet()
  stylesheet.replaceSync(css.join())
  return stylesheet
}

const getDefaultRoot = (): DocumentOrShadowRoot | undefined => {
  if (typeof window === 'undefined') return undefined
  return document
}

export const registerStylesheet = (
  sheet: CSSStyleSheet,
  root: DocumentOrShadowRoot | undefined = getDefaultRoot(),
): void => {
  if (!root) return // for test environments for instance.
  if (root.adoptedStyleSheets.includes(sheet)) return
  root.adoptedStyleSheets.push(sheet)
}

/**
 * To enable color syntax, enable the vscode extension es6-string-html
 */
export const css = flow(stylesheet, registerStylesheet)
