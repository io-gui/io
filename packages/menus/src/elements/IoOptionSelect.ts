import { Register, ReactiveElement, Change, Property, ReactiveElementProps, WithBinding, Field } from '@io-gui/core'
import { Menu } from '../models/Menu.js'
import { ioOption } from './IoOption.js'

export type IoOptionSelectProps = ReactiveElementProps & {
  model?: Menu
  value?: WithBinding<any>
  label?: string
  icon?: string
}

/**
 * Entry point that presents a Menu as a dropdown button. It displays the selected option's label
 * followed by the `▾` character and expands the menu when clicked or activated by space/enter key.
 *
 * `value` is payload, not identity: it mirrors the selected Option's `value`. Writing `value`
 * matches it to an Option at this boundary and selects that Option by its id.
 **/
@Register
export class IoOptionSelect extends ReactiveElement {
  static override get Style() {
    return /* css */`
    :host {
      display: inline-block;
      text-align: center;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      background-image: var(--io_gradientOutset);
      text-align: left;
    }
    :host > io-option {
      margin: calc(-1 * var(--io_borderWidth));
      background-color: transparent !important;
      border-color: transparent !important;
    }
    `
  }

  @Property({value: undefined})
  declare value: any

  @Property('')
  declare label: string

  @Property('')
  declare icon: string

  @Property({type: Menu})
  declare model: Menu

  @Field('button')
  declare role: string

  constructor(args: IoOptionSelectProps) {
    super(args)
  }

  onSelectedIDChanged() {
    if (this._disposed) return
    const selectedOption = this.model.findOptionById(this.model.selectedID)
    if (selectedOption && selectedOption !== this.model) {
      this.inputValue(selectedOption.value)
    }
  }
  inputValue(value: any) {
    if (this.value !== value || typeof this.value === 'object') {
      const oldValue = this.value
      this.setProperty('value', value)
      this.dispatch('value-input', {value: value, oldValue: oldValue}, false)
    }
  }
  valueChanged() {
    if (this.value === undefined) return
    // Boundary value→Option matching: resolve the app-bound value to an Option and select it by id.
    const option = this.model?.findOptionByValue(this.value)
    if (option && option !== this.model && !option.selected) {
      option.selected = true
    }
  }
  modelChanged(change: Change) {
    if (change.oldValue) {
      (change.oldValue as Menu).removeEventListener('selectedID-changed', this.onSelectedIDChanged)
    }
    if (change.value) {
      (change.value as Menu).addEventListener('selectedID-changed', this.onSelectedIDChanged)
    }
    if (this.value === undefined) {
      const selectedOption = this.model.findOptionById(this.model.selectedID)
      if (selectedOption && selectedOption !== this.model) {
        this.value = selectedOption.value
      }
    } else {
      this.valueChanged()
    }
  }
  modelMutated() {
    this.mutated()
  }
  override mutated() {
    let label = this.label
    if (!label) {
      const selectedOption = this.model.findOptionById(this.model.selectedID)
      const valueOption = selectedOption && selectedOption !== this.model ? selectedOption : this.model.findOptionByValue(this.value)
      label = valueOption && valueOption !== this.model ? valueOption.label : String(this.value)
    }
    this.render([ioOption({model: this.model, label: label, icon: this.icon, direction: 'down'})])
  }
}
export const ioOptionSelect = function(arg0: IoOptionSelectProps) {
  return IoOptionSelect.vConstructor(arg0)
}
