import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from '@io-gui/core'
import { ioSelector } from '@io-gui/navigation'
import { IoMenuItem, MenuOption } from '@io-gui/menus'
import { ioTabs } from './IoTabs.js'
import { IoSplit, SplitDirection } from './IoSplit.js'
import { Tab } from '../nodes/Tab.js'
import { Panel } from '../nodes/Panel.js'

export type IoPanelProps = IoElementProps & {
  panel: Panel
  elements: VDOMElement[]
  addMenuOption?: MenuOption
}

@Register
export class IoPanel extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex: 1 1 auto;
        background-color: var(--io_bgColorLight);
      }
      :host > io-selector {
        margin-top: calc(-1 * var(--io_borderWidth));
        border-top: var(--io_border);
        border-top-color: var(--io_borderColorStrong);
      }
    `
  }

  @ReactiveProperty({type: Object})
  declare panel: Panel

  @ReactiveProperty(Array)
  declare elements: VDOMElement[]

  @Property({type: MenuOption})
  declare addMenuOption: MenuOption | undefined

  static get Listeners() {
    return {
      'io-edit-tab': 'onEditTab',
    }
  }

  onEditTab(event: CustomEvent) {
    event.stopPropagation()
    const tab: Tab = event.detail.tab
    const key = event.detail.key
    const index = this.panel.tabs.indexOf(tab)
    if (index === -1) {
      debug: console.warn('IoTabs:Tab not found in panel', tab)
      return
    }
    switch (key) {
      case 'Select': {
        this.selectTab(tab)
        break
      }
      case 'Backspace': {
        this.removeTab(tab)
        break
      }
      case 'ArrowLeft': {
        this.moveTab(tab, index - 1)
        break
      }
      case 'ArrowRight': {
        this.moveTab(tab, index + 1)
        break
      }
    }
  }
  onNewTabClicked(event: CustomEvent) {
    event.stopPropagation()
    const option: MenuOption = event.detail.option
    if (option.id && option.options.length === 0) {
      const tab = new Tab({id: option.id, label: option.label, icon: option.icon})
      this.addTab(tab)
      const addMenuOption = this.querySelector('.io-tabs-add-tab') as IoMenuItem
      if (addMenuOption) addMenuOption.expanded = false
    }
  }
  selectIndex(index: number) {
    index = Math.min(index, this.panel.tabs.length - 1)
    this.panel.setSelected(this.panel.tabs[index].id)
    this.debounce(this.focusTabDebounced, index)
  }
  selectTab(tab: Tab) {
    const index = this.panel.tabs.indexOf(tab)
    this.panel.setSelected(tab.id)
    this.debounce(this.focusTabDebounced, index)
  }
  moveTabToSplit(sourcePanel: IoPanel, tab: Tab, direction: SplitDirection) {
    const parentSplit = this.parentElement as IoSplit
    if (direction === 'center') {
      sourcePanel.removeTab(tab)
      this.addTab(tab)
    } else {
      parentSplit.moveTabToSplit(sourcePanel, this.panel, tab, direction)
    }
  }
  addTab(tab: Tab, index?: number) {
    const existingIndex = this.panel.tabs.findIndex(t => t.id === tab.id)
    if (existingIndex !== -1) {
      console.warn(`IoPanel.addTab: Duplicate tab id "${tab.id}", removing duplicate tab.`)
      this.panel.tabs.splice(existingIndex, 1)
    }
    index = index ?? this.panel.tabs.length
    index = Math.min(index, this.panel.tabs.length)
    this.panel.tabs.splice(index, 0, tab)
    this.selectIndex(index)
  }
  removeTab(tab: Tab) {
    const index = this.panel.tabs.indexOf(tab)
    this.panel.tabs.splice(index, 1)
    if (this.panel.tabs.length > 0) {
      const newIndex = Math.min(index, this.panel.tabs.length - 1)
      this.selectIndex(newIndex)
    } else {
      const parentSplit = this.parentElement as IoSplit
      const isRootPanel = !(parentSplit.parentElement instanceof IoSplit) &&
        parentSplit.split.children.length === 1
      // If this is the last panel at root level, don't remove
      if (!isRootPanel) {
        this.dispatch('io-panel-remove', {panel: this.panel}, true)
      }
    }
  }
  moveTab(tab: Tab, index: number) {
    index = Math.max(Math.min(index, this.panel.tabs.length - 1), 0)
    const currIndex = this.panel.tabs.findIndex(t => t.id === tab.id)
    this.panel.tabs.splice(currIndex, 1)
    index = Math.min(index, this.panel.tabs.length)
    this.panel.tabs.splice(index, 0, tab)
    this.selectIndex(index)
  }
  focusTabDebounced(index: number) {
    const tabs = Array.from(this.querySelectorAll('io-tab')) as HTMLElement[]
    index = Math.min(index, tabs.length - 1)
    if (tabs[index]) tabs[index].focus()
  }
  panelMutated() {
    this.debounce(this.changed)
  }
  getAddMenuOption(): MenuOption | undefined {
    if (this.addMenuOption && this.addMenuOption.options?.length > 0) {
      return this.addMenuOption
    }
    if (!this.elements || this.elements.length === 0) return undefined

    const existingTabIds = new Set(this.panel.tabs.map(tab => tab.id))
    const options = this.elements
      .filter(el => el.props?.id && !existingTabIds.has(el.props.id))
      .map(el => new MenuOption({
        id: el.props!.id,
        label: el.props!.label ?? el.props!.id,
        icon: el.props!.icon ?? '',
      }))

    if (options.length === 0) return undefined
    return new MenuOption({options})
  }
  changed() {
    this.render([
      ioTabs({
        tabs: this.panel.tabs,
        addMenuOption: this.getAddMenuOption(),
        '@io-menu-option-clicked': this.onNewTabClicked,
      }),
      ioSelector({
        caching: 'none', // TODO: Make caching work with mutable elements
        selected: this.panel.getSelected(),
        elements: this.elements,
        anchor: '',
      })
    ])
  }
}
export const ioPanel = function(arg0: IoPanelProps) {
  return IoPanel.vConstructor(arg0)
}