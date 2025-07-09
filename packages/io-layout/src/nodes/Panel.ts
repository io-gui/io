import { Node, NodeProps, ReactiveProperty, Register } from 'io-gui';
import { Tab, TabProps } from './Tab.js';

export type PanelProps = NodeProps & {
  tabs: Array<Tab> | Array<TabProps>,
  selected: string,
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

  constructor(args: PanelProps) {
    if (!args.selected && args.tabs.length > 0) {
      args.selected = args.tabs[0].id;
    }
    if (!args.flex) {
      args.flex = '1 1 100%';
    }
    if (args.tabs) {
      for (let i = 0; i < args.tabs.length; i++) {
        if (!(args.tabs[i] instanceof Tab)) {
          args.tabs[i] = new Tab(args.tabs[i] as TabProps);
        }
        args.tabs[i].selected = args.tabs[i].id === args.selected;
      }
    }
    super(args);
  }

  selectIndex(index: number) {
    if (index < 0) {
      this.selected = '';
      this.tabs.forEach(tab => tab.selected = false);
      return;
    }
    this.selected = this.tabs[index].id;
    this.tabs.forEach(tab => tab.selected = tab.id === this.selected);
    this.dispatch('object-mutated', {object: this});
  }

  removeTab(tab: Tab) {
    this.tabs = this.tabs.filter(t => t !== tab);
    this.dispatch('object-mutated', {object: this});
  }

  moveTab(tab: Tab, index: number) {
    index = Math.max(Math.min(index, this.tabs.length - 1), 0);
    this.tabs = this.tabs.filter(t => t !== tab);
    this.tabs.splice(index, 0, tab);
    this.selectIndex(index);
    this.dispatch('object-mutated', {object: this});
  }

  addTab(tab: Tab, index?: number) {
    if (index === undefined) index = this.tabs.length;
    this.tabs.splice(index, 0, tab);
    this.tabs = this.tabs.filter((t, i) => i === index || t.id !== tab.id);
    index = this.tabs.indexOf(tab);
    this.selectIndex(index);
    this.dispatch('object-mutated', {object: this});
  }

  toJSON(): PanelProps {
    return {
      tabs: this.tabs.map(tab => tab.toJSON()),
      selected: this.selected,
      flex: this.flex,
    };
  }

  fromJSON(json: PanelProps) {
    if (json.tabs) this.tabs = json.tabs.map(tab => {
      if (tab instanceof Tab) return tab;
      else return new Tab(tab as TabProps);
    });
    if (json.selected) this.selected = json.selected;
    if (json.flex) this.flex = json.flex;
    return this;
  }
}