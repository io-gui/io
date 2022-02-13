import {IoElement, RegisterIoElement} from '../../core/io-element.js';
import {IoStorageFactory as $} from './storage.js';

const themePropDefaults =  {
  cssSpacing: 2,
  cssBorderRadius: 3,
  cssBorderWidth: 1,
  cssStrokeWidth: 1,
  cssLineHeight: 22,
  cssItemHeight: 0, // automatically calculated
  cssFontSize: 14,
};

const themeDBDefaults = {
  light: Object.assign({
    cssBackgroundColor: [1, 1, 1, 1],
    cssBackgroundColorLight: [0.6, 0.6, 0.6, 1],
    cssBackgroundColorDark: [0.84, 0.84, 0.84, 1],
    cssBackgroundColorField: [0.92, 0.92, 0.92, 1],
    cssColor: [0, 0, 0, 1],
    cssColorError: [0.91, 0.5, 0.5, 1],
    cssColorLink: [0.2, 0.75, 0.2, 1],
    cssColorFocus: [0.3, 0.6, 1, 1],
    cssColorField: [0, 0, 0, 1],
    cssColorNumber: [0.12, 0.64, 1, 1],
    cssColorString: [0.95, 0.25, 0.1, 1],
    cssColorBoolean: [0.82, 0.35, 0.75, 1],
    cssColorBorder: [0.7, 0.7, 0.7, 1],
    cssColorBorderLight: [1, 1, 1, 1],
    cssColorBorderDark: [0.6, 0.6, 0.6, 1],
    cssColorGradientStart: [0.9, 0.9, 0.9, 1],
    cssColorGradientEnd: [0.75, 0.75, 0.75, 1],
    cssColorShadow: [0, 0, 0, 0.2],
  }, themePropDefaults),
  dark: Object.assign({
    cssBackgroundColor: [0.065, 0.065, 0.065, 1],
    cssBackgroundColorLight: [0.3, 0.3, 0.3, 1],
    cssBackgroundColorDark: [0.5, 0.5, 0.5, 1],
    cssBackgroundColorField: [0.137, 0.137, 0.137, 1],
    cssColor: [1, 1, 1, 1],
    cssColorError: [1, 0.376, 0.062, 1],
    cssColorLink: [0.75, 0.9, 0.59, 1],
    cssColorFocus: [0.3, 0.82, 1.4, 1],
    cssColorField: [0.75, 0.75, 0.75, 1],
    cssColorNumber: [0.125, 0.64, 1, 1],
    cssColorString: [0.94, 0.25, 0.086, 1],
    cssColorBoolean: [0.82, 0.35, 0.75, 1],
    cssColorBorder: [0.3, 0.3, 0.3, 1],
    cssColorBorderLight: [0.4, 0.4, 0.4, 1],
    cssColorBorderDark: [0, 0, 0, 1],
    cssColorGradientStart: [1, 1, 1, 0.1],
    cssColorGradientEnd: [0, 0, 0, 0.2],
    cssColorShadow: [0, 0, 0, 0.2],
  }, themePropDefaults),
};

const themeDB = $({value: JSON.parse(JSON.stringify(themeDBDefaults)), storage: 'local', key: 'themeDB'});

