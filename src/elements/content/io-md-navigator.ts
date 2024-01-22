import { IoElement, VDOMArray } from '../../core/element.js';
import { Register } from '../../core/node.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';
import './io-selector.js';

@Register
export class IoMdNavigator extends IoElement {

  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        align-items: stretch;
        align-self: stretch;
        overflow: auto;
      }
      :host[menu=left],
      :host[menu=right] {
        flex-direction: row;
      }
      :host > io-menu-tree,
      :host > io-menu-options {
        align-self: stretch;
        border-radius: 0;
        padding: 0;
        border-color: var(--iotBorderColorLight);
      }
      :host > io-menu-options {
        flex: 0 0 auto;
        min-height: calc(var(--iotFieldHeight) - var(--iotBorderWidth));
      }
      :host > io-menu-tree {
        flex: 0 0 auto;
        min-width: 10em;
        overflow-y: auto;
      }
      :host[menu=top] > io-menu-options {
        border-width: 0 0 var(--iotBorderWidth) 0;
      }
      :host[menu=bottom] > io-menu-options {
        border-width: var(--iotBorderWidth) 0 0 0;
      }
      :host > io-menu-options > io-menu-item {
        border-radius: 0;
      }
    `;
  }

  @Property(Array)
  declare slotted: VDOMArray[];

  @Property({type: MenuOptions, observe: true})
  declare options: MenuOptions;

  @Property({value: 'none', reflect: true})
  declare menu: 'none' | 'top' | 'left' | 'bottom' | 'right';

  @Property(Infinity)
  declare depth: number;

  // TODO: implement
  @Property(false)
  declare collapsed: boolean;

  @Property(420)
  declare collapseWidth: number;

  onResized() {
    this.collapsed = this.offsetWidth < this.collapseWidth;
  }

  changed() {
    const sharedMenuConfig = {
      options: this.options,
      slotted: this.slotted,
      depth: this.depth
    };

    this.template([
      this.menu === 'top' ? ['io-menu-options', {horizontal: true, ...sharedMenuConfig}] : null,
      this.menu === 'left' ? ['io-menu-tree', {...sharedMenuConfig}] : null,
      this.options.last ? ['io-md-view', {src: this.options.last}] : null,
      this.menu === 'right' ? ['io-menu-tree', {...sharedMenuConfig}] : null,
      this.menu === 'bottom' ? ['io-menu-options', {horizontal: true, direction: 'up', ...sharedMenuConfig}] : null,
    ]);
  }
}
