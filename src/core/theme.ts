import { IoElement, RegisterIoElement } from './element.js';
import { Property, PropertyDeclarations } from './internals/property.js';
import { IoStorage as $ } from './storage.js';

const THEME_VERSION = 'v0.5';

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
  ioSpacing: number;
  ioSpacing2: number;
  ioSpacing3: number;
  ioSpacing4: number;
  ioLineHeight: number;
  ioLineHeight2: number;
  ioLineHeight3: number;
  ioLineHeight4: number;
  ioFieldHeight: number;
  ioFieldHeight2: number;
  ioFieldHeight3: number;
  ioFieldHeight4: number;
  ioStrokeWidth: number;
  ioBorderRadius: number;
  ioBorderRadius2: number;
  ioBorderWidth: number;
  ioBorderWidth2: number;
  ioFontSize: number;

  ioBackgroundColor: Color;
  ioBackgroundColorLight: Color;
  ioBackgroundColorDark: Color;
  ioBackgroundColorField: Color;
  ioBackgroundColorSelected: Color;

  ioColor: Color;
  ioColorError: Color;
  ioColorLink: Color;
  ioColorField: Color;
  ioColorFieldSelected: Color;

  ioBorderColor: Color;
  ioBorderColorLight: Color;
  ioBorderColorDark: Color;
  ioBorderColorSelected: Color;
  ioBorderColorFocus: Color;

  ioGradientColorStart: Color;
  ioGradientColorEnd: Color;

  ioShadowColor: Color;
}

type Themes = Record<string, Variables>;

const defaultThemes: Themes = {
  light: {
    ioSpacing: 2,
    ioSpacing2: 4,
    ioSpacing3: 6,
    ioSpacing4: 8,
    ioLineHeight: 20,
    ioLineHeight2: 40,
    ioLineHeight3: 60,
    ioLineHeight4: 80,
    ioFieldHeight: 28,
    ioFieldHeight2: 56,
    ioFieldHeight3: 112,
    ioFieldHeight4: 168,
    ioStrokeWidth: 1,
    ioBorderRadius: 2,
    ioBorderRadius2: 4,
    ioBorderWidth: 1,
    ioBorderWidth2: 2,
    ioFontSize: 14,

    ioBackgroundColor: new Color(1, 1, 1, 1),
    ioBackgroundColorLight: new Color(0.6, 0.6, 0.6, 1),
    ioBackgroundColorDark: new Color(0.84, 0.84, 0.84, 1),
    ioBackgroundColorField: new Color(0.92, 0.92, 0.92, 1),
    ioBackgroundColorSelected: new Color(0.3, 0.6, 1, 1),

    ioColor: new Color(0, 0, 0, 1),
    ioColorError: new Color(0.91, 0.5, 0.5, 1),
    ioColorLink: new Color(0.2, 0.75, 0.2, 1),
    ioColorField: new Color(0, 0, 0, 1),
    ioColorFieldSelected: new Color(1, 1, 1, 1),

    ioBorderColor: new Color(0.7, 0.7, 0.7, 1),
    ioBorderColorLight: new Color(1, 1, 1, 1),
    ioBorderColorDark: new Color(1, 1, 1, 1),
    ioBorderColorSelected: new Color(1, 1, 1, 1),
    ioBorderColorFocus: new Color(0.3, 0.3, 1, 1),

    ioGradientColorStart: new Color(0.9, 0.9, 0.9, 1),
    ioGradientColorEnd: new Color(0.75, 0.75, 0.75, 1),

    ioShadowColor: new Color(0, 0, 0, 0.2),
  },
  dark: {
    ioSpacing: 2,
    ioSpacing2: 4,
    ioSpacing3: 6,
    ioSpacing4: 8,
    ioLineHeight: 20,
    ioLineHeight2: 40,
    ioLineHeight3: 60,
    ioLineHeight4: 80,
    ioFieldHeight: 28,
    ioFieldHeight2: 56,
    ioFieldHeight3: 112,
    ioFieldHeight4: 168,
    ioStrokeWidth: 1,
    ioBorderRadius: 2,
    ioBorderRadius2: 4,
    ioBorderWidth: 1,
    ioBorderWidth2: 2,
    ioFontSize: 14,

    ioBackgroundColor: new Color(0.2, 0.2, 0.2, 1),
    ioBackgroundColorLight: new Color(0.3, 0.3, 0.3, 1),
    ioBackgroundColorDark: new Color(0.5, 0.5, 0.5, 1),
    ioBackgroundColorField: new Color(0.137, 0.137, 0.137, 1),
    ioBackgroundColorSelected: new Color(0.1, 0.3, 0.85, 1),

    ioColor: new Color(1, 1, 1, 1),
    ioColorError: new Color(1, 0.376, 0.062, 1),
    ioColorLink: new Color(0.75, 0.9, 0.59, 1),
    ioColorField: new Color(0.75, 0.75, 0.75, 1),
    ioColorFieldSelected: new Color(1, 1, 1, 1),

    ioBorderColor: new Color(0.3, 0.3, 0.3, 1),
    ioBorderColorLight: new Color(0.4, 0.4, 0.4, 1),
    ioBorderColorDark: new Color(0.1, 0.1, 0.1, 1),
    ioBorderColorSelected: new Color(0.3, 0.3, 1, 1),
    ioBorderColorFocus: new Color(0.5, 0.9, 1, 1),

    ioGradientColorStart: new Color(1, 1, 1, 0.1),
    ioGradientColorEnd: new Color(0, 0, 0, 0.2),

    ioShadowColor: new Color(0, 0, 0, 0.2),
  },
};

