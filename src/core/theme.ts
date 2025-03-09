import { Register } from './node.js';
import { IoElement } from './element.js';
import { PropertyDefinitions } from './internals/property.js';
import { IoStorage as $ } from './storage.js';
import { Property } from './decorators/property.js';
const THEME_VERSION = 'v0.9';

const styleElement = document.createElement('style');
styleElement.setAttribute('id', 'io-theme-variables-' + THEME_VERSION);
document.head.appendChild(styleElement);

export class Color {
  constructor(public r: number, public g: number, public b: number, public a: number) {}
}

export type Theme = {
  iotSpacing: number;
  iotSpacing2: number;
  iotSpacing3: number;
  iotSpacing5: number;
  iotSpacing8: number;

  iotFontSize: number;

  iotLineHeight: number;

  iotFieldHeight: number;
  iotFieldHeight2: number;
  iotFieldHeight3: number;
  iotFieldHeight4: number;
  iotFieldHeight5: number;
  iotFieldHeight6: number;
  iotFieldHeight7: number;
  iotFieldHeight8: number;
  iotFieldHeight9: number;
  iotFieldHeight10: number;
  iotFieldHeight11: number;
  iotFieldHeight12: number;

  iotBorderRadius: number;
  iotBorderRadius2: number;
  iotBorderWidth: number;
  iotBorderColor: Color;
  iotBorderColorLight: Color;
  iotBorderColorDark: Color;

  iotBgColor: Color;
  iotBgColorStrong: Color;
  iotBgColorDimmed: Color;
  iotBgColorRed: Color;
  iotBgColorGreen: Color;
  iotBgColorBlue: Color;
  iotBgColorField: Color;

  iotColor: Color;
  iotColorStrong: Color;
  iotColorDimmed: Color;
  iotColorRed: Color;
  iotColorGreen: Color;
  iotColorBlue: Color;
  iotColorWhite: Color;
  iotColorField: Color;

  iotGradientColorStart: Color;
  iotGradientColorEnd: Color;

  iotShadowColor: Color;
}

export const LIGHT_THEME: Theme = {
  iotSpacing: 2,
  iotSpacing2: 0,
  iotSpacing3: 0,
  iotSpacing5: 0,
  iotSpacing8: 0,

  iotLineHeight: 20,

  iotFontSize: 14,

  iotFieldHeight: 0,
  iotFieldHeight2: 0,
  iotFieldHeight3: 0,
  iotFieldHeight4: 0,
  iotFieldHeight5: 0,
  iotFieldHeight6: 0,
  iotFieldHeight7: 0,
  iotFieldHeight8: 0,
  iotFieldHeight9: 0,
  iotFieldHeight10: 0,
  iotFieldHeight11: 0,
  iotFieldHeight12: 0,

  iotBorderRadius: 2,
  iotBorderRadius2: 0,
  iotBorderWidth: 1,
  iotBorderColor: new Color(0, 0, 0, 0.2),
  iotBorderColorLight: new Color(1, 1, 1, 0.8),
  iotBorderColorDark: new Color(0, 0, 0, 0.4),

  iotBgColor: new Color(0.85, 0.85, 0.85, 1),
  iotBgColorStrong: new Color(0.9, 0.9, 0.9, 1),
  iotBgColorDimmed: new Color(0.8, 0.8, 0.8, 1),
  iotBgColorRed: new Color(1, 0.5, 0.3, 1),
  iotBgColorGreen: new Color(0.2, 0.9, 0.3, 1),
  iotBgColorBlue: new Color(0.2, 0.5, 0.9, 1),
  iotBgColorField: new Color(0.95, 0.96, 0.95, 1),

  iotColor: new Color(0.25, 0.25, 0.2, 1),
  iotColorStrong: new Color(0, 0, 0, 1),
  iotColorDimmed: new Color(0.6, 0.6, 0.6, 1),
  iotColorRed: new Color(1, 0.2, 0.0, 1),
  iotColorGreen: new Color(0, 0.6, 0.1, 1),
  iotColorBlue: new Color(0.2, 0.3, 1, 1),
  iotColorWhite: new Color(1, 1, 1, 1),
  iotColorField: new Color(0, 0.05, 0.02, 1),

  iotGradientColorStart: new Color(0.9, 0.9, 0.9, 1),
  iotGradientColorEnd: new Color(0.75, 0.75, 0.75, 1),

  iotShadowColor: new Color(0, 0, 0, 0.2),
};

