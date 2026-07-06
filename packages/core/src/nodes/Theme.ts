import { Register } from '../decorators/Register.js'
import { Property } from '../decorators/Property.js'
import { PropertyDefinitions, ReactiveObject, DispatchTiming } from '../nodes/ReactiveObject.js'
import { Storage as $ } from '../nodes/Storage.js'
import { Color } from '../core/Color.js'
import { adoptDocumentStylesheet } from '../core/Style.js'

const THEME_VERSION = 'v0.17'

export const $ThemeID = $({
  value: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  storage: 'local',
  key: 'theme-' + THEME_VERSION
})

export type ThemeJSON = Record<string, number>

export const THEMES: Record<string, ThemeJSON> = {
  light: {
    spacing: 2,
    spacing2: 0,
    spacing3: 0,
    spacing4: 0,
    lineHeight: 20,
    fontSize: 14,
    fieldHeight: 0,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Color.toHex(0.2, 0.2, 0.2),
    borderColorLight: Color.toHex(0.3, 0.3, 0.3),
    borderColorStrong: Color.toHex(0.6, 0.6, 0.6),
    borderColorRed: Color.toHex(1, 0.35, 0.15),
    borderColorGreen: Color.toHex(0.1, 0.7, 0.2),
    borderColorBlue: Color.toHex(0.2, 0.4, 0.95),
    bgColor: Color.toHex(0.85, 0.85, 0.85),
    bgColorStrong: Color.toHex(0.9, 0.9, 0.9),
    bgColorLight: Color.toHex(0.8, 0.8, 0.8),
    bgColorRed: Color.toHex(1, 0.5, 0.3),
    bgColorGreen: Color.toHex(0.2, 0.9, 0.3),
    bgColorBlue: Color.toHex(0.2, 0.5, 0.9),
    bgColorInput: Color.toHex(0.95, 0.96, 0.95),
    color: Color.toHex(0.25, 0.25, 0.2),
    colorStrong: Color.toHex(0, 0, 0),
    colorLight: Color.toHex(0.6, 0.6, 0.6),
    colorRed: Color.toHex(1, 0.2, 0),
    colorGreen: Color.toHex(0, 0.6, 0.1),
    colorBlue: Color.toHex(0.2, 0.3, 1),
    colorWhite: Color.toHex(1, 1, 1),
    colorInput: Color.toHex(0, 0.05, 0.02),
    gradientColorStart: Color.toHex(0.9, 0.9, 0.9),
    gradientColorEnd: Color.toHex(0.75, 0.75, 0.75),
    shadowColor: Color.toHex(0, 0, 0, 0.2),
  },
  dark: {
    spacing: 2,
    spacing2: 0,
    spacing3: 0,
    spacing4: 0,
    lineHeight: 20,
    fontSize: 14,
    fieldHeight: 0,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Color.toHex(0.4, 0.4, 0.4),
    borderColorLight: Color.toHex(0.1, 0.1, 0.1),
    borderColorStrong: Color.toHex(0, 0, 0),
    borderColorRed: Color.toHex(1, 0.2, 0),
    borderColorBlue: Color.toHex(0.4, 0.5, 0.9),
    borderColorGreen: Color.toHex(0, 0.6, 0.1),
    bgColor: Color.toHex(0.2, 0.2, 0.2),
    bgColorStrong: Color.toHex(0.3, 0.3, 0.3),
    bgColorLight: Color.toHex(0.25, 0.25, 0.25),
    bgColorRed: Color.toHex(0.7, 0.2, 0.1),
    bgColorGreen: Color.toHex(0.1, 0.5, 0.2),
    bgColorBlue: Color.toHex(0.2, 0.4, 0.8),
    bgColorInput: Color.toHex(0.02, 0.02, 0.02),
    color: Color.toHex(0.6, 0.6, 0.6),
    colorStrong: Color.toHex(0.86, 0.86, 0.86),
    colorLight: Color.toHex(0.3, 0.3, 0.3),
    colorRed: Color.toHex(1, 0.4, 0.4),
    colorGreen: Color.toHex(0.4, 0.95, 0.3),
    colorBlue: Color.toHex(0.6, 0.9, 1),
    colorWhite: Color.toHex(1, 1, 1),
    colorInput: Color.toHex(0.65, 0.7, 0.68),
    gradientColorStart: Color.toHex(0.45, 0.45, 0.45),
    gradientColorEnd: Color.toHex(0.2, 0.2, 0.2),
    shadowColor: Color.toHex(0, 0, 0, 0.2),
  },
}

