import { Register, IoElement, IoElementProps, ReactiveProperty, Property, NodeArray } from '@io-gui/core'
import { MenuOption, ioMenuItem } from '@io-gui/menus'
import { ioTab } from './IoTab.js'
import { ioTabsHamburger } from './IoTabsHamburger.js'
import { Tab } from '../nodes/Tab.js'

export type IoTabsProps = IoElementProps & {
  tabs: NodeArray<Tab>
  addMenuOption?: MenuOption
}

@Register
export class IoTabs extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        background-color: var(--io_bgColorStrong);
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
      }
      :host io-tab {
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
        /* transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1); */
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

  @Property({type: MenuOption})
  declare addMenuOption: MenuOption | undefined

  constructor(args: IoTabsProps) { super(args) }

  tabsMutated() {
    this.changed()

    this.overflow = -1
    this.onResized()
  }

  onResized() {
    const addMenu = this.querySelector('.add-tab')
    // TODO: It appears that addMenu rect is required for overflow calculation to work correctly.
    // But it is not guaranteed to be available since addMenuOptions is optional. Fix!
    if (!addMenu) return

    const rect = this.getBoundingClientRect()
    const addMenuRect = addMenu.getBoundingClientRect()

    if (this.overflow === -1) {
      if (addMenuRect.right > rect.right) {
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
        class: 'add-tab',
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