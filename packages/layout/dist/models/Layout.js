var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveObject, Property, Register } from '@io-gui/core';
import { Panel } from './Panel.js';
import { Split } from './Split.js';
export function createLayoutChild(child) {
    return child.type === 'panel' ? new Panel(child) : new Split(child);
}
export function isPanelNode(node) {
    return node.tabs !== undefined;
}
export function isSplitNode(node) {
    return node.children !== undefined;
}
let Layout = class Layout extends ReactiveObject {
    constructor(data) {
        super();
        this.applyJSON(data);
    }
    childMutated() {
        this.debounce(this.dispatchMutationDebounced, undefined, 2);
    }
    dispatchMutationDebounced() {
        this.dispatchMutation();
        this.normalize();
    }
    normalize() {
        if (isSplitNode(this.child)) {
            this.child.normalize();
            if (this.child.children.length === 1) {
                this.child = this.child.children[0];
            }
            else if (this.child.children.length === 0) {
                this.child = new Panel({ type: 'panel', tabs: [] });
            }
        }
        if (isSplitNode(this.child) && !this.containsPanel(this.child)) {
            this.child = new Panel({ type: 'panel', tabs: [] });
        }
    }
    containsPanel(node) {
        if (isPanelNode(node))
            return true;
        for (let i = 0; i < node.children.length; i++) {
            if (this.containsPanel(node.children[i]))
                return true;
        }
        return false;
    }
    findPanelWithTab(node, tab) {
        if (isPanelNode(node))
            return node.tabs.includes(tab) ? node : null;
        // Recursively search through split's children
        for (let i = 0; i < node.children.length; i++) {
            const found = this.findPanelWithTab(node.children[i], tab);
            if (found)
                return found;
        }
        return null;
    }
    moveTab(tab, targetPanel, direction, tabIndex) {
        const source = this.findPanelWithTab(this.child, tab);
        if (!source)
            return;
        if (direction === 'center') {
            if (source === targetPanel) {
                source.moveTab(tab, tabIndex);
            }
            else {
                source.removeTab(tab);
                targetPanel.addTab(tab, tabIndex);
            }
            return;
        }
        const parentSplit = this.findParentSplit(targetPanel);
        if (!parentSplit)
            return;
        let orientation = 'horizontal';
        if (direction === 'top' || direction === 'bottom') {
            orientation = 'vertical';
        }
        const index = parentSplit.children.indexOf(targetPanel);
        let newIndex = ['left', 'top'].includes(direction) ? index - 1 : index + 1;
        if (parentSplit.orientation === orientation) {
            newIndex = Math.max(0, newIndex);
            source.removeTab(tab);
            parentSplit.children.splice(newIndex, 0, new Panel({ type: 'panel', tabs: [tab] }));
        }
        else if (targetPanel.tabs.length > 1 || targetPanel !== source) {
            source.removeTab(tab);
            if (newIndex === -1) {
                this.convertToSplit(parentSplit, targetPanel, new Panel({ type: 'panel', tabs: [tab] }), targetPanel, orientation);
            }
            else {
                this.convertToSplit(parentSplit, targetPanel, targetPanel, new Panel({ type: 'panel', tabs: [tab] }), orientation);
            }
        }
    }
    findParentSplit(panel) {
        for (let i = 0; i < panel._parents.length; i++) {
            const parent = panel._parents[i];
            if (isSplitNode(parent)) {
                return parent;
            }
        }
        return null;
    }
    convertToSplit(parentSplit, panel, first, second, orientation) {
        const index = parentSplit.children.indexOf(panel);
        const newSplit = new Split({ type: 'split', orientation, children: [] });
        newSplit.children.push(first, second);
        parentSplit.children.splice(index, 1, newSplit);
    }
    toJSON() {
        return {
            child: this.child.toJSON(),
        };
    }
    applyJSON(data) {
        this.child = createLayoutChild(data.child);
        return this;
    }
};
__decorate([
    Property({ type: Object })
], Layout.prototype, "child", void 0);
Layout = __decorate([
    Register
], Layout);
export { Layout };
