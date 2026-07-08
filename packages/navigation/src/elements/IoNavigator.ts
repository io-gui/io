import { ReactiveElement, VDOMElement, Property, ReactiveElementProps, WithBinding, Register, div } from '@io-gui/core'
import { Menu, Option, ioMenu, ioMenuTree } from '@io-gui/menus'
import { CachingType, ioSelector } from './IoSelector.js'
import { ioNavigatorDrawer, IoNavigatorDrawer } from './IoNavigatorDrawer.js'

export type SelectType = 'shallow' | 'deep' | 'all' | 'none'

export type MenuPosition = 'top' | 'left' | 'none'

export type IoNavigatorProps = ReactiveElementProps & {
  model?: Menu | Option
  elements?: VDOMElement[]
  widget?: VDOMElement
  menu?: MenuPosition
  depth?: number
  select?: SelectType
  caching?: CachingType
  anchor?: WithBinding<string>
  minWidth?: number
}

@Register
export class IoNavigator extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        overflow: hidden;
        flex-direction: row-reverse;
      }
      :host[menu='top'] {
        flex-direction: column-reverse;
      }
      :host > io-menu-tree {
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 10em;
        border: var(--io_border);
        overflow-y: auto;
        border-radius: 0;
      }
      :host > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host > io-menu {
        border: none;
        border-bottom: var(--io_border);
        border-radius: 0;
      }
      :host > .io-veil {
        position: absolute;
        opacity: 0;
        transition: opacity 0.125s ease-out;
        background-color: rgba(0, 0, 0, 1);
        pointer-events: none;
        inset: 0;
      }
      :host[showveil] > .io-veil {
        display: block;
        opacity: 0.5;
        pointer-events: auto;
        cursor: pointer;
      }
    `
  }

  @Property({type: Array, init: null})
  declare elements: VDOMElement[]

  @Property({type: Option})
  declare model: Menu | Option

  @Property(null)
  declare widget: VDOMElement | null

  @Property({value: 'left', type: String, reflect: true})
  declare menu: MenuPosition

  @Property({value: Infinity, type: Number})
  declare depth: number

  @Property({value: 'shallow', type: String})
  declare select: SelectType

  @Property({value: 'none', type: String})
  declare caching: CachingType

  @Property({value: 570, type: Number})
  declare minWidth: number

  @Property({value: '', type: String})
  declare anchor: string

  @Property({value: false, type: Boolean, reflect: true})
  declare collapsed: boolean

  @Property({value: false, type: Boolean, reflect: true})
  declare showVeil: boolean

  static override get Listeners() {
    return {
      'io-drawer-expanded-changed': 'onDrawerExpandedChanged',
    }
  }

  onResized() {
    this.debounce(this.calculateCollapsedDebounced)
  }

  calculateCollapsedDebounced() {
    this.calculateCollapsed()
  }

  calculateCollapsed() {
    if (this.menu !== 'left') {
      this.collapsed = false
      return
    }

    const rect = this.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return

    this.collapsed = rect.width < this.minWidth
  }

  onDrawerExpandedChanged(event: CustomEvent) {
    event.stopPropagation()
    const srcDrawer = event.detail.element as IoNavigatorDrawer
    this.showVeil = srcDrawer.expanded
  }

  collapseDrawer() {
    const drawer = this.querySelector('io-navigator-drawer') as IoNavigatorDrawer
    if (drawer) drawer.expanded = false
  }

  onVeilClick(event: MouseEvent) {
    event.stopPropagation()
    this.collapseDrawer()
  }

  collapsedChanged() {
    this.collapseDrawer()
  }

  menuChanged() {
    this.calculateCollapsed()
  }

  modelMutated() {
    this.mutated()
  }

  override mutated() {
    const sharedMenuConfig = {
      model: this.model,
      widget: this.widget,
      depth: this.depth
    }

    // Selection is derived from the model scope on mutation — no bound projection properties.
    let selected = ''
    if (this.select === 'shallow') selected = this.model.getSelectedIDImmediate()
    if (this.select === 'deep') {
      // Derived deep selection — works for Menu roots and branch Options alike.
      const chain = this.model.getSelectedChain()
      selected = chain.length ? chain[chain.length - 1].id : ''
    }
    if (this.select === 'all') selected = '*'
    if (this.select === 'none') selected = ''

    const selectorElement = ioSelector({selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements})
    const veil = div({class: 'io-veil', '@click': this.onVeilClick})

    if (this.menu === 'none') {
      this.render([selectorElement])
    } else if (this.menu === 'top') {
      this.render([
        selectorElement,
        ioMenu({horizontal: true, ...sharedMenuConfig}),
      ])
    } else if (this.menu === 'left') {
      if (this.collapsed) {
        this.render([
          selectorElement,
          veil,
          ioNavigatorDrawer({
            direction: 'left',
            menuContent: ioMenuTree({...sharedMenuConfig}),
          }),
        ])
      } else {
        this.render([
          selectorElement,
          ioMenuTree({...sharedMenuConfig}),
        ])
      }
    }
  }
}

export const ioNavigator = function(arg0?: IoNavigatorProps) {
  return IoNavigator.vConstructor(arg0)
}