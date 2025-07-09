import { Node, NodeProps, ReactiveProperty, Register } from 'io-gui';
import { Panel, PanelProps } from './Panel.js';

export type SplitOrientation = 'horizontal' | 'vertical';
export type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center';

export type SplitProps = NodeProps & {
  orientation?: SplitOrientation,
  children: Array<Split | Panel | SplitProps | PanelProps>,
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

  constructor(args: SplitProps) {
    if (!args.orientation) {
      args.orientation = 'horizontal';
    }
    if (!args.flex) {
      args.flex = '1 1 100%';
    }
    if (args.children) {
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
  addSplit(child: Panel | Split, index?: number) {
    index = index ?? this.children.length;
    this.children.splice(index, 0, child);
    this.dispatch('object-mutated', {object: this});
  }
  // TODO: consider more robust flex handling and validation.
  remove(child: Panel | Split) {
    this.children = this.children.filter((c: Split | Panel) => c !== child);
    if (this.children.length === 2) {
      this.children[1].flex = '1 1 100%';
    }
    this.dispatch('object-mutated', {object: this});
  }
  convertToSplit(panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation) {
    const index = this.children.indexOf(panel);
    this.children.splice(index, 1, new Split({orientation: orientation, children: [first, second]}));
    this.dispatch('object-mutated', {object: this});
  }
  convertToPanel(split: Split) {
    const child = split.children[0];
    const index = this.children.indexOf(split);
    child.flex = '1 1 100%';
    this.children.splice(index, 1, child);
    this.dispatch('object-mutated', {object: this});
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
    if (json.children) this.children = json.children.map(child => {
      if (child instanceof Split) return child;
      else if (child instanceof Panel) return child;
      else if ((child as PanelProps).tabs) return new Panel(child as PanelProps);
      else return new Split(child as SplitProps);
    });
    if (json.flex) this.flex = json.flex;
    return this;
  }
}