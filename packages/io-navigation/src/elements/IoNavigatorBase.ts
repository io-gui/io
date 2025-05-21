import { IoElement, VDOMElement, ReactiveProperty, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions, MenuItem, ioMenuOptions, ioMenuItem, ioMenuTree } from 'io-menus';

export type IoNavigatorBaseProps = IoElementProps & {
  options?: MenuOptions,
  slotted?: VDOMElement[],
  elements?: VDOMElement[],
  menu?: 'top' | 'left' | 'bottom' | 'right',
  depth?: number,
  collapsed?: WithBinding<boolean>,
  collapseWidth?: number,
};

export class IoNavigatorBase extends IoElement {
  static vConstructor: (arg0?: IoNavigatorBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
      :host > io-menu-tree,
      :host > io-menu-options {
        align-self: stretch;
        border-radius: 0;
        /* border-color: var(--io_borderColorLight); */
      }
      :host[collapsed] > io-menu-options {
        /* min-height: calc(var(--io_fieldHeight) + 1em); */
        /* padding: calc(var(--io_spacing) + 0.5em) !important; */
      }
      :host[collapsed] > io-menu-options > io-menu-item.hamburger {
        /* top: 0; */
        /* padding: calc(var(--io_spacing) + 0.5em); */
        /* padding-right: calc(var(--io_spacing2) + 0.5em); */
        /* min-height: calc(var(--io_fieldHeight) + 1em); */
        /* background-color: transparent; */
      }
      :host > io-menu-options {
        z-index: 1;
        flex: 0 0 auto;
        border: none;
        min-height: var(--io_fieldHeight) !important;
      }
      :host > io-menu-tree {
        z-index: 1;
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
        flex: 0 0 auto;
        border-radius: 0;
        padding: calc(var(--io_spacing) + 0.5em);
        height: 100%;
        background-color: var(--io_bgColorDimmed);
        border-color: transparent !important;
      }
      :host > io-menu-item.hamburger > .hasmore {
        display: none;
      }
      :host[menu=top] > io-menu-options {
        /* padding: 0 var(--io_spacing); */
        /* border-width: 0 0 var(--io_borderWidth) 0; */
      }
      :host[menu=bottom] > io-menu-options {
        /* padding: 0 var(--io_spacing); */
        /* border-width: var(--io_borderWidth) 0 0 0; */
      }
      :host > io-menu-options > io-menu-item {
        /* border-radius: 0; */
      }
    `;
  }

  @ReactiveProperty(Array)
  declare slotted: VDOMElement[];

  @ReactiveProperty(Array)
  declare elements: VDOMElement[];

  @ReactiveProperty({type: MenuOptions})
  declare options: MenuOptions;

  @ReactiveProperty({value: 'left', reflect: true})
  declare menu: 'top' | 'left' | 'bottom' | 'right';

  @ReactiveProperty(Infinity)
  declare depth: number;

  @ReactiveProperty({value: false, reflect: true})
  declare collapsed: boolean;

  @ReactiveProperty(580)
  declare collapseWidth: number;

  init() {
    this._computeCollapsed = this._computeCollapsed.bind(this);
    this.throttle(this._computeCollapsed);
    this.changed();
  }

  onResized() {
    this.throttle(this._computeCollapsed);
  }

  _computeCollapsed() {
    this.collapsed = this.offsetWidth < this.collapseWidth;
  }

  getSlotted(): VDOMElement | null {
    return null;
  }

  changed() {
    const sharedMenuConfig = {
      options: this.options,
      slotted: this.slotted,
      depth: this.depth
    };

    const hamburger = ioMenuItem({
      depth: this.depth,
      role: 'navigation',
      class: 'hamburger',
      direction: this.menu === 'left' ? 'right' : 'left',
      item: new MenuItem({
        label: '',
        icon: 'menu:hamburger',
        options: this.options,
      })
    });

    if (this.menu === 'top') {
      this.template([
        ioMenuOptions({horizontal: true, noPartialCollapse: this.collapsed, ...sharedMenuConfig}),
        this.getSlotted(),
      ]);
    } else if (this.menu === 'left') {
      this.template([
        this.collapsed ? hamburger : ioMenuTree({...sharedMenuConfig}),
        this.getSlotted(),
      ]);
    } else if (this.menu === 'bottom') {
      this.template([
        this.getSlotted(),
        ioMenuOptions({horizontal: true, noPartialCollapse: this.collapsed, direction: 'up', ...sharedMenuConfig}),
      ]);
    } else if (this.menu === 'right') {
      this.template([
        this.getSlotted(),
        this.collapsed ? hamburger : ioMenuTree({...sharedMenuConfig}),
      ]);
    }
  }
}
export const ioNavigatorBase = IoNavigatorBase.vConstructor;