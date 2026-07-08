import { Register, ReactiveElement, Property, VDOMElement, ReactiveElementProps, WithBinding, Field } from '@io-gui/core'
import { ioField, ioString } from '@io-gui/inputs'
import { Option } from '../models/Option.js'
import { Menu } from '../models/Menu.js'
import { ioOption, IoOption } from './IoOption.js'
import { ioMenuTreeBranch } from './IoMenuTreeBranch.js'
import { searchOptions } from '../utils/MenuNodeUtils.js'

function addOptionsOrTreeBranches(model: Menu | Option, menu: Menu | undefined, depth: number, d = 0) {
  const elements: VDOMElement[] = []
  if (d <= depth) for (let i = 0; i < model.options.length; i++) {
    const subOption = model.options[i] as Option
    if (subOption.options.length) {
      // Selected branches disclose themselves; the rest follow the Menu's persistent disclosure state.
      const expanded = subOption.selected || (menu ? menu.isDisclosed(subOption.id) : false)
      elements.push(ioMenuTreeBranch({model: subOption, depth: d, expanded: expanded, $menu: menu}))
    } else {
      elements.push(ioOption({model: subOption, depth: d}))
    }
  }
  return elements
}

export type IoMenuTreeProps = ReactiveElementProps & {
  model?: Menu | Option
  searchable?: boolean
  search?: WithBinding<string>
  depth?: number
  widget?: VDOMElement | null
  $menu?: Menu
}

/**
 * Entry point that presents a Menu as an inline tree with collapsible branches. Branch disclosure is
 * tree-scoped state on the Menu (`expandedIDs`) — persist it by binding that property to storage.
 **/
@Register
export class IoMenuTree extends ReactiveElement {

  static override get Style() {
    return /* css */`
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
    `
  }

  @Property({type: Option})
  declare model: Menu | Option

  @Property({value: false, type: Boolean})
  declare searchable: boolean

  @Property({value: '', type: String})
  declare search: string

  @Property({value: Infinity, type: Number})
  declare depth: number

  @Property(null)
  declare widget: VDOMElement | null

  @Field()
  declare $parent?: IoOption

  @Field()
  declare $menu?: Menu

  @Field('listbox')
  declare role: string

  constructor(args: IoMenuTreeProps = {}) { super(args) }

  get menu(): Menu | undefined {
    return this.$menu ?? (this.model instanceof Menu ? this.model : undefined)
  }

  onResized() {
    this.dispatch('io-menu-tree-resized', {element: this}, true)
  }

  modelMutated() {
    this.mutated()
  }

  override mutated() {
    const vChildren: VDOMElement[] = this.widget ? [this.widget] : []

    if (this.searchable) {
      vChildren.push(ioString({
        id: 'search',
        role: 'search',
        value: this.bind('search'),
        placeholder: 'Search',
        live: true
      }))
    }

    if (this.search) {
      const filteredOptions = searchOptions(this.model, this.search, this.depth)
      if (filteredOptions.length === 0) {
        vChildren.push(ioField({label: 'No matches'}))
      } else for (let i = 0; i < filteredOptions.length; i++) {
        vChildren.push(ioOption({model: filteredOptions[i], depth: 0}))
      }

    } else {
      vChildren.push(...addOptionsOrTreeBranches(this.model, this.menu, this.depth))
    }

    this.render(vChildren)
  }
}
export const ioMenuTree = function(arg0?: IoMenuTreeProps) {
  return IoMenuTree.vConstructor(arg0)
}
