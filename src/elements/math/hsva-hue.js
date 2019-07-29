import {html} from "../../io.js";
import {IoGl, chunk} from "../../io-elements-core.js";

export class IoHsvaHue extends IoGl {
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

      ${chunk.hue2rgb}
      ${chunk.hsv2rgb}

      void main(void) {

        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;

        // Hue spectrum
        vec3 final = hsv2rgb(vec3(axis, 1.0, 1.0));

        // Hue marker
        float lineWidth = 4.0;
      	float hueMarkerOffset = abs(axis - uValue[0]) * ((uHorizontal == 1) ? uSize.x : uSize.y);
        float dist = hueMarkerOffset - lineWidth;
        float dist2 = hueMarkerOffset - (lineWidth + 1.0);
        final = mix(final, cssColor.rgb, saturate(1.0 - dist2));
        final = mix(final, cssBackgroundColor.rgb, saturate(1.0 - dist));

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
  _onPointermove(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.clientX - rect.x) / rect.width));
    const y = Math.max(0, Math.min(1, (pointer.clientY - rect.y) / rect.height));
    this._setHSVA(x, y);
    // TODO: debounce!
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
    this.changed();
    // if (!this._t) {
    //   this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    //   this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
    //   this.changed();
    //   this._t = true;
    //   requestAnimationFrame(() => {
    //     this._t = false;
    //   });
    // } else {
    //   cancelAnimationFrame(this._raf);
    //   this._raf = requestAnimationFrame(() => {
    //     this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    //     this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
    //     this.changed();
    //     this._t = false;
    //   })
    // }
  }
  _setHSVA(x, y) {
    this.value[this._c[0]] = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
  }
}

IoHsvaHue.Register();
