import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Change } from '../../core/internals/changeQueue.js';
import { MenuOptions } from './models/menu-options.js';
import { MenuItem } from './models/menu-item.js';
import { Property } from '../../core/internals/property.js';
import './io-menu-item.js';

// TODO: fix tab-out without collapse

/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 *
 * <io-element-demo element="io-option-menu" properties='{
 *   "label": "",
 *   "value": 0,
 *   "options": [1,2,3]}
 * ' config='{"type:object": ["io-properties"]}'></io-element-demo>
 *
 * <io-element-demo element="io-option-menu" properties='{
 *   "label": "",
 *   "value": 0,
 *   "options": [
 *     {"value": 0, "label": "zero"},
 *     {"value": 1, "label": "one"},
 *     {"value": 2, "label": "two"},
 *     {"value": 3, "label": "three"}
 *   ]
 * }' config='{"type:object": ["io-properties"]}'></io-element-demo>
 *
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
@RegisterIoElement
export class IoOptionMenu extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: inline-block;
      text-align: center;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-border-color-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-outset);
      /* padding-left: calc(2 * var(--io-spacing)); */
      /* padding-right: calc(2 * var(--io-spacing)); */
      text-align: left;
    }
    :host > io-menu-item {
      margin: calc(-1 * var(--io-border-width));
      background-color: transparent !important;
      border-color: transparent !important;
    }
    :host > io-menu-item[selected] {
      color: var(--io-color);
    }
    `;
  }

  @Property({value: undefined, reflect: true})
  declare value: any;

  @Property({observe: true, type: MenuOptions, reflect: true})
  declare options: MenuOptions;

  @Property('button')
  declare role: string;

  private _item: MenuItem | undefined;

  _onLeafChanged(event: CustomEvent) {
    this.inputValue(event.detail.value);
  }

  optionsChanged(change: Change) {
    if (change.oldValue) {
      change.oldValue.removeEventListener('leaf-changed', this._onLeafChanged);
    }
    if (change.value) {
      change.value.addEventListener('leaf-changed', this._onLeafChanged);
    }
    const selectedItem = this.options.getItem(this.value);
    if (selectedItem) selectedItem.selected = true;
  }
  changed() {
    const selectedItem = this.options.getItem(this.value);

    this._item = this._item || new MenuItem({});
    this._item.label = selectedItem?.label || String(this.value);
    this._item.options = this.options;
    this._item.icon = this.icon || '';

    this.template([['io-menu-item', {item: this._item, direction: 'down'}]]);
  }
}
