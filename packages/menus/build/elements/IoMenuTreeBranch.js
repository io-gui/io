var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, ReactiveProperty, Property } from 'io-core';
import { ioBoolean } from 'io-inputs';
import { MenuOption } from '../nodes/MenuOption.js';
import { ioMenuTree } from './IoMenuTree.js';
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
let IoMenuTreeBranch = class IoMenuTreeBranch extends IoElement {
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
      margin-left: var(--io_spacing5);
    }
    `;
    }
    optionMutated() {
        if (this.option.selected)
            this.expanded = this.option.selected;
    }
    changed() {
        this.render([
            ioBoolean({ icon: this.option.icon, true: this.option.label, false: this.option.label, value: this.bind('expanded') }),
            this.expanded ? ioMenuTree({ option: this.option, depth: this.depth + 1 }) : null,
        ]);
    }
};
__decorate([
    ReactiveProperty(Number)
], IoMenuTreeBranch.prototype, "depth", void 0);
__decorate([
    ReactiveProperty({ type: MenuOption })
], IoMenuTreeBranch.prototype, "option", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoMenuTreeBranch.prototype, "expanded", void 0);
__decorate([
    Property('region')
], IoMenuTreeBranch.prototype, "role", void 0);
IoMenuTreeBranch = __decorate([
    Register
], IoMenuTreeBranch);
export { IoMenuTreeBranch };
export const ioMenuTreeBranch = function (arg0) {
    return IoMenuTreeBranch.vConstructor(arg0);
};
//# sourceMappingURL=IoMenuTreeBranch.js.map