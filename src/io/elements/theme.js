import {IoNode} from "../core/node.js";
import {html} from "../core/element.js";

export class IoTheme extends IoNode {
  get dark() {
    return html`<style>
      body {
        --io-spacing: 4px;

        --io-border-radius: 4px;
        --io-border-width: 1px;

        --io-background-color: rgb(42, 42, 42);
        --io-background-color-light: rgb(56, 56, 56);
        --io-background-color-dark: rgb(64, 64, 64);
        --io-background-color-field: rgb(16, 16, 16);

        --io-color: rgb(210, 210, 210);
        --io-color-error: rgb(255, 96, 16);
        --io-color-link: rgb(190, 230, 150);
        --io-color-focus: rgb(80, 210, 355);
        --io-color-field: rgb(150, 150, 150);
        --io-color-number: rgb(32, 164, 255);
        --io-color-string: rgb(240, 64, 22);
        --io-color-boolean: rgb(210, 90, 190);

        --io-gradient-button: linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent 50%), linear-gradient(180deg, rgba(255, 255, 255, 0.075), transparent 50%);
        --io-gradient-collapsable: linear-gradient(100deg, rgba(0, 0, 0, 0.25), transparent 50%), linear-gradient(280deg, rgba(255, 255, 255, 0.075), transparent 50%);

        --io-border-color: rgb(140, 140, 140);
        --io-border: var(--io-border-width) solid var(--io-border-color);
        --io-inset-border-color: rgb(32, 32, 32) var(--io-border-color) var(--io-border-color) rgb(32, 32, 32);
        --io-inset-border: var(--io-border-width) inset var(--io-border-color);
        --io-outset-border-color: var(--io-border-color) rgb(32, 32, 32) rgb(32, 32, 32) var(--io-border-color);
        --io-outset-border: var(--io-border-width) outset var(--io-border-color);

        --io-shadow: 2px 3px 5px rgba(0,0,0,0.2);
      }
    </style>`;
  }
  get light() {
    return html`<style>
      body {
        --io-spacing: 4px;

        --io-border-radius: 4px;
        --io-border-width: 1px;

        --io-background-color: rgb(245, 245, 245);
        --io-background-color-light: rgb(255, 255, 255);
        --io-background-color-dark: rgb(235, 235, 235);
        --io-background-color-field: rgb(225, 225, 225);

        --io-color: rgb(42, 42, 42);
        --io-color-error: rgb(225, 100, 100);
        --io-color-link: rgb(30, 180, 30);
        --io-color-focus: rgb(80, 210, 355);
        --io-color-field: rgb(0, 0, 0);
        --io-color-number: rgb(32, 164, 255);
        --io-color-string: rgb(240, 64, 22);
        --io-color-boolean: rgb(210, 90, 190);

        --io-gradient-button: linear-gradient(0deg, rgba(0, 0, 0, 0.15), transparent 75%), linear-gradient(180deg, rgba(255, 255, 255, 0.25), transparent 75%);
        --io-gradient-collapsable: linear-gradient(100deg, rgba(0, 0, 0, 0.15), transparent 75%), linear-gradient(280deg, rgba(255, 255, 255, 0.25), transparent 75%);

        --io-border-color: rgb(180, 180, 180);
        --io-border: var(--io-border-width) solid var(--io-border-color);
        --io-inset-border-color: rgb(255, 255, 255) var(--io-border-color) var(--io-border-color) rgb(255, 255, 255);
        --io-inset-border: var(--io-border-width) inset var(--io-border-color);
        --io-outset-border-color: var(--io-border-color) rgb(250, 250, 250) rgb(250, 250, 250) var(--io-border-color);
        --io-outset-border: var(--io-border-width) outset var(--io-border-color);

        --io-shadow: 2px 3px 5px rgba(0,0,0,0.2);
      }
    </style>`;
  }
  static get properties() {
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
    let styleString = this[this.theme].string;
    styleString = styleString.replace(new RegExp('<style>', 'g'), '');
    styleString = styleString.replace(new RegExp('</style>', 'g'), '');
    this.styleElement.innerHTML = styleString;
  }
}

IoTheme.Register();
IoTheme.singleton = new IoTheme();
IoTheme.singleton.connect();
document.head.appendChild(IoTheme.singleton.styleElement);
