var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveElement, Register, Property, Field, clearFocusBacktrack } from '@io-gui/core';
import { ioBoolean } from '@io-gui/inputs';
import { Option } from '../models/Option.js';
import { ioMenuTree } from './IoMenuTree.js';
/**
 * A collapsible branch inside an `IoMenuTree`. Toggling it writes through to the Menu's
 * tree-scoped disclosure state (`expandedIDs`) when a Menu is available.
 **/
let IoMenuTreeBranch = class IoMenuTreeBranch extends ReactiveElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
    }
    :host > io-boolean {
      overflow: visible;
      padding-left: var(--io_spacing3);
      padding-right: var(--io_spacing3);
    }
    :host > io-boolean:before {
      display: inline-block;
      width: var(--io_fontSize);
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾"
    }
    :host > io-menu-tree {
      background: transparent;
      border: none;
      border-left: var(--io_border);
      border-color: var(--io_colorLight);
      margin-left: var(--io_spacing4);
    }
    `;
    }
    modelMutated() {
        if (this.model.selected)
            this.expanded = this.model.selected;
    }
    expandedChanged() {
        clearFocusBacktrack();
        if (this.$menu && this.model.id) {
            this.$menu.setDisclosed(this.model.id, this.expanded);
        }
    }
    mutated() {
        this.render([
            ioBoolean({ icon: this.model.icon, true: this.model.label, false: this.model.label, value: this.bind('expanded') }),
            this.expanded ? ioMenuTree({ model: this.model, depth: this.depth + 1, $menu: this.$menu }) : null,
        ]);
    }
};
__decorate([
    Property(Number)
], IoMenuTreeBranch.prototype, "depth", void 0);
__decorate([
    Property({ type: Option })
], IoMenuTreeBranch.prototype, "model", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoMenuTreeBranch.prototype, "expanded", void 0);
__decorate([
    Field()
], IoMenuTreeBranch.prototype, "$menu", void 0);
__decorate([
    Field('region')
], IoMenuTreeBranch.prototype, "role", void 0);
IoMenuTreeBranch = __decorate([
    Register
], IoMenuTreeBranch);
export { IoMenuTreeBranch };
export const ioMenuTreeBranch = function (arg0) {
    return IoMenuTreeBranch.vConstructor(arg0);
};
