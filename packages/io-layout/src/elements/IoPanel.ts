import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { ioSelector } from 'io-navigation';
import { MenuItem, MenuOptions } from 'io-menus';
import { TabData } from './IoTab.js';
import { ioTabs } from './IoTabs.js';

export type PanelData = {
  type: 'panel',
  tabs: Array<TabData>,
  flex: string,
  selected: string,
};

export type IoPanelProps = IoElementProps & {
  panel?: PanelData,
  elements?: VDOMElement[],
  addMenuItem?: MenuItem,
};

@Register
export class IoPanel extends IoElement {
  static vConstructor: (arg0?: IoPanelProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex: 1 1 auto;
        background-color: var(--io_bgColorLight);
      }
    `;
  }

  @ReactiveProperty({type: Object, init: null})
  declare panel: PanelData;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @ReactiveProperty({type: MenuOptions, init: null})
  declare tabs: MenuOptions;

  @Property(MenuItem)
  declare private addMenuItem: MenuItem;

  tabsMutated() {
    this.panel.selected = this.tabs.selected;
    this.panel.tabs.length = 0;
    for (let i = 0; i < this.tabs.items.length; i++) {
      const item = this.tabs.items[i];
      const tab: TabData = {};
      if (item.id) tab.id = item.id;
      if (item.label) tab.label = item.label;
      if (item.icon) tab.icon = item.icon;
      if (item.hint) tab.hint = item.hint;
      this.panel.tabs.push(tab);
    }
    this.dispatchEvent('io-panel-data-changed', {panel: this.panel}, true);
  }
  panelChanged() {
    // TODO: dispose old tabs
    if (this.tabs) {
      this.tabs.dispose();
    }
    this.style.flex = this.panel.flex;
    this.tabs = new MenuOptions({items: this.panel.tabs, selected: this.panel.selected});
  }
  changed() {
    this.render([
      ioTabs({
        tabs: this.tabs,
        addMenuItem: this.addMenuItem,
      }),
      ioSelector({
        options: this.tabs,
        elements: this.elements,
      })
    ]);
  }
}
export const ioPanel = IoPanel.vConstructor;