import { Node, NodeProps, ReactiveProperty, Register } from 'io-gui';
import { Tab, TabProps } from './Tab.js';

export type PanelProps = NodeProps & {
  tabs?: Array<Tab> | Array<TabProps>, // TODO: required
  selected?: string, // TODO: required
  flex?: string,
};

@Register
export class Panel extends Node {
  @ReactiveProperty({type: Array, value: []})
  declare tabs: Array<Tab>;

  @ReactiveProperty({type: String, value: ''})
  declare selected: string;
  
  @ReactiveProperty({type: String, value: ''})
  declare flex: string;

  constructor(args: PanelProps = {}) {
    if (args.tabs) {
      for (let i = 0; i < args.tabs.length; i++) {
        if (!(args.tabs[i] instanceof Tab)) {
          args.tabs[i] = new Tab(args.tabs[i]);
        }
      }
    }
    super(args);
  }

  toJSON(): PanelProps {
    return {
      tabs: this.tabs.map(tab => tab.toJSON()),
      selected: this.selected,
      flex: this.flex,
    };
  }

  fromJSON(json: PanelProps) {
    if (json.tabs) this.tabs = json.tabs.map((tab: TabProps) => new Tab(tab));
    if (json.selected) this.selected = json.selected;
    if (json.flex) this.flex = json.flex;
    return this;
  }
}