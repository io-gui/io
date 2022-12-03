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
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-outset);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
      text-align: left;
    }
    :host > io-menu-item {
      margin: calc(-1 * var(--io-border-width));
      /* background-color: transparent !important; */
      /* border-color: transparent !important; */
    }
    :host > io-menu-item[selected] {
      color: var(--io-color);
    }
    `;
  }

  @Property({value: undefined, reflect: 'attr'})
  declare value: any;

  @Property({type: MenuOptions, reflect: 'attr'})
  declare options: MenuOptions;

  @Property('button')
  declare role: string;

  private _item: MenuItem | undefined;

  get _label() {
    const valueText = (this.value !== undefined) ? String(this.value) : '';
    return this.label || valueText || '';
  }
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

    // TODO: find label deeper in options
    let valueText = '';
    if (this.options.length) {
      const option = this.options.find((option: MenuItem) => {return option.value === this.value;});
      if (option) {
        if (option.label) {
          valueText = option.label;
        } else if (typeof option.value === 'object') {
          valueText = `${option.value.constructor.name}` + (option.value instanceof Array ? `(${option.value.length})` : '');
        } else {
          valueText = String(option.value);
        }
      }
    }
    if (!valueText) valueText = this._label;
    if (this.icon) {
      valueText = this.icon + '  ' + valueText;
    }
    this._item = new MenuItem({label: valueText, options: this.options});
  }
  changed() {
    this.template([['io-menu-item', {item: this._item, direction: 'down'}]]);
  }
}
