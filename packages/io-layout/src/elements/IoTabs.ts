import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { MenuItem, ioMenuItem, MenuOptions } from 'io-menus';
import { ioTab, TabEditCommand } from './IoTab.js';

export type IoTabsProps = IoElementProps & {
  tabs?: MenuOptions,
  addMenuItem?: MenuItem,
};

@Register
export class IoTabs extends IoElement {
  static vConstructor: (arg0?: IoTabsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        background-color: var(--io_bgColorStrong);
        border-bottom: var(--io_border);
        border-bottom-color: var(--io_borderColorStrong);
      }
      :host > io-tab:first-of-type {
        margin-left: var(--io_spacing2);
      }
      :host > io-menu-item {
        min-width: fit-content;
        margin-left: auto;
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
        opacity: 0.125;
      }
      :host > io-menu-item:focus,
      :host > io-menu-item:hover {
        opacity: 1;
      }
      :host > io-menu-item > .label,
      :host > io-menu-item > .icon,
      :host > io-menu-item > .hasmore {
        display: none;
      }
    `;
  }

  @ReactiveProperty({type: MenuOptions, init: null})
  declare private tabs: MenuOptions;

  @Property(MenuItem)
  declare private addMenuItem: MenuItem;

  init() {
    this.addTab = this.addTab.bind(this);
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
    const command: TabEditCommand = event.detail.command;
    const index = this.tabs.items.indexOf(item);
    if (index === -1) {
      debug: console.warn('IoTabs:Item not found in options', item);
      return;
    }
    switch (command) {
      case 'delete': {
        if (this.tabs.items.length === 1) {
          return;
        }
        // TODO: use removeItem()
        this.tabs.items.splice(index, 1);
        const newIndex = Math.min(index, this.tabs.items.length - 1);
        this.selectTabByIndex(newIndex);
        break;
      }
      case 'shiftLeft': {
        if (index > 0) {
          this.tabs.items.splice(index - 1, 0, this.tabs.items.splice(index, 1)[0]);
          this.selectTabByIndex(index - 1);
        }
        break;
      }
      case 'shiftRight': {
        if (index < this.tabs.items.length - 1) {
          this.tabs.items.splice(index + 1, 0, this.tabs.items.splice(index, 1)[0]);
          this.selectTabByIndex(index + 1);
        }
        break;
      }
    }
    if (command) {
      this.changed();
      this.dispatchEvent('object-mutated', {object: this.tabs}, false, window);
    }
  }
  selectTabByIndex(index: number) {
    this.tabs.items[index].selected = true;
    const tabs = this.querySelectorAll('io-tab');
    if (tabs[index]) tabs[index].focus();
  }
  addTab(event: CustomEvent) {
    event.stopPropagation();
    const item: MenuItem = event.detail.item;
    if (!item.id) return;
    const existing = this.tabs.findItemById(item.id!);
    if (!existing) {
      this.tabs.addItem({
        id: item.id,
        label: item.label,
        icon: item.icon,
        hint: item.hint,
        mode: 'select',
      });
      this.debounce(this.selectTabByIndex, this.tabs.items.length - 1);
    } else {
      const index = this.tabs.items.indexOf(existing);
      this.selectTabByIndex(index);
    }
    this.changed();
  }
  changed() {
    this.render([
      ...this.tabs.items.map(item => ioTab({item})),
      // TODO: consider designing an element for options without item in the root.
      // TODO: reconsider iocontextmenu design.
      ioMenuItem({
        icon: 'io:box_fill_plus',
        direction: 'down',
        item: this.addMenuItem,
        '@io-menu-item-clicked': this.addTab,
      }),
    ]);
  }
}
export const ioTabs = IoTabs.vConstructor;