export const DARK_THEME: Theme = {
  iotSpacing: 2,
  iotSpacing2: 0,
  iotSpacing3: 0,
  iotSpacing5: 0,
  iotSpacing8: 0,

  iotLineHeight: 20,

  iotFontSize: 14,

  iotFieldHeight: 0,
  iotFieldHeight2: 0,
  iotFieldHeight3: 0,
  iotFieldHeight4: 0,
  iotFieldHeight5: 0,
  iotFieldHeight6: 0,
  iotFieldHeight7: 0,
  iotFieldHeight8: 0,
  iotFieldHeight9: 0,
  iotFieldHeight10: 0,
  iotFieldHeight11: 0,
  iotFieldHeight12: 0,

  iotBorderRadius: 2,
  iotBorderRadius2: 0,
  iotBorderWidth: 1,
  iotBorderColor: new Color(1, 1, 1, 0.5),
  iotBorderColorLight: new Color(1, 1, 1, 0.3),
  iotBorderColorDark: new Color(0, 0, 0, 1),

  iotBgColor: new Color(0.2, 0.2, 0.2, 1),
  iotBgColorStrong: new Color(0.15, 0.15, 0.15, 1),
  iotBgColorDimmed: new Color(0.25, 0.25, 0.25, 1),
  iotBgColorRed: new Color(0.7, 0.2, 0.1, 1),
  iotBgColorGreen: new Color(0.1, 0.5, 0.2, 1),
  iotBgColorBlue: new Color(0, 0.3, 0.65, 1),
  iotBgColorField: new Color(0.02, 0.02, 0.02, 1),

  iotColor: new Color(0.6, 0.6, 0.6, 1),
  iotColorStrong: new Color(0.86, 0.86, 0.86, 1),
  iotColorDimmed: new Color(0.3, 0.3, 0.3, 1),
  iotColorRed: new Color(1, 0.4, 0.4, 1),
  iotColorGreen: new Color(0.4, 0.95, 0.3, 1),
  iotColorBlue: new Color(0.6, 0.9, 1, 1),
  iotColorWhite: new Color(1, 1, 1, 1),
  iotColorField: new Color(0.65, 0.7, 0.68, 1),

  iotGradientColorStart: new Color(0.45, 0.45, 0.45, 1),
  iotGradientColorEnd: new Color(0.2, 0.2, 0.2, 1),

  iotShadowColor: new Color(0, 0, 0, 0.2),
};

const $ThemeID = $({
  value: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  storage: 'local',
  key: 'theme-' + THEME_VERSION
});

const $Themes = $({
  value: {},
  storage: 'local',
  key: 'io-themes-' + THEME_VERSION
});

const compositeVariables = /* css */`
  body {
    --iotBorder: var(--iotBorderWidth) solid var(--iotBorderColor);
    --iotBorderColorInset: var(--iotBorderColorDark) var(--iotBorderColorLight) var(--iotBorderColorLight) var(--iotBorderColorDark);
    --iotBorderColorOutset: var(--iotBorderColorLight) var(--iotBorderColorDark) var(--iotBorderColorDark) var(--iotBorderColorLight);
    --iotGradientOutset: linear-gradient(180deg, var(--iotGradientColorStart), var(--iotGradientColorEnd) 100%);
    --iotGradientInset: linear-gradient(0deg, var(--iotGradientColorStart), var(--iotGradientColorEnd) 150%);
    --iotShadow: 2px 2px 6px var(--iotShadowColor), 1px 1px 1px var(--iotShadowColor);
    --iotShadowInset: 1px 1px 1px inset var(--iotShadowColor);
    --iotShadowOutset: 1px 1px 2px var(--iotShadowColor);
  }
`;

/**
 * `IoTheme` is designed to be used as `IoThemeSingleton`. It holds top-level CSS variables for Io-Gui design system.
 * CSS Variables are grouped in different themes and can be collectively switched by changing `theme` property.
 *
 * ```javascript
 * IoThemeSingleton.themeID = 'dark';
 * ```
 *
 * CSS color variables such as `'--iotColor'` and `'--iotBgColor'` are mapped to numeric properties `iotColor` and `iotBgColor`.
 */
