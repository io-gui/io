import { IoElement, RegisterIoElement } from './element.js';
import { Property, PropertyDeclarations } from './internals/property.js';
import { IoStorage as $ } from './storage.js';

const THEME_VERSION = 'v0.8';

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
  iotSpacing4: number;
  iotLineHeight: number;
  iotLineHeight2: number;
  iotLineHeight3: number;
  iotLineHeight4: number;
  iotLineHeight8: number;
  iotFieldHeight: number;
  iotFieldHeight2: number;
  iotFieldHeight3: number;
  iotFieldHeight4: number;
  iotFieldHeight8: number;
  iotFieldHeight10: number;
  iotFieldHeight12: number;
  iotStrokeWidth: number;
  iotBorderRadius: number;
  iotBorderRadius2: number;
  iotBorderWidth: number;
  iotBorderWidth2: number;
  iotFontSize: number;

  iotBackgroundColor: Color;
  iotBackgroundColorStrong: Color;
  iotBackgroundColorDimmed: Color;
  iotBackgroundColorFaint: Color;
  iotBackgroundColorField: Color;
  iotBackgroundColorSelected: Color;

  iotColor: Color;
  iotColorStrong: Color;
  iotColorDimmed: Color;
  iotColorError: Color;
  iotColorLink: Color;
  iotColorField: Color;
  iotColorSelected: Color;

  iotBorderColor: Color;
  iotBorderColorLight: Color;
  iotBorderColorDark: Color;
  iotBorderColorSelected: Color;
  iotBorderColorFocus: Color;

  iotGradientColorStart: Color;
  iotGradientColorEnd: Color;

  iotShadowColor: Color;
}

export const LIGHT_THEME: Theme = {
  iotSpacing: 2,
  iotSpacing2: 4,
  iotSpacing3: 6,
  iotSpacing4: 8,
  iotLineHeight: 20,
  iotLineHeight2: 40,
  iotLineHeight3: 60,
  iotLineHeight4: 80,
  iotLineHeight8: 160,
  iotFieldHeight: 28,
  iotFieldHeight2: 56,
  iotFieldHeight3: 112,
  iotFieldHeight4: 168,
  iotFieldHeight8: 236,
  iotFieldHeight10: 280,
  iotFieldHeight12: 336,
  iotStrokeWidth: 1,
  iotBorderRadius: 2,
  iotBorderRadius2: 4,
  iotBorderWidth: 1,
  iotBorderWidth2: 2,
  iotFontSize: 14,

  iotBackgroundColor: new Color(0.95, 0.95, 0.95, 1),
  iotBackgroundColorStrong: new Color(0.75, 0.75, 0.75, 1),
  iotBackgroundColorDimmed: new Color(0.85, 0.85, 0.85, 1),
  iotBackgroundColorFaint: new Color(0.9, 0.9, 0.9, 1),
  iotBackgroundColorField: new Color(0.85, 0.86, 0.87, 1),
  iotBackgroundColorSelected: new Color(0.2, 0.5, 0.9, 1),

  iotColor: new Color(0.25, 0.25, 0.2, 1),
  iotColorStrong: new Color(0, 0, 0, 1),
  iotColorDimmed: new Color(0.34, 0.34, 0.25, 1),
  iotColorError: new Color(0.95, 0.5, 0.3, 1),
  iotColorLink: new Color(0.4, 0.7, 0.3, 1),
  iotColorField: new Color(0, 0, 0, 1),
  iotColorSelected: new Color(1, 1, 1, 1),

  iotBorderColor: new Color(0.8, 0.8, 0.8, 1),
  iotBorderColorLight: new Color(1, 1, 1, 1),
  iotBorderColorDark: new Color(0.65, 0.65, 0.65, 1),
  iotBorderColorSelected: new Color(0.8, 0.9, 1, 1),
  iotBorderColorFocus: new Color(0.3, 0.65, 1, 1),

  iotGradientColorStart: new Color(0.9, 0.9, 0.9, 1),
  iotGradientColorEnd: new Color(0.75, 0.75, 0.75, 1),

  iotShadowColor: new Color(0, 0, 0, 0.2),
};

