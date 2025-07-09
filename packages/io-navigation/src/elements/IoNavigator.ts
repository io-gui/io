import { IoElement, VDOMElement, ReactiveProperty, IoElementProps, WithBinding, Register } from 'io-gui';
import { MenuOptions, ioMenuOptions, ioMenuTree } from 'io-menus';
import { CachingType, ioSelector } from './IoSelector.js';

export type MenuPositionType = 'top' | 'left' | 'right';
export type SelectType = 'shallow' | 'deep' | 'all' | 'none';

export type IoNavigatorProps = IoElementProps & {
  options?: MenuOptions,
  elements?: VDOMElement[],
  widget?: VDOMElement,
  menu?: MenuPositionType,
  depth?: number,
  select?: SelectType,
  caching?: CachingType,
  anchor?: WithBinding<string>,
};

@Register
export class IoNavigator extends IoElement {
  static vConstructor: (arg0?: IoNavigatorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
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

  @ReactiveProperty({value: 'shallow', type: String})
  declare select: SelectType;

  @ReactiveProperty({value: 'none', type: String})
  declare caching: CachingType;

  @ReactiveProperty({value: '', type: String})
  declare anchor: string;

  optionsMutated() {
    this.changed();
  }

  changed() {
    const sharedMenuConfig = {
      options: this.options,
      widget: this.widget,
      depth: this.depth
    };

    // TODO: add widget and test collapse!!
    let selected = '';
    if (this.select === 'shallow') selected = this.options.selectedShallow;
    if (this.select === 'deep') selected = this.options.selected;
    if (this.select === 'all') selected = '*';
    if (this.select === 'none') selected = '';

    if (this.menu === 'top') {
      this.render([
        ioMenuOptions({horizontal: true, ...sharedMenuConfig}),
        ioSelector({selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements}),
      ]);
    } else if (this.menu === 'left') {
      this.render([
        ioMenuTree({...sharedMenuConfig}),
        ioSelector({selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements}),
      ]);
    } else if (this.menu === 'right') {
      this.render([
        ioSelector({selected: selected, anchor: this.bind('anchor'), caching: this.caching,elements: this.elements}),
        ioMenuTree({...sharedMenuConfig}),
      ]);
    }
  }
}

export const ioNavigator = IoNavigator.vConstructor;