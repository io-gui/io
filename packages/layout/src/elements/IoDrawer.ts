import { Register, Property, ReactiveElement, ReactiveElementProps, VDOMElement, div, ThemeSingleton } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'
import { Split } from '../nodes/Split.js'
import { Panel } from '../nodes/Panel.js'
import { IoSplit, ioSplit, parseFlexBasis } from './IoSplit.js'
import { ioPanel } from './IoPanel.js'

export type DrawerDirection = 'leading' | 'trailing'
export type DrawerOrientation = 'horizontal' | 'vertical'

export type IoDrawerProps = ReactiveElementProps & {
  orientation: DrawerOrientation
  direction: DrawerDirection
  parent: IoSplit
  child: Split | Panel | null
  elements: VDOMElement[]
}

@Register
export class IoDrawer extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        pointer-events: auto;
        position: relative;
        z-index: 1;
      }
      :host[orientation="horizontal"] {
        top: 0;
        bottom: 0;
        width: var(--io_lineHeight) !important;
        cursor: ew-resize;
      }
      :host[orientation="vertical"] {
        left: 0;
        right: 0;
        height: var(--io_lineHeight) !important;
        cursor: ns-resize;
      }

      :host > .io-drawer-content {
        position: relative;
        display: flex;
        overflow: hidden;
        transition: transform 0.125s ease-out;
        justify-content: flex-end;
        background-color: var(--io_bgColorStrong);
      }
      :host[orientation="horizontal"] > .io-drawer-content {
        height: 100%;
        width: var(--io-drawer-size);
      }
      :host[orientation="vertical"] > .io-drawer-content {
        width: 100%;
        height: var(--io-drawer-size);
        flex-direction: column;
      }

      :host[orientation="horizontal"][direction="leading"] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
        flex-direction: row;
      }
      :host[orientation="horizontal"][direction="leading"][expanded] > .io-drawer-content {
        transform: translateX(0);
      }

      :host[orientation="horizontal"][direction="trailing"] > .io-drawer-content {
        transform: translateX(0);
        flex-direction: row-reverse;
      }
      :host[orientation="horizontal"][direction="trailing"][expanded] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
      }

      :host[orientation="vertical"][direction="leading"] > .io-drawer-content {
        transform: translateY(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
        flex-direction: column;
      }
      :host[orientation="vertical"][direction="leading"][expanded] > .io-drawer-content {
        transform: translateY(0);
      }

      :host[orientation="vertical"][direction="trailing"] > .io-drawer-content {
        transform: translateY(0);
        flex-direction: column-reverse;
      }
      :host[orientation="vertical"][direction="trailing"][expanded] > .io-drawer-content {
        transform: translateY(calc(var(--io-drawer-size) * -1 + var(--io_lineHeight)));
      }

      :host > .io-drawer-content > .io-drawer-handle {
        display: flex;
        align-items: center;
        background-color: var(--io_bgColorLight);
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        @apply --io-unselectable;
      }
      :host[orientation="horizontal"] > .io-drawer-content > .io-drawer-handle {
        border-top: 0;
        border-bottom: 0;
        flex-direction: row;
      }
      :host[orientation="vertical"] > .io-drawer-content > .io-drawer-handle {
        border-left: 0;
        border-right: 0;
        flex-direction: column;
      }

      :host > .io-drawer-content > io-panel,
      :host > .io-drawer-content > io-split {
        flex: 0 0 auto;
      }
    `
  }

  @Property({type: String, value: 'horizontal', reflect: true})
  declare orientation: 'horizontal' | 'vertical'

  @Property({type: String, value: 'leading', reflect: true})
  declare direction: DrawerDirection

  @Property({type: Boolean, value: false, reflect: true})
  declare expanded: boolean

  @Property({type: Object})
  declare parent: IoSplit

  @Property({type: Object})
  declare child: Split | Panel

  @Property(Array)
  declare elements: VDOMElement[]

  constructor(args: IoDrawerProps) {
    super(args)
  }

  onClick(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.expanded = !this.expanded
  }

  expandedChanged() {
    this.dispatch('io-drawer-expanded-changed', {element:this}, true)
  }

  childMutated() {
    this.mutated()
  }

  override mutated() {
    if (!this.child) {
      this.render([])
      return
    }

    let availableSize = Infinity
    const parent = this.parent as IoSplit
    if (parent) {
      const parentRect = parent.getBoundingClientRect()
      availableSize = this.orientation === 'horizontal' ? parentRect.width : parentRect.height
    }

    const drawerSize = Math.min(parseFlexBasis(this.child.flex), availableSize - ThemeSingleton.lineHeight * 2)
    const contentSize = drawerSize + ThemeSingleton.lineHeight
    const style = this.orientation === 'horizontal' ? {width: `${drawerSize}px`} : {height: `${drawerSize}px`} as Record<string, string>

    let childVDOM: VDOMElement | null = null

    if (this.child instanceof Split) {
      childVDOM = ioSplit({
        split: this.child,
        style: style,
        elements: this.elements,
      })
    } else if (this.child instanceof Panel) {
      childVDOM = ioPanel({
        panel: this.child,
        style: style,
        elements: this.elements,
      })
    }

    const icon = {
      horizontal: {
        leading: this.expanded ? 'io:triangle_left' : 'io:triangle_right',
        trailing: this.expanded ? 'io:triangle_right' : 'io:triangle_left',
      },
      vertical: {
        leading: this.expanded ? 'io:triangle_up' : 'io:triangle_down',
        trailing: this.expanded ? 'io:triangle_down' : 'io:triangle_up',
      }
    }[this.orientation][this.direction]

    this.render([
      div({class: 'io-drawer-content', style: {'--io-drawer-size': `${contentSize}px`}}, [
        childVDOM,
        div({class: 'io-drawer-handle', '@click': this.onClick}, [
          ioIcon({value: icon, size: 'small'})
        ]),
      ])
    ])
  }
}

export const ioDrawer = function(args: IoDrawerProps) {
  return IoDrawer.vConstructor(args)
}
