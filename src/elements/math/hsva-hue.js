import {html, IoGl} from "../../io.js";
import {colorShaderChunk} from "./utils.js";

export class IoHsvaHue extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        cursor: ns-resize;
        min-width: 32px;
        min-height: 1.375em;
      }
      :host[horizontal] {
        cursor: ew-resize;
      }
      :host[aria-invalid] {
        outline: 1px solid var(--io-color-error);
      }
      :host:focus {
        outline: 1px solid var(--io-color-focus);
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
      value: [0.5, 0.5, 0.5, 1],
      horizontal: {
        value: false,
        reflect: 1,
      }
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${colorShaderChunk}

      void main(void) {

        // Hue spectrum
        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;
        vec3 final = hsv2rgb(vec3(axis, 1.0, 1.0));

        float lineWidth = 1.0;

        // Hue marker
      	float hueMarkerOffset = abs(axis - uValue[0]) * ((uHorizontal == 1) ? uSize.x : uSize.y);
        float dist = hueMarkerOffset - lineWidth;
        float dist2 = hueMarkerOffset - (lineWidth + 1.0);
        final = mix(final, vec3(0.0), max(1.0 - dist2, 0.0));
        final = mix(final, vec3(1.0), max(1.0 - dist, 0.0));

        gl_FragColor = vec4(final, 1.0);
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
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['h', 's', 'v', 'a'];
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._onPointerdown(event);
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
  _onPointermove(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.clientX - rect.x) / rect.width));
    const y = Math.max(0, Math.min(1, (pointer.clientY - rect.y) / rect.height));
    this._setHSVA(x, y);
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
    this.changed();
  }
  _setHSVA(x, y) {
    this.value[this._c[0]] = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
  }
}

IoHsvaHue.Register();
