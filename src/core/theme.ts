import { IoElement, RegisterIoElement } from './element.js';
import { Property, PropertyDeclarations } from './internals/property.js';
import { IoStorage as $ } from './storage.js';

const THEME_VERSION = 'v0.6';

const styleElement = document.createElement('style');
styleElement.setAttribute('id', 'io-theme-variables-' + THEME_VERSION);
document.head.appendChild(styleElement);

export class Color {
  constructor(public r: number, public g: number, public b: number, public a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

type Variables = {
  iotSpacing: number;
  iotSpacing2: number;
  iotSpacing3: number;
  iotSpacing4: number;
  iotLineHeight: number;
  iotLineHeight2: number;
  iotLineHeight3: number;
  iotLineHeight4: number;
  iotFieldHeight: number;
  iotFieldHeight2: number;
  iotFieldHeight3: number;
  iotFieldHeight4: number;
  iotStrokeWidth: number;
  iotBorderRadius: number;
  iotBorderRadius2: number;
  iotBorderWidth: number;
  iotBorderWidth2: number;
  iotFontSize: number;

  iotBackgroundColor: Color;
  iotBackgroundColorLight: Color;
  iotBackgroundColorDark: Color;
  iotBackgroundColorField: Color;
  iotBackgroundColorSelected: Color;

  iotColor: Color;
  iotColorError: Color;
  iotColorLink: Color;
  iotColorField: Color;
  iotColorFieldSelected: Color;

  iotBorderColor: Color;
  iotBorderColorLight: Color;
  iotBorderColorDark: Color;
  iotBorderColorSelected: Color;
  iotBorderColorFocus: Color;

  iotGradientColorStart: Color;
  iotGradientColorEnd: Color;

  iotShadowColor: Color;
}

type Themes = Record<string, Variables>;

const defaultThemes: Themes = {
  light: {
    iotSpacing: 2,
    iotSpacing2: 4,
    iotSpacing3: 6,
    iotSpacing4: 8,
    iotLineHeight: 20,
    iotLineHeight2: 40,
    iotLineHeight3: 60,
    iotLineHeight4: 80,
    iotFieldHeight: 28,
    iotFieldHeight2: 56,
    iotFieldHeight3: 112,
    iotFieldHeight4: 168,
    iotStrokeWidth: 1,
    iotBorderRadius: 2,
    iotBorderRadius2: 4,
    iotBorderWidth: 1,
    iotBorderWidth2: 2,
    iotFontSize: 14,

    iotBackgroundColor: new Color(1, 1, 1, 1),
    iotBackgroundColorLight: new Color(0.6, 0.6, 0.6, 1),
    iotBackgroundColorDark: new Color(0.84, 0.84, 0.84, 1),
    iotBackgroundColorField: new Color(0.92, 0.92, 0.92, 1),
    iotBackgroundColorSelected: new Color(0.3, 0.6, 1, 1),

    iotColor: new Color(0, 0, 0, 1),
    iotColorError: new Color(0.91, 0.5, 0.5, 1),
    iotColorLink: new Color(0.2, 0.75, 0.2, 1),
    iotColorField: new Color(0, 0, 0, 1),
    iotColorFieldSelected: new Color(1, 1, 1, 1),

    iotBorderColor: new Color(0.7, 0.7, 0.7, 1),
    iotBorderColorLight: new Color(1, 1, 1, 1),
    iotBorderColorDark: new Color(1, 1, 1, 1),
    iotBorderColorSelected: new Color(1, 1, 1, 1),
    iotBorderColorFocus: new Color(0.3, 0.3, 1, 1),

    iotGradientColorStart: new Color(0.9, 0.9, 0.9, 1),
    iotGradientColorEnd: new Color(0.75, 0.75, 0.75, 1),

    iotShadowColor: new Color(0, 0, 0, 0.2),
  },
  dark: {
    iotSpacing: 2,
    iotSpacing2: 4,
    iotSpacing3: 6,
    iotSpacing4: 8,
    iotLineHeight: 20,
    iotLineHeight2: 40,
    iotLineHeight3: 60,
    iotLineHeight4: 80,
    iotFieldHeight: 28,
    iotFieldHeight2: 56,
    iotFieldHeight3: 112,
    iotFieldHeight4: 168,
    iotStrokeWidth: 1,
    iotBorderRadius: 2,
    iotBorderRadius2: 4,
    iotBorderWidth: 1,
    iotBorderWidth2: 2,
    iotFontSize: 14,

    iotBackgroundColor: new Color(0.2, 0.2, 0.2, 1),
    iotBackgroundColorLight: new Color(0.3, 0.3, 0.3, 1),
    iotBackgroundColorDark: new Color(0.5, 0.5, 0.5, 1),
    iotBackgroundColorField: new Color(0.137, 0.137, 0.137, 1),
    iotBackgroundColorSelected: new Color(0.1, 0.3, 0.85, 1),

    iotColor: new Color(1, 1, 1, 1),
    iotColorError: new Color(1, 0.376, 0.062, 1),
    iotColorLink: new Color(0.75, 0.9, 0.59, 1),
    iotColorField: new Color(0.75, 0.75, 0.75, 1),
    iotColorFieldSelected: new Color(1, 1, 1, 1),

    iotBorderColor: new Color(0.3, 0.3, 0.3, 1),
    iotBorderColorLight: new Color(0.4, 0.4, 0.4, 1),
    iotBorderColorDark: new Color(0.1, 0.1, 0.1, 1),
    iotBorderColorSelected: new Color(0.3, 0.3, 1, 1),
    iotBorderColorFocus: new Color(0.5, 0.9, 1, 1),

    iotGradientColorStart: new Color(1, 1, 1, 0.1),
    iotGradientColorEnd: new Color(0, 0, 0, 0.2),

    iotShadowColor: new Color(0, 0, 0, 0.2),
  },
};

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

const persistantThemes = $({
  value: JSON.parse(JSON.stringify(defaultThemes)),
  storage: 'local',
  key: 'io-persistantThemes-' + THEME_VERSION
});

const theme = $({
  value: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  storage: 'local',
  key: 'theme-' + THEME_VERSION
});

/**
 * `IoTheme` is designed to be used as `IoThemeSingleton`. It holds top-level CSS variables for Io-Gui design system.
 * CSS Variables are grouped in different themes and can be collectively switched by changing `theme` property.
 *
 * ```javascript
 * IoThemeSingleton.theme = 'dark';
 * ```
 *
 * CSS color variables such as `'--iotColor'` and `'--iotBackgroundColor'` are mapped to numeric properties `iotColor` and `iotBackgroundColor`.
 */
@RegisterIoElement
export class IoTheme extends IoElement {
  static get Properties(): PropertyDeclarations {
    const props: PropertyDeclarations = {};
    for (const p in persistantThemes.value[theme.value]) {
      if (persistantThemes.value[theme.value][p] instanceof Object) {
        props[p] = {value: persistantThemes.value[theme.value][p], type: Color, observe: true};
      } else {
        props[p] = persistantThemes.value[theme.value][p];
      }
    }
    return props;
  }

  @Property({value: true})
  declare lazy: boolean;

  @Property({value: true})
  declare persist: boolean;

  @Property({type: String, binding: theme})
  declare theme: string;

  init() {
    this._properties.forEach((property) => {
      if (property.value === 'object') { property.observe = true; }
    });
    this.changed = this.changed.bind(this);
    this.throttle(this.changed, undefined, true);
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
    persistantThemes.value = Object.assign({}, JSON.parse(JSON.stringify(defaultThemes)));
    this.themeChanged();
  }
  themeChanged() {
    const values = persistantThemes.value[this.theme];
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
    this.iotLineHeight2 = this.iotLineHeight * 2;
    this.iotLineHeight3 = this.iotLineHeight * 3;
    this.iotLineHeight4 = this.iotLineHeight * 4;
    this.iotSpacing2 = this.iotSpacing * 2;
    this.iotSpacing3 = this.iotSpacing * 3;
    this.iotSpacing4 = this.iotSpacing * 4;
    this.iotBorderRadius2 = this.iotBorderRadius * 2;
    this.iotBorderWidth2 = this.iotBorderWidth * 2;

    const propertyVariables = Array.from(this._properties.keys()).reduce(
      (result, prop) => {
        if (prop.startsWith('iot')) {
          if (this.persist) {
            persistantThemes.value[theme.value][prop] = this[prop];
            persistantThemes.value = JSON.parse(JSON.stringify(persistantThemes.value));
          }
          if (typeof this[prop] === 'object') {
            return `${result}--${prop}: ${this._toCss(this[prop])};\n    `;
          } else {
            return `${result}--${prop}: ${this[prop]}px;\n    `;
          }
        }
        return '';
      }, '');

    styleElement.innerHTML = /* css */`body {\n  ${propertyVariables}\n}\n${compositeVariables}`;
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
}

const IoThemeSingleton = new IoTheme();
export { IoThemeSingleton };