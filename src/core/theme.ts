import { IoElement, RegisterIoElement } from './element.js';
import { Property, PropertyDeclarations } from './internals/property.js';
import { IoStorage as $ } from './storage.js';

const THEME_VERSION = 'v0.4';

const styleElement = document.createElement('style');
styleElement.setAttribute('id', 'io-theme-variables-' + THEME_VERSION);
document.head.appendChild(styleElement);

// type Color = [number, number, number, number];

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
  ioFontSize: number;
  ioStrokeWidth: number;
  ioBorderRadius: number;
  ioBorderWidth: number;
  ioBackgroundColor: Color;
  ioBackgroundColorLight: Color;
  ioBackgroundColorDark: Color;
  ioBackgroundColorField: Color;
  ioColor: Color;
  ioColorError: Color;
  ioColorLink: Color;
  ioColorFocus: Color;
  ioColorField: Color;
  ioColorNumber: Color;
  ioColorString: Color;
  ioColorBoolean: Color;
  ioColorBorder: Color;
  ioColorBorderLight: Color;
  ioColorBorderDark: Color;
  ioColorGradientStart: Color;
  ioColorGradientEnd: Color;
  ioColorShadow: Color;
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
    ioFontSize: 14,
    ioStrokeWidth: 1,
    ioBorderRadius: 3,
    ioBorderWidth: 1,
    ioBackgroundColor: new Color(1, 1, 1, 1),
    ioBackgroundColorLight: new Color(0.6, 0.6, 0.6, 1),
    ioBackgroundColorDark: new Color(0.84, 0.84, 0.84, 1),
    ioBackgroundColorField: new Color(0.92, 0.92, 0.92, 1),
    ioColor: new Color(0, 0, 0, 1),
    ioColorError: new Color(0.91, 0.5, 0.5, 1),
    ioColorLink: new Color(0.2, 0.75, 0.2, 1),
    ioColorFocus: new Color(0.3, 0.6, 1, 1),
    ioColorField: new Color(0, 0, 0, 1),
    ioColorNumber: new Color(0.12, 0.64, 1, 1),
    ioColorString: new Color(0.95, 0.25, 0.1, 1),
    ioColorBoolean: new Color(0.82, 0.35, 0.75, 1),
    ioColorBorder: new Color(0.7, 0.7, 0.7, 1),
    ioColorBorderLight: new Color(1, 1, 1, 1),
    ioColorBorderDark: new Color(0.6, 0.6, 0.6, 1),
    ioColorGradientStart: new Color(0.9, 0.9, 0.9, 1),
    ioColorGradientEnd: new Color(0.75, 0.75, 0.75, 1),
    ioColorShadow: new Color(0, 0, 0, 0.2),
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
    ioFontSize: 14,
    ioStrokeWidth: 1,
    ioBorderRadius: 3,
    ioBorderWidth: 1,
    ioBackgroundColor: new Color(0.065, 0.065, 0.065, 1),
    ioBackgroundColorLight: new Color(0.3, 0.3, 0.3, 1),
    ioBackgroundColorDark: new Color(0.5, 0.5, 0.5, 1),
    ioBackgroundColorField: new Color(0.137, 0.137, 0.137, 1),
    ioColor: new Color(1, 1, 1, 1),
    ioColorError: new Color(1, 0.376, 0.062, 1),
    ioColorLink: new Color(0.75, 0.9, 0.59, 1),
    ioColorFocus: new Color(0.3, 0.82, 1.4, 1),
    ioColorField: new Color(0.75, 0.75, 0.75, 1),
    ioColorNumber: new Color(0.125, 0.64, 1, 1),
    ioColorString: new Color(0.94, 0.25, 0.086, 1),
    ioColorBoolean: new Color(0.82, 0.35, 0.75, 1),
    ioColorBorder: new Color(0.3, 0.3, 0.3, 1),
    ioColorBorderLight: new Color(0.4, 0.4, 0.4, 1),
    ioColorBorderDark: new Color(0, 0, 0, 1),
    ioColorGradientStart: new Color(1, 1, 1, 0.1),
    ioColorGradientEnd: new Color(0, 0, 0, 0.2),
    ioColorShadow: new Color(0, 0, 0, 0.2),
  },
};

const mixins = /* css */`
  --io-panel: {
    border-radius: calc(var(--io-border-radius) + var(--io-spacing));
    border: var(--io-border);
    border-color: var(--io-color-border-outset);
    color: var(--io-color-field);
    background-color: var(--io-background-color-dark);
    padding: var(--io-spacing);
  }
  --io-row: {
    display: flex;
    flex: 1 1;
    flex-direction: row;
    align-self: stretch;
    justify-self: stretch;
  }
  --io-column: {
    display: flex;
    flex: 1 1;
    flex-direction: column;
    align-self: stretch;
    justify-self: stretch;
  }
  --io-grid2: {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--io-spacing);
  }
  --io-grid3: {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: var(--io-spacing);
  }
  --io-grid4: {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: var(--io-spacing);
  }
  --io-grid5: {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: var(--io-spacing);
  }
`;

const compositeVariables = /* css */`
  body {
    --io-border: var(--io-border-width) solid var(--io-color-border);
    --io-border-error: var(--io-border-width) solid var(--io-color-error);
    --io-color-border-inset: var(--io-color-border-dark) var(--io-color-border-light) var(--io-color-border-light) var(--io-color-border-dark);
    --io-color-border-outset: var(--io-color-border-light) var(--io-color-border-dark) var(--io-color-border-dark) var(--io-color-border-light);
    --io-gradient-button: linear-gradient(180deg, var(--io-color-gradient-start), var(--io-color-gradient-end) 100%);
    --io-shadow: 2px 2px 6px var(--io-color-shadow), 1px 1px 1px var(--io-color-shadow);
    --io-shadow-inset: 1px 1px 2px inset var(--io-color-shadow);
    --io-shadow-outset: -1px -1px 2px inset var(--io-color-shadow);
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
 * CSS color variables such as `'--io-color'` and `'--io-background-color'` are mapped to numeric properties `ioColor` and `ioBackgroundColor`.
 */
@RegisterIoElement
export class IoTheme extends IoElement {
  static get Style(): string {
    return mixins;
  }

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
      if (property.value === 'object') {
        property.observe = true;
      }
    });
    this.changed = this.changed.bind(this);
    this.throttle(this.changed, undefined, true);
  }
  _toCss(rgba: Color) {
    const r = Math.floor(rgba.r * 255);
    const g = Math.floor(rgba.g * 255);
    const b = Math.floor(rgba.b * 255);
    if (rgba.a !== undefined) {
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
    this.setProperties(persistantThemes.value[this.theme]);
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

    const propertyVariables = Array.from(this._properties.keys()).reduce(
      (result, prop) => {
        const cssProp = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        if (prop.startsWith('io')) {
          if (this.persist) {
            persistantThemes.value[theme.value][prop] = this[prop];
            persistantThemes.value = JSON.parse(JSON.stringify(persistantThemes.value));
          }
          if (typeof this[prop] === 'object') {
            return `${result}--${cssProp}: ${this._toCss(this[prop])};\n    `;
          } else {
            return `${result}--${cssProp}: ${this[prop]}px;\n    `;
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