import { Register, IoElement, Change, Property, IoElementProps, VDOMElement, WithBinding, Default } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem } from './IoMenuItem.js';

const dummyOptions = new MenuOptions();
// TODO: fix tab-out without collapse

export type IoOptionMenuProps = IoElementProps & {
  value?: WithBinding<any>,
  options?: MenuOptions,
  item?: MenuItem,
};

/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
@Register
export class IoOptionMenu extends IoElement {
  static vConstructor: (arg0?: IoOptionMenuProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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

  @Property({value: undefined, reflect: true})
  declare value: any;

  @Property({value: dummyOptions, type: MenuOptions, reflect: true})
  declare options: MenuOptions;

  @Property(MenuItem)
  declare item: MenuItem;

  @Default('button')
  declare role: string;

  constructor(args: IoOptionMenuProps = {}) { super(args); }

  _onLastChanged(event: CustomEvent) {
    if (this._disposed) return;
    this.inputValue(event.detail.value);
  }

  optionsChanged(change: Change) {
    if (change.oldValue && change.oldValue !== dummyOptions) {
      change.oldValue.removeEventListener('last-changed', this._onLastChanged);
    }
    if (change.value) {
      change.value.addEventListener('last-changed', this._onLastChanged);
    }
    const selectedItem = this.options.getItem(this.value);
    if (selectedItem) selectedItem.selected = true;
  }
  changed() {
    const selectedItem = this.options.getItem(this.value);

    // TODO: Implement id in menu items
    this.item = this.item || new MenuItem({value: this.value});
    this.item.label = selectedItem?.label || String(this.value);
    this.item.options = this.options;

    this.template([ioMenuItem({item: this.item, direction: 'down'})]);
  }
}
export const ioOptionMenu = IoOptionMenu.vConstructor;