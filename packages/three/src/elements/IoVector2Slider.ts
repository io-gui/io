import { Register, IoGl, ReactiveProperty, Property, WithBinding, IoElementProps } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'

const clamp = (num: number, min: number, max: number) => {
  return max > min ? Math.min(Math.max(num, min), max) : Math.min(Math.max(num, max), min)
}

export type IoVector2SliderProps = IoElementProps & {
  value?: WithBinding<Vector2>
  step?: number
  min?: number
  max?: number
  exponent?: number
  vertical?: boolean
  noscroll?: boolean
}

@Register
export class IoVector2Slider extends IoGl {

  static get Style() {
    return /* css */`
      :host {
        display: flex;
        cursor: crosshair;
        border: var(--io_border);
        border-radius: var(--io_borderRadius);
        border-color: var(--io_borderColorInset);
        min-width: calc(var(--io_fieldHeight) * 5);
        min-height: calc(var(--io_fieldHeight) * 5);
        flex-grow: 0;
      }
      :host[invalid] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorRed);
        border-color: var(--io_colorRed);
      }
      :host:focus {
        @apply --io_focus;
      }
    `
  }

  @ReactiveProperty({type: Vector2, init: null})
  declare value: Vector2

  @ReactiveProperty({type: Number, value: 0.01})
  declare step: number

  @ReactiveProperty({type: Number, value: -1})
  declare min: number

  @ReactiveProperty({type: Number, value: 1})
  declare max: number

  @ReactiveProperty({type: Number, value: 1})
  declare exponent: number

  @ReactiveProperty({value: false, reflect: true})
  declare vertical: boolean

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare invalid: boolean

  @Property(true)
  declare noscroll: boolean

  @Property('slider')
  declare role: string

  @Property(0)
  declare tabIndex: number

  #startX = 0
  #startY = 0
  #active = -1
  #rect: DOMRect | null = null

  constructor(args: IoVector2SliderProps = {}) { super(args) }

