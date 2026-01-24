var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Node, NodeArray, ReactiveProperty, Register } from '@io-gui/core';
import { Panel } from './Panel.js';
function createChild(child) {
    return child.type === 'panel' ? new Panel(child) : new Split(child);
}
function consolidateChildren(children, orientation) {
    let result = children;
    let resultOrientation = orientation;
    while (result.length === 1 && result[0] instanceof Split) {
        const soleChild = result[0];
        resultOrientation = soleChild.orientation;
        result = [...soleChild.children];
    }
    return { children: result, orientation: resultOrientation };
}
let Split = class Split extends Node {
    constructor(args) {
        debug: {
            if (args.type !== 'split') {
                console.error(`Split: Invalid type "${args.type}". Expected "split".`);
            }
        }
        const processedChildren = args.children.map(createChild);
        const consolidated = consolidateChildren(processedChildren, args.orientation ?? 'horizontal');
        super({
            ...args,
            children: consolidated.children,
            orientation: consolidated.orientation,
        });
    }
    childrenMutated() {
        this.debounce(this.onChildrenMutatedDebounced);
    }
    onChildrenMutatedDebounced() {
        this.dispatchMutation();
    }
    flexChanged() {
        debug: {
            const flexRegex = /^[\d.]+\s+[\d.]+\s+(?:auto|[\d.]+(?:px|%))$/;
            if (!flexRegex.test(this.flex)) {
                console.warn(`Split: Invalid flex value "${this.flex}". Expected a valid CSS flex value.`);
            }
        }
    }
    toJSON() {
        const json = {
            type: 'split',
            children: this.children.map((child) => child.toJSON()),
        };
        if (this.orientation !== 'horizontal')
            json.orientation = this.orientation;
        if (this.flex !== '1 1 auto')
            json.flex = this.flex;
        return json;
    }
    fromJSON(json) {
        debug: {
            if (json.type !== 'split') {
                console.error(`Split.fromJSON: Invalid type "${json.type}". Expected "split".`);
            }
        }
        const processedChildren = json.children.map(createChild);
        const consolidated = consolidateChildren(processedChildren, json.orientation ?? 'horizontal');
        this.setProperties({
            children: consolidated.children,
            orientation: consolidated.orientation,
            flex: json.flex ?? '1 1 auto',
        });
        return this;
    }
    dispose() {
        this.children.length = 0;
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
    ReactiveProperty({ type: String, value: '1 1 auto' })
], Split.prototype, "flex", void 0);
Split = __decorate([
    Register
], Split);
export { Split };
//# sourceMappingURL=Split.js.map