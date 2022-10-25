import { IoProperty } from '../../core/internals/property.js';
import { IoGl } from '../../core/gl.js';

type SliderValueTypes = number | [number, number] | {x: number, y: number};

export abstract class IoSliderBase extends IoGl {
  @IoProperty({value: 0})
  declare value: SliderValueTypes;

  @IoProperty(0.01)
  declare step: SliderValueTypes;

  @IoProperty(0)
  declare min: SliderValueTypes;

  @IoProperty(1)
  declare max: SliderValueTypes;

  @IoProperty(1)
  declare exponent: number;

  @IoProperty({value: false, reflect: 'prop'})
  declare vertical: boolean;

  @IoProperty(false)
  declare noscroll: boolean;

  @IoProperty('slider')
  declare role: string;

  @IoProperty('0')
  declare tabindex: string;

  @IoProperty(true)
  declare lazy: boolean;

  _startX = 0;
  _startY = 0;
  _active = false;

  get _min(): [number, number] {
    if (typeof this.min === 'number') {
      return [this.min, this.min];
    } else if (this.min instanceof Array) {
      return [...this.min];
    } else if (typeof this.min === 'object') {
      return [this.min.x, this.min.y];
    }
    return [-Infinity, -Infinity];
  }

  get _max(): [number, number] {
    if (typeof this.max === 'number') {
      return [this.max, this.max];
    } else if (this.max instanceof Array) {
      return [...this.max];
    } else if (typeof this.max === 'object') {
      return [this.max.x, this.max.y];
    }
    return [Infinity, Infinity];
  }

  get _step(): [number, number] {
    if (typeof this.step === 'number') {
      return [this.step, this.step];
    } else if (this.step instanceof Array) {
      return [...this.step];
    } else if (typeof this.step === 'object') {
      return [this.step.x, this.step.y];
    }
    return [0.01, 0.01];
  }

