import { Register, ReactiveProperty, VDOMElement, IoElement, IoElementProps, Property, ThemeSingleton } from '@io-gui/core'
import { MenuOption } from '@io-gui/menus'
import { IoPanel, ioPanel } from './IoPanel.js'
import { ioDivider } from './IoDivider.js'
import { Split, SplitOrientation } from '../nodes/Split.js'
import { Panel } from '../nodes/Panel.js'
import { Tab } from '../nodes/Tab.js'

export type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center'

function sizeToFlex(size: number | 'auto'): string {
  return size === 'auto' ? '1 1 auto' : `0 0 ${size}px`
}

export type IoSplitProps = IoElementProps & {
  split: Split
  elements: VDOMElement[]
  addMenuOption?: MenuOption
}

@Register
export class IoSplit extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: row;
      }
      :host[orientation='vertical'] {
        flex-direction: column;
      }
    `
  }

  @ReactiveProperty({type: Object})
  declare split: Split

  @ReactiveProperty(Array)
  declare elements: VDOMElement[]

  @ReactiveProperty({type: Object, value: null})
  declare leadingDrawer: Split | Panel | null

  @ReactiveProperty({type: Object, value: null})
  declare trailingDrawer: Split | Panel | null

  @Property({type: MenuOption})
  declare addMenuOption: MenuOption | undefined  

  static get Listeners() {
    return {
      'io-divider-move': 'onDividerMove',
      'io-divider-move-end': 'onDividerMoveEnd',
      'io-panel-remove': 'onPanelRemove',
      'io-split-remove': 'onSplitRemove',
      'io-split-consolidate': 'onSplitConsolidate',
    }
  }
  // TODO: Make sure one panel is available even when all tabs are removed.

  constructor(args: IoSplitProps) {
    super(args)
  }

  onResized() {
    this.debounce(this.calculateCollapsedDrawersDebounced)
  }
  calculateCollapsedDrawersDebounced() {
    const split = this.split
    const children = split.children
    const orientation = split.orientation
    const rect = this.getBoundingClientRect()
    let size: number = Infinity
    let minSize = 0
    const sizes: Array<number> = []

    if (orientation ===  'horizontal') {
      size = rect.width
    } else {
      size = rect.height
    }
    children.forEach(child => {
      if (child.size === 'auto') {
        // TODO: implement minsize prop
        minSize += 300
        sizes.push(300)
      } else if (typeof child.size === 'number') {
        minSize += child.size
        sizes.push(child.size)
      } else {
        debug: {
          console.error('IoSplit: Cannot determine minSize of split!')
        }
      }
    })

    let collapsePriority: 'start' | 'end' = 'end'
    const lastIndex = children.length - 1 
    const bothAuto = children[0].size === 'auto' && children[lastIndex].size === 'auto'
    const noneAuto = children[0].size !== 'auto' && children[lastIndex].size !== 'auto'
    if (noneAuto) {
      collapsePriority = children[0].size <= children[lastIndex].size ? 'start' : 'end'
    } else if (!bothAuto) {
      collapsePriority = children[lastIndex].size === 'auto' ? 'start' : 'end'
    }
    const collapsedSize = collapsePriority === 'start' ? sizes[0] : sizes[sizes.length - 1]

    if (size < minSize) {
      if (children.length >= 3 && size < (minSize - collapsedSize)) {
        this.setProperties({
          leadingDrawer: children[0],
          trailingDrawer: children[lastIndex],
        })
      } else if (children.length >= 2) {
        if (collapsePriority === 'start') {
          this.setProperties({
            leadingDrawer: children[0],
            trailingDrawer: null,
          })
        } else {
          this.setProperties({
            leadingDrawer: null,
            trailingDrawer: children[lastIndex],
          })
        }
      }

    } else {
      this.setProperties({
        leadingDrawer: null,
        trailingDrawer: null,
      })
    }
  }

  onDividerMove(event: CustomEvent) {
    event.stopPropagation()
    const dividerIndex = event.detail.index
    const rect = this.getBoundingClientRect()
    const orientation = this.split.orientation
    const dividerSize = ThemeSingleton.spacing3
    const minSize = ThemeSingleton.fieldHeight * 4

    const splits: HTMLElement[] = []
    for (let i = 0; i < this.children.length; i += 2) {
      splits.push(this.children[i] as HTMLElement)
    }

    const isFirstDivider = dividerIndex === 0
    const isLastDivider = dividerIndex === splits.length - 2

    if (isFirstDivider) {
      const splitElement = splits[0]
      const splitRect = splitElement.getBoundingClientRect()
      const pointerPos = orientation === 'horizontal'
        ? event.detail.clientX - splitRect.left - dividerSize / 2
        : event.detail.clientY - splitRect.top - dividerSize / 2

      let fixedSpaceAfter = 0
      let autoCountAfter = 0
      for (let i = 1; i < splits.length; i++) {
        const child = this.split.children[i]
        if (child.size === 'auto') {
          autoCountAfter++
        } else {
          fixedSpaceAfter += child.size
        }
      }
      const totalDividerSpace = dividerSize * (splits.length - 1)
      const totalSpace = (orientation === 'horizontal' ? rect.width : rect.height) - totalDividerSpace
      const maxSize = totalSpace - minSize * autoCountAfter - fixedSpaceAfter
      const size = Math.max(minSize, Math.min(maxSize, pointerPos))
      splitElement.style.flex = `0 0 ${size}px`

    } else if (isLastDivider) {
      const splitElement = splits[splits.length - 1]
      const pointerPos = orientation === 'horizontal'
        ? rect.right - event.detail.clientX - dividerSize / 2
        : rect.bottom - event.detail.clientY - dividerSize / 2

      let fixedSpaceBefore = 0
      let autoCountBefore = 0
      for (let i = 0; i < splits.length - 1; i++) {
        const child = this.split.children[i]
        if (child.size === 'auto') {
          autoCountBefore++
        } else {
          fixedSpaceBefore += child.size
        }
      }
      const totalDividerSpace = dividerSize * (splits.length - 1)
      const totalSpace = (orientation === 'horizontal' ? rect.width : rect.height) - totalDividerSpace
      const maxSize = totalSpace - minSize * autoCountBefore - fixedSpaceBefore
      const size = Math.max(minSize, Math.min(maxSize, pointerPos))
      splitElement.style.flex = `0 0 ${size}px`

    } else {
      const leftSplit = splits[dividerIndex]
      const rightSplit = splits[dividerIndex + 1]
      const leftRect = leftSplit.getBoundingClientRect()
      const rightRect = rightSplit.getBoundingClientRect()

      const combinedSize = orientation === 'horizontal'
        ? leftRect.width + rightRect.width
        : leftRect.height + rightRect.height

      const pointerPos = orientation === 'horizontal'
        ? event.detail.clientX - leftRect.left - dividerSize / 2
        : event.detail.clientY - leftRect.top - dividerSize / 2

      const leftSize = Math.max(minSize, Math.min(combinedSize - minSize, pointerPos))
      const rightSize = combinedSize - leftSize

      leftSplit.style.flex = `0 0 ${leftSize}px`
      rightSplit.style.flex = `0 0 ${rightSize}px`
    }
  }

  onDividerMoveEnd(event: CustomEvent) {
    event.stopPropagation()
    const dividerIndex = event.detail.index
    const orientation = this.split.orientation

    const splits: HTMLElement[] = []
    for (let i = 0; i < this.children.length; i += 2) {
      splits.push(this.children[i] as HTMLElement)
    }

    const isFirstDivider = dividerIndex === 0
    const isLastDivider = dividerIndex === splits.length - 2

    if (isFirstDivider) {
      const splitElement = splits[0]
      const rect = splitElement.getBoundingClientRect()
      const size = Math.round(orientation === 'horizontal' ? rect.width : rect.height)
      this.split.children[0].size = size

    } else if (isLastDivider) {
      const splitElement = splits[splits.length - 1]
      const rect = splitElement.getBoundingClientRect()
      const size = Math.round(orientation === 'horizontal' ? rect.width : rect.height)
      this.split.children[splits.length - 1].size = size

    } else {
      const leftSplit = splits[dividerIndex]
      const rightSplit = splits[dividerIndex + 1]
      const leftRect = leftSplit.getBoundingClientRect()
      const rightRect = rightSplit.getBoundingClientRect()

      const leftSize = Math.round(orientation === 'horizontal' ? leftRect.width : leftRect.height)
      const rightSize = Math.round(orientation === 'horizontal' ? rightRect.width : rightRect.height)

      this.split.children[dividerIndex].size = leftSize
      this.split.children[dividerIndex + 1].size = rightSize
    }
    this.ensureAutoSize()
    this.debounce(this.calculateCollapsedDrawersDebounced)
  }

  onPanelRemove(event: CustomEvent) {
    event.stopPropagation()
    for (let i = this.split.children.length; i--;) {
      const child = this.split.children[i]
      if (child instanceof Panel && child.tabs.length === 0) {
        this.split.children.splice(i, 1)
      }
    }
    if (this.split.children.length === 0) {
      this.dispatch('io-split-remove', {split: this.split}, true)
    } else if (this.split.children.length === 1) {
      this.dispatch('io-split-consolidate', {split: this.split}, true)
    }
    this.ensureAutoSize()
  }

  onSplitRemove(event: CustomEvent) {
    if (event.detail.split === this.split) return
    event.stopPropagation()
    const index = this.split.children.indexOf(event.detail.split)
    if (index === -1) return
    this.split.children.splice(index, 1)

    if (this.split.children.length === 1) {
      this.dispatch('io-split-consolidate', {split: this.split}, true)
    }
    this.ensureAutoSize()
  }

  ensureAutoSize() {
    const hasAutoSize = this.split.children.some(child => child.size === 'auto')
    if (!hasAutoSize && this.split.children.length > 0) {
      this.split.children[0].size = 'auto'
    }
  }

  onSplitConsolidate(event: CustomEvent) {
    if (event.detail.split === this.split) return
    event.stopPropagation()
    this.consolidateChild(event.detail.split)
    // Recursive consolidation: if this split now has only 1 child, propagate up the tree
    if (this.split.children.length === 1) {
      this.dispatch('io-split-consolidate', {split: this.split}, true)
    }
  }

  convertToSplit(panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation) {
    const index = this.split.children.indexOf(panel)
    const newSplit = new Split({type: 'split', orientation, children: []})
    newSplit.children.push(first, second)
    this.split.children.splice(index, 1, newSplit)
  }

  consolidateChild(childSplit: Split) {
    const index = this.split.children.indexOf(childSplit)
    if (index === -1 || childSplit.children.length === 0) return
    const soleChild = childSplit.children[0]
    if (soleChild instanceof Panel) {
      soleChild.size = 'auto'
      this.split.children.splice(index, 1, soleChild)
    } else if (soleChild instanceof Split) {
      this.split.orientation = soleChild.orientation
      this.split.children.splice(index, 1, ...soleChild.children)
      this.ensureAutoSize()
    }
  }

  moveTabToSplit(sourcePanel: IoPanel, panel: Panel, tab: Tab, direction: SplitDirection) {
    const index = this.split.children.indexOf(panel)
    let orientation: SplitOrientation = 'horizontal'
    if (direction === 'top' || direction === 'bottom') {
      orientation = 'vertical'
    }
    let newIndex = ['left', 'top'].includes(direction) ? index - 1 : index + 1

    if (this.split.orientation === orientation) {
      newIndex = Math.max(0, newIndex)
      this.split.children.splice(newIndex, 0, new Panel({type: 'panel', tabs: [tab]}))
      sourcePanel.removeTab(tab)
    } else {
      if (panel.tabs.length > 1 || panel !== sourcePanel.panel) {
        sourcePanel.removeTab(tab)
        if (newIndex === -1) {
          this.convertToSplit(panel, new Panel({type: 'panel', tabs: [tab]}), panel, orientation)
        } else {
          this.convertToSplit(panel, panel, new Panel({type: 'panel', tabs: [tab]}), orientation)
        }
      }
    }
  }
  splitMutated() {
    this.debounce(this.changed)
  }
  changed() {
    this.setAttribute('orientation', this.split.orientation)
    this.style.flex = sizeToFlex(this.split.size)
    const lastIndex = this.split.children.length - 1
    // TODO: Validate split
    const vChildren: VDOMElement[] = []
    for (let i = 0; i < this.split.children.length; i++) {

      if (i === 0 && this.leadingDrawer !== null) {
        continue
      }
      if (i === lastIndex && this.trailingDrawer !== null) {
        continue
      }

      const child = this.split.children[i]
      if (child instanceof Split) {
        vChildren.push(ioSplit({
          split: child,
          style: {flex: sizeToFlex(child.size)},
          elements: this.elements,
          addMenuOption: this.addMenuOption,
        }))
      } else if (child instanceof Panel) {
        vChildren.push(ioPanel({
          panel: child,
          style: {flex: sizeToFlex(child.size)},
          elements: this.elements,
          addMenuOption: this.addMenuOption,
        }))
      } else debug: {
        console.warn('IOSplit: Invalid child type', child)
      }

      let lastDividerIndex = this.trailingDrawer === null ? lastIndex : lastIndex - 1
      if (i < lastDividerIndex) {
        vChildren.push(ioDivider({orientation: this.split.orientation, index: i}))
      }
    }
    this.render(vChildren)
  }
}
export const ioSplit = function(arg0: IoSplitProps) {
  return IoSplit.vConstructor(arg0)
}
