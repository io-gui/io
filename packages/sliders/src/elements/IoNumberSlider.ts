import { Register, ReactiveElement, Property, ReactiveElementProps, WithBinding } from '@io-gui/core'
import {ioNumber} from '@io-gui/inputs'
import {ioSlider} from './IoSlider.js'

export type IoNumberSliderProps = ReactiveElementProps & {
  value?: WithBinding<number>
  step?: WithBinding<number>
  min?: WithBinding<number>
  max?: WithBinding<number>
  exponent?: WithBinding<number>
  conversion?: WithBinding<number>
  disabled?: WithBinding<boolean>
}

/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 **/
@Register
export class IoNumberSlider extends ReactiveElement {

  static override get Style() {
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

  @Property({value: 0})
  declare value: number

  @Property(0.01)
  declare step: number

  @Property(0)
  declare min: number

  @Property(1)
  declare max: number

  @Property(1)
  declare exponent: number

  @Property(1)
  declare conversion: number

  @Property(false)
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
  override ready() {
    this.mutated()
  }
  override mutated() {
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