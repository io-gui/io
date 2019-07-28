import {IoElement, html} from "../../io.js";
import {IoThemeSingleton as mixin} from "../../io-elements-core.js";
import {IoIconsetSingleton} from "./iconset.js";

export class IoIcon extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.item};
      }
      :host {
        width: var(--io-line-height);
        height: var(--io-line-height);
        fill: var(--io-background-color, currentcolor);
      }
      :host[stroke] {
        stroke: var(--io-color, currentcolor);
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
  static get Properties() {
    return {
      icon: {
        value: '',
        reflect: -1,
      },
      stroke: {
        type: Boolean,
        reflect: 1,
      },
    };
  }
  iconChanged() {
    this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
  }
}

IoIcon.Register();
