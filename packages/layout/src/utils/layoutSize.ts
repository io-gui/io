export const DEFAULT_SIZE = 'auto'
export const DEFAULT_AUTO_BUDGET_PX = 240
export const DEFAULT_MIN_SIZE_PX = 24

export type LayoutSizeData = {
  size?: string
}

const AUTO_SIZE_REGEX = /^[\d.]+(?:px|%)\s+auto$/
const SIZE_REGEX = /^(?:auto|[\d.]+(?:px|%)(?:\s+auto)?)$/


export function sizeToPx(size: string): number {
  if (isAutoSize(size)) return DEFAULT_AUTO_BUDGET_PX
  return parseLengthPx(size, 100)
}

export function sizeToFlex(size: string): string {
  if (isAutoSize(size)) return '1 1 auto'
  return `0 0 ${size}`
}

export function isAutoSize(size: string): boolean {
  return size === DEFAULT_SIZE || AUTO_SIZE_REGEX.test(size)
}

export function isValidSize(size: string): boolean {
  return SIZE_REGEX.test(size)
}

export function parseSizeBudgetPx(size: string, containerSize: number): number {
  return parseLengthPx(sizeBudgetToken(size), containerSize)
}

function sizeBudgetToken(size: string): string {
  if (size === DEFAULT_SIZE) return `${DEFAULT_AUTO_BUDGET_PX}px`
  const autoMatch = size.match(/^([\d.]+(?:px|%))\s+auto$/)
  if (autoMatch) return autoMatch[1]
  return size
}

function parseLengthPx(length: string, containerSize: number): number {
  const pxMatch = length.match(/^([\d.]+)px$/)
  if (pxMatch) return parseFloat(pxMatch[1])
  const pctMatch = length.match(/^([\d.]+)%$/)
  if (pctMatch) return containerSize * parseFloat(pctMatch[1]) / 100
  return DEFAULT_AUTO_BUDGET_PX
}

export function layoutSizeToJSON(node: { size: string }): Partial<LayoutSizeData> {
  const data: Partial<LayoutSizeData> = {}
  if (node.size !== DEFAULT_SIZE) data.size = node.size
  return data
}

export function applyLayoutSizeProps(data: LayoutSizeData): { size: string } {
  return {
    size: data.size ?? DEFAULT_SIZE,
  }
}

export function ensureOneChildHasAutoSize(children: Array<{ size: string }>): void {
  if (children.length === 0) return
  if (children.some(child => isAutoSize(child.size))) return
  const i = Math.min(1, children.length - 1)
  children[i].size = DEFAULT_SIZE
}