export const DARK_THEME: Theme = {
  iotSpacing: 2,
  iotSpacing2: 4,
  iotSpacing3: 6,
  iotSpacing4: 8,
  iotLineHeight: 20,
  iotLineHeight2: 40,
  iotLineHeight3: 60,
  iotLineHeight4: 80,
  iotLineHeight8: 160,
  iotFieldHeight: 28,
  iotFieldHeight2: 56,
  iotFieldHeight3: 112,
  iotFieldHeight4: 168,
  iotFieldHeight8: 236,
  iotFieldHeight10: 280,
  iotFieldHeight12: 336,
  iotStrokeWidth: 1,
  iotBorderRadius: 2,
  iotBorderRadius2: 4,
  iotBorderWidth: 1,
  iotBorderWidth2: 2,
  iotFontSize: 14,

  iotBackgroundColor: new Color(0.092, 0.094, 0.093, 1),
  iotBackgroundColorStrong: new Color(0.06, 0.06, 0.06, 1),
  iotBackgroundColorDimmed: new Color(0.11, 0.12, 0.12, 1),
  iotBackgroundColorFaint:  new Color(0.12, 0.14, 0.13, 1),
  iotBackgroundColorField: new Color(0.02, 0.038, 0.03, 1),
  iotBackgroundColorSelected: new Color(0, 0.3, 0.65, 1),

  iotColor: new Color(0.76, 0.77, 0.78, 1),
  iotColorStrong: new Color(1, 1, 1, 1),
  iotColorDimmed: new Color(0.6, 0.64, 0.63, 1),
  iotColorError: new Color(0.8, 0.376, 0.062, 1),
  iotColorLink: new Color(0.78, 0.9, 0.6, 1),
  iotColorField: new Color(0.65, 0.7, 0.68, 1),
  iotColorSelected: new Color(1, 1, 1, 1),

  iotBorderColor: new Color(0.2, 0.2, 0.2, 1),
  iotBorderColorLight: new Color(0.3, 0.3, 0.3, 1),
  iotBorderColorDark: new Color(0.06, 0.06, 0.06, 1),
  iotBorderColorSelected: new Color(0.6, 0.9, 1, 1),
  iotBorderColorFocus: new Color(0.3, 0.65, 0.75, 1),

  iotGradientColorStart: new Color(0.192, 0.195, 0.194, 1),
  iotGradientColorEnd: new Color(0.08, 0.083, 0.082, 1),

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
    --iotBorderError: var(--iotBorderWidth) solid var(--iotColorError);
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
 * CSS color variables such as `'--iotColor'` and `'--iotBackgroundColor'` are mapped to numeric properties `iotColor` and `iotBackgroundColor`.
 */
@RegisterIoElement
class IoTheme extends IoElement {
  static get Properties(): PropertyDeclarations {
    const props: PropertyDeclarations = {};
    for (const p in LIGHT_THEME) {
      const prop = LIGHT_THEME[p as keyof typeof LIGHT_THEME];
      if (prop instanceof Object) {
        props[p] = {value: prop, type: Color, observe: true};
      } else {
        props[p] = prop;
      }
    }
    return props;
  }

  // Default themes
  @Property({type: Object, init: true})
  declare themes: Record<string, Theme>;

  @Property({type: String, binding: $ThemeID})
  declare themeID: string;

  init() {
    // this.changed = this.changed.bind(this);
    this._properties.forEach((property) => {
      if (property.value === 'object') { property.observe = true; }
    });
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
    this.iotFieldHeight8 = this.iotFieldHeight * 8;
    this.iotFieldHeight10 = this.iotFieldHeight * 10;
    this.iotFieldHeight12 = this.iotFieldHeight * 12;
    this.iotLineHeight2 = this.iotLineHeight * 2;
    this.iotLineHeight3 = this.iotLineHeight * 3;
    this.iotLineHeight4 = this.iotLineHeight * 4;
    this.iotLineHeight8 = this.iotLineHeight * 8;
    this.iotSpacing2 = this.iotSpacing * 2;
    this.iotSpacing3 = this.iotSpacing * 3;
    this.iotSpacing4 = this.iotSpacing * 4;
    this.iotBorderRadius2 = this.iotBorderRadius * 2;
    this.iotBorderWidth2 = this.iotBorderWidth * 2;

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