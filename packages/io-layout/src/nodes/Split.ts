import { Node, NodeArray, ReactiveProperty, Register } from 'io-gui';
import { Panel, PanelProps } from './Panel.js';

export type SplitOrientation = 'horizontal' | 'vertical';
export type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center';

export type SplitProps = {
  children: Array<SplitProps | PanelProps>,
  orientation?: SplitOrientation,
  flex?: string,
};

@Register
export class Split extends Node {

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare children: NodeArray<Split | Panel>;

  @ReactiveProperty({type: String, value: 'horizontal'})
  declare orientation: SplitOrientation;

  @ReactiveProperty({type: String, value: '1 1 100%'})
  declare flex: string;

  constructor(args: SplitProps) {
    args = { ...args };
    for (let i = 0; i < args.children.length; i++) {
      const panelChild = args.children[i] as PanelProps;
      const splitChild = args.children[i] as SplitProps;
      if (panelChild.tabs) {
        args.children[i] = new Panel(panelChild);
      } else if (splitChild.children) {
        args.children[i] = new Split(splitChild);
      }
    }
    super(args);
  }
  childrenMutated() {
    this.debounce(this.onChildrenMutatedDebounced);
  }
  onChildrenMutatedDebounced() {
    this.dispatchMutation();
  }
  toJSON(): SplitProps {
    return {
      children: this.children.map((child: Split | Panel): SplitProps | PanelProps => child.toJSON()),
      orientation: this.orientation,
      flex: this.flex,
    };
  }
  fromJSON(json: SplitProps) {
    this.setProperties({
      children: json.children.map((child: SplitProps | PanelProps) => {
        const panelChild = child as PanelProps;
        const splitChild = child as SplitProps;
        if (panelChild.tabs) {
          return new Panel(panelChild);
        } else if (splitChild.children) {
          return new Split(splitChild);
        }
      }),
      orientation: json.orientation ?? 'horizontal',
      flex: json.flex ?? '1 1 100%',
    });
    return this;
  }
  dispose() {
    this.children.length = 0; // TODO: test magic!
    super.dispose();
  }
}