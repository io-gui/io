import { ReactiveObject, NodeArray, Property, Register } from '@io-gui/core'
import { Tab, TabData } from './Tab.js'
import {
  DEFAULT_SIZE,
  LayoutSizeData,
  applyLayoutSizeProps,
  isValidSize,
  layoutSizeToJSON,
} from '../utils/layoutSize.js'

export type PanelData = {
  type: 'panel'
  tabs: Array<TabData>
} & LayoutSizeData

@Register
export class Panel extends ReactiveObject {

  @Property({type: NodeArray, init: 'this'})
  declare tabs: NodeArray<Tab>

  @Property({type: String, value: DEFAULT_SIZE})
  declare size: string

  constructor(data: PanelData) {
    super()
    this.applyJSON(data)
  }

  tabsMutated() {
    this.debounce(this.onTabsMutatedDebounced)
  }

  onTabsMutatedDebounced() {
    this.dispatchMutation()
  }

  getSelected() {
    let selected = ''
    for (let i = 0; i < this.tabs.length; i++) {
      const item = this.tabs[i]
      if (item.selected && item.id) {
        selected = item.id
        break
      }
    }
    return selected
  }

  setSelected(id: string) {
    this.tabs.withInternalOperation(() => {
      for (let i = 0; i < this.tabs.length; i++) {
        const item = this.tabs[i]
        if (item.id === id) {
          item.selected = true
        } else {
          item.selected = false
        }
      }
    })
    this.tabs.dispatchMutation()
  }

  addTab(tab: Tab, index?: number) {
    const existingIndex = this.tabs.findIndex(t => t.id === tab.id)
    if (existingIndex !== -1) {
      console.warn(`Panel.addTab: Duplicate tab id "${tab.id}", removing duplicate tab.`)
      this.tabs.splice(existingIndex, 1)
    }
    index = index ?? this.tabs.length
    index = Math.min(index, this.tabs.length)
    this.tabs.splice(index, 0, tab)
    this.selectIndex(index)
  }

  removeTab(tab: Tab) {
    const index = this.tabs.indexOf(tab)
    if (index === -1) return
    this.tabs.splice(index, 1)
    if (this.tabs.length > 0) {
      const newIndex = Math.min(index, this.tabs.length - 1)
      this.selectIndex(newIndex)
    }
  }

  moveTab(tab: Tab, index: number) {
    index = Math.max(Math.min(index, this.tabs.length - 1), 0)
    const currIndex = this.tabs.findIndex(t => t.id === tab.id)
    if (currIndex === -1) return
    this.tabs.splice(currIndex, 1)
    index = Math.min(index, this.tabs.length)
    this.tabs.splice(index, 0, tab)
    this.selectIndex(index)
  }

  selectIndex(index: number) {
    index = Math.min(index, this.tabs.length - 1)
    if (index >= 0 && this.tabs.length > 0) {
      this.setSelected(this.tabs[index].id)
    }
  }

  sizeChanged() {
    if (!isValidSize(this.size)) {
      debug: {
        console.error(`Panel: Invalid size value "${this.size}". Expected "auto", "Npx", "N%", or "Npx auto" / "N% auto".`)
      }
      this.size = DEFAULT_SIZE
    }
  }

  override toJSON(): PanelData {
    const data: PanelData = {
      type: 'panel',
      tabs: this.tabs.map(tab => tab.toJSON()),
      ...layoutSizeToJSON(this),
    }
    return data
  }

  override applyJSON(data: PanelData) {
    const tabs = data.tabs.map(tab => new Tab(tab))
    if (tabs.length > 0 && !tabs.some(tab => tab.selected && tab.id)) {
      const first = tabs.find(tab => tab.id)
      if (first) first.selected = true
    }
    this.setProperties({
      tabs,
      ...applyLayoutSizeProps(data),
    })
    return this
  }

}
