export const DEFAULT_FLEX = '1 1 auto'

// A CSS `flex` shorthand restricted to the forms this layout produces and reads back:
// `<grow> <shrink> <basis>` where basis is `auto`, a pixel length, or a percentage.
const FLEX_REGEX = /^[\d.]+\s+[\d.]+\s+(?:auto|[\d.]+(?:px|%))$/

export function isValidFlex(flex: string): boolean {
  return FLEX_REGEX.test(flex)
}
