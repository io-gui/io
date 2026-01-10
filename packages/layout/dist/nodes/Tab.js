var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Node, ReactiveProperty, Register } from '@io-gui/core';
let Tab = class Tab extends Node {
    constructor(args) {
        debug: {
            if (!args.id) {
                console.error('Tab: construction error - empty id');
            }
        }
        super({
            ...args,
            label: args.label ? args.label : args.id,
        });
    }
    toJSON() {
        const json = { id: this.id };
        if (this.label !== this.id)
            json.label = this.label;
        if (this.icon)
            json.icon = this.icon;
        if (this.selected)
            json.selected = this.selected;
        return json;
    }
    fromJSON(json) {
        this.setProperties({
            id: json.id,
            label: json.label ? json.label : json.id,
            icon: json.icon ? json.icon : '',
            selected: json.selected ? json.selected : false,
        });
        return this;
    }
};
__decorate([
    ReactiveProperty({ type: String, value: '' })
], Tab.prototype, "id", void 0);
__decorate([
    ReactiveProperty({ type: String, value: '' })
], Tab.prototype, "label", void 0);
__decorate([
    ReactiveProperty({ type: String, value: '' })
], Tab.prototype, "icon", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, value: false })
], Tab.prototype, "selected", void 0);
Tab = __decorate([
    Register
], Tab);
export { Tab };
//# sourceMappingURL=Tab.js.map