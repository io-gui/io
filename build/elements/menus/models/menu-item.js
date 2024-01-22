var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoNode, Register } from '../../../core/node.js';
import { Property } from '../../../core/internals/property.js';
import { MenuOptions } from './menu-options.js';
// TODO: documentation!
let MenuItem = class MenuItem extends IoNode {
    get hasmore() {
        return !!(this.options?.length);
    }
    getSubitem(value) {
        return this.options?.getItem(value);
    }
    constructor(args) {
        const item = {
            value: '',
            label: '',
        };
        if (typeof args !== 'object' || args === null) {
            item.value = args;
            item.label = String(args);
        }
        else {
            item.value = args.value;
            if (args.label === undefined) {
                if (typeof item.value === 'object') {
                    if (item.value === null) {
                        item.label = 'null';
                    }
                    else {
                        item.label = `${item.value.constructor.name}` + (item.value instanceof Array ? `(${item.value.length})` : '');
                    }
                }
                else {
                    item.label = String(item.value);
                }
            }
            else {
                item.label = args.label;
            }
            if (args.icon !== undefined)
                item.icon = args.icon;
            if (args.hint !== undefined)
                item.hint = args.hint;
            if (args.hidden !== undefined)
                item.hidden = args.hidden;
            if (args.disabled !== undefined)
                item.disabled = args.disabled;
            if (args.action !== undefined)
                item.action = args.action;
            if (args.mode !== undefined)
                item.mode = args.mode;
            if (args.selected !== undefined)
                item.selected = args.selected;
            if (args.options !== undefined) {
                if (args.options instanceof MenuOptions) {
                    item.options = args.options;
                }
                else {
                    item.options = new MenuOptions(args.options);
                }
            }
            if (item.selected === undefined && (args.mode === 'select' || args.mode === undefined) && item.options) {
                item.selected = !!item.options.find((item) => item.selected && item.mode === 'select');
            }
        }
        debug: {
            if (item.mode && (item.mode === 'toggle') && item.options) {
                console.warn('MenuItem: cannot have suboptions when `mode === "toggle"`');
            }
            if (item.mode && (item.mode === 'scroll') && item.options) {
                console.warn('MenuItem: cannot have suboptions when `mode === "scroll"`');
            }
            if (item.mode && ['select', 'toggle', 'scroll', 'link', 'none'].indexOf(item.mode) === -1) {
                console.warn('MenuItem: unknown `mode` property!', item.mode);
            }
            if (item.action && typeof item.action !== 'function') {
                console.warn('MenuItem: invalid type of `action` property!', typeof item.action);
            }
        }
        super(item);
        if (this.options) {
            this.options.addEventListener('item-selected', this._onSubItemSelected);
            this.options.addEventListener('path-changed', this._onOptionsPathChanged);
        }
    }
    toJSON() {
        const json = {
            value: this.value,
            label: this.label,
            icon: this.icon,
            hint: this.hint,
            hidden: this.hidden,
            disabled: this.disabled,
        };
        if (this.options)
            json.options = this.options;
        return json;
    }
    _onSubItemSelected() {
        this.selected = true;
    }
    _onOptionsPathChanged(event) {
        this.dispatchEvent('path-changed', event.detail);
    }
    optionsChanged() {
        // TODO test this behavior and look for regressions
        if ((this.options?.first !== undefined || this.options?.scroll !== undefined) && this.mode === 'select') {
            this.selected = true;
        }
    }
    selectedChanged() {
        if (this.mode === 'select' && this.selected === false && this.options) {
            for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].mode === 'select' || this.options[i].mode === 'scroll') {
                    this.options[i].selected = false;
                }
            }
            this.options.updatePaths();
        }
    }
    changed() {
        this.dispatchEvent('object-mutated', { object: this }, false, window);
    }
    dispose() {
        if (this.options) {
            this.options.removeEventListener('item-selected', this._onSubItemSelected);
            this.options.removeEventListener('path-changed', this._onOptionsPathChanged);
        }
        super.dispose();
    }
};
__decorate([
    Property(undefined)
], MenuItem.prototype, "value", void 0);
__decorate([
    Property('')
], MenuItem.prototype, "label", void 0);
__decorate([
    Property('')
], MenuItem.prototype, "icon", void 0);
__decorate([
    Property('')
], MenuItem.prototype, "hint", void 0);
__decorate([
    Property(false)
], MenuItem.prototype, "hidden", void 0);
__decorate([
    Property(false)
], MenuItem.prototype, "disabled", void 0);
__decorate([
    Property(undefined)
], MenuItem.prototype, "action", void 0);
__decorate([
    Property('select')
], MenuItem.prototype, "mode", void 0);
__decorate([
    Property(false)
], MenuItem.prototype, "selected", void 0);
__decorate([
    Property(undefined)
], MenuItem.prototype, "options", void 0);
MenuItem = __decorate([
    Register
], MenuItem);
export { MenuItem };
//# sourceMappingURL=menu-item.js.map