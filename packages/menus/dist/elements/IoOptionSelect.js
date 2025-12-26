var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property } from 'io-core';
import { MenuOption } from '../nodes/MenuOption.js';
import { ioMenuItem } from './IoMenuItem.js';
/**
 * Option select element. Similar to `IoMenuItem`, except it is displayed as a button and uses `options` property instead of ~~`option.options`~~  and it is `selectable` by default. It displays selected `value` or `label` followed by the `â–¾` character.
 * When clicked or activated by space/enter key, it expands a menu with selectable options.
 **/
let IoOptionSelect = class IoOptionSelect extends IoElement {
    static get Style() {
        return /* css */ `
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
    constructor(args) {
        super(args);
    }
    // TODO: Consider triggering inputValue() only by user-input!
    onOptionSelected(event) {
        if (this._disposed)
            return;
        if (this.selectBy === 'value') {
            this.inputValue(event.detail.option.value);
        }
        else if (this.selectBy === 'id') {
            this.inputValue(event.detail.option.id);
        }
    }
    inputValue(value) {
        if (this.value !== value || typeof this.value === 'object') {
            const oldValue = this.value;
            this.setProperty('value', value);
            this.dispatch('value-input', { value: value, oldValue: oldValue }, false);
        }
    }
    optionChanged(change) {
        if (change.oldValue) {
            change.oldValue.removeEventListener('option-selected', this.onOptionSelected);
        }
        if (change.value) {
            change.value.addEventListener('option-selected', this.onOptionSelected);
        }
    }
    changed() {
        let selectedItem;
        if (this.selectBy === 'value') {
            selectedItem = this.option.findItemByValue(this.value);
        }
        else if (this.selectBy === 'id') {
            selectedItem = this.option.findItemById(this.value);
        }
        const label = selectedItem ? selectedItem.label : this.label || String(this.value);
        this.render([ioMenuItem({ option: this.option, label: label, icon: this.icon, direction: 'down' })]);
    }
};
__decorate([
    ReactiveProperty({ value: undefined })
], IoOptionSelect.prototype, "value", void 0);
__decorate([
    ReactiveProperty('')
], IoOptionSelect.prototype, "label", void 0);
__decorate([
    ReactiveProperty('')
], IoOptionSelect.prototype, "icon", void 0);
__decorate([
    ReactiveProperty('value')
], IoOptionSelect.prototype, "selectBy", void 0);
__decorate([
    ReactiveProperty({ type: MenuOption })
], IoOptionSelect.prototype, "option", void 0);
__decorate([
    Property('button')
], IoOptionSelect.prototype, "role", void 0);
IoOptionSelect = __decorate([
    Register
], IoOptionSelect);
export { IoOptionSelect };
export const ioOptionSelect = function (arg0) {
    return IoOptionSelect.vConstructor(arg0);
};
//# sourceMappingURL=IoOptionSelect.js.map