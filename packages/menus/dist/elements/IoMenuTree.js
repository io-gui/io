var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, Field } from '@io-gui/core';
import { ioField, ioString } from '@io-gui/inputs';
import { Option } from '../models/Option.js';
import { Menu } from '../models/Menu.js';
import { ioOption } from './IoOption.js';
import { ioMenuTreeBranch } from './IoMenuTreeBranch.js';
import { searchOptions } from '../utils/MenuNodeUtils.js';
function addOptionsOrTreeBranches(model, menu, depth, d = 0) {
    const elements = [];
    if (d <= depth)
        for (let i = 0; i < model.options.length; i++) {
            const subOption = model.options[i];
            if (subOption.options.length) {
                // Selected branches disclose themselves; the rest follow the Menu's persistent disclosure state.
                const expanded = subOption.selected || (menu ? menu.isDisclosed(subOption.id) : false);
                elements.push(ioMenuTreeBranch({ model: subOption, depth: d, expanded: expanded, $menu: menu }));
            }
            else {
                elements.push(ioOption({ model: subOption, depth: d }));
            }
        }
    return elements;
}
/**
 * Entry point that presents a Menu as an inline tree with collapsible branches. Branch disclosure is
 * tree-scoped state on the Menu (`expandedIDs`) — persist it by binding that property to storage.
 **/
let IoMenuTree = class IoMenuTree extends ReactiveElement {
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
      @apply --io-unselectable;
    }
    :host io-menu-tree {
      padding: 0 !important;
    }
    :host > io-option {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing3);
    }
    :host > io-option[selected] {
      border-color: transparent var(--io_colorBlue) transparent transparent;
    }
    :host > io-option:before {
      display: inline-block;
      width: var(--io_fontSize);
      content: ""
    }
    `;
    }
    constructor(args = {}) { super(args); }
    get menu() {
        return this.$menu ?? (this.model instanceof Menu ? this.model : undefined);
    }
    onResized() {
        this.dispatch('io-menu-tree-resized', { element: this }, true);
    }
    modelMutated() {
        this.mutated();
    }
    mutated() {
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
            const filteredOptions = searchOptions(this.model, this.search, this.depth);
            if (filteredOptions.length === 0) {
                vChildren.push(ioField({ label: 'No matches' }));
            }
            else
                for (let i = 0; i < filteredOptions.length; i++) {
                    vChildren.push(ioOption({ model: filteredOptions[i], depth: 0 }));
                }
        }
        else {
            vChildren.push(...addOptionsOrTreeBranches(this.model, this.menu, this.depth));
        }
        this.render(vChildren);
    }
};
__decorate([
    Property({ type: Option })
], IoMenuTree.prototype, "model", void 0);
__decorate([
    Property({ value: false, type: Boolean })
], IoMenuTree.prototype, "searchable", void 0);
__decorate([
    Property({ value: '', type: String })
], IoMenuTree.prototype, "search", void 0);
__decorate([
    Property({ value: Infinity, type: Number })
], IoMenuTree.prototype, "depth", void 0);
__decorate([
    Property(null)
], IoMenuTree.prototype, "widget", void 0);
__decorate([
    Field()
], IoMenuTree.prototype, "$parent", void 0);
__decorate([
    Field()
], IoMenuTree.prototype, "$menu", void 0);
__decorate([
    Field('listbox')
], IoMenuTree.prototype, "role", void 0);
IoMenuTree = __decorate([
    Register
], IoMenuTree);
export { IoMenuTree };
export const ioMenuTree = function (arg0) {
    return IoMenuTree.vConstructor(arg0);
};
