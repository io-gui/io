import { Register, IoElement, VDOMElement, IoElementProps, ReactiveProperty, Property } from 'io-gui';
import { MenuItem, ioMenuItem } from 'io-menus';
import { ioTab } from './IoTab.js';
import { Panel } from '../nodes/Panel.js';

export type IoTabsProps = IoElementProps & {
  panel?: Panel,
  addMenuItem?: MenuItem,
};

@Register
export class IoTabs extends IoElement {
  static vConstructor: (arg0?: IoTabsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        display: flex;
        background-color: var(--io_bgColorStrong);
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
      }
      :host > io-menu-item {
        min-width: fit-content;
        margin-left: auto;
        padding: 0;
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

  @ReactiveProperty({type: Panel, init: null})
  declare private panel: Panel;

  @Property(MenuItem)
  declare private addMenuItem: MenuItem;

  constructor(args: IoTabsProps = {}) { super(args); }

  panelMutated() {
    this.changed();
  }

  changed() {
    this.render([
      ...this.panel.tabs.map(tab => ioTab({tab: tab})),
      ioMenuItem({
        icon: 'io:box_fill_plus',
        direction: 'down',
        item: this.addMenuItem,
      }),
    ]);
  }
}
export const ioTabs = IoTabs.vConstructor;