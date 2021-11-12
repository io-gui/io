import {RegisterIoElement} from '../../../srcj/components/io-element.js';
import {IoGl} from '../../../srcj/elements/core/gl.js';

export class IoSlider extends IoGl {
  static get Style() {
    return /* css */`
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
    }
    :host[horizontal] {
      cursor: ew-resize;
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
    `;
  }
  static get Properties() {
    return {
      value: 0,
      step: 0.01,
      min: 0,
      max: 1,
      exponent: 1,
      horizontal: {
        value: true,
        reflect: 1,
      },
      noscroll: false,
      role: 'slider',
      tabindex: 0,
      lazy: true,
    };
  }
  static get Listeners() {
    return {
      'focus': '_onFocus',
      'contextmenu': '_onContextmenu',
      'pointerdown': '_onPointerdown',
      'touchstart': '_onTouchstart',
    };
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
  _onTouchstart(event) {
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._x = event.changedTouches[0].clientX;
    this._y = event.changedTouches[0].clientY;
    this._active = this.noscroll ? 1 : -1;
  }
  _onTouchmove(event) {
    const dx = Math.abs(this._x - event.changedTouches[0].clientX);
    const dy = Math.abs(this._y - event.changedTouches[0].clientY);
    if (this._active === -1) {
      if (this.horizontal) {
        if (dx > 3 && dx > dy) {
          this._active = (dx > dy && dy < 10) ? 1 : 0;
        }
      } else {
        if (dy > 3 && dy > dx) {
          this._active = (dy > dx && dx < 10) ? 1 : 0;
        }
      }
    }
    if (this._active !== 1) return;
    event.preventDefault();
  }
  _onTouchend() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _onPointerdown(event) {
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
  }
  _onPointermove(event) {
    if (event.pointerType !== 'touch') this._active = 1;
    this.throttle(this._onPointermoveThrottled, event, true);
  }
  _onPointerup() {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
  }
  _getPointerCoord(event) {
    const rect = this.getBoundingClientRect();
    const x = Math.pow(Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width)), this.exponent);
    const y = Math.pow(Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height)), this.exponent);
    return [x, y];
  }
  _getValueFromCoord(coord) {
    let value = this.min * (1 - coord) + this.max * coord;
    value = Math.min(this.max, Math.max(this.min, value));
    return Math.round(value / this.step) * this.step;
  }
  _getCoordFromValue(value) {
    return (value - this.min) / (this.max - this.min);
  }
  _onPointermoveThrottled(event) {
    if (this._active === 1) {
      if (document.activeElement !== this ) this.focus();
      const p = this._getPointerCoord(event);
      let _x = this._getValueFromCoord(p[0]);
      let _y = this._getValueFromCoord(p[1]);
      this._setValue(this.horizontal ? _x : _y, this.horizontal ? _y : _x);
    }
  }
  _setValue(x) {
    this.set('value', Number(x.toFixed(5)));
  }
  _onKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('left');
        else this._setDecrease();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('up');
        else this._setIncrease();
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('right');
        else this._setIncrease();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('down');
        else this._setDecrease();
        break;
      case 'PageUp':
      case '+':
        event.preventDefault();
        this._setIncrease();
        break;
      case 'PageDown':
      case '-':
        event.preventDefault();
        this._setDecrease();
        break;
      case 'Home':
        event.preventDefault();
        this._setMin();
        break;
      default:
        break;
    }
  }
  // TODO: round to step
  _setIncrease() {
    let value = this.value + this.step;
    value = Math.min(this.max, Math.max(this.min, value));
    this._setValue(value);
  }
  _setDecrease() {
    let value = this.value - this.step;
    value = Math.min(this.max, Math.max(this.min, value));
    this._setValue(value);
  }
  _setMin() {
    let value = this.min;
    value = Math.min(this.max, Math.max(this.min, value));
    this._setValue(value);
  }
  _setMax() {
    let value = this.max;
    value = Math.min(this.max, Math.max(this.min, value));
    this._setValue(value);
  }
  // TODO: consider moving or standardizing.
  changed() {
    super.changed();
  }
  applyAria() {
    super.applyAria();
    this.setAttribute('aria-invalid', isNaN(this.value) ? 'true' : false);
    this.setAttribute('aria-valuenow', isNaN(this.value) ? 0 : this.value);
    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    // this.setAttribute('aria-valuestep', this.step);
  }
  static get GlUtils() {
    return /* glsl */`
    vec4 paintSlider(vec2 position, vec2 sliderStart, vec2 sliderEnd, float knobRadius, float slotWidth, vec3 color) {
      vec4 slotColor = mix(cssColor, cssBackgroundColorField, 0.125);
      vec4 sliderColor = vec4(0.0);
      float stroke = cssStrokeWidth;

      vec2 startPos = translate(position, sliderStart);
      vec2 endPos = translate(position, sliderEnd);
      vec2 slotCenter = (startPos + endPos) / 2.;
      float slotSpan = abs(startPos.x - endPos.x) / 2.0;

      float strokeShape = min(min(
        circle(startPos, knobRadius + stroke + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke + stroke))),
        circle(endPos, knobRadius + stroke + stroke)
      );
      sliderColor = mix(vec4(slotColor.rgb, 1.0), sliderColor, strokeShape);

      float fillShape = min(min(
        circle(startPos, knobRadius + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke))),
        circle(endPos, knobRadius + stroke)
      );
      sliderColor = mix(vec4(cssBackgroundColor.rgb, 1.0), sliderColor, fillShape);

      float colorShape = min(min(
        circle(startPos, knobRadius),
        rectangle(slotCenter, vec2(slotSpan, slotWidth))),
        circle(endPos, knobRadius)
      );
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);

      return sliderColor;
    }
    \n\n`;
  }
  static get Frag() {
    return /* glsl */`
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
        // TODO: grid with exponent
        float gridWidth = size.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      vec4 slotGradient = mix(cssColorFocus, cssColorLink, uv.x);
      float knobRadius = cssItemHeight * 0.125;
      float slotWidth = cssItemHeight * 0.125;

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      float sign = valueInRange < 0.0 ? -1.0 : 1.0;
      valueInRange = abs(pow(valueInRange, 1./uExponent)) * sign;

      vec2 sliderStart = vec2(0.0, size.y * 0.5);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), size.y * 0.5);

      vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
  }
}

RegisterIoElement(IoSlider);