  static get GlUtils() {
    return /* glsl */`
      vec3 paintKnob(vec3 dstCol, vec2 p, vec2 center, vec3 color) {
        vec4 finalCol = vec4(0.0);
        vec2 pCenter = translate(p, center);
        float radius = io_fieldHeight * 0.25;
        float stroke = io_borderWidth;
        float strokeShape = circle(pCenter, radius + stroke + stroke);
        float fillShape   = circle(pCenter, radius + stroke);
        float colorShape  = circle(pCenter, radius);
        finalCol = mix(io_colorStrong, finalCol, strokeShape);
        finalCol = mix(vec4(io_bgColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(color, 1.0), finalCol, colorShape);
        return compose(dstCol, finalCol);
      }
    `
  }
  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.5));

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = io_bgColorBlue.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      vec2 gridSize = size / abs((uMax - uMin) / uStep);
      vec2 gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;
      vec2 gridPosition = translate(position, -gridOffset);
      float gridShape = paintDerivativeGrid2D(gridPosition, gridSize, io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Axis
      float axisShape = lineCross2d(gridPosition, io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, axisShape));

      // Knob
      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, gridPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`
  }

  onFocus() {
    this.addEventListener('blur', this.onBlur)
    this.addEventListener('keydown', this.onKeydown)
  }
  onBlur() {
    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('keydown', this.onKeydown)
  }
  onContextmenu(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }
  onTouchstart(event: TouchEvent) {
    this.#rect = this.getBoundingClientRect()
    this.addEventListener('touchmove', this.onTouchmove, {passive: false})
    this.addEventListener('touchend', this.onTouchend)
    this.#startX = event.changedTouches[0].clientX
    this.#startY = event.changedTouches[0].clientY
    this.#active = this.noscroll ? 1 : -1
  }
  onTouchmove(event: TouchEvent) {
    const dx = Math.abs(this.#startX - event.changedTouches[0].clientX)
    const dy = Math.abs(this.#startY - event.changedTouches[0].clientY)
    if (this.#active === -1) {
      if (this.vertical) {
        if (dy > 5 && dy > dx) {
          this.#active = (dy > dx && dx < 5) ? 1 : 0
        }
      } else {
        if (dx > 5 && dx > dy) {
          this.#active = (dx > dy && dy < 5) ? 1 : 0
        }
      }
    }
    if (this.#active === 1 && event.cancelable) {
      event.stopPropagation()
      event.preventDefault()
    }
  }
  onTouchend() {
    this.removeEventListener('touchmove', this.onTouchmove)
    this.removeEventListener('touchend', this.onTouchend)
  }
  onPointerdown(event: PointerEvent) {
    event.stopPropagation()
    this.#rect = this.getBoundingClientRect()
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.onPointermove)
    this.addEventListener('pointerup', this.onPointerup)
    this.addEventListener('pointercancel', this.onPointerup)
  }
  onPointermove(event: PointerEvent) {
    if (event.pointerType !== 'touch') this.#active = 1
    this.throttle(this.onPointermoveThrottled, event)
  }
  onPointerup(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId)
    this.removeEventListener('pointermove', this.onPointermove)
    this.removeEventListener('pointerup', this.onPointerup)
    this.removeEventListener('pointercancel', this.onPointerup)
    this.#active = -1
  }

  _getPointerCoord(event: PointerEvent): [number, number] {
    const rect = this.#rect || this.getBoundingClientRect()
    let x = Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width))
    let y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height))
    x = Math.pow(x, this.exponent)
    y = Math.pow(y, this.exponent)
    return this.vertical ? [y, x] : [x, y]
  }
  _getValueFromCoord(coord: [number, number]): [number, number] {
    return [
      this.min * (1 - coord[0]) + this.max * coord[0],
      this.min * (1 - coord[1]) + this.max * coord[1]
    ]
  }
  onPointermoveThrottled(event: PointerEvent) {
    if (this.#active === 1) {
      if (document.activeElement !== this as unknown as Element) this.focus()
      const coord = this._getPointerCoord(event)
      const value = this._getValueFromCoord(coord)
      this._inputValue(value)
    }
  }
  _inputValue(value: [number, number]) {
    value[0] = clamp(value[0], this.max, this.min)
    value[1] = clamp(value[1], this.max, this.min)
    value[0] = Math.round(value[0] / this.step) * this.step
    value[1] = Math.round(value[1] / this.step) * this.step

    value[0] = Number(value[0].toFixed(5))
    value[1] = Number(value[1].toFixed(5))

    this.value.x = value[0]
    this.value.y = value[1]

    this.dispatch('value-input', {value: value}, false) // TODO: test
    this.dispatchMutation(this.value)
  }
  onKeydown(event: KeyboardEvent) {
    const oneDimension = typeof this.value === 'number'

    if (event.shiftKey) switch (event.key) {
      case 'ArrowLeft':
        oneDimension ? this._setDecrease() : this._setLeft()
        break
      case 'ArrowUp':
        oneDimension ? this._setIncrease() : this._setUp()
        break
      case 'ArrowRight':
        oneDimension ? this._setIncrease() : this._setRight()
        break
      case 'ArrowDown':
        oneDimension ? this._setDecrease() : this._setDown()
        break
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
        event.preventDefault()
        this.dispatch('io-focus-to', {source: this, command: event.key}, true)
      }
  }
  _setIncrease() {
    this._inputValue([this.value.x + this.step, this.value.y + this.step])
  }
  _setDecrease() {
    this._inputValue([this.value.x - this.step, this.value.y - this.step])
  }
  _setMin() {
    this._inputValue([this.min, this.min])
  }
  _setMax() {
    this._inputValue([this.max, this.max])
  }
  _setUp() {
    this._inputValue([this.value.x + this.step, this.value.y])
  }
  _setDown() {
    this._inputValue([this.value.x - this.step, this.value.y])
  }
  _setLeft() {
    this._inputValue([this.value.x, this.value.y - this.step])
  }
  _setRight() {
    this._inputValue([this.value.x, this.value.y + this.step])
  }
  ready() {
    this.changed()
  }
  valueChanged() {
    this.invalid = !(this.value instanceof Vector2)
  }
  invalidChanged() {
    if (this.invalid) {
      this.setAttribute('aria-invalid', 'true')
    } else {
      this.removeAttribute('aria-invalid')
    }
  }
  valueMutated() {
    this.changed()
    this.dispatchMutation()
  }
  changed() {
    super.changed()
    this.setAttribute('aria-valuemin', JSON.stringify(this.min))
    this.setAttribute('aria-valuemax', JSON.stringify(this.max))
    this.setAttribute('aria-valuestep', JSON.stringify(this.step))
    this.setAttribute('aria-valuenow', JSON.stringify(this.value))
  }

}
export const ioVector2Slider = function(arg0?: IoVector2SliderProps) {
  return IoVector2Slider.vConstructor(arg0)
}
