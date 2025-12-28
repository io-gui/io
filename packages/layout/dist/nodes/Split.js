var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Split_1;
import { Node, NodeArray, ReactiveProperty, Register } from '@io-gui/core';
import { Panel } from './Panel.js';
let Split = Split_1 = class Split extends Node {
    constructor(args) {
        args = { ...args };
        for (let i = 0; i < args.children.length; i++) {
            const panelChild = args.children[i];
            const splitChild = args.children[i];
            if (panelChild.tabs) {
                args.children[i] = new Panel(panelChild);
            }
            else if (splitChild.children) {
                args.children[i] = new Split_1(splitChild);
            }
        }
        super(args);
    }
    childrenMutated() {
        this.debounce(this.onChildrenMutatedDebounced);
    }
    onChildrenMutatedDebounced() {
        this.dispatchMutation();
    }
    toJSON() {
        return {
            children: this.children.map((child) => child.toJSON()),
            orientation: this.orientation,
            flex: this.flex,
        };
    }
    fromJSON(json) {
        this.setProperties({
            children: json.children.map((child) => {
                const panelChild = child;
                const splitChild = child;
                if (panelChild.tabs) {
                    return new Panel(panelChild);
                }
                else if (splitChild.children) {
                    return new Split_1(splitChild);
                }
            }),
            orientation: json.orientation ?? 'horizontal',
            flex: json.flex ?? '1 1 100%',
        });
        return this;
    }
    dispose() {
        this.children.length = 0; // TODO: test magic!
        super.dispose();
    }
};
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], Split.prototype, "children", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'horizontal' })
], Split.prototype, "orientation", void 0);
__decorate([
    ReactiveProperty({ type: String, value: '1 1 100%' })
], Split.prototype, "flex", void 0);
Split = Split_1 = __decorate([
    Register
], Split);
export { Split };
//# sourceMappingURL=Split.js.map