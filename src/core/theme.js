import {IoElement, html} from "./element.js";
import {IoNode} from "./node.js";
import {glGlobals} from "./gl.js";

export class IoThemeMixin extends IoNode {
  static get Style() {
    return html`<style>
    item {
      cursor: default;
      display: inline-block;
      -webkit-tap-highlight-color: transparent;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      white-space: nowrap;
      height: 1.375em;
      border: var(--io-inset-border);
      border-radius: var(--io-border-radius);
      border-color: transparent;
      background-color: transparent;
      background-image: none;
      padding: var(--io-spacing);
    }
    button {
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      border: var(--io-outset-border);
      border-color: var(--io-outset-border-color);
      border-radius: var(--io-border-radius);
      padding: var(--io-spacing);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
      transition: background-color 0.25s;
    }
    field {
      border: var(--io-inset-border);
      border-radius: var(--io-border-radius);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      background-image: none;
      box-shadow: var(--io-shadow-inset);
      padding: var(--io-spacing);
      user-select: text;
      width: 4.5em;
      height: 1.375em;
      min-width: 0.5em;
    }
    panel {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      align-items: flex-start;
      border: var(--io-outset-border);
      border-radius: var(--io-border-radius);
      border-color: var(--io-outset-border-color);
      padding: var(--io-spacing);
      background: var(--io-background-color-dark);
      background-image: var(--io-gradient-panel);
    }
    frame {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      align-items: flex-start;
      border: var(--io-inset-border);
      border-radius: var(--io-border-radius);
      color: var(--io-color);
      background-color: var(--io-background-color);
      background-image: none;
      box-shadow: var(--io-shadow-inset);
      padding: var(--io-spacing);
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
    </style>`;
  }
  constructor(props) {
    super(props);
    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('id', 'io-theme-mixins');
    this.styleElement.innerHTML = this.mixins;
    document.head.appendChild(this.styleElement);
  }
}
IoThemeMixin.Register = function() {
  IoNode.Register.call(this);
  let mixins = '';
  for (let i = this.prototype.__protochain.length; i--;) {
    const style = this.prototype.__protochain[i].constructor.Style;
    if (style) {
      // TODO: improve CSS parsing to support comments etc.
      const match = Array.from(style.string.matchAll(new RegExp(/([\s\S]*?){([\s\S]*?)}/, 'g')));
      for (let j = 0; j < match.length; j++) {
        const name = match[j][1].replace(/\s/g, '');
        const value = match[j][2];
        Object.defineProperty(this.prototype, name, {value: value});
        mixins += `.io-${name} {\n${value}\n}\n`;
      }
    }
  }
  Object.defineProperty(this.prototype, 'mixins', { value: mixins });
};

IoThemeMixin.Register();

export const IoThemeMixinSingleton = new IoThemeMixin();

export class IoTheme extends IoElement {
  static get Style() {
    return html`<style>
    body {
      --io-spacing: 4px;
      --io-border-radius: 3px;
      --io-border-width: 1px;
    }
    @keyframes spinner {
      to {transform: rotate(360deg);}
    }
    body .io-loading {
      background-image: repeating-linear-gradient(135deg, var(--io-background-color-light), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-light) 10px) !important;
      background-repeat: repeat;
      position: relative;
    }
    body .io-loading:after {
      content: '';
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      margin-top: -20px;
      margin-left: -20px;
      border-radius: 50%;
      border: var(--io-border);
      border-top-color: #000;
      animation: spinner .6s linear infinite;
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

        --io-border-color: rgb(140, 140, 140);
        --io-border: var(--io-border-width) solid var(--io-border-color);
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

        --io-border-color: rgb(180, 180, 180);
        --io-border: var(--io-border-width) solid var(--io-border-color);
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
      theme: 'light',
    };
  }
  constructor(props) {
    super(props);
    this.styleElement = document.createElement('style');
    this.styleElement.setAttribute('id', 'io-theme');
  }
  changed() {
    this.styleElement.innerHTML = this[this.theme].string;
    setTimeout(() => {
      glGlobals.updateValues();
    });
  }
}
IoTheme.Register();

export const IoThemeSingleton = new IoTheme();
IoThemeSingleton.connect();
document.head.appendChild(IoThemeSingleton.styleElement);
