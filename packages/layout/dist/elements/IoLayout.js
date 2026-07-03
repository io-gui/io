var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement } from '@io-gui/core';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { ioSplit } from './IoSplit.js';
import { ioPanel } from './IoPanel.js';
let IoLayout = class IoLayout extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        overflow: hidden;
      }
    `;
    }
    layoutMutated() {
        this.mutated();
    }
    mutated() {
        const child = this.layout.child;
        if (child instanceof Split) {
            this.render([
                ioSplit({
                    split: child,
                    elements: this.elements,
                }),
            ]);
        }
        else if (child instanceof Panel) {
            this.render([
                ioPanel({
                    panel: child,
                    elements: this.elements,
                }),
            ]);
        }
    }
};
__decorate([
    Property({ type: Object })
], IoLayout.prototype, "layout", void 0);
__decorate([
    Property(Array)
], IoLayout.prototype, "elements", void 0);
IoLayout = __decorate([
    Register
], IoLayout);
export { IoLayout };
export const ioLayout = function (arg0) {
    return IoLayout.vConstructor(arg0);
};
