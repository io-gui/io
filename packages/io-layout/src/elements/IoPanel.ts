import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { ioSelector } from 'io-navigation';
import { IoMenuItem, MenuItem } from 'io-menus';
import { ioTabs } from './IoTabs.js';
import { IoSplit } from './IoSplit.js';
import { Tab } from '../nodes/Tab.js';
import { Panel } from '../nodes/Panel.js';
import { SplitDirection } from '../nodes/Split.js';

export type IoPanelProps = IoElementProps & {
  panel: Panel,
  elements: VDOMElement[],
  addMenuItem: MenuItem,
};

@Register
export class IoPanel extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex: 1 1 auto;
        background-color: var(--io_bgColorLight);
      }
      :host > io-selector {
        margin-top: calc(-1 * var(--io_borderWidth));
        border-top: var(--io_border);
        border-top-color: var(--io_borderColorStrong);
      }
    `;
  }

  @ReactiveProperty({type: Object, init: null})
  declare panel: Panel;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @Property(MenuItem)
  declare private addMenuItem: MenuItem;

  static get Listeners() {
    return {
      'io-edit-tab': 'onEditTab',
    };
  }

  onEditTab(event: CustomEvent) {
    event.stopPropagation();
    const tab: Tab = event.detail.tab;
    const key = event.detail.key;
    const index = this.panel.tabs.indexOf(tab);
    if (index === -1) {
      debug: console.warn('IoTabs:Tab not found in panel', tab);
      return;
    }
    switch (key) {
      // TODO: This should be unnecessary once NodeArray is used.
      case 'Edit': {
        this.panel.dispatchMutation();
        break;
      }
      case 'Select': {
        this.selectTab(tab);
        break;
      }
      case 'Backspace': {
        this.removeTab(tab);
        break;
      }
      case 'ArrowLeft': {
        this.moveTab(tab, index - 1);
        break;
      }
      case 'ArrowRight': {
        this.moveTab(tab, index + 1);
        break;
      }
      case 'ArrowUp': {
        // TODO: move tab to panel above or split the panel
        break;
      }
      case 'ArrowDown': {
        // TODO: move tab to panel below or split the panel
        break;
      }
    }
  }
  init() {
    this.focusTabDebounced = this.focusTabDebounced.bind(this);
  }
  onNewTabClicked(event: CustomEvent) {
    event.stopPropagation();
    const item: MenuItem = event.detail.item;
    if (item.id) {
      const tab = new Tab({id: item.id, label: item.label, icon: item.icon});
      this.addTab(tab);
      const addMenuItem = this.querySelector('.add-tab') as IoMenuItem;
      if (addMenuItem) addMenuItem.expanded = false;
    }
  }
  moveTabToSplit(sourcePanel: IoPanel, tab: Tab, direction: SplitDirection) {
    const parentSplit = this.parentElement as IoSplit;
    if (direction === 'center') {
      this.addTab(tab);
      sourcePanel.removeTab(tab);
    } else {
      parentSplit.moveTabToSplit(sourcePanel, this.panel, tab, direction);
    }
  }
  selectTab(tab: Tab) {
    const index = this.panel.tabs.indexOf(tab);
    this.panel.selectIndex(index);
    this.debounce(this.focusTabDebounced, index);
  }
  addTab(tab: Tab, index?: number) {
    index = index ?? this.panel.tabs.length;
    this.panel.addTab(tab, index);
    this.debounce(this.focusTabDebounced, index);
  }
  removeTab(tab: Tab) {
    const index = this.panel.tabs.indexOf(tab);
    this.panel.removeTab(tab);
    if (this.panel.tabs.length === 0) {
      this.dispatch('io-panel-remove', {panel: this.panel}, true);
    } else {
      this.debounce(this.focusTabDebounced, index);
    }
  }
  moveTab(tab: Tab, index: number) {
    index = Math.max(Math.min(index, this.panel.tabs.length - 1), 0);
    this.panel.moveTab(tab, index);
    this.debounce(this.focusTabDebounced, index);
  }
  focusTabDebounced(index: number) {
    const tabs = Array.from(this.querySelectorAll('io-tab')) as HTMLElement[];
    index = Math.min(index, tabs.length - 1);
    if (tabs[index]) tabs[index].focus();
  }
  panelMutated() {
    this.changed();
  }
  changed() {
    this.render([
      ioTabs({
        tabs: this.panel.tabs,
        addMenuItem: this.addMenuItem,
        '@io-menu-item-clicked': this.onNewTabClicked,
      }),
      ioSelector({
        selected: this.panel.bind('selected'),
        elements: this.elements,
        anchor: '',
      })
    ]);
  }
}
export const ioPanel = function(arg0: IoPanelProps) {
  return IoPanel.vConstructor(arg0);
}