var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoNavigatorBase } from './io-navigator-base.js';
import './io-scroller.js';
let IoNavigatorScroller = class IoNavigatorScroller extends IoNavigatorBase {
    getSlotted() {
        return ['io-scroller', { options: this.options }, this.elements];
    }
};
IoNavigatorScroller = __decorate([
    Register
], IoNavigatorScroller);
export { IoNavigatorScroller };
//# sourceMappingURL=io-navigator-scroller.js.map