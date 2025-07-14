import { Node, NodeArray, ReactiveProperty, Register } from 'io-gui';
import { Tab, TabProps } from './Tab.js';

export type PanelProps = {
  tabs: Array<TabProps>,
  flex?: string,
  selected?: string,
};

@Register
export class Panel extends Node {

  @ReactiveProperty({type: NodeArray, init: ['this']})
  declare tabs: NodeArray<Tab>;

  @ReactiveProperty({type: String, value: '1 1 100%'})
  declare flex: string;

  constructor(args: PanelProps) {
    if (args.tabs.length > 0 && !args.tabs.find(tab => tab.selected)) {
      args.tabs[0].selected = true;
    }
    args.tabs = args.tabs.map(tab => new Tab({...tab}));
    super(args);
    this.tabsMutatedDebounced = this.tabsMutatedDebounced.bind(this);
  }
  tabsMutated() {
    this.debounce(this.tabsMutatedDebounced);
  }
  tabsMutatedDebounced() {
    this.dispatchMutation();
  }
  toJSON(): PanelProps {
    return {
      tabs: this.tabs.map(tab => tab.toJSON()),
      flex: this.flex ?? '1 1 100%',
    };
  }
  fromJSON(json: PanelProps) {
    this.setProperties({
      tabs: json.tabs.map(tab => new Tab(tab)),
      flex: json.flex ?? '1 1 100%',
    });
    return this;
  }
}