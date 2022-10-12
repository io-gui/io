var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
// TODO: test and documentation
/*

 **/
let IoContent = class IoContent extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-content;
    }
    :host:not([expanded]) {
      display: none;
    }
    `;
    }
    static get Properties() {
        return {
            elements: {
                type: Array,
                observe: true,
            },
            expanded: {
                type: Boolean,
                reflect: 'prop',
            },
            cache: Boolean,
        };
    }
    changed() {
        // TODO: cache outside DOM and disconnect!
        if (this.expanded) {
            this.template([this.elements]);
        }
        else if (!this.cache) {
            this.template([null]);
        }
    }
};
IoContent = __decorate([
    RegisterIoElement
], IoContent);
export { IoContent };
//# sourceMappingURL=content.js.map