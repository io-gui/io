import { Register, ReactiveElement, Change, Property, ReactiveElementProps, WithBinding, Field } from '@io-gui/core'
import { MenuOption } from '../nodes/MenuOption.js'
import { ioMenuItem } from './IoMenuItem.js'

export type SelectBy = 'value' | 'id'

export type IoOptionSelectProps = ReactiveElementProps & {
  option: MenuOption
  value?: WithBinding<any>
  label?: string
  icon?: string
  selectBy?: SelectBy
}

/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
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
    :host > io-menu-item {
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

  // TODO: consider deprecating
  @Property('value')
  declare selectBy: SelectBy

  @Property({type: MenuOption})
  declare option: MenuOption

  @Field('button')
  declare role: string

  constructor(args: IoOptionSelectProps) {
    super(args)
  }

  // TODO: Consider triggering inputValue() only by user-input!
  onOptionSelected(event: CustomEvent) {
    if (this._disposed) return
    if (this.selectBy === 'value') {
      this.inputValue(event.detail.option.value)
    } else if (this.selectBy === 'id') {
      this.inputValue(event.detail.option.id)
    }
  }
  inputValue(value: any) {
    if (this.value !== value || typeof this.value === 'object') {
      const oldValue = this.value
      this.setProperty('value', value)
      this.dispatch('value-input', {value: value, oldValue: oldValue}, false)
    }
  }
  optionChanged(change: Change) {
    if (change.oldValue) {
      (change.oldValue as MenuOption).removeEventListener('option-selected', this.onOptionSelected)
    }
    if (change.value) {
      (change.value as MenuOption).addEventListener('option-selected', this.onOptionSelected)
    }

    //TODO: Cleanup and test
    if (this.value === undefined) {
      const selectedID = this.option.selectedID
      const selectedItem = this.option.findItemById(selectedID)
      if (this.selectBy === 'value') {
        if (selectedItem) {
          this.value = selectedItem.value
        }
      } else if (this.selectBy === 'id') {
        if (selectedItem) {
          this.value = selectedItem.id
        }
      }
    }
  }
  optionMutated() {
    this.mutated()
  }
  override mutated() {
    let selectedItem
    let label = this.label
    if (this.selectBy === 'value') {
      selectedItem = this.option.findItemByValue(this.value)
      label = selectedItem ? selectedItem.label : String(this.value)
    } else if (this.selectBy === 'id') {
      selectedItem = this.option.findItemById(this.value)
      label = selectedItem ? selectedItem.label : String(this.value)
    }
    this.render([ioMenuItem({option: this.option, label: label, icon: this.icon, direction: 'down'})])
  }
}
export const ioOptionSelect = function(arg0: IoOptionSelectProps) {
  return IoOptionSelect.vConstructor(arg0)
}