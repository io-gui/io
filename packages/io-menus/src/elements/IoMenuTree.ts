import { Register, IoElement, ReactiveProperty, VDOMElement, Storage as $, genObjectStorageID, IoElementProps, WithBinding, Property } from 'io-gui';
import { ioString } from 'io-inputs';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem, IoMenuItem } from './IoMenuItem.js';
import { ioMenuTreeBranch } from './IoMenuTreeBranch.js';
import { searchMenuOptions } from '../utils/MenuNodeUtils.js';

function addMenuItemsOrTreeBranches(options: MenuOptions, depth: number, d = 0) {
  const elements: VDOMElement[] = [];
  if (d <= depth) for (let i = 0; i < options.items.length; i++) {
    const item = options.items[i];
    if (item.options?.items.length) {
      const collapsibleState = $({value: false, storage: 'local', key: genObjectStorageID(item)});
      if (item.selected === true) collapsibleState.value = true;
      elements.push(ioMenuTreeBranch({item: item, depth: d, expanded: collapsibleState}));
    } else {
      elements.push(ioMenuItem({item: item, depth: d}));
    }
  }
  return elements;
}

export type IoMenuTreeProps = IoElementProps & {
  options?: MenuOptions,
  searchable?: boolean,
  search?: WithBinding<string>,
  depth?: number,
  widget?: VDOMElement | null,
};

@Register
export class IoMenuTree extends IoElement {
  static vConstructor: (arg0?: IoMenuTreeProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: var(--io_borderRadius);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing);
      user-select: none;
    }
    :host io-menu-tree {
      padding: 0 !important;
    }
    :host > io-menu-item {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing3);
    }
    :host > io-menu-item[selected] {
      border-color: transparent var(--io_colorBlue) transparent transparent;
    }
    :host > io-menu-item:before {
      display: inline-block;
      width: var(--io_fontSize);
      content: ""
    }
    `;
  }

  @ReactiveProperty({type: MenuOptions, init: null})
  declare options: MenuOptions;

  @ReactiveProperty({value: false, type: Boolean})
  declare searchable: boolean;

  @ReactiveProperty({value: '', type: String})
  declare search: string;

  @ReactiveProperty({value: Infinity, type: Number})
  declare depth: number;

  @ReactiveProperty(null)
  declare widget: VDOMElement | null;

  @ReactiveProperty(undefined)
  declare $parent?: IoMenuItem;

  @Property('listbox')
  declare role: string;

  constructor(args: IoMenuTreeProps = {}) { super(args); }

  changed() {
    const elements: VDOMElement[] = this.widget ? [this.widget] : [];

    if (this.searchable) {
      elements.push(ioString({
        id: 'search',
        role: 'search',
        value: this.bind('search'),
        placeholder: 'Search',
        live: true
      }));
    }

    if (this.search) {
      const filteredItems = searchMenuOptions(this.options, this.search, this.depth);
      if (filteredItems.length === 0) {
        elements.push(ioMenuItem({item: new MenuItem({label: 'No matches', mode: 'none'})}));
      } else for (let i = 0; i < filteredItems.length; i++) {
        elements.push(ioMenuItem({item: filteredItems[i], depth: 0}));
      }

    } else {
      elements.push(...addMenuItemsOrTreeBranches(this.options, this.depth));
    }

    this.render(elements);
  }
}
export const ioMenuTree = IoMenuTree.vConstructor;