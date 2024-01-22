var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';
let IoScroller = class IoScroller extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        position: relative;
        overflow-y: auto;
        max-width: 100%;
        max-height: 100%;
        scrollbar-gutter: stable;
      }
      :host > * {
        overflow: unset;
      }
    `;
    }
    init() {
        this._observer = new MutationObserver(this._domMutated);
        this._observer.observe(this, { attributes: false, childList: true, subtree: true });
    }
    connectedCallback() {
        super.connectedCallback();
        this.optionsMutated();
    }
    _domMutated() {
        this.throttle(this._scrollToSelected);
    }
    optionsMutated() {
        this.throttle(this._scrollToSelected);
    }
    _scrollToSelected() {
        if (this.scrollHeight <= this.clientHeight)
            return;
        const selected = this.options.scroll;
        debug: {
            if (selected && typeof selected !== 'string') {
                console.warn('IoScroller: selected scroll option is not a string!');
            }
        }
        if (selected && typeof selected === 'string') {
            const element = this.querySelector('#' + selected);
            if (element) {
                this.scrollTo({ top: element.offsetTop, behavior: 'auto' });
            }
            else {
                this.scrollTo(0, 0);
            }
        }
    }
    dispose() {
        super.dispose();
        this._observer.disconnect();
    }
};
__decorate([
    Property({ type: MenuOptions, observe: true })
], IoScroller.prototype, "options", void 0);
IoScroller = __decorate([
    Register
], IoScroller);
export { IoScroller };
//# sourceMappingURL=io-scroller.js.map