const compositeVariables = /* css */`
  body {
    --ioBorder: var(--ioBorderWidth) solid var(--ioBorderColor);
    --ioBorderError: var(--ioBorderWidth) solid var(--ioColorError);
    --ioBorderColorInset: var(--ioBorderColorDark) var(--ioBorderColorLight) var(--ioBorderColorLight) var(--ioBorderColorDark);
    --ioBorderColorOutset: var(--ioBorderColorLight) var(--ioBorderColorDark) var(--ioBorderColorDark) var(--ioBorderColorLight);
    --ioGradientOutset: linear-gradient(180deg, var(--ioGradientColorStart), var(--ioGradientColorEnd) 100%);
    --ioGradientInset: linear-gradient(0deg, var(--ioGradientColorStart), var(--ioGradientColorEnd) 150%);
    --ioShadow: 2px 2px 6px var(--ioShadowColor), 1px 1px 1px var(--ioShadowColor);
    --ioShadowInset: 1px 1px 1px inset var(--ioShadowColor);
    --ioShadowOutset: 1px 1px 2px var(--ioShadowColor);
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
 * CSS color variables such as `'--ioColor'` and `'--ioBackgroundColor'` are mapped to numeric properties `ioColor` and `ioBackgroundColor`.
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
    this.ioFieldHeight = this.ioLineHeight + 2 * (this.ioSpacing + this.ioBorderWidth);
    this.ioFieldHeight2 = this.ioFieldHeight * 2;
    this.ioFieldHeight3 = this.ioFieldHeight * 3;
    this.ioFieldHeight4 = this.ioFieldHeight * 4;
    this.ioLineHeight2 = this.ioLineHeight * 2;
    this.ioLineHeight3 = this.ioLineHeight * 3;
    this.ioLineHeight4 = this.ioLineHeight * 4;
    this.ioSpacing2 = this.ioSpacing * 2;
    this.ioSpacing3 = this.ioSpacing * 3;
    this.ioSpacing4 = this.ioSpacing * 4;
    this.ioBorderRadius2 = this.ioBorderRadius * 2;
    this.ioBorderWidth2 = this.ioBorderWidth * 2;

    const propertyVariables = Array.from(this._properties.keys()).reduce(
      (result, prop) => {
        if (prop.startsWith('io')) {
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