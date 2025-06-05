import { IoElement, VDOMElement, Register, ReactiveProperty, IoElementProps, WithBinding, Property } from 'io-gui';
import { ioBoolean } from 'io-inputs';
import { MenuItem } from '../nodes/MenuItem';
import { ioMenuTree } from './IoMenuTree';

export type IoMenuTreeBranchProps = IoElementProps & {
  depth?: number,
  item?: MenuItem,
  expanded?: WithBinding<boolean>,
};
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/

@Register
export class IoMenuTreeBranch extends IoElement {
  static vConstructor: (arg0?: IoMenuTreeBranchProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
    }
    :host > io-boolean {
      overflow: visible;
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
      margin-top: 0;
      margin-left: var(--io_spacing3);
      border: none;
    }
    `;
  }

  @ReactiveProperty(Number)
  declare depth: number;

  @ReactiveProperty({type: MenuItem, init: null})
  declare item: MenuItem;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare expanded: boolean;

  @Property('region')
  declare role: string;

  itemMutated() {
    if (this.item.selected) this.expanded = this.item.selected;
  }

  changed() {
    this.template([
      ioBoolean({icon: this.item.icon, true: this.item.label, false: this.item.label, value: this.bind('expanded')}),
      this.expanded ? ioMenuTree({options: this.item.options, depth: this.depth + 1}) : null,
    ]);
  }
}
export const ioMenuTreeBranch = IoMenuTreeBranch.vConstructor;