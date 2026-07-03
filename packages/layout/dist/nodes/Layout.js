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
// IMPORTANT: Do not remove commented out code. It is used in the future.
let Layout = class Layout extends ReactiveObject {
    constructor(data) {
        super();
        this.applyJSON(data);
    }
    // normalize() {
    //   if (isSplitNode(this.child)) {
    //     this.child.normalize()
    //     if (this.child.children.length === 1) {
    //       this.child = this.child.children[0]
    //     } else if (this.child.children.length === 0) {
    //       this.child = new Panel({ type: 'panel', tabs: [] })
    //     }
    //   }
    //   if (isSplitNode(this.child) && !this.containsPanel(this.child)) {
    //     this.child = new Panel({ type: 'panel', tabs: [] })
    //   }
    // }
    // containsPanel(node: LayoutChild): boolean {
    //   if (isPanelNode(node)) return true
    //   for (let i = 0; i < node.children.length; i++) {
    //     if (this.containsPanel(node.children[i])) return true
    //   }
    //   return false
    // }
    // findPanelInNode(node: LayoutChild, tab?: Tab): Panel | null {
    //   if (isPanelNode(node)) {
    //     if (tab === undefined) return node
    //     return node.tabs.includes(tab) ? node : null
    //   }
    //   for (let i = 0; i < node.children.length; i++) {
    //     const found = this.findPanelInNode(node.children[i], tab)
    //     if (found) return found
    //   }
    //   return null
    // }
    // findPanel(tab: Tab): Panel | null {
    //   return this.findPanelInNode(this.child, tab)
    // }
    // findSourcePanel(tab: Tab): Panel | null {
    //   return this.findPanel(tab)
    // }
    // moveTab(tab: Tab, targetPanel: Panel, direction: SplitDirection, sourcePanel?: Panel) {
    //   const source = sourcePanel ?? this.findSourcePanel(tab)
    //   if (!source) return
    //   if (direction === 'center') {
    //     source.removeTab(tab)
    //     targetPanel.addTab(tab)
    //     this.normalize()
    //     return
    //   }
    //   const parentSplit = this.findParentSplit(targetPanel)
    //   if (!parentSplit) return
    //   let orientation: SplitOrientation = 'horizontal'
    //   if (direction === 'top' || direction === 'bottom') {
    //     orientation = 'vertical'
    //   }
    //   const index = parentSplit.children.indexOf(targetPanel)
    //   let newIndex = ['left', 'top'].includes(direction) ? index - 1 : index + 1
    //   if (parentSplit.orientation === orientation) {
    //     newIndex = Math.max(0, newIndex)
    //     parentSplit.children.splice(newIndex, 0, new Panel({ type: 'panel', tabs: [tab] }))
    //     source.removeTab(tab)
    //   } else if (targetPanel.tabs.length > 1 || targetPanel !== source) {
    //     if (newIndex === -1) {
    //       this.convertToSplit(parentSplit, targetPanel, new Panel({ type: 'panel', tabs: [tab] }), targetPanel, orientation)
    //     } else {
    //       this.convertToSplit(parentSplit, targetPanel, targetPanel, new Panel({ type: 'panel', tabs: [tab] }), orientation)
    //     }
    //     source.removeTab(tab)
    //   }
    //   parentSplit.normalize()
    //   this.normalize()
    // }
    // findParentSplit(panel: Panel): Split | null {
    //   for (let i = 0; i < panel._parents.length; i++) {
    //     const parent = panel._parents[i]
    //     if (isSplitNode(parent as LayoutChild)) {
    //       return parent as Split
    //     }
    //   }
    //   return null
    // }
    // convertToSplit(parentSplit: Split, panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation) {
    //   const index = parentSplit.children.indexOf(panel)
    //   const newSplit = new Split({ type: 'split', orientation, children: [] })
    //   newSplit.children.push(first, second)
    //   parentSplit.children.splice(index, 1, newSplit)
    // }
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