const themeKeys = Object.keys(THEMES.light) as Array<keyof typeof THEMES.light>

function isThemeColorKey(key: string): boolean {
  return key.includes('Color') || key.startsWith('color') || key.startsWith('gradient')
}

/**
 * Top-level theme singleton; maps numeric/Color properties to `--io_*` CSS variables.
 * @see ThemeSingleton
 */
@Register
export class Theme extends ReactiveObject {
  static override get Properties(): PropertyDefinitions {
    const props: PropertyDefinitions = {}
    for (const key of themeKeys) {
      if (isThemeColorKey(key)) {
        props[key] = {type: Color, init: [0, 0, 0, 1]}
      } else {
        props[key] = {type: Number}
      }
    }
    return props
  }

  declare spacing: number
  declare spacing2: number
  declare spacing3: number
  declare spacing4: number
  declare lineHeight: number
  declare fontSize: number
  declare fieldHeight: number
  declare borderRadius: number
  declare borderWidth: number
  declare borderColor: Color
  declare borderColorLight: Color
  declare borderColorStrong: Color
  declare borderColorRed: Color
  declare borderColorGreen: Color
  declare borderColorBlue: Color
  declare bgColor: Color
  declare bgColorStrong: Color
  declare bgColorLight: Color
  declare bgColorRed: Color
  declare bgColorGreen: Color
  declare bgColorBlue: Color
  declare bgColorInput: Color
  declare color: Color
  declare colorStrong: Color
  declare colorLight: Color
  declare colorRed: Color
  declare colorGreen: Color
  declare colorBlue: Color
  declare colorWhite: Color
  declare colorInput: Color
  declare gradientColorStart: Color
  declare gradientColorEnd: Color
  declare shadowColor: Color

  @Property('debounced')
  declare dispatchTiming: DispatchTiming

  override onPropertyMutated(event: CustomEvent) {
    const mutated = super.onPropertyMutated(event)
    if (mutated) {
      this.mutated()
      this.dispatchMutation()
      return true
    }
    return false
  }

  fontSizeChanged() {
    this.lineHeight = Math.max(this.fontSize, this.lineHeight)
  }

  lineHeightChanged() {
    this.fontSize = Math.min(this.lineHeight, this.fontSize)
  }

  override mutated() {
    this.fieldHeight = this.lineHeight + 2 * (this.spacing + this.borderWidth)
    this.spacing2 = this.spacing * 2
    this.spacing3 = this.spacing * 3  
    this.spacing4 = this.spacing * 4
    for (const key of themeKeys) {
      const value = this[key as keyof this]
      const cssValue = (value instanceof Color) ? value.toCss() : `${value}px`
      themeStyleDeclaration.setProperty(`--io_${key}`, cssValue)
    }
  }
}

const compositeVariables = {
  '--io_border': 'var(--io_borderWidth) solid var(--io_borderColor)',
  '--io_borderColorInset': 'var(--io_borderColorStrong) var(--io_borderColorLight) var(--io_borderColorLight) var(--io_borderColorStrong)',
  '--io_borderColorOutset': 'var(--io_borderColorLight) var(--io_borderColorStrong) var(--io_borderColorStrong) var(--io_borderColorLight)',
  '--io_gradientOutset': 'linear-gradient(180deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 100%)',
  '--io_gradientInset': 'linear-gradient(0deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 150%)',
  '--io_shadow': '2px 2px 6px var(--io_shadowColor), 1px 1px 1px var(--io_shadowColor)',
  '--io_shadowInset': '0.75px 0.75px 2px inset var(--io_shadowColor)',
  '--io_shadowOutset': '1px 1px 2px var(--io_shadowColor)',
} as const

const themeStyleDeclaration = createThemeStyleDeclaration()

function createThemeStyleDeclaration(): CSSStyleDeclaration {
  const styleSheet = adoptDocumentStylesheet('body {}')
  const bodyRule = styleSheet.cssRules[0] as CSSStyleRule
  for (const name in compositeVariables) {
    bodyRule.style.setProperty(name, compositeVariables[name as keyof typeof compositeVariables])
  }
  return bodyRule.style
}

const ThemeSingleton = new Theme().applyJSON(THEMES[$ThemeID.value as keyof typeof THEMES])

export const $Theme = $({
  value: ThemeSingleton,
  storage: 'none',
  key: 'io-theme-' + THEME_VERSION
})

$ThemeID.node.addEventListener('value-changed', (event: CustomEvent) => {
  ThemeSingleton.applyJSON(THEMES[event.detail.value as keyof typeof THEMES])
})

export { ThemeSingleton }