@Register
class IoTheme extends IoElement {
  static get Properties(): PropertyDefinitions {
    const props: PropertyDefinitions = {};
    for (const p in LIGHT_THEME) {
      const prop = LIGHT_THEME[p as keyof typeof LIGHT_THEME];
      if (prop instanceof Object) {
        props[p] = {value: prop, type: Color};
      } else {
        props[p] = prop;
      }
    }
    return props;
  }

  // Default themes
  @Property(Object)
  declare themes: Record<string, Theme>;

  @Property({type: String, binding: $ThemeID})
  declare themeID: string;

  @Property(true)
  declare lazy: boolean;

  init() {
    // this.changed = this.changed.bind(this);
    this.registerTheme('light', LIGHT_THEME);
    this.registerTheme('dark', DARK_THEME);
    this.themeIDChanged();
  }
  registerTheme(themeID: string, theme: Theme) {
    this.themes[themeID] = theme;
    $Themes.value[themeID] = theme;

    // Save default theme
    this.setProperty('themes', JSON.parse(JSON.stringify(this.themes)), true);
    // Save persistand theme
    $Themes.value = JSON.parse(JSON.stringify($Themes.value));
  }
  _toCss(rgba: Color) {
    const r = Math.floor(rgba.r * 255);
    const g = Math.floor(rgba.g * 255);
    const b = Math.floor(rgba.b * 255);
    if (rgba.a !== undefined && rgba.a !== 1) {
      return `rgba(${r}, ${g}, ${b}, ${rgba.a})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  reset() {
    // Load persistand themes from default themes
    $Themes.value = JSON.parse(JSON.stringify(this.themes));
    this.themeIDChanged();
  }
  themeIDChanged() {
    const values = $Themes.value[this.themeID];
    for (const p in values) {
      if (values[p] instanceof Object && JSON.stringify(Object.keys(values[p])) === '["r","g","b","a"]') {
         values[p] = new Color(values[p].r, values[p].g, values[p].b, values[p].a);
      }
    }
    this.setProperties(values);
  }
  changed() {
    this.iotFieldHeight = this.iotLineHeight + 2 * (this.iotSpacing + this.iotBorderWidth);
    this.iotFieldHeight2 = this.iotFieldHeight * 2;
    this.iotFieldHeight3 = this.iotFieldHeight * 3;
    this.iotFieldHeight4 = this.iotFieldHeight * 4;
    this.iotFieldHeight5 = this.iotFieldHeight * 5;
    this.iotFieldHeight6 = this.iotFieldHeight * 6;
    this.iotFieldHeight7 = this.iotFieldHeight * 7;
    this.iotFieldHeight8 = this.iotFieldHeight * 8;
    this.iotFieldHeight9 = this.iotFieldHeight * 9;
    this.iotFieldHeight10 = this.iotFieldHeight * 10;
    this.iotFieldHeight11 = this.iotFieldHeight * 11;
    this.iotFieldHeight12 = this.iotFieldHeight * 12;

    this.iotSpacing2 = this.iotSpacing * 2;
    this.iotSpacing3 = this.iotSpacing * 3;
    this.iotSpacing5 = this.iotSpacing * 5;
    this.iotSpacing8 = this.iotSpacing * 8;

    this.iotBorderRadius2 = this.iotBorderRadius + this.iotSpacing;

    const propertyVariables = Array.from(this._properties.keys()).reduce(
      (result, prop) => {
        if (prop.startsWith('iot')) {
          $Themes.value[this.themeID][prop] = this[prop];
          $Themes.value = JSON.parse(JSON.stringify($Themes.value));
          if (typeof this[prop] === 'object') {
            return `${result}--${prop}: ${this._toCss(this[prop])};\n    `;
          } else {
            return `${result}--${prop}: ${this[prop]}px;\n    `;
          }
        }
        return '';
      }, '');

    styleElement.innerHTML = /* css */`body {\n  ${propertyVariables}\n}\n${compositeVariables}`;
    // console.log(this.iotColor);
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
}

const IoThemeSingleton = new IoTheme();
export { IoThemeSingleton };