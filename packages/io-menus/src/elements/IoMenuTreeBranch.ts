import { IoElement, Register, ReactiveProperty, IoElementProps, WithBinding, Property } from 'io-core';
import { ioBoolean } from 'io-inputs';
import { MenuOption } from '../nodes/MenuOption.js';
import { ioMenuTree } from './IoMenuTree.js';

export type IoMenuTreeBranchProps = IoElementProps & {
  depth?: number,
  option?: MenuOption,
  expanded?: WithBinding<boolean>,
};
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/

@Register
export class IoMenuTreeBranch extends IoElement {
  static get Style() {
    return /* css */`
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

  @ReactiveProperty(Number)
  declare depth: number;

  @ReactiveProperty({type: MenuOption})
  declare option: MenuOption;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare expanded: boolean;

  @Property('region')
  declare role: string;

  optionMutated() {
    if (this.option.selected) this.expanded = this.option.selected;
  }

  changed() {
    this.render([
      ioBoolean({icon: this.option.icon, true: this.option.label, false: this.option.label, value: this.bind('expanded')}),
      this.expanded ? ioMenuTree({option: this.option, depth: this.depth + 1}) : null,
    ]);
  }
}
export const ioMenuTreeBranch = function(arg0?: IoMenuTreeBranchProps) {
  return IoMenuTreeBranch.vConstructor(arg0);
};