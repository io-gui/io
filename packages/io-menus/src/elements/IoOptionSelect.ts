import { Register, IoElement, Change, ReactiveProperty, IoElementProps, WithBinding, Property } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem } from './IoMenuItem.js';

export type SelectBy = 'value' | 'id';

export type IoOptionSelectProps = IoElementProps & {
  value?: WithBinding<any>,
  label?: string,
  icon?: string,
  selectBy?: SelectBy,
  options?: MenuOptions,
};

/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
@Register
export class IoOptionSelect extends IoElement {
  static get Style() {
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
    `;
  }

  @ReactiveProperty({value: undefined})
  declare value: any;

  @ReactiveProperty('')
  declare label: string;

  @ReactiveProperty('')
  declare icon: string;

  // TODO: consider deprecating
  @ReactiveProperty('value')
  declare selectBy: SelectBy;

  @ReactiveProperty({type: MenuOptions})
  declare options: MenuOptions;

  @Property('button')
  declare role: string;

  declare $item: MenuItem;

  constructor(args: IoOptionSelectProps = {}) {
    super(args);
  }

  ready() {
    this.$item = new MenuItem({value: this.value, mode: 'none', options: this.options});
  }

  // TODO: implement selecting by id
  // TODO: Consider triggering this.inputValue() only by user-input!
  _onItemSelected(event: CustomEvent) {
    if (this._disposed) return;
    this.inputValue(event.detail.item.value);
  }
  inputValue(value: any) {
    if (this.value !== value || typeof this.value === 'object') {
      const oldValue = this.value;
      this.setProperty('value', value);
      this.dispatch('value-input', {value: value, oldValue: oldValue}, false);
    }
  }

  optionsChanged(change: Change) {
    if (change.oldValue) {
      change.oldValue.removeEventListener('item-selected', this._onItemSelected);
    }
    if (change.value) {
      change.value.addEventListener('item-selected', this._onItemSelected);
    }
    this.$item.options = this.options;
  }
  optionsMutated() {
    this.changed();
  }
  changed() {
    this.debounce(this.onChange);
  }
  onChange() {
    let selectedItem;
    if (this.selectBy === 'value') {
      selectedItem = this.options.findItemByValue(this.value);
    } else if (this.selectBy === 'id') {
      selectedItem = this.options.findItemById(this.value);
    }
    if (selectedItem) selectedItem.selected = true;
    const label = selectedItem ? selectedItem.label : this.label || String(this.value);
    this.render([ioMenuItem({item: this.$item, label: label, icon: this.icon, direction: 'down'})]);
  }
}
export const ioOptionSelect = function(arg0?: IoOptionSelectProps) {
  return IoOptionSelect.vConstructor(arg0);
};