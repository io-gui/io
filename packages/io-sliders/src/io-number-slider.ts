import { Register, IoElement, Property, VDOMArray, IoElementArgs, ArgsWithBinding } from 'io-gui';
import {ioSlider} from './io-slider.js';
import {ioNumber} from 'io-inputs';

export type IoNumberSliderArgs = IoElementArgs & ArgsWithBinding<{
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  exponent?: number;
  conversion?: number;
}>;

/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 *
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.01, "conversion": 1, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.2617993877991494, "conversion": 57.29577951308232, "min": -6.283185307179586, "max": 6.283185307179586, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.1, "conversion": 0.2, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
@Register
export class IoNumberSlider extends IoElement {
  static vConstructor: (arg0?: IoNumberSliderArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;

  static get Style() {
    return /* css */`
    :host {
      display: flex;
      min-width: var(--io_fieldHeight5);
      width: var(--io_fieldHeight10);
    }
    :host > io-number {
      flex: 0 0 3.25em;
      margin-right: var(--io_spacing);
    }
    :host > io-slider {
      flex: 1 1 3em;
      min-width: 3em;
    }
    `;
  }

  @Property({value: 0})
  declare value: number;

  @Property(0.01)
  declare step: number;

  @Property(0)
  declare min: number;

  @Property(1)
  declare max: number;

  @Property(1)
  declare exponent: number;

  @Property(1)
  declare conversion: number;

  constructor(properties: IoNumberSliderArgs = {}) {
    super(properties);
  }

  _onNumberSet(event: CustomEvent) {
    this.value = event.detail.value;
    this.dispatchEvent('value-input', event.detail, false);
  }
  _onSliderSet(event: CustomEvent) {
    event.detail.value = event.detail.value / this.conversion;
    this.value = event.detail.value;
    this.dispatchEvent('value-input', event.detail, false);
  }
  init() {
    this.changed();
  }
  changed() {
    this.template([
      ioNumber({
        $: 'number',
        value: this.value,
        step: this.step,
        conversion: this.conversion,
        '@value-input': this._onNumberSet,
      }),
      ioSlider({
        $: 'slider',
        value: this.value * this.conversion,
        step: this.step * this.conversion,
        min: this.min * this.conversion,
        max: this.max * this.conversion,
        exponent: this.exponent,
        '@value-input': this._onSliderSet,
      }),
    ]);
  }
}
export const ioNumberSlider = IoNumberSlider.vConstructor;