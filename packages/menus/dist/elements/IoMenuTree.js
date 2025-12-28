var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Storage as $, Property } from '@io-gui/core';
import { ioField, ioString } from '@io-gui/inputs';
import { MenuOption } from '../nodes/MenuOption.js';
import { ioMenuItem } from './IoMenuItem.js';
import { ioMenuTreeBranch } from './IoMenuTreeBranch.js';
import { searchMenuOption } from '../utils/MenuNodeUtils.js';
function genObjectStorageID(object) {
    const string = JSON.stringify(object);
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = Math.imul(31, hash) + string.charCodeAt(i) | 0;
    }
    return 'io-local-state-' + String(hash);
}
function addMenuOptionsOrTreeBranches(option, depth, d = 0) {
    const elements = [];
    if (d <= depth)
        for (let i = 0; i < option.options.length; i++) {
            const subOption = option.options[i];
            if (subOption.options.length) {
                const collapsibleState = $({ value: false, storage: 'local', key: genObjectStorageID(subOption) });
                if (subOption.selected === true)
                    collapsibleState.value = true;
                elements.push(ioMenuTreeBranch({ option: subOption, depth: d, expanded: collapsibleState }));
            }
            else {
                elements.push(ioMenuItem({ option: subOption, depth: d }));
            }
        }
    return elements;
}
let IoMenuTree = class IoMenuTree extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: var(--io_borderRadius);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: var(--io_spacing);
      @apply --unselectable;
    }
    :host io-menu-tree {
      padding: 0 !important;
    }
    :host > io-menu-item {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing3);
    }
    :host > io-menu-item[selected] {
      border-color: transparent var(--io_colorBlue) transparent transparent;
    }
    :host > io-menu-item:before {
      display: inline-block;
      width: var(--io_fontSize);
      content: ""
    }
    `;
    }
    constructor(args = {}) { super(args); }
    changed() {
        const vChildren = this.widget ? [this.widget] : [];
        if (this.searchable) {
            vChildren.push(ioString({
                id: 'search',
                role: 'search',
                value: this.bind('search'),
                placeholder: 'Search',
                live: true
            }));
        }
        if (this.search) {
            const filteredItems = searchMenuOption(this.option, this.search, this.depth);
            if (filteredItems.length === 0) {
                vChildren.push(ioField({ label: 'No matches' }));
            }
            else
                for (let i = 0; i < filteredItems.length; i++) {
                    vChildren.push(ioMenuItem({ option: filteredItems[i], depth: 0 }));
                }
        }
        else {
            vChildren.push(...addMenuOptionsOrTreeBranches(this.option, this.depth));
        }
        this.render(vChildren);
    }
};
__decorate([
    ReactiveProperty({ type: MenuOption })
], IoMenuTree.prototype, "option", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean })
], IoMenuTree.prototype, "searchable", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], IoMenuTree.prototype, "search", void 0);
__decorate([
    ReactiveProperty({ value: Infinity, type: Number })
], IoMenuTree.prototype, "depth", void 0);
__decorate([
    ReactiveProperty(null)
], IoMenuTree.prototype, "widget", void 0);
__decorate([
    Property()
], IoMenuTree.prototype, "$parent", void 0);
__decorate([
    Property('listbox')
], IoMenuTree.prototype, "role", void 0);
IoMenuTree = __decorate([
    Register
], IoMenuTree);
export { IoMenuTree };
export const ioMenuTree = function (arg0) {
    return IoMenuTree.vConstructor(arg0);
};
//# sourceMappingURL=IoMenuTree.js.map