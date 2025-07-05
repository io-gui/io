import { Register, ReactiveProperty,  IoGl, IoElementProps, Binding, VDOMElement, Property, ListenerDefinition } from 'io-gui';

const clamp = (num: number, min: number, max: number) => {
  return max > min ? Math.min(Math.max(num, min), max) : Math.min(Math.max(num, max), min);
};

export type IoSliderProps = IoElementProps & {
  value?: number | Binding<number>,
  step?: number,
  min?: number,
  max?: number,
  exponent?: number,
  vertical?: boolean,
  disabled?: boolean,
  noscroll?: boolean,
};

/**
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 **/
@Register
export class IoSlider extends IoGl {
  static vConstructor: (arg0?: IoSliderProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        cursor: ew-resize;
        border: var(--io_border);
        border-radius: var(--io_borderRadius);
        border-color: var(--io_borderColorInset);
        min-height: var(--io_fieldHeight);
        min-width: var(--io_fieldHeight);
        flex-grow: 1;
      }
      :host[vertical] {
        cursor: ns-resize;
        width: var(--io_fieldHeight);
        min-height: calc(var(--io_fieldHeight) * 5);
        flex-basis: var(--io_fieldHeight);
        flex-grow: 0;
      }
      :host[invalid] {
        border-color: var(--io_colorRed);
      }
      :host[disabled] {
        opacity: 0.5;
      }
      :host:focus {
        @apply --io_focus;
      }
    `;
  }

  @ReactiveProperty(0)
  declare value: number;

  @ReactiveProperty(0.01)
  declare step: number;

  @ReactiveProperty(0)
  declare min: number;

  @ReactiveProperty(1)
  declare max: number;

  @ReactiveProperty(1)
  declare exponent: number;

  @ReactiveProperty({value: false, reflect: true})
  declare vertical: boolean;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare invalid: boolean;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare disabled: boolean;

  @Property(false)
  declare noscroll: boolean;

  @Property('slider')
  declare role: string;

  @Property('0')
  declare tabIndex: string;

  #startX = 0;
  #startY = 0;
  #active = -1;
  #rect: DOMRect | null = null;

  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * vec2(uv.x, uv.y - 0.5);
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);
      float valueInRange = (uValue - uMin) / (uMax - uMin);
      if (uInvalid == 1) valueInRange = 0.0;
      float valueSign = sign(valueInRange);
      float expValueInRange = pow(abs(valueInRange), 1./uExponent) * valueSign;

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = io_bgColorBlue.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(expPosition, gridOffset, 0.0), vec2(gridSize, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Slider
      float sliderShape = rectangle(expPosition, vec2(size.x * valueInRange, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(io_bgColorInput.rgb, gridShape * sliderShape * 0.125));

      // Lines
      float lineShape1 = lineVertical(translate(position, expValueInRange * size.x, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineShape1));
      float lineShape2 = lineVertical(translate(position, expValueInRange * size.x - io_borderWidth, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineShape2));

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }

  static get Listeners() {
    return {
      'focus': 'onFocus',
      'contextmenu': 'onContextmenu',
      'pointerdown': 'onPointerdown',
      'touchstart': ['onTouchstart', {passive: false}] as ListenerDefinition,
    };
  }

  constructor(args: IoSliderProps = {}) { super(args); }

  onFocus() {
    this.addEventListener('blur', this.onBlur);
    this.addEventListener('keydown', this.onKeydown);
  }
  onBlur() {
    this.removeEventListener('blur', this.onBlur);
    this.removeEventListener('keydown', this.onKeydown);
  }
  onContextmenu(event: Event) {
    event.preventDefault();
  }
  onTouchstart(event: TouchEvent) {
    this.#rect = this.getBoundingClientRect();
    this.addEventListener('touchmove', this.onTouchmove, {passive: false});
    this.addEventListener('touchend', this.onTouchend);
    this.#startX = event.changedTouches[0].clientX;
    this.#startY = event.changedTouches[0].clientY;
    this.#active = this.noscroll ? 1 : -1;
  }
  onTouchmove(event: TouchEvent) {
    const dx = Math.abs(this.#startX - event.changedTouches[0].clientX);
    const dy = Math.abs(this.#startY - event.changedTouches[0].clientY);
    if (this.#active === -1) {
      if (this.vertical) {
        if (dy > 5 && dy > dx) {
          this.#active = (dy > dx && dx < 5) ? 1 : 0;
        }
      } else {
        if (dx > 5 && dx > dy) {
          this.#active = (dx > dy && dy < 5) ? 1 : 0;
        }
      }
    }
    if (this.#active === 1 && event.cancelable) {
      event.preventDefault();
    }
  }
  onTouchend() {
    this.removeEventListener('touchmove', this.onTouchmove);
    this.removeEventListener('touchend', this.onTouchend);
  }
  onPointerdown(event: PointerEvent) {
    this.#rect = this.getBoundingClientRect();
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
    this.addEventListener('pointercancel', this.onPointerup);
  }
  onPointermove(event: PointerEvent) {
    if (event.pointerType !== 'touch') this.#active = 1;
    this.throttle(this.onPointermoveThrottled, event);
  }
  onPointerup(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
    this.removeEventListener('pointercancel', this.onPointerup);
    this.#active = -1;
  }
  _getPointerCoord(event: PointerEvent): number {
    const rect = this.#rect || this.getBoundingClientRect();
    let x = Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width));
    let y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height));
    return Math.pow(this.vertical ? y : x, this.exponent);
  }
  _getValueFromCoord(coord: number) {
    return this.min * (1 - coord) + this.max * coord;
  }
  onPointermoveThrottled(event: PointerEvent) {
    if (this.#active === 1) {
      if (document.activeElement !== this as unknown as Element) this.focus();
      const coord = this._getPointerCoord(event);
      const value = this._getValueFromCoord(coord);
      this._inputValue(value);
    }
  }
  _incrementValue(value: number) {
    this._inputValue(this.value + value);
  }
  _inputValue(value: number) {
    value = clamp(value, this.max, this.min);
    value = Math.round(value / this.step) * this.step;
    value = Number(value.toFixed(5));
    if (!isNaN(value) && this.value !== value) {
      this.inputValue(value);
    }
  }
  onKeydown(event: KeyboardEvent) {
    const invert = this.max < this.min;
    if (event.shiftKey) switch (event.key) {
      case 'ArrowLeft':
        this._incrementValue(invert ? this.step : -this.step);
        break;
      case 'ArrowUp':
        this._incrementValue(invert ? -this.step : this.step);
        break;
      case 'ArrowRight':
        this._incrementValue(invert ? -this.step : this.step);
        break;
      case 'ArrowDown':
        this._incrementValue(invert ? this.step : -this.step);
        break;
      case 'Home':
        event.preventDefault();
        this._inputValue(this.min);
        break;
      case 'End':
        event.preventDefault();
        this._inputValue(this.max);
        break;
      case 'PageUp':
        event.preventDefault();
        this._incrementValue(invert ? -this.step : this.step);
        break;
      case 'PageDown':
        event.preventDefault();
        this._incrementValue(invert ? this.step : -this.step);
        break;
    } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      this.dispatchEvent('io-focus-to', {source: this, command: event.key}, true);
    }
  }
  ready() {
    this.valueChanged();
    this.minChanged();
    this.maxChanged();
    this.changed();
  }
  invalidChanged() {
    this.ariaInvalid = this.invalid;
  }
  disabledChanged() {
    this.inert = this.disabled;
    this.ariaDisabled = this.disabled;
  }
  valueChanged() {
    this.invalid = isNaN(this.value);
    this.ariaValueNow = this.value;
  }
  minChanged() {
    this.ariaValueMin = this.min;
  }
  maxChanged() {
    this.ariaValueMax = this.max;
  }
}
export const ioSlider = IoSlider.vConstructor;
