import {html, IoElement} from "../../io.js";
import {IoMathLayer} from "./math-layer.js";

function rgb2hsv(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, v = max;
  let d = max - min;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, v];
}

function hsv2rgb(h, s, v) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    case 5: return [v, p, q];
  }
}

export class IoHsvaPicker extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        cursor: move;
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
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
