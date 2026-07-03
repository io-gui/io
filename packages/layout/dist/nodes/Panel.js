var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveObject, NodeArray, Property, Register } from '@io-gui/core';
import { Tab } from './Tab.js';
import { DEFAULT_SIZE, applyLayoutSizeProps, isValidSize, layoutSizeToJSON, } from '../utils/layoutSize.js';
// IMPORTANT: Do not remove commented out code. It is used in the future.
let Panel = class Panel extends ReactiveObject {
    constructor(data) {
        super();
        this.applyJSON(data);
    }
    tabsMutated() {
        this.debounce(this.onTabsMutatedDebounced);
    }
    onTabsMutatedDebounced() {
        this.dispatchMutation();
    }
    getSelected() {
        let selected = '';
        for (let i = 0; i < this.tabs.length; i++) {
            const item = this.tabs[i];
            if (item.selected && item.id) {
                selected = item.id;
                break;
            }
        }
        return selected;
    }
    setSelected(id) {
        this.tabs.withInternalOperation(() => {
            for (let i = 0; i < this.tabs.length; i++) {
                const item = this.tabs[i];
                if (item.id === id) {
                    item.selected = true;
                }
                else {
                    item.selected = false;
                }
            }
        });
        this.tabs.dispatchMutation();
    }
    // addTab(tab: Tab, index?: number) {
    //   const existingIndex = this.tabs.findIndex(t => t.id === tab.id)
    //   if (existingIndex !== -1) {
    //     console.warn(`Panel.addTab: Duplicate tab id "${tab.id}", removing duplicate tab.`)
    //     this.tabs.splice(existingIndex, 1)
    //   }
    //   index = index ?? this.tabs.length
    //   index = Math.min(index, this.tabs.length)
    //   this.tabs.splice(index, 0, tab)
    //   this.selectIndex(index)
    // }
    // removeTab(tab: Tab) {
    //   const index = this.tabs.indexOf(tab)
    //   if (index === -1) return
    //   this.tabs.splice(index, 1)
    //   if (this.tabs.length > 0) {
    //     const newIndex = Math.min(index, this.tabs.length - 1)
    //     this.selectIndex(newIndex)
    //   } else {
    //     this.notifyParentSplitNormalize()
    //   }
    // }
    // moveTab(tab: Tab, index: number) {
    //   index = Math.max(Math.min(index, this.tabs.length - 1), 0)
    //   const currIndex = this.tabs.findIndex(t => t.id === tab.id)
    //   if (currIndex === -1) return
    //   this.tabs.splice(currIndex, 1)
    //   index = Math.min(index, this.tabs.length)
    //   this.tabs.splice(index, 0, tab)
    //   this.selectIndex(index)
    // }
    // selectIndex(index: number) {
    //   index = Math.min(index, this.tabs.length - 1)
    //   if (index >= 0 && this.tabs.length > 0) {
    //     this.setSelected(this.tabs[index].id)
    //   }
    // }
    // notifyParentSplitNormalize() {
    //   let node: ReactiveNode | undefined = this
    //   while (node) {
    //     let splitParent: Split | undefined
    //     for (let i = 0; i < node._parents.length; i++) {
    //       const parent = node._parents[i]
    //       if (isSplitNode(parent as LayoutChild)) {
    //         splitParent = parent as Split
    //         break
    //       }
    //     }
    //     if (!splitParent) break
    //     splitParent.normalize()
    //     node = splitParent
    //   }
    // }
    sizeChanged() {
        if (!isValidSize(this.size)) {
            debug: {
                console.error(`Panel: Invalid size value "${this.size}". Expected "auto", "Npx", "N%", or "Npx auto" / "N% auto".`);
            }
            this.size = DEFAULT_SIZE;
        }
    }
    toJSON() {
        const data = {
            type: 'panel',
            tabs: this.tabs.map(tab => tab.toJSON()),
            ...layoutSizeToJSON(this),
        };
        return data;
    }
    applyJSON(data) {
        const tabs = data.tabs.map(tab => new Tab(tab));
        if (tabs.length > 0 && !tabs.some(tab => tab.selected && tab.id)) {
            const first = tabs.find(tab => tab.id);
            if (first)
                first.selected = true;
        }
        this.setProperties({
            tabs,
            ...applyLayoutSizeProps(data),
        });
        return this;
    }
};
__decorate([
    Property({ type: NodeArray, init: 'this' })
], Panel.prototype, "tabs", void 0);
__decorate([
    Property({ type: String, value: DEFAULT_SIZE })
], Panel.prototype, "size", void 0);
Panel = __decorate([
    Register
], Panel);
export { Panel };
