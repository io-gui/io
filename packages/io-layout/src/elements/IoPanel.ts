import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { ioSelector } from 'io-navigation';
import { IoMenuItem, MenuItem } from 'io-menus';
import { ioTabs } from './IoTabs.js';
import { IoSplit } from './IoSplit.js';
import { Tab } from '../nodes/Tab.js';
import { Panel } from '../nodes/Panel.js';
import { SplitDirection } from '../nodes/Split.js';
import { IoLayout } from './IoLayout.js';

export type IoPanelProps = IoElementProps & {
  panel: Panel,
  elements: VDOMElement[],
  addMenuOption: MenuItem,
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

  @ReactiveProperty({type: Object})
  declare panel: Panel;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @Property(MenuItem)
  declare private addMenuOption: MenuItem;

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
      const addMenuOption = this.querySelector('.add-tab') as IoMenuItem;
      if (addMenuOption) addMenuOption.expanded = false;
    }
  }
  selectIndex(index: number) {
    index = Math.min(index, this.panel.tabs.length - 1);
    this.panel.tabs.selected = this.panel.tabs[index].id;
    this.debounce(this.focusTabDebounced, index);
  }
  selectTab(tab: Tab) {
    const index = this.panel.tabs.indexOf(tab);
    this.panel.tabs.selected = tab.id;
    this.debounce(this.focusTabDebounced, index);
  }
  moveTabToSplit(sourcePanel: IoPanel, tab: Tab, direction: SplitDirection) {
    const parentSplit = this.parentElement as IoSplit;
    if (direction === 'center') {
      sourcePanel.removeTab(tab);
      this.addTab(tab);
    } else {
      parentSplit.moveTabToSplit(sourcePanel, this.panel, tab, direction);
    }
  }
  addTab(tab: Tab, index?: number) {
    const existingIndex = this.panel.tabs.findIndex(t => t.id === tab.id);
    if (existingIndex !== -1) {
      this.panel.tabs.splice(existingIndex, 1);
    }
    index = index ?? this.panel.tabs.length;
    index = Math.min(index, this.panel.tabs.length);
    this.panel.tabs.splice(index, 0, tab);
    this.selectIndex(index);
  }
  removeTab(tab: Tab) {
    // Prevent removing the last tab from a layout with only one split, panel and a tab.
    const parentSplit = this.parentElement as IoSplit;
    const grandParentLayout = (parentSplit.parentElement instanceof IoLayout) ? parentSplit.parentElement : null;
    if (grandParentLayout && parentSplit.split.children.length === 1 && this.panel.tabs.length === 1) {
      return;
    }

    const index = this.panel.tabs.indexOf(tab);
    this.panel.tabs.splice(index, 1);
    if (this.panel.tabs.length > 0) {
      const newIndex = Math.min(index, this.panel.tabs.length - 1);
      this.selectIndex(newIndex);
    } else {
      this.dispatch('io-panel-remove', {panel: this.panel}, true);
    }
  }
  moveTab(tab: Tab, index: number) {
    index = Math.max(Math.min(index, this.panel.tabs.length - 1), 0);
    const currIndex = this.panel.tabs.findIndex(t => t.id === tab.id);
    this.panel.tabs.splice(currIndex, 1);
    index = Math.min(index, this.panel.tabs.length);
    this.panel.tabs.splice(index, 0, tab);
    this.selectIndex(index);
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
        addMenuOption: this.addMenuOption,
        '@io-menu-option-clicked': this.onNewTabClicked,
      }),
      ioSelector({
        selected: this.panel.tabs.selected,
        elements: this.elements,
        anchor: '',
      })
    ]);
  }
}
export const ioPanel = function(arg0: IoPanelProps) {
  return IoPanel.vConstructor(arg0);
};