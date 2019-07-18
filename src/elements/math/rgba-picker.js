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

export class IoRgbaPicker extends IoElement {
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
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['r', 'g', 'b', 'a'];
  }
  _onValueSet(event) {
    const c = this._c;
    const hsva = event.detail.value;
    const rgb = hsv2rgb(hsva[0], hsva[1], hsva[2]);
    this.value[c[0]] = rgb[0];
    this.value[c[1]] = rgb[1];
    this.value[c[2]] = rgb[2];
    if (this.value[c[3]] !== undefined) this.value[c[3]] = hsva[3];

    this._suspendLoop = true;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    setTimeout(()=> {
      this._suspendLoop = false;
    });
  }
  changed() {
    if (this._suspendLoop) return;
    const c = this._c;
    const hsv = rgb2hsv(this.value[c[0]], this.value[c[1]], this.value[c[2]]);
    this._hsva = [...hsv, this.value[c[3]] || 1];
    this.template([
      ['io-hsva-sv', {
        value: this._hsva,
        'on-value-set': this._onValueSet,
      }],
      ['io-hsva-hue', {
        value: this._hsva,
        horizontal: !this.horizontal,
        'on-value-set': this._onValueSet,
      }],
      this.value[c[3]] !== undefined ? ['io-hsva-alpha', {
        value: this._hsva,
        horizontal: !this.horizontal,
        'on-value-set': this._onValueSet,
      }] : null,
    ]);
  }
}

IoRgbaPicker.Register();

IoRgbaPicker.singleton = new IoRgbaPicker();
IoMathLayer.singleton.appendChild(IoRgbaPicker.singleton);
IoRgbaPicker.singleton.addEventListener('expanded-changed', IoMathLayer.singleton.onChildExpanded);