var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Option_1;
import { ReactiveObject, Register, Property, NodeArray } from '@io-gui/core';
/**
 * One node of a Menu's tree. Carries local state only (id, value, label, icon,
 * hint, mode, action, selected, child options) — tree-scoped state (selection
 * tracking, disclosure, serialization entry point) belongs on `Menu`.
 *
 * The `select`-mode children of any one Option form a selection scope: at most
 * one of them is selected, enforced here by the parent.
 */
let Option = Option_1 = class Option extends ReactiveObject {
    static get Listeners() {
        return {
            // Internal scope-enforcement traffic — not public API.
            'option-selected-changed': 'onOptionSelectedChanged',
        };
    }
    constructor(args) {
        super();
        this.applyJSON(args);
        // `action` and `selected` are props-only — never part of the wire format.
        if (!!args && typeof args === 'object') {
            if (typeof args.action === 'function') {
                // An Option with an action is a transient command unless told otherwise.
                if (args.mode === undefined) {
                    this.setProperty('mode', 'none', true);
                }
                this.setProperty('action', args.action, true);
            }
            if (args.selected !== undefined) {
                this.setProperty('selected', args.selected, true);
            }
            this.dispatchQueue();
        }
    }
    getAllOptions() {
        const options = [this];
        for (let i = 0; i < this.options.length; i++) {
            options.push(...this.options[i].getAllOptions());
        }
        return options;
    }
    findOptionByValue(value) {
        for (let i = 0; i < this.options.length; i++) {
            const found = this.options[i].findOptionByValue(value);
            if (found)
                return found;
        }
        if (this.value === value)
            return this;
    }
    findOptionById(id) {
        for (let i = 0; i < this.options.length; i++) {
            const found = this.options[i].findOptionById(id);
            if (found)
                return found;
        }
        if (this.id === id)
            return this;
    }
    selectDefault() {
        let walker = this.mode === 'select' ? this : undefined;
        while (walker) {
            const next = walker.options.find(option => option.mode === 'select');
            if (walker.mode === 'select' && next) {
                walker = next;
            }
            else {
                break;
            }
        }
        if (walker)
            walker.selected = true;
    }
    selectedChanged() {
        if (this.selected === false) {
            this.unselectSuboptions();
        }
        this.dispatch('option-selected-changed', { option: this }, true);
    }
    // Derived: the id of this scope's selected child ('' when none).
    getSelectedIDImmediate() {
        let selected = '';
        for (let i = 0; i < this.options.length; i++) {
            const item = this.options[i];
            if (item.selected && item.mode === 'select') {
                selected = item.id;
                break;
            }
        }
        return selected;
    }
    findSelectedImmediateOption() {
        const selectedIDImmediate = this.getSelectedIDImmediate();
        return this.options.find(option => option.mode === 'select' && option.selected && option.id === selectedIDImmediate);
    }
    // Derived: the chain of selected options from this scope downwards.
    getSelectedChain() {
        const chain = [];
        let walker = this.findSelectedImmediateOption();
        while (walker) {
            chain.push(walker);
            walker = walker.findSelectedImmediateOption();
        }
        return chain;
    }
    onOptionSelectedChanged(event) {
        // TODO: Instead of this check, use event.stopPropagation() once implemented in EventDispatcher.
        if (this.options.indexOf(event.detail.option) === -1)
            return;
        if (event.detail.option === this)
            return;
        const selectedOption = event.detail.option;
        if (selectedOption.selected) {
            for (let i = 0; i < this.options.length; i++) {
                const option = this.options[i];
                if (option !== selectedOption && option.mode === 'select' && selectedOption.mode === 'select') {
                    option.selected = false;
                }
            }
        }
    }
    unselectSuboptions() {
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            if (option.mode === 'select') {
                option.selected = false;
                option.unselectSuboptions();
            }
        }
    }
    optionsMutated() {
        const selectedOptions = this.options.filter(option => option.mode === 'select' && option.selected);
        for (let i = 1; i < selectedOptions.length; i++) {
            debug: console.warn('Duplicate selected options with mode "select" found!', selectedOptions);
            selectedOptions[i].selected = false;
        }
        const hasSelected = this.options.some(option => option.selected && option.mode === 'select');
        if (this.mode === 'select' && hasSelected && this.options.length) {
            this.setProperty('selected', true);
        }
        this.dispatchMutation();
    }
    mutated() {
        debug: {
            if (this.icon !== '' && this.icon.indexOf(':') === -1) {
                console.warn(`Option icon "${this.icon}" must contain a colon — it is the Iconset selector!`, this);
            }
            if (['select', 'toggle', 'none'].indexOf(this.mode) === -1) {
                console.warn(`Unknown "mode" property "${this.mode}"!`, this);
            }
            if (this.selected && ['select', 'toggle'].indexOf(this.mode) === -1) {
                console.warn('"selected" property is only valid when mode is "select" or "toggle"!', this);
            }
            if (this.action && typeof this.action !== 'function') {
                console.warn(`Invalid type "${typeof this.action}" of "action" property!`, this);
            }
            if (this.id.indexOf(',') !== -1) {
                console.warn(`Option id "${this.id}" may not contain a comma — it is the Path separator!`);
            }
        }
    }
    // Structure only — selection is not part of an Option's serialized form.
    toJSON() {
        const json = {
            id: this.id,
            value: this.value,
            label: this.label,
            icon: this.icon,
            hint: this.hint,
            disabled: this.disabled,
            hidden: this.hidden,
            mode: this.mode,
            options: this.options.map(option => option.toJSON()),
        };
        if (json.value === json.id)
            delete json.value;
        if (json.label === json.id)
            delete json.label;
        if (json.id === '')
            delete json.id;
        if (json.icon === '')
            delete json.icon;
        if (json.hint === '')
            delete json.hint;
        if (json.disabled === false)
            delete json.disabled;
        if (json.hidden === false)
            delete json.hidden;
        if (json.mode === 'select')
            delete json.mode;
        return json;
    }
    applyJSON(json) {
        if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean' || json === null) {
            json = { id: String(json), value: json };
        }
        if (json.id === undefined)
            json.id = '';
        this.setProperties({
            id: json.id,
            // Default value to id only when absent — null/false are valid payloads.
            value: json.value !== undefined ? json.value : json.id,
            label: json.label ?? json.id,
            icon: json.icon ?? '',
            hint: json.hint ?? '',
            disabled: json.disabled ?? false,
            hidden: json.hidden ?? false,
            mode: json.mode ?? 'select',
            options: json.options?.map(option => (option instanceof Option_1) ? option : new Option_1(option)) ?? [],
            // action: N/A for serialization
            // selected: N/A for serialization
        });
        return this;
    }
};
__decorate([
    Property({ value: '', type: String })
], Option.prototype, "id", void 0);
__decorate([
    Property({ value: undefined })
], Option.prototype, "value", void 0);
__decorate([
    Property({ value: '', type: String })
], Option.prototype, "label", void 0);
__decorate([
    Property({ value: '', type: String })
], Option.prototype, "icon", void 0);
__decorate([
    Property({ value: '', type: String })
], Option.prototype, "hint", void 0);
__decorate([
    Property({ value: false, type: Boolean })
], Option.prototype, "disabled", void 0);
__decorate([
    Property({ value: false, type: Boolean })
], Option.prototype, "hidden", void 0);
__decorate([
    Property({ value: 'select', type: String })
], Option.prototype, "mode", void 0);
__decorate([
    Property({ type: NodeArray, init: 'this' })
], Option.prototype, "options", void 0);
__decorate([
    Property()
], Option.prototype, "action", void 0);
__decorate([
    Property({ value: false, type: Boolean })
], Option.prototype, "selected", void 0);
Option = Option_1 = __decorate([
    Register
], Option);
export { Option };