export class IoTheme extends IoElement {
  static get Style() {
    return /* css */`
    --io-item: {
      align-self: flex-start;
      display: inline-block;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      white-space: nowrap;
      box-sizing: border-box;
      line-height: var(--io-line-height);
      height: var(--io-item-height);
      font-size: var(--io-font-size);
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: transparent;
      color: var(--io-color);
      background-color: transparent;
      background-image: none;
      padding: var(--io-spacing);
      transition: background-color 0.25s;
    }
    --io-panel: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      border-radius: calc(var(--io-border-radius) + var(--io-spacing));
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-dark);
      padding: var(--io-spacing);
    }
    --io-content: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-tap-highlight-color: transparent;
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
    --io-table2: {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table3: {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table4: {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table5: {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: var(--io-spacing);
    }
    `;
  }
  static get Properties(): any {
    const isDarkMode = !!window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = $({value: isDarkMode ? 'dark' : 'light', storage: 'local', key: 'theme'});
    const vars = themeDB.value[theme.value];
    return {
      theme: theme,
      //
      cssSpacing: vars.cssSpacing,
      cssBorderRadius: vars.cssBorderRadius,
      cssBorderWidth: vars.cssBorderWidth,
      cssStrokeWidth: vars.cssStrokeWidth,
      cssLineHeight: vars.cssLineHeight,
      cssItemHeight: vars.cssItemHeight,
      cssFontSize: vars.cssFontSize,
      cssBackgroundColor: {value: vars.cssBackgroundColor, observe: true},
      cssBackgroundColorLight: {value: vars.cssBackgroundColorLight, observe: true},
      cssBackgroundColorDark: {value: vars.cssBackgroundColorDark, observe: true},
      cssBackgroundColorField: {value: vars.cssBackgroundColorField, observe: true},
      cssColor: {value: vars.cssColor, observe: true},
      cssColorError: {value: vars.cssColorError, observe: true},
      cssColorLink: {value: vars.cssColorLink, observe: true},
      cssColorFocus: {value: vars.cssColorFocus, observe: true},
      cssColorField: {value: vars.cssColorField, observe: true},
      cssColorNumber: {value: vars.cssColorNumber, observe: true},
      cssColorString: {value: vars.cssColorString, observe: true},
      cssColorBoolean: {value: vars.cssColorBoolean, observe: true},
      cssColorBorder: {value: vars.cssColorBorder, observe: true},
      cssColorBorderLight: {value: vars.cssColorBorderLight, observe: true},
      cssColorBorderDark: {value: vars.cssColorBorderDark, observe: true},
      cssColorGradientStart: {value: vars.cssColorGradientStart, observe: true},
      cssColorGradientEnd: {value: vars.cssColorGradientEnd, observe: true},
      cssColorShadow: {value: vars.cssColorShadow, observe: true},
      //
      lazy: true,
    };
  }
  constructor(props?: any) {
    super(props);
    this.variablesElement = document.createElement('style');
    this.variablesElement.setAttribute('id', 'io-theme-variables');
    document.head.appendChild(this.variablesElement);
  }
  _toCss(rgba: number[]) {
    const r = Math.floor(rgba[0] * 255);
    const g = Math.floor(rgba[1] * 255);
    const b = Math.floor(rgba[2] * 255);
    if (rgba[3] !== undefined) {
      return `rgba(${r}, ${g}, ${b}, ${rgba[3]})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  reset() {
    themeDB.value = Object.assign({}, JSON.parse(JSON.stringify(themeDBDefaults)));
    this.themeChanged();
  }
  themeChanged() {
    const vars = themeDB.value[this.theme];
    this.setProperties({
      cssSpacing: vars.cssSpacing,
      cssBorderRadius: vars.cssBorderRadius,
      cssBorderWidth: vars.cssBorderWidth,
      cssStrokeWidth: vars.cssStrokeWidth,
      cssLineHeight: vars.cssLineHeight,
      cssItemHeight: vars.cssItemHeight,
      cssFontSize: vars.cssFontSize,
      cssBackgroundColor: vars.cssBackgroundColor,
      cssBackgroundColorLight: vars.cssBackgroundColorLight,
      cssBackgroundColorDark: vars.cssBackgroundColorDark,
      cssBackgroundColorField: vars.cssBackgroundColorField,
      cssColor: vars.cssColor,
      cssColorError: vars.cssColorError,
      cssColorLink: vars.cssColorLink,
      cssColorFocus: vars.cssColorFocus,
      cssColorField: vars.cssColorField,
      cssColorNumber: vars.cssColorNumber,
      cssColorString: vars.cssColorString,
      cssColorBoolean: vars.cssColorBoolean,
      cssColorBorder: vars.cssColorBorder,
      cssColorBorderLight: vars.cssColorBorderLight,
      cssColorBorderDark: vars.cssColorBorderDark,
      cssColorGradientStart: vars.cssColorGradientStart,
      cssColorGradientEnd: vars.cssColorGradientEnd,
      cssColorShadow: vars.cssColorShadow,
    });
  }
  changed() {
    this.setPropertyValue('cssItemHeight', this.cssLineHeight + 2 * (this.cssSpacing + this.cssBorderWidth));
    this.variablesElement.innerHTML = /* css */`
      body {
        --io-spacing: ${this.cssSpacing}px;
        --io-border-radius: ${this.cssBorderRadius}px;
        --io-border-width: ${this.cssBorderWidth}px;
        --io-stroke-width: ${this.cssStrokeWidth}px;
        --io-line-height: ${this.cssLineHeight}px;
        --io-item-height: ${this.cssItemHeight}px;
        --io-font-size: ${this.cssFontSize}px;

        --io-background-color: ${this._toCss(this.cssBackgroundColor)};
        --io-background-color-light: ${this._toCss(this.cssBackgroundColorLight)};
        --io-background-color-dark: ${this._toCss(this.cssBackgroundColorDark)};
        --io-background-color-field: ${this._toCss(this.cssBackgroundColorField)};

        --io-color: ${this._toCss(this.cssColor)};
        --io-color-error: ${this._toCss(this.cssColorError)};
        --io-color-link: ${this._toCss(this.cssColorLink)};
        --io-color-focus: ${this._toCss(this.cssColorFocus)};
        --io-color-field: ${this._toCss(this.cssColorField)};
        --io-color-number: ${this._toCss(this.cssColorNumber)};
        --io-color-string: ${this._toCss(this.cssColorString)};
        --io-color-boolean: ${this._toCss(this.cssColorBoolean)};
        --io-color-border: ${this._toCss(this.cssColorBorder)};
        --io-color-border-light: ${this._toCss(this.cssColorBorderLight)};
        --io-color-border-dark: ${this._toCss(this.cssColorBorderDark)};
        --io-color-gradient-start: ${this._toCss(this.cssColorGradientStart)};
        --io-color-gradient-end: ${this._toCss(this.cssColorGradientEnd)};
        --io-color-shadow: ${this._toCss(this.cssColorShadow)};


        --io-border: var(--io-border-width) solid var(--io-color-border);
        --io-border-error: var(--io-border-width) solid var(--io-color-error);
        --io-color-border-inset: var(--io-color-border-dark) var(--io-color-border-light) var(--io-color-border-light) var(--io-color-border-dark);
        --io-color-border-outset: var(--io-color-border-light) var(--io-color-border-dark) var(--io-color-border-dark) var(--io-color-border-light);

        --io-gradient-button: linear-gradient(180deg, var(--io-color-gradient-start), var(--io-color-gradient-end) 100%);
        --io-gradient-error: repeating-linear-gradient(135deg, transparent, var(--io-color-error) 1px, var(--io-color-error) 4px, transparent 6px);

        --io-shadow: 2px 2px 6px var(--io-color-shadow),
                     1px 1px 1px var(--io-color-shadow);
        --io-shadow-inset: 1px 1px 2px inset var(--io-color-shadow);
        --io-shadow-outset: -1px -1px 2px inset var(--io-color-shadow);
      }
    `;

    const vars = themeDB.value[this.theme];
    for (const prop in this._properties) {
      if (prop.startsWith('css')) {
        vars[prop] = this._properties[prop].value;
      }
    }
    themeDB.value = Object.assign({}, themeDB.value);
    // TODO: consider removing (required for gl updates in theme demo)

    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
}

RegisterIoElement(IoTheme);

/*
 * Extends `IoElement`.
 *
 * `IoThemeSingleton` holds top-level CSS variables for Io design system. Variables are grouped in different themes and can be collectively switched by changing `theme` property.
 *
 * ```javascript
 * IoThemeSingleton.theme = 'dark';
 * ```
 *
 * <io-element-demo element="io-option-menu" properties='{"value": "light", "options": ["light", "dark"]}'></io-element-demo>
 *
 * Moreover, some of the key theme variables such as `'--io-color'` and `'--io-background-color'` are mapped to numeric properties `cssColor` and `cssBackgroundColor` source code for more advanced example.
 **/

const IoThemeSingleton = new IoTheme();
document.head.appendChild(IoThemeSingleton as unknown as HTMLElement);

export { IoThemeSingleton };