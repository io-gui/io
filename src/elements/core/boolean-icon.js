import {html} from "../../io.js";
import {IoBoolean} from "./boolean.js";
import {IoIconsetSingleton} from "./iconset.js";

export class IoBooleanIcon extends IoBoolean {
  static get Style() {
    return html`<style>
      :host {
        width: var(--io-item-height);
        height: var(--io-item-height);
        fill: var(--io-color, currentcolor);
      }
      :host[stroke] {
        stroke: var(--io-background-color, currentcolor);
        stroke-width: var(--io-stroke-width);
      }
      :host > svg {
        width: 100%;
        height: 100%;
      }
      :host > svg > g {
        pointer-events: none;
        transform-origin: 0px 0px;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      stroke: true,
    };
  }
  static get Properties() {
    return {
      true: 'icons:check',
      false: 'icons:uncheck',
    };
  }
  changed() {
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    this.setAttribute('aria-label', this.label);
    this.title = this.label;
    this.innerHTML = IoIconsetSingleton.getIcon(this.value ? this.true : this.false);
  }
}

IoBooleanIcon.Register();
