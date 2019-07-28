import {IoElement, html, IoStorage as $} from "../../io.js";

export class IoTheme extends IoElement {
  static get Style() {
    return html`<style>
    body {
      --io-spacing: 3px;
      --io-border-radius: 3px;
      --io-border-width: 1px;
      --io-stroke-width: 0.5px;
      --io-line-height: 20px;
      --io-item-height: 28px; /* line+2*spacing+2*border */
      --io-font-size: 13px;
    }
    </style>`;
  }
  static get Mixins() {
    return html`<style>
    item {
      display: inline-block;
      height: var(--io-line-height);
      font-size: var(--io-font-size);
      line-height: var(--io-line-height);
      border-radius: var(--io-border-radius);
      border: var(--io-inset-border);
      border-color: transparent;
      color: var(--io-color);
      background-color: transparent;
      background-image: none;
      padding: var(--io-spacing);

    }
    button {
      display: inline-block;
      text-align: center;
      height: var(--io-line-height);
      font-size: var(--io-font-size);
      line-height: var(--io-line-height);
      border-radius: var(--io-border-radius);
      border: var(--io-outset-border);
      border-color: var(--io-outset-border-color);
      color: var(--io-color);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding: var(--io-spacing);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
      transition: background-color 0.25s;

    }
    field {
      display: inline-block;
      width: calc(4 * var(--io-line-height));
      height: var(--io-line-height);
      font-size: var(--io-font-size);
      line-height: var(--io-line-height);
      border-radius: var(--io-border-radius);
      border: var(--io-inset-border);
      border-color: var(--io-inset-border-color);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      background-image: none;
      padding: var(--io-spacing);
      box-shadow: var(--io-shadow-inset);
    }
    panel {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      align-items: flex-start;
      border-radius: var(--io-border-radius);
      border: var(--io-outset-border);
      border-color: var(--io-outset-border-color);
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
      border: var(--io-inset-border);
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
  get dark() {
    return html`<style>
      body {
        --io-background-color: rgb(42, 42, 42);
        --io-background-color-light: rgb(56, 56, 56);
        --io-background-color-dark: rgb(64, 64, 64);
        --io-background-color-field: rgb(35, 35, 35);

        --io-color: rgb(210, 210, 210);
        --io-color-error: rgb(255, 96, 16);
        --io-color-link: rgb(190, 230, 150);
        --io-color-focus: rgb(80, 210, 355);
        --io-color-field: rgb(190, 190, 190);
        --io-color-number: rgb(32, 164, 255);
        --io-color-string: rgb(240, 64, 22);
        --io-color-boolean: rgb(210, 90, 190);

        --io-gradient-button: linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent 50%), linear-gradient(180deg, rgba(255, 255, 255, 0.075), transparent 50%);
        --io-gradient-panel: linear-gradient(100deg, rgba(0, 0, 0, 0.25), transparent 50%), linear-gradient(280deg, rgba(255, 255, 255, 0.075), transparent 50%);
        --io-gradient-error: repeating-linear-gradient(135deg, transparent, rgba(255, 0, 0, 0.1) 1px, rgba(255, 0, 0, 0.1) 4px, transparent 6px);

        --io-border-color: rgb(140, 140, 140);
        --io-border: var(--io-border-width) solid var(--io-border-color);
        --io-border-error: var(--io-border-width) solid var(--io-color-error);
        --io-inset-border-color: rgb(140, 140, 140) var(--io-border-color) var(--io-border-color) rgb(140, 140, 140);
        --io-inset-border: var(--io-border-width) inset var(--io-border-color);
        --io-outset-border-color: var(--io-border-color) rgb(32, 32, 32) rgb(32, 32, 32) var(--io-border-color);
        --io-outset-border: var(--io-border-width) outset var(--io-border-color);

        --io-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        --io-shadow-inset: 2px 2px 2px inset rgba(0,0,0,0.05);
        --io-shadow-outset: -1px -1px 2px inset rgba(0,0,0,0.1), 2px 2px 2px inset rgba(255,255,255,0.3);
      }
    </style>`;
  }
  get light() {
    return html`<style>
      body {
        --io-background-color: rgb(245, 245, 245);
        --io-background-color-light: rgb(255, 255, 255);
        --io-background-color-dark: rgb(215, 215, 215);
        --io-background-color-field: rgb(235, 235, 235);

        --io-color: rgb(42, 42, 42);
        --io-color-error: rgb(225, 100, 100);
        --io-color-link: rgb(30, 180, 30);
        --io-color-focus: rgb(80, 210, 355);
        --io-color-field: rgb(0, 0, 0);
        --io-color-number: rgb(32, 164, 255);
        --io-color-string: rgb(240, 64, 22);
        --io-color-boolean: rgb(210, 90, 190);

        --io-gradient-button: linear-gradient(0deg, rgba(0, 0, 0, 0.15), transparent 75%), linear-gradient(180deg, rgba(255, 255, 255, 0.25), transparent 75%);
        --io-gradient-panel: linear-gradient(100deg, rgba(0, 0, 0, 0.15), transparent 75%), linear-gradient(280deg, rgba(255, 255, 255, 0.25), transparent 75%);
        --io-gradient-error: repeating-linear-gradient(135deg, transparent, rgba(255, 0, 0, 0.1) 1px, rgba(255, 0, 0, 0.1) 4px, transparent 6px);

        --io-border-color: rgb(180, 180, 180);
        --io-border: var(--io-border-width) solid var(--io-border-color);
        --io-border-error: var(--io-border-width) solid var(--io-color-error);
        --io-inset-border-color: rgb(220, 220, 220) var(--io-border-color) var(--io-border-color) rgb(220, 220, 220);
        --io-inset-border: var(--io-border-width) inset var(--io-border-color);
        --io-outset-border-color: var(--io-border-color) rgb(210, 210, 210) rgb(210, 210, 210) var(--io-border-color);
        --io-outset-border: var(--io-border-width) outset var(--io-border-color);

        --io-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        --io-shadow-inset: 1px 1px 1px inset rgba(0,0,0,0.1);
        --io-shadow-outset: -1px -1px 1px inset rgba(0,0,0,0.2), 1px 1px 1px inset rgba(255,255,255,0.6);
      }
    </style>`;
  }
  static get Properties() {
    return {
      theme: $('theme', 'light'),
      cssBackgroundColor: [0, 0, 0, 1],
      cssBackgroundColorField: [0, 0, 0, 1],
      cssColor: [1, 1, 1, 1],
      cssColorLink: [1, 1, 1, 1],
      cssColorFocus: [1, 1, 1, 1],
      cssBorderWidth: 1,
    };
  }
  constructor(props) {
    super(props);
    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('id', 'io-theme');

    this.mixinsElement = document.createElement('style');
    this.mixinsElement.setAttribute('id', 'io-theme-mixins');
    this.mixinsElement.innerHTML = this.mixins;

    this.themeChanged();

    document.head.appendChild(this.mixinsElement);
  }
  themeChanged() {
    this.styleElement.innerHTML = this[this.theme];
    setTimeout(() => {
      this.updatePropertiesFromCSS();
    });
  }
  getCssRgba(style, property) {
    const rgba = style.getPropertyValue(property).split("(")[1].split(")")[0].split(",");
    return rgba.map(color => { return color / 255; });
  }
  getCssFloat(style, property) {
    return parseFloat(style.getPropertyValue(property)) * window.devicePixelRatio;
  }
  updatePropertiesFromCSS() {
    const cs = getComputedStyle(document.body);
    this.setProperties({
      cssColor: this.getCssRgba(cs, '--io-color'),
      cssBackgroundColor: this.getCssRgba(cs, '--io-background-color'),
      cssBackgroundColorField: this.getCssRgba(cs, '--io-background-color-field'),
      cssBorderWidth: this.getCssFloat(cs, '--io-border-width'),
      cssColorLink: this.getCssRgba(cs, '--io-color-link'),
      cssColorFocus: this.getCssRgba(cs, '--io-color-focus'),
    });
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
}
IoTheme.Register = function() {
  IoElement.Register.call(this);
  let mixins = '';
  for (let i = this.prototype.__protochain.length; i--;) {
    const styleString = this.prototype.__protochain[i].constructor.Mixins;
    if (styleString) {
      // TODO: improve CSS parsing to support comments etc.
      // const match = Array.from(styleString.matchAll(new RegExp(/([\s\S]*?){([\s\S]*?)}/, 'g')));
      const match = Array.from(styleString.match(new RegExp(/([\s\S]*?){([\s\S]*?)}/, 'g')));
      for (let j = 0; j < match.length; j++) {
        // console.log(, match[j].split('{')[1].replace('}', ''));
        // console.log(match[j][1], match[j][2]);
        // console.log(i, match[j].split('{'));
        const name = match[j].split('{')[0].replace(/\s/g, '');
        const value = match[j].split('{')[1].replace('}', '');
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
document.head.appendChild(IoThemeSingleton.styleElement);
