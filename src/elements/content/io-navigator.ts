import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { MenuItem } from '../menus/models/menu-item.js';
import { Property } from '../../core/internals/property.js';
import './io-selector.js';

@RegisterIoElement
export class IoNavigator extends IoElement {

  static get Style() {
    return /* css */`
      :host {
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
        border-color: var(--iotBorderColorLight);
      }
      :host[collapsed] > io-menu-options {
        min-height: calc(var(--iotFieldHeight) + 1em);
        padding: calc(var(--iotSpacing) + 0.5em) !important;
      }
      :host[collapsed] > io-menu-options > io-menu-item.hamburger {
        top: 0;
        padding: calc(var(--iotSpacing) + 0.5em);
        padding-right: calc(var(--iotSpacing2) + 0.5em);
        min-height: calc(var(--iotFieldHeight) + 1em);
        background-color: transparent;
      }
      :host > io-menu-options {
        flex: 0 0 auto;
        padding: 0;
      }
      :host > io-menu-tree {
        flex: 0 0 auto;
        min-width: 10em;
        overflow-y: auto;
        padding: var(--iotBorderWidth) 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--iotBorderWidth) 0 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--iotBorderWidth) 0 0;
      }
      :host > io-menu-item.hamburger {
        border-radius: 0;
        padding: calc(var(--iotSpacing) + 0.5em);
        height: 100%;
        flex: 0 0 auto;
        background-color: var(--iotBackgroundColorDimmed);
        border-color: transparent !important;
      }
      :host > io-menu-item.hamburger > .hasmore {
        display: none;
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
      :host > io-selector {
        overflow: auto;
      }
      /* :host > io-selector, */
      :host > io-scroller,
      :host > io-scroller > io-selector {
        flex: 1 1 auto;
      }
    `;
  }

  @Property(Array)
  declare slotted: VDOMArray[];

  @Property(Array)
  declare elements: VDOMArray[];

  @Property({type: MenuOptions, observe: true})
  declare options: MenuOptions;

  @Property({value: 'none', reflect: true})
  declare menu: 'none' | 'top' | 'left' | 'bottom' | 'right';

  @Property('first')
  declare select: 'first' | 'last';

  @Property('select')
  declare mode: 'select' | 'scroll' | 'select-and-anchor';

  @Property(Infinity)
  declare depth: number;

  @Property(false)
  declare cache: boolean;

  @Property({value: false, reflect: true})
  declare collapsed: boolean;

  @Property(380)
  declare collapseWidth: number;

  init() {
    this.throttle(this._onSetCollapsed);
    this.changed();
  }
  onResized() {
    this.throttle(this._onSetCollapsed);
  }

  _onSetCollapsed() {
    this.collapsed = this.offsetWidth < this.collapseWidth;
  }

  changed() {
    const sharedMenuConfig = {
      options: this.options,
      slotted: this.slotted,
      depth: this.depth
    };

    let contentNavigation: VDOMArray = ['io-selector', {options: this.options, cache: this.cache, select: this.select, elements: this.elements}];
    if (this.mode === 'scroll') {
      contentNavigation = ['io-scroller', {options: this.options}, this.elements];
    } else if (this.mode === 'select-and-anchor') {
      contentNavigation = ['io-scroller', {options: this.options}, [contentNavigation]];
    }

    const hamburger = ['io-menu-item', {
      depth: this.depth,
      role: 'navigation',
      class: 'hamburger',
      direction: this.menu === 'left' ? 'right' : 'left',
      item: new MenuItem({
        label: '',
        icon: 'icons:hamburger',
        options: this.options,
      })
    }];

    if (this.menu === 'top') {
      this.template([
        ['io-menu-options', {horizontal: true, noPartialCollapse: this.collapsed, ...sharedMenuConfig}],
        contentNavigation,
      ]);
    } else if (this.menu === 'left') {
      this.template([
        this.collapsed ? hamburger : ['io-menu-tree', {...sharedMenuConfig}],
        contentNavigation,
      ]);
    } else if (this.menu === 'bottom') {
      this.template([
        contentNavigation,
        ['io-menu-options', {horizontal: true, noPartialCollapse: this.collapsed, direction: 'up', ...sharedMenuConfig}],
      ]);
    } else if (this.menu === 'right') {
      this.template([
        contentNavigation,
        this.collapsed ? hamburger : ['io-menu-tree', {...sharedMenuConfig}],
      ]);
    }
  }
}
