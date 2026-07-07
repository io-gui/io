import { ReactiveObject, Property, Register } from '@io-gui/core'
import { SplitDirection } from '../types/SplitDirection.js'
import { DEFAULT_SIZE } from '../utils/layoutSize.js'
import { Panel, PanelData } from './Panel.js'
import { Split, SplitData, SplitOrientation } from './Split.js'
import { Tab } from './Tab.js'

export type LayoutChildData = SplitData | PanelData
export type LayoutChild = Split | Panel

export type LayoutData = { child: LayoutChildData }

export function createLayoutChild(child: SplitData | PanelData): Split | Panel {
  return child.type === 'panel' ? new Panel(child) : new Split(child)
}

export function isPanelNode(node: LayoutChild): node is Panel {
  return (node as Panel).tabs !== undefined
}

export function isSplitNode(node: LayoutChild): node is Split {
  return (node as Split).children !== undefined
}

@Register
export class Layout extends ReactiveObject {

  @Property({type: Object})
  declare child: LayoutChild

  constructor(data: LayoutData) {
    super()
    this.applyJSON(data)
  }

  childMutated() {
    this.debounce(this.dispatchMutationDebounced, undefined, 2)
  }

  dispatchMutationDebounced() {
    this.dispatchMutation()
    this.normalize()
  }

  normalize() {
    if (isSplitNode(this.child)) {
      this.child.normalize()
      if (this.child.children.length === 1) {
        this.child = this.child.children[0]
      } else if (this.child.children.length === 0) {
        this.child = new Panel({ type: 'panel', tabs: [] })
      }
    }
    if (isSplitNode(this.child) && !this.containsPanel(this.child)) {
      this.child = new Panel({ type: 'panel', tabs: [] })
    }
  }

  containsPanel(node: LayoutChild): boolean {
    if (isPanelNode(node)) return true
    for (let i = 0; i < node.children.length; i++) {
      if (this.containsPanel(node.children[i])) return true
    }
    return false
  }

  findPanelWithTab(node: LayoutChild, tab: Tab): Panel | null {
    if (isPanelNode(node)) return node.tabs.includes(tab) ? node : null
    // Recursively search through split's children
    for (let i = 0; i < node.children.length; i++) {
      const found = this.findPanelWithTab(node.children[i], tab)
      if (found) return found
    }
    return null
  }

  moveTab(tab: Tab, targetPanel: Panel, direction: SplitDirection, tabIndex: number) {
    const source = this.findPanelWithTab(this.child, tab)
    if (!source) return

    if (direction === 'center') {
      if (source === targetPanel) {
        source.moveTab(tab, tabIndex)
      } else {
        source.removeTab(tab)
        targetPanel.addTab(tab, tabIndex)
      }
      return
    }

    let orientation: SplitOrientation = 'horizontal'
    if (direction === 'top' || direction === 'bottom') {
      orientation = 'vertical'
    }

    const parentSplit = this.findParentSplit(targetPanel)
    if (!parentSplit) {
      if (targetPanel !== this.child) return
      if (!(targetPanel.tabs.length > 1 || targetPanel !== source)) return

      source.removeTab(tab)
      const newPanel = new Panel({ type: 'panel', tabs: [tab] })
      const newSplit = new Split({ type: 'split', orientation, children: [] })
      if (['left', 'top'].includes(direction)) {
        newSplit.children.push(newPanel, targetPanel)
      } else {
        newSplit.children.push(targetPanel, newPanel)
      }
      this.child = newSplit
      return
    }

    const index = parentSplit.children.indexOf(targetPanel)
    let newIndex = ['left', 'top'].includes(direction) ? index - 1 : index + 1

    if (parentSplit.orientation === orientation) {
      newIndex = Math.max(0, newIndex)
      source.removeTab(tab)
      parentSplit.children.splice(newIndex, 0, new Panel({ type: 'panel', tabs: [tab] }))

    } else if (targetPanel.tabs.length > 1 || targetPanel !== source) {

      source.removeTab(tab)
      if (['left', 'top'].includes(direction)) {
        this.convertToSplit(parentSplit, targetPanel, new Panel({ type: 'panel', tabs: [tab] }), targetPanel, orientation)
      } else {
        this.convertToSplit(parentSplit, targetPanel, targetPanel, new Panel({ type: 'panel', tabs: [tab] }), orientation)
      }
    }
  }

  findParentSplit(panel: Panel): Split | null {
    for (let i = 0; i < panel._parents.length; i++) {
      const parent = panel._parents[i]
      if (parent instanceof Split) {
        return parent
      }
    }
    return null
  }

  convertToSplit(parentSplit: Split, panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation) {
    const index = parentSplit.children.indexOf(panel)
    const newSplit = new Split({ type: 'split', orientation, children: [] })
    newSplit.size = panel.size
    panel.size = DEFAULT_SIZE
    newSplit.children.push(first, second)
    parentSplit.children.splice(index, 1, newSplit)
  }

  override toJSON(): LayoutData {
    return {
      child: this.child.toJSON() as LayoutChildData,
    }
  }

  override applyJSON(data: LayoutData) {
    this.child = createLayoutChild(data.child)
    return this
  }
}
