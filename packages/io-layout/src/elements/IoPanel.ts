import { Register, IoElement, div, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { CachingType, ioSelector } from 'io-navigation';
import { MenuItem, MenuOptions, ioMenuItem, ioOptionSelect } from 'io-menus';
import { ioTab, TabEditCommand } from './IoTab.js';

export type IoPanelProps = IoElementProps & {
  tabs?: MenuOptions,
  elements?: VDOMElement[],
  caching?: CachingType,
};

@Register
export class IoPanel extends IoElement {
  static vConstructor: (arg0?: IoPanelProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        flex-direction: column;
        background-color: var(--io_bgColorDimmed);
      }
      :host > .io-tabs-wrapper {
        display: flex;
        flex-direction: row;
        background-color: var(--io_bgColorStrong);
        border-bottom: var(--io_border);
      }
      :host > .io-tabs-wrapper > io-tab {
        padding: 0;
        height: inherit;
        min-height: inherit;
        margin: var(--io_spacing);
        margin-bottom: calc(-1 * var(--io_borderWidth));
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-color: transparent;
      }
      :host > .io-tabs-wrapper > io-tab:first-of-type {
        margin-left: var(--io_spacing2);
      }
      :host > .io-tabs-wrapper > io-menu-item {
        margin-left: auto;
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
      }
      :host > .io-tabs-wrapper > io-menu-item > .label,
      :host > .io-tabs-wrapper > io-menu-item > .icon,
      :host > .io-tabs-wrapper > io-menu-item > .hasmore {
        display: none;
      }
    `;
  }

  @ReactiveProperty({type: MenuOptions, init: null})
  declare tabs: MenuOptions;

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @ReactiveProperty({value: 'reactive', type: String})
  declare caching: CachingType;

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
      debug: console.warn('IoPanel:Item not found in options', item);
      return;
    }
    switch (command) {
      case 'delete': {
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
      this.tabs.dispatchEvent('object-mutated', {object: this.tabs});
    }
  }
  selectTabByIndex(index: number) {
    this.tabs.items[index].selected = true;
    const tabs = this.querySelectorAll('io-tab');
    if (tabs[index]) tabs[index].focus();
  }
  addTab(id: string) {
    const existing = this.tabs.findItemById(id);
    if (!existing) {
      this.tabs.addItem({id: id});
      this.debounce(this.selectTabByIndex, this.tabs.items.length - 1);
    } else {
      const index = this.tabs.items.indexOf(existing);
      this.selectTabByIndex(index);
    }
    this.tabs.dispatchEvent('object-mutated', {object: this.tabs});
  }
  tabsMutated() {
    this.changed();
  }
  elementsMutated() {
    this.elementsChanged();
    this.changed();
  }
  elementsChanged() {
    // TODO: dispose old menu items and options
    // TODO: consider not creating new menu items and options but requiring the user to provide a menu item with options
    this.addMenuItem = new MenuItem({
      mode: 'none',
      options: new MenuOptions({
        items: this.elements.map((vElement: VDOMElement) => ({
          value: vElement.props?.id,
          icon: 'io:box_fill_plus',
          mode: 'action',
          action: this.addTab
        }))
      })
    });
  }
  changed() {
    const tabs: VDOMElement[] = [];
    for (let i = 0; i < this.tabs.items.length; i++) {
      tabs.push(ioTab({item: this.tabs.items[i]}));
    }

    tabs.push(ioMenuItem({
      icon: 'io:box_fill_plus',
      direction: 'down',
      item: this.addMenuItem,
    }));

    this.render([
      div({class: 'io-tabs-wrapper'}, tabs),
      ioSelector({
        options: this.tabs,
        elements: this.elements,
        caching: this.caching,
      })
    ]);
  }
}
export const ioPanel = IoPanel.vConstructor;