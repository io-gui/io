var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Split_1;
import { ReactiveObject, NodeArray, Property, Register, detachNodeParents } from '@io-gui/core';
import { Panel } from './Panel.js';
import { DEFAULT_SIZE, applyLayoutSizeProps, isValidSize, layoutSizeToJSON, ensureOneChildHasAutoSize, } from '../utils/layoutSize.js';
import { createLayoutChild } from './Layout.js';
let Split = Split_1 = class Split extends ReactiveObject {
    constructor(data) {
        super();
        this.applyJSON(data);
    }
    childrenMutated() {
        this.debounce(this.onChildrenMutatedDebounced);
    }
    onChildrenMutatedDebounced() {
        this.dispatchMutation();
    }
    normalize() {
        let changed = true;
        while (changed) {
            changed = false;
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                if (child instanceof Split_1) {
                    const lengthBefore = child.children.length;
                    child.normalize();
                    if (child.children.length !== lengthBefore)
                        changed = true;
                }
            }
            this.children.withInternalOperation(() => {
                for (let i = this.children.length; i--;) {
                    const child = this.children[i];
                    if (child instanceof Panel && child.tabs.length === 0) {
                        this.children.splice(i, 1);
                        changed = true;
                    }
                }
                for (let i = this.children.length; i--;) {
                    const child = this.children[i];
                    if (child instanceof Split_1 && child.children.length === 0) {
                        this.children.splice(i, 1);
                        changed = true;
                    }
                }
                for (let i = this.children.length; i--;) {
                    const child = this.children[i];
                    if (child instanceof Split_1 && child.children.length === 1) {
                        this.consolidateChildAt(i, child);
                        changed = true;
                    }
                }
                ensureOneChildHasAutoSize(this.children);
            });
        }
    }
    consolidateChildAt(index, childSplit) {
        this.children.withInternalOperation(() => {
            const soleChild = childSplit.children[0];
            if (soleChild instanceof Panel) {
                soleChild.size = childSplit.size;
                this.children.splice(index, 1, soleChild);
            }
            else if (soleChild instanceof Split_1) {
                const orientationsMatch = this.orientation === soleChild.orientation;
                const parentHasOneChild = this.children.length === 1;
                if (orientationsMatch || parentHasOneChild) {
                    if (parentHasOneChild)
                        this.orientation = soleChild.orientation;
                    detachNodeParents(soleChild);
                    this.children.splice(index, 1, ...soleChild.children);
                    ensureOneChildHasAutoSize(this.children);
                }
                else {
                    soleChild.size = childSplit.size;
                    this.children.splice(index, 1, soleChild);
                }
            }
        });
    }
    sizeChanged() {
        if (!isValidSize(this.size)) {
            debug: {
                console.error(`Split: Invalid size value "${this.size}". Expected "auto", "Npx", "N%", or "Npx auto" / "N% auto".`);
            }
            this.size = DEFAULT_SIZE;
        }
    }
    toJSON() {
        const json = {
            type: 'split',
            children: this.children.map((child) => child.toJSON()),
            ...layoutSizeToJSON(this),
        };
        if (this.orientation !== 'horizontal')
            json.orientation = this.orientation;
        return json;
    }
    applyJSON(data) {
        this.setProperties({
            children: data.children.map(createLayoutChild),
            orientation: data.orientation ?? 'horizontal',
            ...applyLayoutSizeProps(data),
        });
        return this;
    }
};
__decorate([
    Property({ type: NodeArray, init: 'this' })
], Split.prototype, "children", void 0);
__decorate([
    Property({ type: String, value: 'horizontal' })
], Split.prototype, "orientation", void 0);
__decorate([
    Property({ type: String, value: DEFAULT_SIZE })
], Split.prototype, "size", void 0);
Split = Split_1 = __decorate([
    Register
], Split);
export { Split };
