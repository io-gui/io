var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, Field } from '@io-gui/core';
import { Menu } from '../models/Menu.js';
import { ioOption } from './IoOption.js';
/**
 * Entry point that presents a Menu as a dropdown button. It displays the selected option's label
 * followed by the `▾` character and expands the menu when clicked or activated by space/enter key.
 *
 * `value` is payload, not identity: it mirrors the selected Option's `value`. Writing `value`
 * matches it to an Option at this boundary and selects that Option by its id.
 **/
let IoOptionSelect = class IoOptionSelect extends ReactiveElement {
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
    :host > io-option {
      margin: calc(-1 * var(--io_borderWidth));
      background-color: transparent !important;
      border-color: transparent !important;
    }
    `;
    }
    constructor(args) {
        super(args);
    }
    onSelectedIDChanged() {
        if (this._disposed)
            return;
        const selectedOption = this.model.findOptionById(this.model.selectedID);
        if (selectedOption && selectedOption !== this.model) {
            this.inputValue(selectedOption.value);
        }
    }
    inputValue(value) {
        if (this.value !== value || typeof this.value === 'object') {
            const oldValue = this.value;
            this.setProperty('value', value);
            this.dispatch('value-input', { value: value, oldValue: oldValue }, false);
        }
    }
    valueChanged() {
        if (this.value === undefined)
            return;
        // Boundary value→Option matching: resolve the app-bound value to an Option and select it by id.
        const option = this.model?.findOptionByValue(this.value);
        if (option && option !== this.model && !option.selected) {
            option.selected = true;
        }
    }
    modelChanged(change) {
        if (change.oldValue) {
            change.oldValue.removeEventListener('selectedID-changed', this.onSelectedIDChanged);
        }
        if (change.value) {
            change.value.addEventListener('selectedID-changed', this.onSelectedIDChanged);
        }
        if (this.value === undefined) {
            const selectedOption = this.model.findOptionById(this.model.selectedID);
            if (selectedOption && selectedOption !== this.model) {
                this.value = selectedOption.value;
            }
        }
        else {
            this.valueChanged();
        }
    }
    modelMutated() {
        this.mutated();
    }
    mutated() {
        let label = this.label;
        if (!label) {
            const selectedOption = this.model.findOptionById(this.model.selectedID);
            const valueOption = selectedOption && selectedOption !== this.model ? selectedOption : this.model.findOptionByValue(this.value);
            label = valueOption && valueOption !== this.model ? valueOption.label : String(this.value);
        }
        this.render([ioOption({ model: this.model, label: label, icon: this.icon, direction: 'down' })]);
    }
};
__decorate([
    Property({ value: undefined })
], IoOptionSelect.prototype, "value", void 0);
__decorate([
    Property('')
], IoOptionSelect.prototype, "label", void 0);
__decorate([
    Property('')
], IoOptionSelect.prototype, "icon", void 0);
__decorate([
    Property({ type: Menu })
], IoOptionSelect.prototype, "model", void 0);
__decorate([
    Field('button')
], IoOptionSelect.prototype, "role", void 0);
IoOptionSelect = __decorate([
    Register
], IoOptionSelect);
export { IoOptionSelect };
export const ioOptionSelect = function (arg0) {
    return IoOptionSelect.vConstructor(arg0);
};
