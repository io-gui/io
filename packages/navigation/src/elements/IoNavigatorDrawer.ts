import { Register, ReactiveProperty, IoElement, IoElementProps, VDOMElement, div, ThemeSingleton } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'

export type DrawerDirection = 'left' | 'right'

export type IoNavigatorDrawerProps = IoElementProps & {
  direction: DrawerDirection
  expanded?: boolean
  menuContent: VDOMElement
}

@Register
export class IoNavigatorDrawer extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        pointer-events: auto;
        position: relative;
        top: 0;
        bottom: 0;
        width: var(--io_fieldHeight) !important;
      }

      :host > .io-drawer-content {
        position: relative;
        display: flex;
        overflow: hidden;
        transition: transform 0.125s ease-out;
        height: 100%;
        width: var(--io-drawer-size);
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        border-top: 0 !important;
        border-bottom: 0 !important;
        justify-content: flex-end;
        background-color: var(--io_bgColorStrong);
      }

      :host[direction="left"] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) * -1 + var(--io_fieldHeight)));
        flex-direction: row;
      }
      :host[direction="left"][expanded] > .io-drawer-content {
        transform: translateX(0);
      }
      
      :host[direction="right"] > .io-drawer-content {
        transform: translateX(0);
        flex-direction: row-reverse;
      }
      :host[direction="right"][expanded] > .io-drawer-content {
        transform: translateX(calc(var(--io-drawer-size) * -1 + var(--io_fieldHeight)));
      }

      :host > .io-drawer-content > .io-drawer-handle {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--io_bgColorLight);
        cursor: pointer;
        flex: 0 0 auto;
        width: var(--io_fieldHeight);
        @apply --unselectable;
      }
      :host[direction="left"][expanded] > .io-drawer-content > .io-drawer-handle {
        border-left: var(--io_border);
        border-color: var(--io_borderColorStrong);
      }
      :host[direction="right"][expanded] > .io-drawer-content > .io-drawer-handle {
        border-right: var(--io_border );
        border-color: var(--io_borderColorStrong);
      }

      :host[expanded] > .io-drawer-content > .io-drawer-handle > io-icon:first-of-type {
        opacity: 0;
      }
      :host > .io-drawer-content > .io-drawer-handle > io-icon:first-of-type {
        margin: var(--io_spacing2) auto;
      }
      :host > .io-drawer-content > .io-drawer-handle > io-icon:last-of-type {
        margin: auto;
      }

      :host > .io-drawer-content > .io-navigator-drawer-menu {
        display: flex;
        flex: 0 0 auto;
        overflow-y: auto;
        flex-direction: column;
      }
      :host > .io-drawer-content > .io-navigator-drawer-menu > io-menu-tree {
        flex: 1 1 auto;
        border: none;
        border-radius: 0;
      }
    `
  }

  @ReactiveProperty({type: String, value: 'left', reflect: true})
  declare direction: DrawerDirection

  @ReactiveProperty({type: Boolean, value: false, reflect: true})
  declare expanded: boolean

  @ReactiveProperty({type: Object})
  declare menuContent: VDOMElement

  constructor(args: IoNavigatorDrawerProps) {
    super(args)
  }

  static get Listeners() {
    return {
      'io-menu-option-clicked': 'onMenuOptionClicked',
      'io-menu-tree-resized': 'onMenuTreeResized',
    }
  }

  onMenuOptionClicked() {
    this.expanded = false
  }

  onMenuTreeResized() {
    this.throttle(this.updateDrawerSizeThrottled)
  }

  onClick(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.expanded = !this.expanded
  }

  expandedChanged() {
    this.dispatch('io-drawer-expanded-changed', {element: this}, true)
  }

  changed() {
    const icon = {
      left: this.expanded ? 'io:triangle_left' : 'io:triangle_right',
      right: this.expanded ? 'io:triangle_right' : 'io:triangle_left',
    }[this.direction]

    // TODO: create menu vDOM from model. Dont pass vDOM as arg.

    this.render([
      div({class: 'io-drawer-content'}, [
        div({class: 'io-navigator-drawer-menu'}, [
          this.menuContent,
        ]),
        div({class: 'io-drawer-handle', '@click': this.onClick}, [
          ioIcon({value: 'io:hamburger', size: 'small'}),
          ioIcon({value: icon, size: 'small'})
        ]),
      ])
    ])

    this.throttle(this.updateDrawerSizeThrottled)
  }

  updateDrawerSizeThrottled() {
    const menuEl = this.querySelector('.io-navigator-drawer-menu')
    if (menuEl) {
      const contentSize = menuEl.scrollWidth + ThemeSingleton.lineHeight
      const contentEl = this.querySelector('.io-drawer-content') as HTMLElement
      if (contentEl) {
        contentEl.style.setProperty('--io-drawer-size', `${contentSize}px`)
      }
    }
  }
}

export const ioNavigatorDrawer = function(args: IoNavigatorDrawerProps) {
  return IoNavigatorDrawer.vConstructor(args)
}
