import {html} from "../../io.js";
import {IoGl} from "./gl.js";

export class IoSlider extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        cursor: ns-resize;
        box-sizing: border-box;
        border: var(--io-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-color-border-inset);
        min-width: var(--io-item-height);
        min-height: var(--io-item-height);
        align-self: stretch;
        justify-self: stretch;
        touch-action: none;
      }
      :host[horizontal] {
        cursor: ew-resize;
      }
      :host[orientation="2d"] {
        cursor: move;
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
      :host[aria-invalid] > .io-gl-canvas {
        opacity: 0.5;
      }
      :host:focus {
        border-color: var(--io-color-focus);
        outline-color: var(--io-color-focus);
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: 0,
      step: 0.01,
      min: 0,
      max: 1,
      horizontal: {
        value: true,
        reflect: 1,
      },
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Listeners() {
    return {
      'focus': '_onFocus',
      'contextmenu': '_onContextmenu',
      'pointerdown': '_onPointerdown',
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
  }
  _onFocus() {
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
  }
  _onBlur() {
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
  }
  _onContextmenu(event) {
    event.preventDefault();
  }
  _onPointerdown(event) {
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    event.preventDefault();
    event.stopImmediatePropagation();
    this.setPointerCapture(event.pointerId);
    this.focus();
  }
  _onPointermove(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    this.debounce(this._onPointermoveDebounced, event);
  }
  _onPointerup() {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
  }
  _onPointermoveDebounced(event) {
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height));

    let _x = this.min * (1 - x) + this.max * x;
    _x = Math.min(this.max, Math.max(this.min, _x));
    _x = Math.round(_x / this.step) * this.step;
    let _y = this.min * (1 - y) + this.max * y;
    _y = Math.min(this.max, Math.max(this.min, _y));
    _y = Math.round(_y / this.step) * this.step;

    this._setValue(this.horizontal ? _x : _y, this.horizontal ? _y : _x);
  }
  _setValue(x) {
    this.set('value', Number(x.toFixed(5)));
  }
  _onKeydown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('left');
      else this._setDecrease();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('up');
      else this._setIncrease();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('right');
      else this._setIncrease();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('down');
      else this._setDecrease();
    } else if (event.key === 'PageUp' || event.key === '+') {
      event.preventDefault();
      this._setIncrease();
    } else if (event.key === 'PageDown' || event.key === '-') {
      event.preventDefault();
      this._setDecrease();
    } else if (event.key === 'Home') {
      event.preventDefault();
      this._setMin();
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      this._setMax();
    }
  }
  // TODO: round to step
  _setIncrease() {
    let value = this.value + this.step;
    value = Math.min(this.max, Math.max(this.min, (value)));
    this.set('value', Number(value.toFixed(4)));
  }
  _setDecrease() {
    let value = this.value - this.step;
    value = Math.min(this.max, Math.max(this.min, (value)));
    this.set('value', Number(value.toFixed(4)));
  }
  _setMin() {
    let value = this.min;
    value = Math.min(this.max, Math.max(this.min, (value)));
    this.set('value', Number(value.toFixed(4)));
  }
  _setMax() {
    let value = this.max;
    value = Math.min(this.max, Math.max(this.min, (value)));
    this.set('value', Number(value.toFixed(4)));
  }
  // TODO: consider moving or standardizing.
  changed() {
    super.changed();
    this.setAria();
  }
  setAria() {
    this.setAttribute('aria-invalid', isNaN(this.value) ? 'true' : false);
    this.setAttribute('aria-valuenow', isNaN(this.value) ? 0 : this.value);
    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    // this.setAttribute('aria-valuestep', this.step);
  }
  static get GlUtils() {
    return /* glsl */`
    vec4 paintSlider(vec2 position, vec3 color) {
      vec4 slotColor = mix(cssColor, cssBackgroundColorField, 0.125);
      vec4 sliderColor = vec4(0.0);
      float slotWidth = cssStrokeWidth;
      float stroke = cssStrokeWidth;
      float radius = cssItemHeight * 0.125;

      float strokeShape = min(
        circle(position, radius + stroke + stroke),
        rectangle(vec2(0., position.y), vec2(-position.x, radius + stroke + stroke))
      );
      sliderColor = mix(vec4(slotColor.rgb, 1.0), sliderColor, strokeShape);

      float fillShape = min(
        circle(position, radius + stroke),
        rectangle(vec2(0., position.y), vec2(-position.x, radius + stroke))
      );
      sliderColor = mix(vec4(cssBackgroundColor.rgb, 1.0), sliderColor, fillShape);

      float colorShape = min(
        circle(position, radius),
        rectangle(vec2(0., position.y), vec2(-position.x, radius))
      );
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);

      return sliderColor;
    }
    \n\n`;
  }
  static get Frag() {
    return `
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = cssBackgroundColorField.rgb;

      vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
      vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
      vec2 position = size * uv;

      float stepInPx = size.x / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(cssColor, cssBackgroundColorField, 0.75);

      float lineWidth = cssStrokeWidth;
      if (stepInPx > lineWidth * 2.0) {
        float gridWidth = size.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        float gridShape = grid(translate(position, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      vec4 slotGradient = mix(cssColorFocus, cssColorLink, uv.x);
      vec2 markerPos = translate(position, vec2(size.x * valueInRange, size.y * 0.5));
      vec4 slider = paintSlider(markerPos, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
  }
}

IoSlider.Register();
