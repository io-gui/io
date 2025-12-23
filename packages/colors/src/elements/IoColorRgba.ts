import { Register } from 'io-core'
import { ioNumber } from 'io-inputs'
import { IoColorBase, IoColorBaseProps } from './IoColorBase.js'
import { ioColorPicker } from './IoColorPicker.js'

/**
 * Input element for color displayed as vector and an interactive picker.
 **/
@Register
export class IoColorRgba extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 0 1 auto;
      }
      :host > io-number {
        flex: 1 0 0;
      }
      :host > io-number#r {
        border-bottom-color: var(--io_bgColorRed);
      }
      :host > io-number#g {
        border-bottom-color: var(--io_bgColorGreen);
      }
      :host > io-number#b {
        border-bottom-color: var(--io_bgColorBlue);
      }
      :host > io-number#a {
        border-bottom-color: var(--io_color);
      }
      :host > io-color-picker {
        flex-shrink: 0;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
    `
  }

  _onNumberValueInput(event: CustomEvent) {
    event.stopPropagation()
    const item = event.composedPath()[0] as HTMLElement
    if (['r', 'g', 'b'].includes(item.id)) {
      this.value[item.id as keyof typeof this.value] = event.detail.value
    }
    this.dispatch('value-input', {property: 'value', value: this.value}, false)
  }

  changed() {
    this.render([
      // Consider removing global id collisions.
      ioNumber({id: 'r', value: this.value.r, min: 0, max: 1, step: 0.001, ladder: true, '@value-input': this._onNumberValueInput}),
      ioNumber({id: 'g', value: this.value.g, min: 0, max: 1, step: 0.001, ladder: true, '@value-input': this._onNumberValueInput}),
      ioNumber({id: 'b', value: this.value.b, min: 0, max: 1, step: 0.001, ladder: true, '@value-input': this._onNumberValueInput}),
      this.value.a !== undefined
        ? ioNumber({id: 'a', value: this.value.a, min: 0, max: 1, step: 0.0001, ladder: true, '@value-input': this._onNumberValueInput})
        : null,
      ioColorPicker({id: 'swatch', value: this.value, '@value-input': this._onNumberValueInput}),
    ])
  }
}
export const ioColorRgba = function(arg0?: IoColorBaseProps) {
  return IoColorRgba.vConstructor(arg0)
}
