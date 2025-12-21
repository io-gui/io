var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MenuOption_1;
import { Node, Register, ReactiveProperty, NodeArray } from 'io-core';
let MenuOption = MenuOption_1 = class MenuOption extends Node {
    static get Listeners() {
        return {
            'option-selected-changed': 'onOptionSelectedChanged',
        };
    }
    constructor(args) {
        if (typeof args === 'string' || typeof args === 'number' || typeof args === 'boolean' || args === null || args === undefined) {
            args = {
                id: String(args),
                value: args,
            };
        }
        args = { ...args };
        args.id = args.id ?? 'null'; // TODO: Reconsider.
        args.label = args.label ?? args.id;
        args.value = args.value ?? args.id;
        args.options = args.options ?? [];
        args.options = args.options.map(option => (option instanceof MenuOption_1) ? option : new MenuOption_1(option));
        const hardenedOptions = args.options;
        const selectedOptions = hardenedOptions.filter(option => option.mode === 'select' && option.selected);
        for (let i = 1; i < selectedOptions.length; i++) {
            debug: console.warn('Duplicate selected options with mode "select" found!', selectedOptions);
            selectedOptions[i].selected = false;
        }
        super(args);
    }
    getAllOptions() {
        const options = [this];
        for (let i = 0; i < this.options.length; i++) {
            options.push(...this.options[i].getAllOptions());
        }
        debug: {
            const ids = new Set();
            for (let i = 0; i < options.length; i++) {
                if (ids.has(options[i].id))
                    console.warn(`Duplicate id "${options[i].id}"`, this);
                ids.add(options[i].id);
            }
        }
        return options;
    }
    findItemByValue(value) {
        const allItems = this.getAllOptions();
        for (let i = 0; i < allItems.length; i++) {
            if (allItems[i].value === value)
                return allItems[i];
        }
        return null;
    }
    findItemById(id) {
        const allItems = this.getAllOptions();
        for (let i = 0; i < allItems.length; i++) {
            if (allItems[i].id === id)
                return allItems[i];
        }
        return null;
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
    selectedIDChanged() {
        const option = this.findItemById(this.selectedID);
        if (option) {
            option.selected = true;
            this.dispatch('option-selected', { option: option }, false);
        }
    }
    selectedIDImmediateChanged() {
        if (this.selectedIDImmediate) {
            this.selected = true;
            const option = this.options.find(option => option.id === this.selectedIDImmediate);
            if (option)
                option.selected = true;
        }
        this.updatePaths();
    }
    getSelectedIDImmediate() {
        let selected = '';
        for (let i = 0; i < this.options.length; i++) {
            const item = this.options[i];
            if (item.selected && item.id && item.mode === 'select') {
                selected = item.id;
                break;
            }
        }
        return selected;
    }
    setSelectedIDImmediate(id) {
        // TODO Test and reconsider withInternalOperation
        this.options.withInternalOperation(() => {
            for (let i = 0; i < this.options.length; i++) {
                const item = this.options[i];
                if (item.id === id) {
                    item.selected = true;
                }
                else {
                    item.selected = false;
                }
            }
        });
        this.options.dispatchMutation();
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
        const hasSelected = this.options.some(option => option.selected && option.mode === 'select');
        if (hasSelected) {
            // this.updatePaths();
        }
        else {
            this.setProperties({
                selectedID: '',
                selectedIDImmediate: '',
                path: '',
            });
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
    updatePaths() {
        const path = [];
        if (this.mode !== 'select' || !this.selected) {
            this.path = '';
            return;
        }
        let selectedIDImmediate = this.getSelectedIDImmediate();
        let walker = selectedIDImmediate ? this.options.find(option => option.mode === 'select' && option.selected && option.id === selectedIDImmediate) : undefined;
        if (!walker)
            return;
        while (walker) {
            path.push(walker.id);
            selectedIDImmediate = walker.getSelectedIDImmediate();
            walker = selectedIDImmediate ? walker.options.find(option => option.mode === 'select' && option.selected && option.id === selectedIDImmediate) : undefined;
        }
        this.path = path.join(',');
    }
    pathChanged() {
        const path = this.path ? [...this.path.split(',')] : [];
        if (path.length)
            this.selectedID = path[path.length - 1];
    }
    optionsMutated(event) {
        // console.log('optionsMutated', this.id, this.options.length);
        const selectedIDImmediate = this.getSelectedIDImmediate();
        if (this.mode === 'select' && selectedIDImmediate && this.options.length) {
            this.setProperties({
                // selected: !!selectedIDImmediate,
                selectedIDImmediate: selectedIDImmediate,
            });
        }
        this.updatePaths();
        this.dispatchMutation();
    }
    toJSON() {
        return {
            id: this.id,
            value: this.value,
            label: this.label,
            icon: this.icon,
            hint: this.hint,
            disabled: this.disabled,
            // action: N/A for serialization
            mode: this.mode,
            options: this.options.map(option => option.toJSON()),
        };
    }
    fromJSON(json) {
        this.setProperties({
            id: json.id,
            value: json.value ?? undefined,
            label: json.label ?? json.id,
            icon: json.icon ?? '',
            hint: json.hint ?? '',
            disabled: json.disabled ?? false,
            // action: N/A for serialization
            mode: json.mode ?? 'select',
            selected: json.selected ?? false,
            options: json.options?.map(option => new MenuOption_1(option)) ?? [],
        });
        return this;
    }
    changed() {
        debug: {
            if (['select', 'toggle', 'none'].indexOf(this.mode) === -1) {
                console.warn(`Unknown "mode" property "${this.mode}"!`, this);
            }
            if (this.selected && ['select', 'toggle'].indexOf(this.mode) === -1) {
                console.warn('"selected" property is only valid when mode is "select" or "toggle"!', this);
            }
            if (!this.id) {
                console.warn('"id" property is required!', this);
            }
            if (this.action && typeof this.action !== 'function') {
                console.warn(`Invalid type "${typeof this.action}" of "action" property!`, this);
            }
        }
    }
    dispose() {
        this.options.length = 0; // TODO: test magic!
        super.dispose();
    }
};
__decorate([
    ReactiveProperty({ value: '', type: String })
], MenuOption.prototype, "id", void 0);
__decorate([
    ReactiveProperty({ value: undefined })
], MenuOption.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], MenuOption.prototype, "label", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], MenuOption.prototype, "icon", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], MenuOption.prototype, "hint", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean })
], MenuOption.prototype, "disabled", void 0);
__decorate([
    ReactiveProperty()
], MenuOption.prototype, "action", void 0);
__decorate([
    ReactiveProperty({ value: 'select', type: String })
], MenuOption.prototype, "mode", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean })
], MenuOption.prototype, "selected", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], MenuOption.prototype, "selectedIDImmediate", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], MenuOption.prototype, "selectedID", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], MenuOption.prototype, "path", void 0);
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], MenuOption.prototype, "options", void 0);
MenuOption = MenuOption_1 = __decorate([
    Register
], MenuOption);
export { MenuOption };
//# sourceMappingURL=MenuOption.js.map