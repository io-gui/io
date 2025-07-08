import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { ioSelector } from 'io-navigation';
import { MenuItem, MenuOptions } from 'io-menus';
import { ioTabs } from './IoTabs.js';
import { Panel } from '../nodes/Panel.js';
import { Tab } from '../nodes/Tab.js';

export type IoPanelProps = IoElementProps & {
  panel?: Panel,
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

  @ReactiveProperty({type: MenuOptions, init: null})
  declare options: MenuOptions;

  @Property(MenuItem)
  declare private addMenuItem: MenuItem;

  init() {
    this.selectTabByIndex = this.selectTabByIndex.bind(this);
  }
  static get Listeners() {
    return {
      'io-edit-tab-item': 'onEditTabItem',
    };
  }

  onEditTabItem(event: CustomEvent) {
    event.stopPropagation();
    const item: MenuItem = event.detail.item;
    const key = event.detail.key;
    const index = this.options.items.indexOf(item);
    if (index === -1) {
      debug: console.warn('IoTabs:Item not found in options', item);
      return;
    }
    switch (key) {
      case 'Backspace': {
        this.removeTab(item);
        this.selectTabByIndex(Math.min(index, this.options.items.length - 1));
        break;
      }
      case 'ArrowLeft': {
        this.options.moveItem(index, index - 1);
        this.selectTabByIndex(index - 1);
        break;
      }
      case 'ArrowRight': {
        this.options.moveItem(index, index + 1);
        this.selectTabByIndex(index + 1);
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
  selectTabByIndex(index: number) {
    if (index < 0) {
      this.options.selected = '';
      this.panel.selected = '';
      return;
    }
    this.options.items[index].selected = true;
    const tabs = Array.from(this.querySelectorAll('io-tab')) as HTMLElement[];
    if (tabs[index]) tabs[index].focus();
  }
  onMenuItemClicked(event: CustomEvent) {
    event.stopPropagation();
    const item: MenuItem = event.detail.item;
    this.addTab(item);
  }
  addTab(item: MenuItem, index?: number) {
    if (!item.id) return;
    index = index ?? this.options.items.length;
    this.options.addItem({
      id: item.id,
      label: item.label,
      icon: item.icon,
      mode: 'select',
    }, index);
    const foundItem = this.options.findItemById(item.id)!;
    const foundItemIndex = this.options.items.indexOf(foundItem);
    this.selectTabByIndex(foundItemIndex);
  }
  removeTab(item: MenuItem) {
    this.options.removeItemById(item.id);
    if (this.options.items.length === 0) {
      this.dispatch('io-panel-remove', {panel: this.panel}, true);
    }
  }
  optionsMutated() {
    // TODO: use TabData instead of MenuItem?
    this.panel.selected = this.options.selected;
    this.panel.tabs.length = 0;
    this.options.items.forEach(item => {
      this.panel.tabs.push(new Tab({
        id: item.id,
        label: item.label,
        icon: item.icon,
      }));
    });
    this.dispatch('io-panel-data-changed', {}, true);
  }
  panelChanged() {
    this.options?.dispose();
    this.options = new MenuOptions({items: this.panel.tabs as unknown as MenuItem[], selected: this.panel.selected});
  }
  changed() {
    this.render([
      ioTabs({
        options: this.options,
        addMenuItem: this.addMenuItem,
        '@io-menu-item-clicked': this.onMenuItemClicked,
      }),
      ioSelector({
        options: this.options,
        elements: this.elements,
      })
    ]);
  }
}
export const ioPanel = IoPanel.vConstructor;