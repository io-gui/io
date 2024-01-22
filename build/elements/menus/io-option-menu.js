var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
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
let IoOptionMenu = class IoOptionMenu extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: inline-block;
      text-align: center;
      border-radius: var(--iotBorderRadius);
      border: var(--iotBorder);
      border-color: var(--iotBorderColorOutset);
      background-color: var(--iotBackgroundColorDimmed);
      background-image: var(--iotGradientOutset);
      /* padding-left: calc(2 * var(--iotSpacing)); */
      /* padding-right: calc(2 * var(--iotSpacing)); */
      text-align: left;
    }
    :host > io-menu-item {
      margin: calc(-1 * var(--iotBorderWidth));
      background-color: transparent !important;
      border-color: transparent !important;
    }
    :host > io-menu-item[selected] {
      color: var(--iotColor);
    }
    `;
    }
    _item;
    _onLeafChanged(event) {
        this.inputValue(event.detail.value);
    }
    optionsChanged(change) {
        if (change.oldValue) {
            change.oldValue.removeEventListener('last-changed', this._onLeafChanged);
        }
        if (change.value) {
            change.value.addEventListener('last-changed', this._onLeafChanged);
        }
        const selectedItem = this.options.getItem(this.value);
        if (selectedItem)
            selectedItem.selected = true;
    }
    changed() {
        const selectedItem = this.options.getItem(this.value);
        this._item = this._item || new MenuItem({});
        this._item.label = selectedItem?.label || String(this.value);
        this._item.options = this.options;
        this._item.icon = this.icon || '';
        this.template([['io-menu-item', { item: this._item, direction: 'down' }]]);
    }
};
__decorate([
    Property({ value: undefined, reflect: true })
], IoOptionMenu.prototype, "value", void 0);
__decorate([
    Property({ observe: true, type: MenuOptions, reflect: true })
], IoOptionMenu.prototype, "options", void 0);
__decorate([
    Property('button')
], IoOptionMenu.prototype, "role", void 0);
IoOptionMenu = __decorate([
    Register
], IoOptionMenu);
export { IoOptionMenu };
//# sourceMappingURL=io-option-menu.js.map