import { Register, IoElement, Change, ReactiveProperty, IoElementProps, VDOMElement, WithBinding, Property } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem } from './IoMenuItem.js';

export type SelectBy = 'value' | 'id';

export type IoOptionSelectProps = IoElementProps & {
  value?: WithBinding<any>,
  label?: string,
  selectBy?: SelectBy,
  options?: MenuOptions,
};

/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
@Register
export class IoOptionSelect extends IoElement {
  static vConstructor: (arg0?: IoOptionSelectProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: inline-block;
      text-align: center;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorDimmed);
      background-image: var(--io_gradientOutset);
      text-align: left;
    }
    :host > io-menu-item {
      margin: calc(-1 * var(--io_borderWidth));
      background-color: transparent !important;
      border-color: transparent !important;
    }
    :host > io-menu-item[selected] {
      color: var(--io_colorStrong);
    }
    `;
  }

  @ReactiveProperty({value: undefined})
  declare value: any;

  @ReactiveProperty('')
  declare label: string;

  // TODO: consider deprecating
  @ReactiveProperty('value')
  declare selectBy: SelectBy;

  @ReactiveProperty({type: MenuOptions, init: null})
  declare options: MenuOptions;

  @Property('button')
  declare role: string;

  declare $item: MenuItem;

  constructor(args: IoOptionSelectProps = {}) {
    super(args);
  }

  init() {
    this.$item = new MenuItem({value: this.value, mode: 'none', options: this.options});
  }

  // TODO: implement selecting by id
  _onSelectedChanged(event: CustomEvent) {
    if (this._disposed) return;
    this.inputValue(event.detail.value);
  }

  optionsChanged(change: Change) {
    if (change.oldValue) {
      change.oldValue.removeEventListener('selected-changed', this._onSelectedChanged);
    }
    if (change.value) {
      change.value.addEventListener('selected-changed', this._onSelectedChanged);
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

    this.render([ioMenuItem({item: this.$item, label: label, direction: 'down'})]);
  }
}
export const ioOptionSelect = IoOptionSelect.vConstructor;