import {html} from "../../io.js";
import {IoThemeSingleton as mixin} from "../../io-elements-core.js";
import {IoItem} from "./item.js";
import {IoIconsetSingleton} from "./iconset.js";

export class IoBoolean extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.button}
      }
      :host[display="icon"] {
        ${mixin.item};
      }
      :host[display="icon"] {
        width: var(--io-line-height);
        height: var(--io-line-height);
        fill: var(--io-color, currentcolor);
      }
      :host[stroke] {
        stroke: var(--io-background-color, currentcolor);
        stroke-width: var(--io-stroke-width);
      }
      :host[display="icon"] > svg {
        width: 100%;
        height: 100%;
      }
      :host[display="icon"] > svg > g {
        pointer-events: none;
        transform-origin: 0px 0px;
      }
      :host[display="switch"] {
        position: relative;
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        color: var(--io-color-field);
        background-image: none;
        background-color: var(--io-background-color-dark);
        box-shadow: var(--io-shadow-inset);
        padding: 0;
        margin: var(--io-spacing);
        width: calc(2 * var(--io-line-height));
        height: var(--io-line-height);
        height: var(--io-line-height);
        border-radius: var(--io-line-height);
        transition: background-color 0.4s;
      }
      :host[display="switch"]:after {
        display: inline-block;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        height: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
        width: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
        background-color: var(--io-background-color-dark);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-line-height);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[display="switch"][value]:after {
        background-color: rgba(80, 210, 355, 0.75);
        left: calc(100% - var(--io-line-height));
      }
      :host:not([value]) {
        opacity: 0.5;
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
      :host:hover,
      :host[display="switch"][value]:not([aria-invalid]) {
        background-color: var(--io-background-color);
      }
      :host:focus {
        outline: none;
        border-color: var(--io-color-focus);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'switch',
    };
  }
  static get Properties() {
    return {
      value: {
        type: Boolean,
        reflect: 1,
      },
      display: {
        value: 'button',
        reflect: 1,
      },
      true: 'true',
      false: 'false',
      trueicon: 'icons:check',
      falseicon: 'icons:uncheck',
      role: 'switch',
    };
  }
  _onClick() {
    this.toggle();
  }
  toggle() {
    this.set('value', !this.value);
  }
  valueChanged() {
    this.setAttribute('value', Boolean(this.value));
  }
  changed() {
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    if (this.display === 'icon') {
      this.innerHTML = IoIconsetSingleton.getIcon(this.value ? this.trueicon : this.falseicon);
    } else if (this.display === 'button') {
      this.textNode = this.value ? this.true : this.false;
    } else if (this.display === 'switch') {
      this.textNode = '';
    }
  }
}

IoBoolean.Register();
