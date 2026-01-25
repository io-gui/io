import { ReactiveNode, NodeArray, ReactiveProperty, Register } from '@io-gui/core'
import { Tab, TabProps } from './Tab.js'

export type PanelProps = {
  type: 'panel'
  tabs: Array<TabProps>
  flex?: string
}

function deduplicateTabs<T extends TabProps>(tabs: Array<T>, context: string): Array<T> {
  const seenIds = new Set<string>()
  const uniqueTabs: Array<T> = []
  for (const tab of tabs) {
    if (seenIds.has(tab.id)) {
      console.warn(`${context}: Duplicate tab id "${tab.id}" - keeping first occurrence`)
    } else {
      seenIds.add(tab.id)
      uniqueTabs.push(tab)
    }
  }
  return uniqueTabs
}

@Register
export class Panel extends ReactiveNode {

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare tabs: NodeArray<Tab>

  @ReactiveProperty({type: String, value: '1 1 auto'})
  declare flex: string

  constructor(args: PanelProps) {
    debug: {
      if (args.type !== 'panel') {
        console.error(`Panel: Invalid type "${args.type}". Expected "panel".`)
      }
    }
    args = { ...args }
    args.tabs = deduplicateTabs(args.tabs, 'Panel')

    if (args.tabs.length > 0 && !args.tabs.find(tab => tab.selected)) {
      args.tabs[0].selected = true
    }
    args.tabs = args.tabs.map(tab => new Tab({...tab}))
    super(args)
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
    // TODO Test and reconsider withInternalOperation
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
  flexChanged() {
    const flexRegex = /^[\d.]+\s+[\d.]+\s+(?:auto|[\d.]+(?:px|%))$/
    if (!flexRegex.test(this.flex)) {
      debug: {
        console.error(`Split: Invalid flex value "${this.flex}". Expected a valid CSS flex value.`)
      }
      this.flex = '0 1 auto'
    }
  }
  toJSON(): PanelProps {
    const json: PanelProps = {
      type: 'panel',
      tabs: this.tabs.map(tab => tab.toJSON()),
    }
    if (this.flex !== '1 1 auto') json.flex = this.flex
    return json
  }
  fromJSON(json: PanelProps) {
    debug: {
      if (json.type !== 'panel') {
        console.error(`Panel.fromJSON: Invalid type "${json.type}". Expected "panel".`)
      }
    }
    const uniqueTabs = deduplicateTabs(json.tabs, 'Panel.fromJSON')
    this.setProperties({
      tabs: uniqueTabs.map(tab => new Tab(tab)),
      flex: json.flex ?? '1 1 auto',
    })
    return this
  }
  dispose() {
    this.tabs.length = 0
    super.dispose()
  }
}