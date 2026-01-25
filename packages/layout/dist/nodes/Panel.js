var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveNode, NodeArray, ReactiveProperty, Register } from '@io-gui/core';
import { Tab } from './Tab.js';
function deduplicateTabs(tabs, context) {
    const seenIds = new Set();
    const uniqueTabs = [];
    for (const tab of tabs) {
        if (seenIds.has(tab.id)) {
            console.warn(`${context}: Duplicate tab id "${tab.id}" - keeping first occurrence`);
        }
        else {
            seenIds.add(tab.id);
            uniqueTabs.push(tab);
        }
    }
    return uniqueTabs;
}
let Panel = class Panel extends ReactiveNode {
    constructor(args) {
        debug: {
            if (args.type !== 'panel') {
                console.error(`Panel: Invalid type "${args.type}". Expected "panel".`);
            }
        }
        args = { ...args };
        args.tabs = deduplicateTabs(args.tabs, 'Panel');
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
    flexChanged() {
        const flexRegex = /^[\d.]+\s+[\d.]+\s+(?:auto|[\d.]+(?:px|%))$/;
        if (!flexRegex.test(this.flex)) {
            debug: {
                console.error(`Split: Invalid flex value "${this.flex}". Expected a valid CSS flex value.`);
            }
            this.flex = '0 1 auto';
        }
    }
    toJSON() {
        const json = {
            type: 'panel',
            tabs: this.tabs.map(tab => tab.toJSON()),
        };
        if (this.flex !== '1 1 auto')
            json.flex = this.flex;
        return json;
    }
    fromJSON(json) {
        debug: {
            if (json.type !== 'panel') {
                console.error(`Panel.fromJSON: Invalid type "${json.type}". Expected "panel".`);
            }
        }
        const uniqueTabs = deduplicateTabs(json.tabs, 'Panel.fromJSON');
        this.setProperties({
            tabs: uniqueTabs.map(tab => new Tab(tab)),
            flex: json.flex ?? '1 1 auto',
        });
        return this;
    }
    dispose() {
        this.tabs.length = 0;
        super.dispose();
    }
};
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], Panel.prototype, "tabs", void 0);
__decorate([
    ReactiveProperty({ type: String, value: '1 1 auto' })
], Panel.prototype, "flex", void 0);
Panel = __decorate([
    Register
], Panel);
export { Panel };
//# sourceMappingURL=Panel.js.map