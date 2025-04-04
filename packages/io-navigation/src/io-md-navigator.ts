import { IoElement, VDOMArray, Register, Property, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { MenuOptions, ioMenuOptions, ioMenuTree } from 'io-menus';
import { ioMarkdown } from 'io-markdown';

export type IoMdNavigatorArgs = IoElementArgs & ArgsWithBinding<{
  options?: MenuOptions;
  slotted?: VDOMArray[];
  menu?: 'top' | 'left' | 'bottom' | 'right';
  depth?: number;
  collapsed?: boolean;
  collapseWidth?: number;
}>;

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
        border-color: var(--io_borderColorLight);
      }
      :host > io-menu-options {
        flex: 0 0 auto;
        min-height: calc(var(--io_fieldHeight) - var(--io_borderWidth));
      }
      :host > io-menu-tree {
        flex: 0 0 auto;
        min-width: 10em;
        overflow-y: auto;
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
    `;
  }

  @Property(Array)
  declare slotted: VDOMArray[];

  @Property({type: MenuOptions})
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
      this.menu === 'top' ? ioMenuOptions({horizontal: true, ...sharedMenuConfig}) : null,
      this.menu === 'left' ? ioMenuTree({...sharedMenuConfig}) : null,
      this.options.last ? ioMarkdown({src: this.options.last}) : null,
      this.menu === 'right' ? ioMenuTree({...sharedMenuConfig}) : null,
      this.menu === 'bottom' ? ioMenuOptions({horizontal: true, direction: 'up', ...sharedMenuConfig}) : null,
    ]);
  }
  static vDOM: (arg0?: IoMdNavigatorArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export const ioMdNavigator = IoMdNavigator.vDOM;