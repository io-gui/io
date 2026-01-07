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
        debug: {
            if (args.type !== 'split') {
                console.error(`Split: Invalid type "${args.type}". Expected "split".`);
            }
        }
        let processedChildren = args.children.map(child => {
            if (child.type === 'panel') {
                return new Panel(child);
            }
            else {
                return new Split_1(child);
            }
        });
        let orientation = args.orientation;
        // Consolidate splits containing only one split as child
        while (processedChildren.length === 1 && processedChildren[0] instanceof Split_1) {
            const soleChild = processedChildren[0];
            orientation = soleChild.orientation;
            processedChildren = [...soleChild.children];
        }
        super({
            ...args,
            children: processedChildren,
            orientation,
        });
    }
    childrenMutated() {
        this.debounce(this.onChildrenMutatedDebounced);
    }
    onChildrenMutatedDebounced() {
        this.dispatchMutation();
    }
    toJSON() {
        return {
            type: 'split',
            children: this.children.map((child) => child.toJSON()),
            orientation: this.orientation,
            flex: this.flex,
        };
    }
    fromJSON(json) {
        debug: {
            if (json.type !== 'split') {
                console.error(`Split.fromJSON: Invalid type "${json.type}". Expected "split".`);
            }
        }
        this.setProperties({
            children: json.children.map((child) => {
                if (child.type === 'panel') {
                    return new Panel(child);
                }
                else {
                    return new Split_1(child);
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