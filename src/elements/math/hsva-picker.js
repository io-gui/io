import {html, IoElement} from "../../io.js";
import {IoLayerSingleton, IoThemeSingleton as mixin} from "../../io-elements-core.js";

export class IoHsvaPicker extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.panel}
      }
      :host {
        display: flex;
        cursor: move;
        align-items: stretch;
        min-width: 2.75em;
        min-height: 1.375em;
        flex-direction: column;
      }
      :host[horizontal] {
        flex-direction: row;
      }
      :host > io-hsva-sv {
        flex: 1 1;
      }
      :host > *:not(:last-child) {
        margin: 0 0 var(--io-spacing) 0;
      }
      :host[horizontal] > *:not(:last-child) {
        margin: 0 var(--io-spacing) 0 0;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      horizontal: true,
    };
  }
  static get Properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: 1,
      },
      value: [0.5, 0.5, 0.5, 1],
    };
  }
  changed() {
    const hasAlpha = this.value[3] !== undefined || this.value.a !== undefined;
    this.template([
      ['io-hsva-sv', {value: this.value}],
      ['io-hsva-hue', {value: this.value, horizontal: !this.horizontal}],
      hasAlpha ? ['io-hsva-alpha', {value: this.value, horizontal: !this.horizontal}] : null,
    ]);
  }
}

IoHsvaPicker.Register();

IoHsvaPicker.singleton = new IoHsvaPicker();
IoLayerSingleton.appendChild(IoHsvaPicker.singleton);
IoHsvaPicker.singleton.addEventListener('expanded-changed', IoLayerSingleton.onChildExpanded);
