import { Node, NodeProps, ReactiveProperty, Register } from 'io-gui';
import { Panel, PanelProps } from './Panel.js';

export type SplitOrientation = 'horizontal' | 'vertical';

export type SplitProps = NodeProps & {
  orientation?: SplitOrientation,
  children?: Array<Split | Panel> | Array<SplitProps | PanelProps>,
  flex?: string,
};

@Register
export class Split extends Node {
  @ReactiveProperty({type: String, value: 'horizontal'})
  declare orientation: SplitOrientation;

  @ReactiveProperty({type: Array, value: []})
  declare children: Array<Split | Panel>;

  @ReactiveProperty({type: String, value: ''})
  declare flex: string;

  constructor(args?: SplitProps) {
    if (args?.children) {
      for (let i = 0; i < args.children.length; i++) {
        if (!(args.children[i] instanceof Split) && !(args.children[i] instanceof Panel)) {
          if ((args.children[i] as PanelProps).tabs) {
            args.children[i] = new Panel(args.children[i] as PanelProps);
          } else {
            args.children[i] = new Split(args.children[i] as SplitProps);
          }
        }
      }
    }
    super(args);
  }

  remove(child: Panel | Split) {
    this.children = this.children.filter((c: Split | Panel) => c !== child);
    this.dispatchEvent('object-mutated', {object: this});
  }

  toJSON(): SplitProps {
    return {
      orientation: this.orientation,
      children: this.children.map((child: Split | Panel): SplitProps | PanelProps => child.toJSON()),
      flex: this.flex,
    };
  }

  fromJSON(json: SplitProps) {
    if (json.orientation) this.orientation = json.orientation;
    if (json.children) this.children = json.children.map((child: SplitProps | PanelProps): Split | Panel => new Split(child));
    if (json.flex) this.flex = json.flex;
    return this;
  }
}