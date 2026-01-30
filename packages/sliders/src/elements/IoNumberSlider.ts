import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding } from '@io-gui/core'
import {ioNumber} from '@io-gui/inputs'
import {ioSlider} from './IoSlider.js'

export type IoNumberSliderProps = IoElementProps & {
  value?: WithBinding<number>
  step?: number
  min?: number
  max?: number
  exponent?: number
  conversion?: number
  disabled?: WithBinding<boolean>
}

/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 **/
@Register
export class IoNumberSlider extends IoElement {

  static get Style() {
    return /* css */`
    :host {
      display: flex;
    }
    :host > io-number {
      flex: 0 0 3.8em;
      margin-right: var(--io_spacing);
    }
    :host > io-slider {
      flex: 1 1 3em;
      min-width: 3em;
    }
    `
  }

  @ReactiveProperty({value: 0})
  declare value: number

  @ReactiveProperty(0.01)
  declare step: number

  @ReactiveProperty(0)
  declare min: number

  @ReactiveProperty(1)
  declare max: number

  @ReactiveProperty(1)
  declare exponent: number

  @ReactiveProperty(1)
  declare conversion: number

  @ReactiveProperty(false)
  declare disabled: boolean

  constructor(args: IoNumberSliderProps = {}) { super(args) }

  _onNumberSet(event: CustomEvent) {
    this.value = event.detail.value
    this.dispatch('value-input', event.detail, false)
  }
  _onSliderSet(event: CustomEvent) {
    event.detail.value = event.detail.value / this.conversion
    this.value = event.detail.value
    this.dispatch('value-input', event.detail, false)
  }
  ready() {
    this.changed()
  }
  changed() {
    this.render([
      ioNumber({
        id: 'number',
        value: this.value,
        step: this.step,
        conversion: this.conversion,
        disabled: this.disabled,
        '@value-input': this._onNumberSet,
      }),
      ioSlider({
        id: 'slider',
        value: this.value * this.conversion,
        step: this.step * this.conversion,
        min: this.min * this.conversion,
        max: this.max * this.conversion,
        exponent: this.exponent,
        disabled: this.disabled,
        '@value-input': this._onSliderSet,
      }),
    ])
  }
}
export const ioNumberSlider = function(arg0?: IoNumberSliderProps) {
  return IoNumberSlider.vConstructor(arg0)
}