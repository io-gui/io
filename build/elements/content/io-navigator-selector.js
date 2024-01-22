var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoNavigatorBase } from './io-navigator-base.js';
let IoNavigatorSelector = class IoNavigatorSelector extends IoNavigatorBase {
    getSlotted() {
        return ['io-selector', { options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements }];
    }
};
__decorate([
    Property('first')
], IoNavigatorSelector.prototype, "select", void 0);
__decorate([
    Property(false)
], IoNavigatorSelector.prototype, "cache", void 0);
__decorate([
    Property(false)
], IoNavigatorSelector.prototype, "precache", void 0);
IoNavigatorSelector = __decorate([
    Register
], IoNavigatorSelector);
export { IoNavigatorSelector };
//# sourceMappingURL=io-navigator-selector.js.map