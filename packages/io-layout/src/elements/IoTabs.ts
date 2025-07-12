import { Register, IoElement, IoElementProps, ReactiveProperty, Property, NodeArray } from 'io-gui';
import { MenuItem, ioMenuItem } from 'io-menus';
import { ioTab } from './IoTab.js';
import { ioTabsHamburger } from './IoTabsHamburger.js';
import { Tab } from '../nodes/Tab.js';

export type IoTabsProps = IoElementProps & {
  tabs: NodeArray<Tab>,
  addMenuItem: MenuItem,
};

@Register
export class IoTabs extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        background-color: var(--io_bgColorStrong);
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
      }
      :host > io-tabs-hamburger {
        margin-bottom: var(--io_spacing);
      }
      :host > io-menu-item {
        margin-left: auto;
        flex-shrink: 0;
        opacity: 0.125;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
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

  @ReactiveProperty({type: NodeArray, init: null})
  declare private tabs: NodeArray<Tab>;

  @Property(MenuItem)
  declare private addMenuItem: MenuItem;

  constructor(args: IoTabsProps) { super(args); }

  changed() {
    this.render([
      ioTabsHamburger({tabs: this.tabs}),
      ...this.tabs.map(tab => ioTab({tab: tab})),
      ioMenuItem({
        class: 'add-tab',
        icon: 'io:box_fill_plus',
        direction: 'down',
        item: this.addMenuItem,
      }),
    ]);
  }
}

export const ioTabs = function(arg0: IoTabsProps) {
  return IoTabs.vConstructor(arg0);
};