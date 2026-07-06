import { Register, ReactiveElement, VDOMElement, ReactiveElementProps, Property, CallbackFunction } from '@io-gui/core'
import { ioSelector } from '@io-gui/navigation'
import { ioTabs } from './IoTabs.js'
import { Tab } from '../models/Tab.js'
import { Panel } from '../models/Panel.js'
import { TabActions } from './IoTab.js'

export type IoPanelData = ReactiveElementProps & {
  model: Panel
  elements: VDOMElement[]
}

@Register
export class IoPanel extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex: 1 1 auto;
        background-color: var(--io_bgColor);
      }
    `
  }

  @Property({type: Object})
  declare model: Panel

  @Property(Array)
  declare elements: VDOMElement[]

  static override get Listeners() {
    return {
      'io-tab-action': 'onTabAction',
      'io-add-tab-clicked': 'onAddTabClicked',
      'io-panel-tab-selected': 'onPanelTabSelected'
    }
  }

  onTabAction(event: CustomEvent) {
    event.stopPropagation()
    const tabModel: Tab = event.detail.model
    const action = event.detail.action as TabActions
    const index = this.model.tabs.indexOf(tabModel)
    if (index === -1) return
    switch (action) {
      case 'select': {
        this.model.selectByIndex(index)
        break
      }
      case 'delete': {
        this.model.removeTab(tabModel)
        break
      }
      case 'move-left': {
        this.model.moveTab(tabModel, index - 1)
        break
      }
      case 'move-right': {
        this.model.moveTab(tabModel, index + 1)
        break
      }
      case 'move-start': {
        this.model.moveTab(tabModel, 0)
        break
      }
      case 'move-end': {
        this.model.moveTab(tabModel, this.model.tabs.length - 1)
        break
      }
    }
  }

  onPanelTabSelected(event: CustomEvent) {
    event.stopPropagation()
    this.debounce(this.focusTabDebounced as CallbackFunction, event.detail.index)
  }

  onAddTabClicked(event: CustomEvent) {
    event.stopPropagation()
    this.dispatch('io-add-tab-request', {model: this.model}, true)
  }

  focusTabDebounced(index: number) {
    const tabs = Array.from(this.querySelectorAll('io-tab')) as HTMLElement[]
    index = Math.min(index, tabs.length - 1)
    if (tabs[index]) tabs[index].focus()
  }

  modelMutated() {
    this.debounce(this.mutated)
  }

  override mutated() {
    this.render([
      ioTabs({
        tabs: this.model.tabs,
      }),
      ioSelector({
        // TODO: Investigate caching for edge cases
        caching: 'reactive',
        selected: this.model.selectedID,
        elements: this.elements,
        anchor: '',
      })
    ])
  }

}

export const ioPanel = function(arg0: IoPanelData) {
  return IoPanel.vConstructor(arg0)
}
