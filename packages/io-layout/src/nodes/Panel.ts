import { Node, NodeArray, ReactiveProperty, Register } from 'io-gui';
import { Tab, TabProps } from './Tab.js';

export type PanelProps = {
  tabs: Array<TabProps>,
  selected?: string,
  flex?: string,
};

@Register
export class Panel extends Node {

  @ReactiveProperty({type: NodeArray, init: ['this']})
  declare tabs: NodeArray<Tab>;

  @ReactiveProperty({type: String, value: ''})
  declare selected: string;

  @ReactiveProperty({type: String, value: ''})
  declare flex: string;

  constructor(args: PanelProps) {
    args.selected = args.selected ?? args.tabs[0]?.id ?? '';
    args.tabs = args.tabs.map(tab => new Tab({...tab, selected: tab.id === args.selected}));
    super(args);
    this.tabsMutatedDebounced = this.tabsMutatedDebounced.bind(this);
  }
  selectIndex(index: number) {
    index = Math.min(index, this.tabs.length - 1);
    this.selected = this.tabs[index].id;
    this.tabs.forEach(tab => tab.selected = tab.id === this.selected);
  }
  removeTab(tab: Tab) {
    const index = this.tabs.indexOf(tab);
    this.tabs.splice(index, 1);
    if (this.tabs.length > 0) {
      const newIndex = Math.min(index, this.tabs.length - 1);
      this.selectIndex(newIndex);
    }
  }
  moveTab(tab: Tab, index: number) {
    const currIndex = this.tabs.findIndex(t => t.id === tab.id);
    this.tabs.splice(currIndex, 1);
    index = Math.min(index, this.tabs.length);
    this.tabs.splice(index, 0, tab);
    this.selectIndex(index);
  }
  addTab(tab: Tab, index?: number) {
    if (index === undefined) index = this.tabs.length;
    index = Math.min(index, this.tabs.length);
    this.tabs.splice(index, 0, tab);
    this.selectIndex(index);
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
      selected: this.selected ?? '',
      flex: this.flex ?? '1 1 100%',
    };
  }
  fromJSON(json: PanelProps) {
    this.setProperties({
      tabs: json.tabs.map(tab => new Tab(tab)),
      selected: json.selected ?? '',
      flex: json.flex ?? '1 1 100%',
    });
    return this;
  }
}