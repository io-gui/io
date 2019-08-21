import {IoNode, html, IoStorage as $} from "../../io.js";

const isDarkMode = !!window.matchMedia("(prefers-color-scheme: dark)").matches;

const themeSizes =  {
  cssSpacing: 3,
  cssBorderRadius: 3,
  cssBorderWidth: 1,
  cssStrokeWidth: 1,
  cssLineHeight: 20,
  cssItemHeight: 28,
  cssFontSize: 13,
};
const themeDB = {
  light: Object.assign({
    cssBackgroundColor: [0.96, 0.96, 0.96, 1],
    cssBackgroundColorLight: [1, 1, 1, 1],
    cssBackgroundColorDark: [0.84, 0.84, 0.84, 1],
    cssBackgroundColorField: [0.92, 0.92, 0.92, 1],
    cssColor: [0.16, 0.16, 0.16, 1],
    cssColorError: [0.91, 0.5, 0.5, 1],
    cssColorLink: [0.08, 0.89, 0.08, 1],
    cssColorFocus: [0.3, 0.82, 1, 1],
    cssColorField: [0, 0, 0, 1],
    cssColorNumber: [0.12, 0.64, 1, 1],
    cssColorString: [0.95, 0.25, 0.1, 1],
    cssColorBoolean: [0.82, 0.35, 0.75, 1],
    cssColorBorder: [0.7, 0.7, 0.7, 1],
    cssColorBorderLight: [0.82, 0.82, 0.82, 1],
    cssColorBorderDark: [0.86, 0.86, 0.86, 1],
    cssColorGradientStart: [0, 0, 0, 0.15],
    cssColorGradientEnd: [1, 1, 1, 0.25],
    cssColorShadow: [0, 0, 0, 0.2],
  }, themeSizes),
  dark: Object.assign({
    cssBackgroundColor: [0.164, 0.164, 0.164, 1],
    cssBackgroundColorLight: [0.22, 0.22, 0.22, 1],
    cssBackgroundColorDark: [0.25, 0.25, 0.25, 1],
    cssBackgroundColorField: [0.137, 0.137, 0.137, 1],
    cssColor: [0.823, 0.823, 0.823, 1],
    cssColorError: [1, 0.376, 0.062, 1],
    cssColorLink: [0.75, 0.9, 0.59, 1],
    cssColorFocus: [0.3, 0.82, 1.4, 1],
    cssColorField: [0.75, 0.75, 0.75, 1],
    cssColorNumber: [0.125, 0.64, 1, 1],
    cssColorString: [0.94, 0.25, 0.086, 1],
    cssColorBoolean: [0.82, 0.35, 0.75, 1],
    cssColorBorder: [0.4, 0.4, 0.4, 1],
    cssColorBorderLight: [0.5, 0.5, 0.5, 1],
    cssColorBorderDark: [0.1, 0.1, 0.1, 1],
    cssColorGradientStart: [0, 0, 0, 0.15],
    cssColorGradientEnd: [1, 1, 1, 0.25],
    cssColorShadow: [0, 0, 0, 0.2],
  }, themeSizes),
};

const theme = $('theme', isDarkMode ? 'dark' : 'light');
const vars = themeDB[theme.value] || themeDB['light'];

export class IoTheme extends IoNode {
  static get Mixins() {
    return html`<style>
    item {
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
    panel {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      align-items: flex-start;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-panel);
      padding: var(--io-spacing);
    }
    frame {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      align-items: flex-start;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      color: var(--io-color);
      background-color: var(--io-background-color);
      background-image: none;
      padding: var(--io-spacing);
      box-shadow: var(--io-shadow-inset);
    }
    content {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-tap-highlight-color: transparent;
    }
    row {
      display: flex;
      flex: 1 1;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
    }
    column {
      display: flex;
      flex: 1 1;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    table2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--io-spacing);
    }
    table3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--io-spacing);
    }
    table4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: var(--io-spacing);
    }
    table5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: var(--io-spacing);
    }
    </style>`;
  }
  static get Properties() {
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
    };
  }
  constructor(props) {
    super(props);
    this.mixinsElement = document.createElement('style');
    this.mixinsElement.setAttribute('id', 'io-theme-mixins');
    this.mixinsElement.innerHTML = this.mixins;
    document.head.appendChild(this.mixinsElement);

    this.variablesElement = document.createElement('style');
    this.variablesElement.setAttribute('id', 'io-theme-variables');
    document.head.appendChild(this.variablesElement);
  }
  _toCss(rgba) {
    const r = Math.floor(rgba[0] * 255);
    const g = Math.floor(rgba[1] * 255);
    const b = Math.floor(rgba[2] * 255);
    if (rgba[3] !== undefined) {
      return `rgba(${r}, ${g}, ${b}, ${rgba[3]})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  themeChanged() {
    const vars = themeDB[this.theme] || themeDB['light'];
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
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  changed() {
    // TODO: consider removing (required for gl updates in theme demo)
    this.dispatchEvent('object-mutated', {object: this}, false, window);
    this.__properties.cssItemHeight.value =
      this.cssLineHeight + 2 * (this.cssSpacing + this.cssBorderWidth);
    this.variablesElement.innerHTML = `
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

        --io-gradient-button: linear-gradient(0deg, var(--io-color-gradient-start), transparent 75%), linear-gradient(180deg, var(--io-color-gradient-end), transparent 75%);
        --io-gradient-panel: linear-gradient(100deg, var(--io-color-gradient-start), transparent 75%), linear-gradient(280deg, var(--io-color-gradient-end), transparent 75%);
        --io-gradient-error: repeating-linear-gradient(135deg, transparent, var(--io-color-error) 1px, var(--io-color-error) 4px, transparent 6px);

        --io-shadow: 2px 2px 5px var(--io-color-shadow);
        --io-shadow-inset: 1px 1px 1px inset var(--io-color-shadow);
        --io-shadow-outset: -1px -1px 1px inset var(--io-color-shadow);
      }
    `;
  }
}
IoTheme.Register = function() {
  IoNode.Register.call(this);
  let mixins = '';
  for (let i = this.prototype.__protochain.length; i--;) {
    const styleString = this.prototype.__protochain[i].constructor.Mixins;
    if (styleString) {
      // TODO: improve CSS parsing to support comments etc.
      // const match = Array.from(styleString.matchAll(new RegExp(/([\s\S]*?){([\s\S]*?)}/, 'g')));
      const match = Array.from(styleString.match(new RegExp(/([\s\S]*?){([\s\S]*?)}/, 'g')));
      for (let j = 0; j < match.length; j++) {
        // TODO: unhack!
        const name = match[j].split('{')[0].replace(/\s/g, '');
        const value = match[j].split('{')[1].replace(/}/g, '');
        Object.defineProperty(this.prototype, name, {value: value});
        mixins += `.io-${name} {\n${value}\n}\n`;
      }
    }
  }
  Object.defineProperty(this.prototype, 'mixins', { value: mixins });
};
IoTheme.Register();

export const IoThemeSingleton = new IoTheme();
IoThemeSingleton.connect();
