import { IoElement, VDOMArray } from '../../core/element.js';
import { Register } from '../../core/decorators/register.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { MenuItem } from '../menus/models/menu-item.js';
import { Property } from '../../core/decorators/property.js';
import './io-selector.js';

@Register
export class IoNavigator extends IoElement {

  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex: 1 1 auto;
      }
      :host[menu=left],
      :host[menu=right] {
        flex-direction: row;
      }
      :host > io-menu-tree,
      :host > io-menu-options {
        align-self: stretch;
        border-radius: 0;
        border-color: var(--io_borderColorLight);
      }
      :host[collapsed] > io-menu-options {
        min-height: calc(var(--io_fieldHeight) + 1em);
        padding: calc(var(--io_spacing) + 0.5em) !important;
      }
      :host[collapsed] > io-menu-options > io-menu-item.hamburger {
        top: 0;
        padding: calc(var(--io_spacing) + 0.5em);
        padding-right: calc(var(--io_spacing2) + 0.5em);
        min-height: calc(var(--io_fieldHeight) + 1em);
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
        padding: var(--io_borderWidth) 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host > io-menu-item.hamburger {
        border-radius: 0;
        padding: calc(var(--io_spacing) + 0.5em);
        height: 100%;
        flex: 0 0 auto;
        background-color: var(--io_bgColorDimmed);
        border-color: transparent !important;
      }
      :host > io-menu-item.hamburger > .hasmore {
        display: none;
      }
      :host[menu=top] > io-menu-options {
        border-width: 0 0 var(--io_borderWidth) 0;
      }
      :host[menu=bottom] > io-menu-options {
        border-width: var(--io_borderWidth) 0 0 0;
      }
      :host > io-menu-options > io-menu-item {
        border-radius: 0;
      }
      :host > io-selector {
        overflow: auto;
        flex: 1 1 auto;
        max-height: 100%;
      }
      /* :host > io-selector, */
      :host > io-scroller,
      :host > io-scroller > io-selector {
        flex: 1 1 auto;
      }
      :host > io-scroller > io-selector {
        overflow: unset !important;
      }
    `;
  }

  @Property(Array)
  declare slotted: VDOMArray[];

  @Property(Array)
  declare elements: VDOMArray[];

  @Property({type: MenuOptions})
  declare options: MenuOptions;

  @Property({value: 'left', reflect: true})
  declare menu: 'top' | 'left' | 'bottom' | 'right';

  @Property('first')
  declare select: 'first' | 'last';

  @Property('select')
  declare mode: 'select' | 'scroll';

  @Property(Infinity)
  declare depth: number;

  @Property(false)
  declare cache: boolean;

  @Property(false)
  declare precache: boolean;

  @Property({value: false, reflect: true})
  declare collapsed: boolean;

  @Property(580)
  declare collapseWidth: number;

  init() {
    this.throttle(this._computeCollapsed);
    this.changed();
  }

  onResized() {
    this.throttle(this._computeCollapsed);
  }

  _computeCollapsed() {
    this.collapsed = this.offsetWidth < this.collapseWidth;
  }

  changed() {
    const sharedMenuConfig = {
      options: this.options,
      slotted: this.slotted,
      depth: this.depth
    };

    const contentNavigation: VDOMArray = ['io-scroller', {options: this.options}, [
      ['io-selector', {options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements}]
    ]];

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
