import { Node, NodeArray, ReactiveProperty, Register } from 'io-gui';
import { Tab, TabProps } from './Tab.js';

export type PanelProps = {
  tabs: Array<TabProps>,
  flex?: string,
};

@Register
export class Panel extends Node {

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare tabs: NodeArray<Tab>;

  @ReactiveProperty({type: String, value: '1 1 100%'})
  declare flex: string;

  constructor(args: PanelProps) {
    args = { ...args };
    if (args.tabs.length > 0 && !args.tabs.find(tab => tab.selected)) {
      args.tabs[0].selected = true;
    }
    args.tabs = args.tabs.map(tab => new Tab({...tab}));
    super(args);
  }
  tabsMutated() {
    this.debounce(this.onTabsMutatedDebounced);
  }
  onTabsMutatedDebounced() {
    this.dispatchMutation();
  }
  getSelected() {
    let selected = '';
    for (let i = 0; i < this.tabs.length; i++) {
      const item = this.tabs[i];
      if (item.selected && item.id) {
        selected = item.id;
        break;
      }
    }
    return selected;
  }
  setSelected(id: string) {
    // TODO Test and reconsider withInternalOperation
    this.tabs.withInternalOperation(() => {
      for (let i = 0; i < this.tabs.length; i++) {
        const item = this.tabs[i];
        if (item.id === id) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      }
    });
    this.tabs.dispatchMutation();
  }
  toJSON(): PanelProps {
    return {
      tabs: this.tabs.map(tab => tab.toJSON()),
      flex: this.flex,
    };
  }
  fromJSON(json: PanelProps) {
    this.setProperties({
      tabs: json.tabs.map(tab => new Tab(tab)),
      flex: json.flex ?? '1 1 100%',
    });
    return this;
  }
  dispose() {
    this.tabs.length = 0; // TODO: test magic!
    super.dispose();
  }
}