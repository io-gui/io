import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, Node } from 'io-core';
import {ioNumber} from 'io-inputs';
import {ioSliderRange} from './IoSliderRange.js';

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
      this.dispatchMutation(this.value);
    }
  }
  _onSliderSet(event: CustomEvent) {
    this.value = event.detail.value;
    if (!(this.value as unknown as Node)._isNode) {
      this.dispatchMutation(this.value);
    }
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
        min: this.min,
        max: this.max,
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
        min: this.min,
        max: this.max,
        conversion: this.conversion,
        '@value-input': this._onNumberSet,
      }),
    ]);
  }
}
export const ioNumberSliderRange = function(arg0?: IoNumberSliderRangeProps) {
  return IoNumberSliderRange.vConstructor(arg0);
};