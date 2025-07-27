import { Register, IoElement, ReactiveProperty, VDOMElement, Storage as $, IoElementProps, WithBinding, Property } from 'io-gui';
import { ioField, ioString } from 'io-inputs';
import { MenuOption } from '../nodes/MenuOption.js';
import { ioMenuItem, IoMenuItem } from './IoMenuItem.js';
import { ioMenuTreeBranch } from './IoMenuTreeBranch.js';
import { searchMenuOption } from '../utils/MenuNodeUtils.js';

function genObjectStorageID(object: Record<string, any>) {
  const string = JSON.stringify(object);
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = Math.imul(31, hash) + string.charCodeAt(i) | 0;
  }
  return 'io-local-state-' + String(hash);
}

function addMenuOptionsOrTreeBranches(option: MenuOption, depth: number, d = 0) {
  const elements: VDOMElement[] = [];
  if (d <= depth) for (let i = 0; i < option.options.length; i++) {
    const subOption = option.options[i] as MenuOption;
    if (subOption.options.length) {
      const collapsibleState = $({value: false, storage: 'local', key: genObjectStorageID(subOption)});
      if (subOption.selected === true) collapsibleState.value = true;
      elements.push(ioMenuTreeBranch({option: subOption, depth: d, expanded: collapsibleState}));
    } else {
      elements.push(ioMenuItem({option: subOption, depth: d}));
    }
  }
  return elements;
}

export type IoMenuTreeProps = IoElementProps & {
  option?: MenuOption,
  searchable?: boolean,
  search?: WithBinding<string>,
  depth?: number,
  widget?: VDOMElement | null,
};

@Register
export class IoMenuTree extends IoElement {

  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: var(--io_borderRadius);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: var(--io_spacing);
      @apply --unselectable;
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

  @ReactiveProperty({type: MenuOption})
  declare option: MenuOption;

  @ReactiveProperty({value: false, type: Boolean})
  declare searchable: boolean;

  @ReactiveProperty({value: '', type: String})
  declare search: string;

  @ReactiveProperty({value: Infinity, type: Number})
  declare depth: number;

  @ReactiveProperty(null)
  declare widget: VDOMElement | null;

  @Property()
  declare $parent?: IoMenuItem;

  @Property('listbox')
  declare role: string;

  constructor(args: IoMenuTreeProps = {}) { super(args); }

  changed() {
    const vChildren: VDOMElement[] = this.widget ? [this.widget] : [];

    if (this.searchable) {
      vChildren.push(ioString({
        id: 'search',
        role: 'search',
        value: this.bind('search'),
        placeholder: 'Search',
        live: true
      }));
    }

    if (this.search) {
      const filteredItems = searchMenuOption(this.option, this.search, this.depth);
      if (filteredItems.length === 0) {
        vChildren.push(ioField({label: 'No matches'}));
      } else for (let i = 0; i < filteredItems.length; i++) {
        vChildren.push(ioMenuItem({option: filteredItems[i], depth: 0}));
      }

    } else {
      vChildren.push(...addMenuOptionsOrTreeBranches(this.option, this.depth));
    }

    this.render(vChildren);
  }
}
export const ioMenuTree = function(arg0?: IoMenuTreeProps) {
  return IoMenuTree.vConstructor(arg0);
};