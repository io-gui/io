import { IoElement, VDOMElement, ReactiveProperty, IoElementProps, WithBinding, Register, div } from '@io-gui/core'
import { MenuOption, ioMenuOptions, ioMenuTree } from '@io-gui/menus'
import { CachingType, ioSelector } from './IoSelector.js'
import { ioNavigatorDrawer, IoNavigatorDrawer } from './IoNavigatorDrawer.js'

export type SelectType = 'shallow' | 'deep' | 'all' | 'none'

export type MenuPosition = 'top' | 'left'

export type IoNavigatorProps = IoElementProps & {
  option?: MenuOption
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
export class IoNavigator extends IoElement {
  static get Style() {
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
      :host > io-menu-options {
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

  @ReactiveProperty({type: Array, init: null})
  declare elements: VDOMElement[]

  @ReactiveProperty({type: MenuOption})
  declare option: MenuOption

  @ReactiveProperty(null)
  declare widget: VDOMElement | null

  @ReactiveProperty({value: 'left', type: String, reflect: true})
  declare menu: MenuPosition

  @ReactiveProperty({value: Infinity, type: Number})
  declare depth: number

  @ReactiveProperty({value: 'shallow', type: String})
  declare select: SelectType

  @ReactiveProperty({value: 'none', type: String})
  declare caching: CachingType

  @ReactiveProperty({value: 570, type: Number})
  declare minWidth: number

  @ReactiveProperty({value: '', type: String})
  declare anchor: string

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare collapsed: boolean

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare showVeil: boolean

  static get Listeners() {
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
    if (this.menu === 'top') {
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

  optionMutated() {
    this.changed()
  }

  changed() {
    const sharedMenuConfig = {
      option: this.option,
      widget: this.widget,
      depth: this.depth
    }

    let selected = ''
    if (this.select === 'shallow') selected = this.option.selectedIDImmediate
    if (this.select === 'deep') selected = this.option.selectedID
    if (this.select === 'all') selected = '*'
    if (this.select === 'none') selected = ''

    const selectorElement = ioSelector({selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements})
    const veil = div({class: 'io-veil', '@click': this.onVeilClick})

    if (this.menu === 'top') {
      this.render([
        selectorElement,
        ioMenuOptions({horizontal: true, ...sharedMenuConfig}),
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