  get _value(): [number, number] {
    if (typeof this.value === 'number') {
      return [this.value, this.value];
    } else if (this.value instanceof Array) {
      return [...this.value];
    } else if (typeof this.value === 'object') {
      return [this.value.x, this.value.y];
    }
    return [NaN, NaN];
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
  _onContextmenu(event: Event) {
    event.preventDefault();
  }
  _onTouchstart(event: TouchEvent) {
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._startX = event.changedTouches[0].clientX;
    this._startY = event.changedTouches[0].clientY;
    this._active = this.noscroll ? true : false;
  }
  _onTouchmove(event: TouchEvent) {
    const dx = Math.abs(this._startX - event.changedTouches[0].clientX);
    const dy = Math.abs(this._startY - event.changedTouches[0].clientY);
    if (this._active === false) {
      if (this.vertical) {
        if (dy > 3 && dy > dx) {
          this._active = (dy > dx && dx < 10) ? true : false;
        }
      } else {
        if (dx > 3 && dx > dy) {
          this._active = (dx > dy && dy < 10) ? true : false;
        }
      }
    }
    if (this._active === false) return;
    event.preventDefault();
  }
  _onTouchend() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _onPointerdown(event: PointerEvent) {
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
  }
  _onPointermove(event: PointerEvent) {
    if (event.pointerType !== 'touch') this._active = true;
    this.throttle(this._onPointermoveThrottled, event);
  }
  _onPointerup(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    this._active = false;
  }
  _getPointerCoord(event: PointerEvent): [number, number] {
    const rect = this.getBoundingClientRect();
    let x = Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width));
    let y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height));
    x = Math.pow(x, this.exponent);
    y = Math.pow(y, this.exponent);
    return [x, y];
  }
  _getValueFromCoord(coord: [number, number]) {
    const value: [number, number] = [0, 0];
    const min = this._min;
    const max = this._max;
    value[0] = min[0] * (1 - coord[0]) + max[0] * coord[0];
    value[1] = min[1] * (1 - coord[1]) + max[1] * coord[1];
    return value;
  }
  _getCoordFromValue(value: [number, number]) {
    const coord = [0, 0];
    const min = this._min;
    const max = this._max;
    coord[0] = (value[0] - min[0]) / (max[0] - min[0]);
    coord[1] = (value[1] - min[1]) / (max[1] - min[1]);
    return coord;
  }
  _onPointermoveThrottled(event: PointerEvent) {
    if (this._active === true) {
      if (document.activeElement !== this as unknown as Element) this.focus();
      const coord = this._getPointerCoord(event);
      const value = this._getValueFromCoord(coord);
      if (this.vertical) value.reverse();
      this._inputValue(value);
    }
  }
  _inputValue(value: [number, number]) {
    const min = this._min;
    const max = this._max;
    const step = this._step;
    value[0] = Math.min(max[0], Math.max(min[0], value[0]));
    value[1] = Math.min(max[1], Math.max(min[1], value[1]));
    value[0] = Math.round(value[0] / step[0]) * step[0];
    value[1] = Math.round(value[1] / step[1]) * step[1];
    value[0] = Number(value[0].toFixed(5));
    value[1] = Number(value[1].toFixed(5));
    if (typeof this.value === 'number') {
      this.inputValue(value[0]);
    } else if (this.value instanceof Array) {
      this.value[0] = value[0];
      this.value[1] = value[1];
      this.inputValue(this.value);
      this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    } else if (typeof this.value === 'object') {
      const $value = this.value as {x: number, y: number};
      $value.x = value[0];
      $value.y = value[1];
      this.inputValue(this.value);
      this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    }
  }
  _onKeydown(event: KeyboardEvent) {
    const oneDimension = typeof this.value === 'number';
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (event.shiftKey) {
          oneDimension ? this._setDecrease() : this._setLeft();
        } else {
          this.focusTo('left');
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.shiftKey) {
          oneDimension ? this._setIncrease() : this._setUp();
        } else {
          this.focusTo('up');
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (event.shiftKey) {
          oneDimension ? this._setIncrease() : this._setRight();
        } else {
          this.focusTo('right');
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (event.shiftKey) {
          oneDimension ? this._setDecrease() : this._setDown();
        } else {
          this.focusTo('down');
        }
        break;
      default:
        break;
    }
  }
  _setIncrease() {
    const value = this._value;
    const step = this._step;
    value[0] = value[0] + step[0];
    value[1] = value[1] + step[1];
    this._inputValue(value);
  }
  _setDecrease() {
    const value = this._value;
    const step = this._step;
    value[0] = value[0] - step[0];
    value[1] = value[1] - step[1];
    this._inputValue(value);
  }
  _setMin() {
    const min = this._min;
    this._inputValue(min);
  }
  _setMax() {
    const max = this._max;
    this._inputValue(max);
  }
  _setUp() {
    const value = this._value;
    const step = this._step;
    value[0] = value[0] + step[0];
    this._inputValue(value);
  }
  _setDown() {
    const value = this._value;
    const step = this._step;
    value[0] = value[0] - step[0];
    this._inputValue(value);
  }
  _setLeft() {
    const value = this._value;
    const step = this._step;
    value[1] = value[1] - step[1];
    this._inputValue(value);
  }
  _setRight() {
    const value = this._value;
    const step = this._step;
    value[1] = value[1] + step[1];
    this._inputValue(value);
  }
  init() {
    this.changed();
  }
  changed() {
    super.changed();
    this.setAttribute('aria-valuemin', JSON.stringify(this.min));
    this.setAttribute('aria-valuemax', JSON.stringify(this.max));
    this.setAttribute('aria-valuestep', JSON.stringify(this.step));
    const value = this._value;
    if (typeof value[0] !== 'number' || isNaN(value[0])) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
    this.setAttribute('aria-valuenow', JSON.stringify(this.value));
  }
  static get GlUtils() {
    return /* glsl */`
    vec4 paintSlider(vec2 position, vec2 sliderStart, vec2 sliderEnd, float knobRadius, float slotWidth, vec3 color) {
      vec4 slotColor = mix(ioColor, ioBackgroundColorField, 0.125);
      vec4 sliderColor = vec4(0.0);
      float stroke = ioStrokeWidth;

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
      sliderColor = mix(vec4(ioBackgroundColor.rgb, 1.0), sliderColor, fillShape);

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
}

