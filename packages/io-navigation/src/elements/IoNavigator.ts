import { IoElement, VDOMElement, ReactiveProperty, IoElementProps, WithBinding, Register } from 'io-gui';
import { MenuOptions, MenuItem, ioMenuOptions, ioMenuItem, ioMenuTree } from 'io-menus';
import { CachingType, ioSelector, SelectType } from './IoSelector';

export type MenuPositionType = 'top' | 'left' | 'right';

export type IoNavigatorProps = IoElementProps & {
  options?: MenuOptions,
  elements?: VDOMElement[],
  widget?: VDOMElement,
  menu?: MenuPositionType,
  depth?: number,
  collapsed?: WithBinding<boolean>,
  collapseWidth?: number,
  select?: SelectType,
  caching?: CachingType,
};

@Register
export class IoNavigator extends IoElement {
  static vConstructor: (arg0?: IoNavigatorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        overflow-y: auto !important;
        flex: 1 1 auto;
      }
      :host[menu=left],
      :host[menu=right] {
        flex-direction: row;
      }
      :host > io-menu-tree {
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 10em;
        border: var(--io_border);
        overflow-y: auto;
        border-radius: 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host > io-menu-options {
        border: none;
        border-bottom: var(--io_border);
        border-radius: 0;
      }
    `;
  }

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @ReactiveProperty({type: MenuOptions, init: null})
  declare options: MenuOptions;

  @ReactiveProperty(null)
  declare widget: VDOMElement | null;

  @ReactiveProperty({value: 'left', type: String, reflect: true})
  declare menu: MenuPositionType;

  @ReactiveProperty({value: Infinity, type: Number})
  declare depth: number;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare collapsed: boolean;

  @ReactiveProperty({value: 580, type: Number})
  declare collapseWidth: number;

  @ReactiveProperty({value: 'shallow', type: String})
  declare select: SelectType;

  @ReactiveProperty({value: 'none', type: String})
  declare caching: CachingType;

  changed() {
    const sharedMenuConfig = {
      options: this.options,
      widget: this.widget,
      depth: this.depth
    };

    const hamburger = ioMenuItem({
      depth: this.depth,
      role: 'navigation',
      class: 'hamburger',
      direction: this.menu === 'left' ? 'right' : 'left',
      item: new MenuItem({
        mode: 'none',
        icon: 'menu:hamburger',
        options: this.options,
      })
    });

    // TODO: add widget and test collapse!!

    if (this.menu === 'top') {
      this.render([
        ioMenuOptions({horizontal: true, ...sharedMenuConfig}),
        ioSelector({options: this.options, caching: this.caching, select: this.select, elements: this.elements}),
      ]);
    } else if (this.menu === 'left') {
      this.render([
        this.collapsed ? hamburger : ioMenuTree({...sharedMenuConfig}),
        ioSelector({options: this.options, caching: this.caching, select: this.select, elements: this.elements}),
      ]);
    } else if (this.menu === 'right') {
      this.render([
        ioSelector({options: this.options, caching: this.caching, select: this.select, elements: this.elements}),
        this.collapsed ? hamburger : ioMenuTree({...sharedMenuConfig}),
      ]);
    }
  }
}

export const ioNavigator = IoNavigator.vConstructor;