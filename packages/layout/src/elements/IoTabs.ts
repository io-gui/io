import { Register, ReactiveElement, ReactiveElementProps, Property, NodeArray } from '@io-gui/core'
import { ioTab } from './IoTab.js'
import { Tab } from '../models/Tab.js'
import { ioButton } from '@io-gui/inputs'

export type IoTabsProps = ReactiveElementProps & {
  tabs: Array<Tab>
}

@Register
export class IoTabs extends ReactiveElement {

  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
        border-bottom: var(--io_border);
        border-bottom-color: var(--io_borderColorStrong);
        background-color: var(--io_bgColorLight);
      }
      :host:has(io-tab:focus) {
        border-bottom-color: var(--io_colorWhite) !important;
      }
      :host io-tab {
        margin-bottom: calc(-1.25 * var(--io_borderWidth));
      }
      :host io-tab:not([selected]) {
        margin-bottom: 0;
      }
      :host io-button {
        flex: 0 0 auto;
        background-image: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
        margin-left: auto;
        opacity: 0.2;
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      :host:hover io-button {
        opacity: 0.5;
      }
      :host io-button:hover {
        border-color: transparent !important;
        box-shadow: none !important;
        opacity: 1 !important;
      }
    `
  }

  @Property({type: NodeArray, init: 'this'})
  declare tabs: NodeArray<Tab>

  constructor(args: IoTabsProps) {
    super(args)
  }

  tabsMutated() {
    this.mutated()
  }

  onAddTab() {
    this.dispatch('io-add-tab-clicked', undefined, true)
  }

  override mutated() {
    this.render([
      ...this.tabs.map(tab => ioTab({model: tab})),
      ioButton({icon: 'io:layer_add', action: this.onAddTab}),
    ])
  }
}

export const ioTabs = function(arg0: IoTabsProps) {
  return IoTabs.vConstructor(arg0)
}