var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Node, NodeArray, ReactiveProperty, Register } from 'io-core';
import { Tab } from './Tab.js';
let Panel = class Panel extends Node {
    constructor(args) {
        args = { ...args };
        if (args.tabs.length > 0 && !args.tabs.find(tab => tab.selected)) {
            args.tabs[0].selected = true;
        }
        args.tabs = args.tabs.map(tab => new Tab({ ...tab }));
        super(args);
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
        // TODO Test and reconsider withInternalOperation
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
    toJSON() {
        return {
            tabs: this.tabs.map(tab => tab.toJSON()),
            flex: this.flex,
        };
    }
    fromJSON(json) {
        this.setProperties({
            tabs: json.tabs.map(tab => new Tab(tab)),
            flex: json.flex ?? '1 1 100%',
        });
        return this;
    }
    dispose() {
        this.tabs.length = 0; // TODO: test magic!
        super.dispose();
    }
};
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], Panel.prototype, "tabs", void 0);
__decorate([
    ReactiveProperty({ type: String, value: '1 1 100%' })
], Panel.prototype, "flex", void 0);
Panel = __decorate([
    Register
], Panel);
export { Panel };
//# sourceMappingURL=Panel.js.map