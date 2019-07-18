import {html, IoElement} from "../../io.js";
import {IoMathLayer} from "./math-layer.js";

export class IoHsvaPicker extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        cursor: move;
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        background-color: var(--io-background-color);
        padding: var(--io-spacing);
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
      ['io-hsva-sv', {
        value: this.value,
      }],
      ['io-hsva-hue', {
        value: this.value,
        horizontal: !this.horizontal,
      }],
      hasAlpha ? ['io-hsva-alpha', {
        value: this.value,
        horizontal: !this.horizontal,
      }] : null,
    ]);
  }
}

IoHsvaPicker.Register();

IoHsvaPicker.singleton = new IoHsvaPicker();
IoMathLayer.singleton.appendChild(IoHsvaPicker.singleton);
IoHsvaPicker.singleton.addEventListener('expanded-changed', IoMathLayer.singleton.onChildExpanded);
