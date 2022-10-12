var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Options } from '../../models/options.js';
import { Item } from '../../models/item.js';
import './menu-item.js';
// TODO: fix tab-out without collapse
/*
 * Extends `IoMenuItem`
 *
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
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
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
    static get Properties() {
        return {
            value: {
                reflect: 'attr',
            },
            options: {
                type: Options,
                reflect: 'attr'
            },
            role: 'button',
        };
    }
    get _label() {
        const valueText = (this.value !== undefined) ? String(this.value) : '';
        return this.label || valueText || '';
    }
    _onPathChanged(event) {
        // TODO: Fix Path convering values to string type.
        if (event.detail.leaf !== undefined) {
            try {
                this.inputValue(JSON.parse(event.detail.leaf));
            }
            catch (error) {
                this.inputValue(event.detail.leaf);
            }
        }
    }
    changed() {
        let valueText = '';
        if (this.options.length) {
            const option = this.options.find((option) => { return option.value === this.value; });
            if (option) {
                if (option.label) {
                    valueText = option.label;
                }
                else if (typeof option.value === 'object') {
                    valueText = `${option.value.constructor.name}` + (option.value instanceof Array ? `(${option.value.length})` : '');
                }
                else {
                    valueText = String(option.value);
                }
            }
        }
        if (!valueText)
            valueText = this._label;
        if (this.icon) {
            valueText = this.icon + '  ' + valueText;
        }
        // TODO: Clean up binding of value to menu model.
        this.options.setSelectedPath([this.value]);
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            if (option.value === this.value) {
                option.selected = true;
            }
        }
        const option = new Item({
            label: valueText,
            options: this.options,
            // TODO: this causes _onPathChanged to trigger initially
            'on-path-changed': this._onPathChanged,
        });
        this.template([
            ['io-menu-item', {
                    option: option,
                    direction: 'bottom',
                }]
        ]);
    }
};
IoOptionMenu = __decorate([
    RegisterIoElement
], IoOptionMenu);
export { IoOptionMenu };
//# sourceMappingURL=option-menu.js.map