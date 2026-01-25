import { Node, NodeArray, ReactiveProperty, Register } from '@io-gui/core'
import { Panel, PanelProps } from './Panel.js'

export type SplitOrientation = 'horizontal' | 'vertical'

export type SplitProps = {
  type: 'split'
  children: Array<SplitProps | PanelProps>
  orientation?: SplitOrientation
  flex?: string
}

function createChild(child: SplitProps | PanelProps): Split | Panel {
  return child.type === 'panel' ? new Panel(child) : new Split(child)
}

function consolidateChildren(
  children: Array<Split | Panel>,
  orientation: SplitOrientation
): { children: Array<Split | Panel>; orientation: SplitOrientation } {
  let result = children
  let resultOrientation = orientation
  while (result.length === 1 && result[0] instanceof Split) {
    const soleChild = result[0]
    resultOrientation = soleChild.orientation
    result = [...soleChild.children]
  }
  return { children: result, orientation: resultOrientation }
}

@Register
export class Split extends Node {

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare children: NodeArray<Split | Panel>

  @ReactiveProperty({type: String, value: 'horizontal'})
  declare orientation: SplitOrientation

  @ReactiveProperty({type: String, value: '1 1 auto'})
  declare flex: string

  constructor(args: SplitProps) {
    debug: {
      if (args.type !== 'split') {
        console.error(`Split: Invalid type "${args.type}". Expected "split".`)
      }
    }

    const processedChildren = args.children.map(createChild)
    const consolidated = consolidateChildren(processedChildren, args.orientation ?? 'horizontal')

    super({
      ...args,
      children: consolidated.children,
      orientation: consolidated.orientation,
    })
  }
  childrenMutated() {
    this.debounce(this.onChildrenMutatedDebounced)
  }
  onChildrenMutatedDebounced() {
    this.dispatchMutation()
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
  toJSON(): SplitProps {
    const json: SplitProps = {
      type: 'split',
      children: this.children.map((child: Split | Panel) => child.toJSON()),
    }
    if (this.orientation !== 'horizontal') json.orientation = this.orientation
    if (this.flex !== '1 1 auto') json.flex = this.flex
    return json
  }
  fromJSON(json: SplitProps) {
    debug: {
      if (json.type !== 'split') {
        console.error(`Split.fromJSON: Invalid type "${json.type}". Expected "split".`)
      }
    }
    const processedChildren = json.children.map(createChild)
    const consolidated = consolidateChildren(processedChildren, json.orientation ?? 'horizontal')

    this.setProperties({
      children: consolidated.children,
      orientation: consolidated.orientation,
      flex: json.flex ?? '1 1 auto',
    })
    return this
  }
  dispose() {
    this.children.length = 0
    super.dispose()
  }
}