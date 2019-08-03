import {html} from "../../io.js";
import {IoColorSwatch} from "./color-swatch.js";
import {convert} from "../../../lib/color-convert.js";

export class IoColorSlider extends IoColorSwatch {
  static get Style() {
    return html`<style>
      :host {
        cursor: ns-resize;
      }
      :host[horizontal] {
        cursor: ew-resize;
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
      horizontal: {
        value: false,
        reflect: 1,
      },
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

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
