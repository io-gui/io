import { ReactiveElement, Register, Property, ReactiveElementProps, WithBinding, Field, clearFocusBacktrack } from '@io-gui/core'
import { ioBoolean } from '@io-gui/inputs'
import { Option } from '../models/Option.js'
import { Menu } from '../models/Menu.js'
import { ioMenuTree } from './IoMenuTree.js'

export type IoMenuTreeBranchProps = ReactiveElementProps & {
  depth?: number
  model?: Option
  expanded?: WithBinding<boolean>
  $menu?: Menu
}
/**
 * A collapsible branch inside an `IoMenuTree`. Toggling it writes through to the Menu's
 * tree-scoped disclosure state (`expandedIDs`) when a Menu is available.
 **/

@Register
export class IoMenuTreeBranch extends ReactiveElement {
  static override get Style() {
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
      margin-left: var(--io_spacing4);
    }
    `
  }

  @Property(Number)
  declare depth: number

  @Property({type: Option})
  declare model: Option

  @Property({value: false, type: Boolean, reflect: true})
  declare expanded: boolean

  @Field()
  declare $menu?: Menu

  @Field('region')
  declare role: string

  modelMutated() {
    if (this.model.selected) this.expanded = this.model.selected
  }

  expandedChanged() {
    clearFocusBacktrack()
    if (this.$menu && this.model.id) {
      this.$menu.setDisclosed(this.model.id, this.expanded)
    }
  }

  override mutated() {
    this.render([
      ioBoolean({icon: this.model.icon, true: this.model.label, false: this.model.label, value: this.bind('expanded')}),
      this.expanded ? ioMenuTree({model: this.model, depth: this.depth + 1, $menu: this.$menu}) : null,
    ])
  }
}
export const ioMenuTreeBranch = function(arg0?: IoMenuTreeBranchProps) {
  return IoMenuTreeBranch.vConstructor(arg0)
}
