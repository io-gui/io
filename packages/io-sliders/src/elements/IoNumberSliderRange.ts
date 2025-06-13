import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, Node } from 'io-gui';
import {ioSliderRange} from './IoSliderRange';
import {ioNumber} from 'io-inputs';

export type IoNumberSliderRangeProps = IoElementProps & {
  value?: WithBinding<[number, number]>,
  step?: number,
  min?: number,
  max?: number,
  exponent?: number,
  conversion?: number,
};

/**
 * Input element for `Array(2)` data type combining `IoNumber` and `IoSliderRange`
 **/
@Register
export class IoNumberSliderRange extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      min-width: var(--io_fieldHeight5);
      width: var(--io_fieldHeight10);
    }
    :host > io-number {
      flex: 0 0 3.5em;
    }
    :host > io-slider-range {
      margin-left: var(--io_spacing);
      margin-right: var(--io_spacing);
      flex: 1 1 3.5em;
      min-width: 3.5em;
    }
    `;
  }

  @ReactiveProperty({type: Array, init: [0, 0]})
  declare value: [number, number];

  @ReactiveProperty(0.01)
  declare step: number;

  @ReactiveProperty(0)
  declare min: number;

  @ReactiveProperty(1)
  declare max: number;

  @ReactiveProperty(1)
  declare exponent: number;

  @ReactiveProperty(1)
  declare conversion: number;

  constructor(args: IoNumberSliderRangeProps = {}) { super(args); }

  _onNumberSet(event: CustomEvent) {
    const item = event.composedPath()[0];
    if (item === this.$.number0) this.value[0] = event.detail.value;
    if (item === this.$.number1) this.value[1] = event.detail.value;
    if (!(this.value as unknown as Node)._isNode) {
      // TODO: add oldValue/value
      const detail = {object: this.value};
      this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
    }
  }
  _onSliderSet(event: CustomEvent) {
    this.value = event.detail.value;
    // this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-input', event.detail, false);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.render([
      ioNumber({
        id: 'number0',
        value: this.value[0],
        step: this.step,
        conversion: this.conversion,
        '@value-input': this._onNumberSet,
      }),
      ioSliderRange({
        id: 'slider',
        value: this.value,
        step: this.step,
        min: this.min,
        max: this.max,
        exponent: this.exponent,
        '@value-input': this._onSliderSet,
      }),
      ioNumber({
        id: 'number1',
        value: this.value[1],
        step: this.step,
        conversion: this.conversion,
        '@value-input': this._onNumberSet,
      }),
    ]);
  }
}
export const ioNumberSliderRange = IoNumberSliderRange.vConstructor;