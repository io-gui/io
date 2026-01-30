import { Register, IoElement, IoElementProps, ReactiveProperty, NodeArray } from '@io-gui/core'
import { MenuOption, ioMenuItem } from '@io-gui/menus'
import { ioTab } from './IoTab.js'
import { ioTabsHamburger } from './IoTabsHamburger.js'
import { Tab } from '../nodes/Tab.js'

export type IoTabsProps = IoElementProps & {
  tabs: Array<Tab>
  addMenuOption?: MenuOption
}

@Register
export class IoTabs extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
        border-bottom: var(--io_border);
        border-bottom-color: var(--io_borderColorStrong);
      }
      :host io-tab {
        margin-bottom: calc(-1 * var(--io_borderWidth));
        transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      :host:not([overflow="-1"]) io-tab {
        /* TODO: make niceer animations */
        pointer-events: none;
        opacity: 0;
      }
      :host[overflow="-1"] io-tabs-hamburger {
        /* TODO: make niceer animations */
        display: none;
      }
      :host > io-tabs-hamburger {
        margin-bottom: var(--io_spacing);
      }
      :host > io-menu-item {
        margin-left: auto;
        flex-shrink: 0;
        opacity: 0.125;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host > io-menu-item:focus,
      :host > io-menu-item:hover {
        opacity: 1;
      }
      :host > io-menu-item > .label,
      :host > io-menu-item > .icon,
      :host > io-menu-item > .hasmore {
        display: none;
      }
    `
  }

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare tabs: NodeArray<Tab>

  @ReactiveProperty({type: Number, value: -1, reflect: true})
  declare overflow: number

  @ReactiveProperty({type: MenuOption})
  declare addMenuOption: MenuOption | undefined

  constructor(args: IoTabsProps) { super(args) }

  tabsMutated() {
    this.changed()
    this.overflow = -1
    this.onResized()
  }

  onResized() {
    const lastElement = this.children[this.children.length - 1]
    if (!lastElement) return

    const rect = this.getBoundingClientRect()
    const lastElementRect = lastElement.getBoundingClientRect()

    if (this.overflow === -1) {
      if (lastElementRect.right > rect.right) {
        this.overflow = rect.width
      }
    } else if (rect.width > (this.overflow + 32)) {
      this.overflow = -1
    }
  }

  changed() {
    const hasOptions = this.addMenuOption && this.addMenuOption.options?.length > 0
    this.render([
      ioTabsHamburger({tabs: this.tabs}),
      ...this.tabs.map(tab => ioTab({tab: tab})),
      hasOptions ?ioMenuItem({
        class: 'io-tabs-add-tab',
        icon: 'io:box_fill_plus',
        direction: 'down',
        option: this.addMenuOption,
      }) : null,
    ])
  }
}

export const ioTabs = function(arg0: IoTabsProps) {
  return IoTabs.vConstructor(arg0)
}