import { Property, IoGl, IoGlProps, VDOMElement, PropsWithBinding, Default } from 'io-gui';

const clamp = (num: number, min: number, max: number) => {
  return max > min ? Math.min(Math.max(num, min), max) : Math.min(Math.max(num, max), min);
};

export type IoSliderBaseProps = IoGlProps & PropsWithBinding<{
  value?:  number | [number, number];
  step?:  number | [number, number];
  min?: number | [number, number];
  max?: number | [number, number];
  exponent?: number;
  vertical?: boolean;
  noscroll?: boolean;
}>;

export class IoSliderBase extends IoGl {
  static vConstructor: (arg0?: IoSliderBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

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
      }
      :host:not([vertical]) {
        width: var(--io_fieldHeight10);
        height: var(--io_fieldHeight);
      }
      :host[vertical] {
        cursor: ns-resize;
        width: var(--io_fieldHeight);
        height: var(--io_fieldHeight5);
        min-height: var(--io_fieldHeight5);
        flex-basis: var(--io_fieldHeight);
        flex-grow: 0;
      }
      :host[disabled] {
        opacity: 0.5;
      }
      :host[invalid] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorRed);
        border-color: var(--io_colorRed);
      }
    `;
  }

  @Property({value: 0})
  declare value: number | [number, number];

  @Property(0.01)
  declare step: number | [number, number];

  @Property(0)
  declare min: number | [number, number];

  @Property(1)
  declare max: number | [number, number];

  @Property(1)
  declare exponent: number;

  @Property({value: false, reflect: true})
  declare vertical: boolean;

  @Property({value: false, reflect: true})
  declare disabled: boolean;

  @Property({value: false, reflect: true})
  declare invalid: boolean;

  @Property(false)
  declare noscroll: boolean;

  @Default('slider')
  declare role: string;

  @Default('0')
  declare tabIndex: string;

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
      'touchstart': ['onTouchstart', {passive: false}],
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
  onKeydown(event: KeyboardEvent) {
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
  disabledChanged() {
    this.inert = this.disabled;
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
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

