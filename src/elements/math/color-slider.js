import {html} from "../../io.js";
import {IoGl, chunk} from "../../io-elements-core.js";
import {chunk as colorChunk} from "./gl-chunk.js";
import {convert} from "../../../lib/color-convert.js";

export class IoColorSlider extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        border-radius: var(--io-border-radius);
        border: var(--io-inset-border);
        min-width: var(--io-line-height);
        min-height: var(--io-line-height);
        cursor: ns-resize;
      }
      :host[horizontal] {
        cursor: ew-resize;
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
      }
      :host:focus {
        outline: 0;
        border-color: var(--io-color-focus);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Properties() {
    return {
      value: [1, 1, 1, 1],
      horizontal: {
        value: false,
        reflect: 1,
      },
      // Internal
      rgb: [1, 1, 1],
      hsv: [1, 1, 1],
      hsl: [1, 1, 1],
      cmyk: [1, 1, 1, 1],
      alpha: 1,
      components: {
        type: Array,
        notify: false,
      },
      // 0 - rgba
      // 1 - hsva
      // 2 - hsla
      // 3 - cmyka
      mode: 0,
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${chunk.translate}
      ${chunk.checker}

      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));

        gl_FragColor = saturate(vec4(mix(alphaPattern, uRgb.rgb, uAlpha), 1.0));
      }
    `;
  }
  static get Listeners() {
    return {
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
      'keydown': '_onKeydown',
    };
  }
  valueMutated() {
    this.valueChanged();
  }
  valueChanged() {
    let c = [];
    if (this.value instanceof Array) {
      for (var i = 0; i < this.value.length; i++) {
        c.push(i);
      }
    } else {
      c.push(...Object.keys(this.value));
    }

    let mode = this.mode;
    if (c.indexOf('r') !== -1) mode = 0;
    else if (c.indexOf('h') !== -1 && c.indexOf('v') !== -1) mode = 1;
    else if (c.indexOf('h') !== -1 && c.indexOf('l') !== -1) mode = 2;
    else if (c.indexOf('c') !== -1) mode = 3;

    const val = [];
    for (let i = 0; i < c.length; i++) {
      val.push(this.value[c[i]]);
    }

    let rgb;
    let hsv;
    let hsl;
    let cmyk;
    let alpha = 1;

    switch (mode) {
      case 3:
        cmyk = [val[0] * 100, val[1] * 100, val[2] * 100, val[3] * 100];
        rgb = convert.cmyk.rgb(cmyk);
        hsv = convert.rgb.hsv(convert.cmyk.rgb(cmyk));
        hsl = convert.rgb.hsl(convert.cmyk.rgb(cmyk));
        if (val[4] !== undefined) alpha = val[4] * 100;
        break;
      case 2:
        hsl = [val[0] * 360, val[1] * 100, val[2] * 100];
        rgb = convert.hsl.rgb(hsl);
        hsv = convert.hsl.hsv(hsl);
        cmyk = convert.rgb.cmyk(convert.hsl.rgb(hsl));
        if (val[3] !== undefined) alpha = val[3] * 100;
        break;
      case 1:
        hsv = [val[0] * 360, val[1] * 100, val[2] * 100];
        rgb = convert.hsv.rgb(hsv);
        hsl = convert.hsv.hsl(hsv);
        cmyk = convert.rgb.cmyk(convert.hsv.rgb(hsv));
        if (val[3] !== undefined) alpha = val[3] * 100;
        break;
      case 0:
      default:
        rgb = [val[0] * 255, val[1] * 255, val[2] * 255];
        hsv = convert.rgb.hsv(rgb);
        hsl = convert.rgb.hsl(rgb);
        cmyk = convert.rgb.cmyk(rgb);
        if (val[3] !== undefined) alpha = val[3] * 100;
        break;
    }

    this.setProperties({
      rgb: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255],
      hsv: [hsv[0] / 360, hsv[1] / 100, hsv[2] / 100],
      hsl: [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100],
      cmyk: [cmyk[0] / 100, cmyk[1] / 100, cmyk[2] / 100, cmyk[3] / 100],
      alpha: alpha / 100,
      components: c,
      mode: mode,
    });
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._onPointerdown(event);
    this.focus();
  }
  _onTouchmove(event) {
    event.preventDefault();
    this._onPointermove(event);
  }
  _onTouchend() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _onMousedown(event) {
    event.preventDefault();
    this.focus();
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    this._onPointerdown(event);
  }
  _onMousemove(event) {
    this._onPointermove(event);
  }
  _onMouseup() {
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  _onPointerdown(event) {
    this._onPointermove(event);
  }
  _onPointermoveDebounced(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.clientX - rect.x) / rect.width));
    const y = Math.max(0, Math.min(1, (pointer.clientY - rect.y) / rect.height));
    this._setValue(x, y);
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
    this.valueChanged();
    this.changed();
  }
  _onPointermove(event) {
    this.debounce(this._onPointermoveDebounced, event);
  }
  _setValue(x, y) {
    x, y;
    // NOTE: implement in subclass
  }
}

IoColorSlider.Register();
