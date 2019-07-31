import {html} from "../../io.js";
import {IoGl, chunk} from "../../io-elements-core.js";

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
      // 0 - rgb
      // 1 - hsv
      // 2 - hsl
      // 3 - cmyk
      colorMode: 0,
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${chunk.hue2rgb}
      ${chunk.hsv2rgb}

      void main(void) {
        vec3 finalColor = uValue.rgb;
        float alpha = uValue.a;
        if (uColorMode == 1.0) {
          finalColor = hsv2rgb(uValue.xyz);
        } else if (uColorMode == 2.0) {
          // finalColor = hsl2rgb(uValue.xyz);
        } else if (uColorMode == 3.0) {
          // finalColor = cmyk2rgb(uValue);
          alpha = 1.0;
        }
        gl_FragColor = saturate(vec4(finalColor, alpha));
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
    const c = new Array();
    if (this.value instanceof Array) {
      for (let i = 0; i < this.value.length; i++) c.push(i);
    }
    if (typeof this.value === 'object') {
      if (this.value.r !== undefined) c.push('r');
      if (this.value.g !== undefined) c.push('g');
      if (this.value.b !== undefined) { c.push('b'); this.colorMode = 0; }
      if (this.value.h !== undefined) c.push('h');
      if (this.value.s !== undefined) c.push('s');
      if (this.value.v !== undefined) { c.push('v'); this.colorMode = 1; }
      if (this.value.l !== undefined) { c.push('l'); this.colorMode = 2; }
      if (this.value.c !== undefined) c.push('c');
      if (this.value.m !== undefined) c.push('m');
      if (this.value.y !== undefined) c.push('y');
      if (this.value.k !== undefined) { c.push('k'); this.colorMode = 3; }
      if (this.value.a !== undefined) c.push('a');
    }
    this._c = c;
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
