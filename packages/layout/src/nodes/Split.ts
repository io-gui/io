import { Node, NodeArray, ReactiveProperty, Register } from '@io-gui/core'
import { Panel, PanelProps } from './Panel.js'

export type SplitOrientation = 'horizontal' | 'vertical'
export type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center'

export type SplitProps = {
  type: 'split'
  children: Array<SplitProps | PanelProps>
  orientation?: SplitOrientation
  flex?: string
}

@Register
export class Split extends Node {

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare children: NodeArray<Split | Panel>

  @ReactiveProperty({type: String, value: 'horizontal'})
  declare orientation: SplitOrientation

  @ReactiveProperty({type: String, value: '1 1 100%'})
  declare flex: string

  constructor(args: SplitProps) {
    debug: {
      if (args.type !== 'split') {
        console.error(`Split: Invalid type "${args.type}". Expected "split".`)
      }
    }

    let processedChildren: Array<Split | Panel> = args.children.map(child => {
      if (child.type === 'panel') {
        return new Panel(child)
      } else {
        return new Split(child)
      }
    })

    let orientation = args.orientation

    // Consolidate splits containing only one split as child
    while (processedChildren.length === 1 && processedChildren[0] instanceof Split) {
      const soleChild = processedChildren[0]
      orientation = soleChild.orientation
      processedChildren = [...soleChild.children]
    }

    super({
      ...args,
      children: processedChildren,
      orientation,
    })
  }
  childrenMutated() {
    this.debounce(this.onChildrenMutatedDebounced)
  }
  onChildrenMutatedDebounced() {
    this.dispatchMutation()
  }
  toJSON(): SplitProps {
    return {
      type: 'split',
      children: this.children.map((child: Split | Panel): SplitProps | PanelProps => child.toJSON()),
      orientation: this.orientation,
      flex: this.flex,
    }
  }
  fromJSON(json: SplitProps) {
    debug: {
      if (json.type !== 'split') {
        console.error(`Split.fromJSON: Invalid type "${json.type}". Expected "split".`)
      }
    }
    this.setProperties({
      children: json.children.map((child) => {
        if (child.type === 'panel') {
          return new Panel(child)
        } else {
          return new Split(child)
        }
      }),
      orientation: json.orientation ?? 'horizontal',
      flex: json.flex ?? '1 1 100%',
    })
    return this
  }
  dispose() {
    this.children.length = 0 // TODO: test magic!
    super.dispose()
  }
}