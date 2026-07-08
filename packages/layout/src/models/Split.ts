import { ReactiveObject, NodeArray, Property, Register, detachNodeParents } from '@io-gui/core'
import { Panel, PanelData } from './Panel.js'
import {
  DEFAULT_SIZE,
  applyLayoutSizeProps,
  isValidSize,
  layoutSizeToJSON,
  ensureOneChildHasAutoSize,
} from '../utils/layoutSize.js'
import { createLayoutChild } from './Layout.js'

export type SplitOrientation = 'horizontal' | 'vertical'

export type SplitData = {
  type: 'split'
  children: Array<SplitData | PanelData>
  orientation?: SplitOrientation
  size?: string
}

@Register
export class Split extends ReactiveObject {

  @Property({type: NodeArray, init: 'this'})
  declare children: NodeArray<Split | Panel>

  @Property({type: String, value: 'horizontal'})
  declare orientation: SplitOrientation

  @Property({type: String, value: DEFAULT_SIZE})
  declare size: string

  constructor(data: SplitData) {
    super()
    this.applyJSON(data)
  }

  childrenMutated() {
    this.debounce(this.onChildrenMutatedDebounced)
  }

  onChildrenMutatedDebounced() {
    this.dispatchMutation()
  }

  normalize() {
    let changed = true
    while (changed) {
      changed = false
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        if (child instanceof Split) {
          const lengthBefore = child.children.length
          child.normalize()
          if (child.children.length !== lengthBefore) changed = true
        }
      }
      this.children.withInternalOperation(() => {
        for (let i = this.children.length; i--;) {
          const child = this.children[i]
          if (child instanceof Panel && child.tabs.length === 0) {
            this.children.splice(i, 1)
            changed = true
          }
        }
        for (let i = this.children.length; i--;) {
          const child = this.children[i]
          if (child instanceof Split && child.children.length === 0) {
            this.children.splice(i, 1)
            changed = true
          }
        }
        for (let i = this.children.length; i--;) {
          const child = this.children[i]
          if (child instanceof Split && child.children.length === 1) {
            this.consolidateChildAt(i, child)
            changed = true
          }
        }
        ensureOneChildHasAutoSize(this.children)
      })
    }
  }

  consolidateChildAt(index: number, childSplit: Split) {
    this.children.withInternalOperation(() => {
      const soleChild = childSplit.children[0]
      if (soleChild instanceof Panel) {
        soleChild.size = childSplit.size
        this.children.splice(index, 1, soleChild)
      } else if (soleChild instanceof Split) {
        const orientationsMatch = this.orientation === soleChild.orientation
        const parentHasOneChild = this.children.length === 1
        if (orientationsMatch || parentHasOneChild) {
          if (parentHasOneChild) this.orientation = soleChild.orientation
          detachNodeParents(soleChild)
          this.children.splice(index, 1, ...soleChild.children)
          ensureOneChildHasAutoSize(this.children)
        } else {
          soleChild.size = childSplit.size
          this.children.splice(index, 1, soleChild)
        }
      }
    })
  }

  sizeChanged() {
    if (!isValidSize(this.size)) {
      debug: {
        console.error(`Split: Invalid size value "${this.size}". Expected "auto", "Npx", "N%", or "Npx auto" / "N% auto".`)
      }
      this.size = DEFAULT_SIZE
    }
  }

  override toJSON(): SplitData {
    const json: SplitData = {
      type: 'split',
      children: this.children.map((child: Split | Panel) => child.toJSON()),
      ...layoutSizeToJSON(this),
    }
    if (this.orientation !== 'horizontal') json.orientation = this.orientation
    return json
  }

  override applyJSON(data: SplitData) {
    this.setProperties({
      children: data.children.map(createLayoutChild),
      orientation: data.orientation ?? 'horizontal',
      ...applyLayoutSizeProps(data),
    })
    return this
  }

}
