import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';
import './io-selector.js';
import './io-scroller.js';

const noOptions = new MenuOptions();

@RegisterIoElement
export class IoNavigator extends IoElement {

  static get Style() {
    return /* css */`
      :host {
        flex-direction: column;
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
        min-width: 10em;
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
      :host > io-scroller {
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

  @Property({value: 'select'})
  declare mode: 'select' | 'scroll' | 'select-scroll';

  @Property({value: 'root'})
  declare select: 'root' | 'leaf';

  @Property(Infinity)
  declare depth: number;

  @Property(false)
  declare cache: boolean;

  // TODO: implement
  // @Property(false)
  // declare collapsed: boolean;
  // @Property(420)
  // declare collapseWidth: number;

  changed() {
    let scrollOptions = noOptions;
    if (this.options.root) {
      const subOptions = this.options.getItem(this.options.root)?.options;
      if (subOptions) scrollOptions = subOptions;
    }

    const sharedMenuConfig = {
      options: this.options,
      slotted: this.slotted,
      depth: this.depth
    };

    let contentNavigation: VDOMArray | null = null;
    if (this.mode === 'select') {
      contentNavigation = ['io-selector', {options: this.options, cache: this.cache, elements: this.elements, select: this.select}];
    } else if (this.mode === 'scroll') {
      contentNavigation = ['io-scroller', {options: this.options}, this.elements];
    } else if (this.mode === 'select-scroll') {
      contentNavigation = ['io-scroller', {options: scrollOptions}, [
        ['io-selector', {options: this.options, cache: this.cache, elements: this.elements, select: 'root'}],
      ]];
    }

    this.template([
      this.menu === 'top' ? ['io-menu-options', {horizontal: true, ...sharedMenuConfig}] : null,
      this.menu === 'left' ? ['io-menu-tree', {...sharedMenuConfig}] : null,
      contentNavigation,
      this.menu === 'right' ? ['io-menu-tree', {...sharedMenuConfig}] : null,
      this.menu === 'bottom' ? ['io-menu-options', {horizontal: true, direction: 'up', ...sharedMenuConfig}] : null,
    ]);
  }
}
