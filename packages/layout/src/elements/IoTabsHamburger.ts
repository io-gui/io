import { Register, NodeArray, Property } from '@io-gui/core'
import { IoField, IoFieldProps } from '@io-gui/inputs'
import { ioIcon } from '@io-gui/icons'
import { Tab } from '../nodes/Tab.js'
import { ioTabsHamburgerMenuSingleton } from './IoTabsHamburgerMenuSingleton.js'

export type IoTabsHamburgerProps = IoFieldProps & {
  tabs: NodeArray<Tab>
}

@Register
export class IoTabsHamburger extends IoField {
  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-shrink: 0;
      }
    `
  }

  @Property({type: NodeArray, init: 'this'})
  declare private tabs: NodeArray<Tab>

  constructor(args: IoTabsHamburgerProps) { super(args) }

  override onClick() {
    ioTabsHamburgerMenuSingleton.expand({
      source: this,
      direction: 'over',
      tabs: this.tabs,
      onEditTab: this.onEditTab,
    })
  }
  onEditTab(event: CustomEvent) {
    this.dispatch('io-edit-tab', {tab: event.detail.tab, key: event.detail.key}, true)
  }
  override mutated() {
    this.render([
      ioIcon({value: 'io:hamburger'})
    ])
  }
}

export const ioTabsHamburger = function(arg0: IoTabsHamburgerProps) {
  return IoTabsHamburger.vConstructor(arg0)
}