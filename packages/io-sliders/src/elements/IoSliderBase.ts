import { ReactiveProperty, IoGl, IoElementProps, WithBinding, Property, ListenerDefinition } from 'io-gui';

const clamp = (num: number, min: number, max: number) => {
  return max > min ? Math.min(Math.max(num, min), max) : Math.min(Math.max(num, max), min);
};

export type IoSliderBaseProps = IoElementProps & {
  value?:  WithBinding<number | [number, number]>,
  step?:  number | [number, number],
  min?: number | [number, number],
  max?: number | [number, number],
  exponent?: number,
  vertical?: boolean,
  noscroll?: boolean,
};

export class IoSliderBase extends IoGl {
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
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorRed);
        border-color: var(--io_colorRed);
      }
      :host:focus {
        @apply --io_focus;
      }
    `;
  }

  @ReactiveProperty({type: Number, value: 0})
  declare value: number | [number, number];

  @ReactiveProperty({type: Number, value: 0.01})
  declare step: number | [number, number];

  @ReactiveProperty({type: Number, value: 0})
  declare min: number | [number, number];

  @ReactiveProperty({type: Number, value: 1})
  declare max: number | [number, number];

  @ReactiveProperty({type: Number, value: 1})
  declare exponent: number;

  @ReactiveProperty({value: false, reflect: true})
  declare vertical: boolean;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare invalid: boolean;

  @Property(false)
  declare noscroll: boolean;

  @Property('slider')
  declare role: string;

  @Property(0)
  declare tabIndex: number;

  _startX = 0;
  _startY = 0;
  _rect: DOMRect | null = null;

  _active = -1;

  get _min(): [number, number] {
    if (typeof this.min === 'number') {
      return [this.min, this.min];
    } else if (this.min instanceof Array) {
      return [...this.min];
    }
    return [-Infinity, -Infinity];
  }

  get _max(): [number, number] {
    if (typeof this.max === 'number') {
      return [this.max, this.max];
    } else if (this.max instanceof Array) {
      return [...this.max];
    }
    return [Infinity, Infinity];
  }

  get _step(): [number, number] {
    if (typeof this.step === 'number') {
      return [this.step, this.step];
    } else if (this.step instanceof Array) {
      return [...this.step];
    }
    return [0.01, 0.01];
  }

  get _value(): [number, number] {
    if (typeof this.value === 'number') {
      return [this.value, this.value];
    } else if (this.value instanceof Array) {
      return [...this.value];
    }
    return [NaN, NaN];
  }

  static get Listeners() {
    return {
      'focus': 'onFocus',
      'contextmenu': 'onContextmenu',
      'pointerdown': 'onPointerdown',
      'touchstart': ['onTouchstart', {passive: false}] as ListenerDefinition,
    };
  }

  constructor(args: IoSliderBaseProps = {}) { super(args); }

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
    this._rect = this.getBoundingClientRect();
    this.addEventListener('touchmove', this.onTouchmove, {passive: false});
    this.addEventListener('touchend', this.onTouchend);
    this._startX = event.changedTouches[0].clientX;
    this._startY = event.changedTouches[0].clientY;
    this._active = this.noscroll ? 1 : -1;
  }
  onTouchmove(event: TouchEvent) {
    const dx = Math.abs(this._startX - event.changedTouches[0].clientX);
    const dy = Math.abs(this._startY - event.changedTouches[0].clientY);
    if (this._active === -1) {
      if (this.vertical) {
        if (dy > 5 && dy > dx) {
          this._active = (dy > dx && dx < 5) ? 1 : 0;
        }
      } else {
        if (dx > 5 && dx > dy) {
          this._active = (dx > dy && dy < 5) ? 1 : 0;
        }
      }
    }
    if (this._active === 1 && event.cancelable) {
      event.preventDefault();
    }
  }
  onTouchend() {
    this.removeEventListener('touchmove', this.onTouchmove);
    this.removeEventListener('touchend', this.onTouchend);
  }
  onPointerdown(event: PointerEvent) {
    this._rect = this.getBoundingClientRect();
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
    this.addEventListener('pointercancel', this.onPointerup);
  }
  onPointermove(event: PointerEvent) {
    if (event.pointerType !== 'touch') this._active = 1;
    this.throttle(this.onPointermoveThrottled, event);
  }
  onPointerup(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
    this.removeEventListener('pointercancel', this.onPointerup);
    this._active = -1;
  }
  _getPointerCoord(event: PointerEvent): [number, number] {
    const rect = this._rect || this.getBoundingClientRect();
    let x = Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width));
    let y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height));
    x = Math.pow(x, this.exponent);
    y = Math.pow(y, this.exponent);
    return this.vertical ? [y, x] : [x, y];
  }
  _getValueFromCoord(coord: [number, number]) {
    const value: [number, number] = [0, 0];
    const min = this._min;
    const max = this._max;
    value[0] = min[0] * (1 - coord[0]) + max[0] * coord[0];
    value[1] = min[1] * (1 - coord[1]) + max[1] * coord[1];
    return value;
  }
  onPointermoveThrottled(event: PointerEvent) {
    if (this._active === 1) {
      if (document.activeElement !== this as unknown as Element) this.focus();
      const coord = this._getPointerCoord(event);
      const value = this._getValueFromCoord(coord);
      this._inputValue(value);
    }
  }
  _inputValue(value: [number, number]) {
    const min = this._min;
    const max = this._max;
    const step = this._step;

    value[0] = clamp(value[0], max[0], min[0]);
    value[1] = clamp(value[1], max[1], min[1]);
    value[0] = Math.round(value[0] / step[0]) * step[0];
    value[1] = Math.round(value[1] / step[1]) * step[1];

    value[0] = Number(value[0].toFixed(5));
    value[1] = Number(value[1].toFixed(5));
    if (typeof this.value === 'number') {
      if (this.value === value[0]) return;
      this.inputValue(value[0]);
    } else if (this.value instanceof Array) {
      const oldValue = JSON.stringify(this.value);
      this.value[0] = value[0];
      this.value[1] = value[1];
      if (oldValue === JSON.stringify(this.value)) return;
      this.inputValue(this.value);
      this.dispatchMutation(this.value);
    } else if (typeof this.value === 'object') {
      const oldValue = JSON.stringify(this.value);
      const $value = this.value as {x: number, y: number};
      $value.x = value[0];
      $value.y = value[1];
      if (oldValue === JSON.stringify(this.value)) return;
      this.inputValue(this.value);
      this.dispatchMutation(this.value);
    }
  }
  inputValue(value: any) {
    if (this.value !== value || typeof this.value === 'object') {
      const oldValue = this.value;
      this.setProperty('value', value);
      this.dispatch('value-input', {value: value, oldValue: oldValue}, false);
    }
  }
  onKeydown(event: KeyboardEvent) {
    const oneDimension = typeof this.value === 'number';

    if (event.shiftKey) switch (event.key) {
      case 'ArrowLeft':
        oneDimension ? this._setDecrease() : this._setLeft();
        break;
      case 'ArrowUp':
        oneDimension ? this._setIncrease() : this._setUp();
        break;
      case 'ArrowRight':
        oneDimension ? this._setIncrease() : this._setRight();
        break;
      case 'ArrowDown':
        oneDimension ? this._setDecrease() : this._setDown();
        break;
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
        event.preventDefault();
        this.dispatch('io-focus-to', {source: this, command: event.key}, true);
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
  ready() {
    this.changed();
  }
  valueChanged() {
    let invalid = false;
    if (this.value instanceof Array) {
      invalid = isNaN(this.value[0]) || isNaN(this.value[1]);
    } else if (isNaN(this.value)) {
      invalid = true;
    }
    this.invalid = invalid;
  }
  invalidChanged() {
    if (this.invalid) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }
  valueMutated() {
    this.changed();
    this.dispatchMutation();
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
}

