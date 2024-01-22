var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoNavigatorBase } from './io-navigator-base.js';
import './io-md-view.js';
let IoNavigatorMdView = class IoNavigatorMdView extends IoNavigatorBase {
    getSlotted() {
        const src = this.options.last;
        return ['io-scroller', { options: this.options }, [
                ['io-md-view', { src, strip: this.strip, sanitize: this.sanitize }]
            ]];
    }
};
__decorate([
    Property({ type: Array })
], IoNavigatorMdView.prototype, "strip", void 0);
__decorate([
    Property(true)
], IoNavigatorMdView.prototype, "sanitize", void 0);
IoNavigatorMdView = __decorate([
    Register
], IoNavigatorMdView);
export { IoNavigatorMdView };
//# sourceMappingURL=io-navigator-md-view.js.map