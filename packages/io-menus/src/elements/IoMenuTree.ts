import { Register, IoElement, Property, VDOMElement, Storage as $, genObjectStorageID, div, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { ioString } from 'io-inputs';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem, IoMenuItem } from './IoMenuItem.js';

export function addMenuOptions(options: MenuOptions, depth: number, d = 0) {
  const elements: VDOMElement[] = [];
  if (d <= depth) for (let i = 0; i < options.length; i++) {
    const item = options[i];
    if (item.options?.length) {
      const collapsibleState = $({value: item.selected, storage: 'local', key: genObjectStorageID(item)});
      if (item.selected === true) collapsibleState.value = true;
      // TODO: remove dependency on io-collapsible from io-navigation.
      elements.push(
        div([...addMenuOptions(item.options, depth, d + 1)])
        // ioCollapsible({
        //   label: item.label,
        //   icon: item.icon,
        //   expanded: collapsibleState,
        //   elements: [...addMenuOptions(item.options, depth, d + 1)]
        // })
      );
    } else {
      elements.push(ioMenuItem({
        item: item,
        depth: d
      }));
    }
  }
  return elements;
}

function matchItem(item: MenuItem, search: string) {
  if (item.value !== undefined && String(item.value).toLowerCase().indexOf(search) !== -1) return true;
  if (item.label && item.label.toLowerCase().indexOf(search) !== -1) return true;
  if (item.hint && item.hint.toLowerCase().indexOf(search) !== -1) return true;
  return false;
}

export function filterOptions(options: MenuOptions, search: string, depth = 5, elements: VDOMElement[] = [], d = 0): any {
  search = search.toLowerCase();
  if (d <= depth) for (let i = 0; i < options.length; i++) {
    if (matchItem(options[i], search)) {
      elements.push(ioMenuItem({
        item: options[i],
        depth: 0
      }));
    }
    if (options[i].options) {
      filterOptions(options[i].options, search, depth, elements, d + 1);
    }
  }
}

export type IoMenuTreeArgs = IoElementArgs & ArgsWithBinding<{
  options?: MenuOptions;
  searchable?: boolean;
  search?: string;
  depth?: number;
  slotted?: VDOMElement[];
}>;

@Register
export class IoMenuTree extends IoElement {
  static vConstructor: (arg0?: IoMenuTreeArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      color: var(--io_colorInput);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing) 0;
      align-self: flex-start;
      user-select: none;
      transition: opacity 0.25s;
      overflow: auto;
    }

    :host io-collapsible {
      flex: 0 0 auto;
      border-color: transparent;
      border: 0;
      overflow: visible;
    }
    :host io-collapsible > div.io-collapsible-content {
      background-color: transparent;
      flex: 0 0 auto;
      border-radius: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: var(--io_bgColorDimmed);
    }
    
    :host io-menu-item:first-of-type {
      margin-top: var(--io_borderWidth);
    }
    :host io-menu-item {
      background-color: var(--io_bgColorDimmed);
      flex: 0 0 auto;
      align-self: stretch;
      border-radius: 0;
      margin-left: var(--io_borderWidth);
      margin-right: var(--io_borderWidth);
    }
    :host io-menu-item[depth="1"] {
      padding-left: calc(var(--io_lineHeight) * 1);
    }
    :host io-menu-item[depth="2"] {
      padding-left: calc(var(--io_lineHeight) * 2);
    }
    :host io-menu-item[depth="3"] {
      padding-left: calc(var(--io_lineHeight) * 3);
    }
    :host io-menu-item[depth="4"] {
      padding-left: calc(var(--io_lineHeight) * 4);
    }
    :host io-menu-item[depth="5"] {
      padding-left: calc(var(--io_lineHeight) * 5);
    }
    :host io-menu-item[depth="6"] {
      padding-left: calc(var(--io_lineHeight) * 6);
    }
    /* Item spacing */
    :host io-menu-item {
      margin-bottom: var(--io_borderWidth);
    }
    :host io-menu-item:first-of-type {
      /* margin-top: var(--io_spacing); */
    }

    /* Search field */
    :host > .search {
      border-radius: 0;
      flex: 0 0 auto;
    }
    `;
  }

  @Property({type: MenuOptions, reflect: true})
  declare options: MenuOptions;

  @Property(false)
  declare searchable: boolean;

  @Property('')
  declare search: string;

  @Property(Infinity)
  declare depth: number;

  @Property({type: Array})
  declare slotted: VDOMElement[];

  @Property('listbox')
  declare role: string;

  @Property(undefined)
  declare $parent?: IoMenuItem;

  static get Listeners() {
    return {
      'item-clicked': '_onItemClicked',
    };
  }

  constructor(args: IoMenuTreeArgs = {}) { super(args); }

  _onItemClicked(event: CustomEvent) {
    const item = event.composedPath()[0] as unknown as IoMenuItem;
    const d = event.detail as MenuItem;
   if (item !== this as any) {
      event.stopImmediatePropagation();
      this.dispatchEvent('item-clicked', d, true);
      this.throttle(this._onCollapse);
    }
  }

  // TODO: fix UX. This shouldselect search field on collapse by click.
  _onCollapse() {
    const focusSearch = this.searchable && this.search;
    this.search = '';
    if (focusSearch) this.$.search.focus();
  }

  changed() {
    const elements: VDOMElement[] = [...this.slotted];

    // TODO: fix depth.

    if (this.searchable) {
      elements.push(ioString({
        $: 'search',
        role: 'search',
        class: 'search',
        value: this.bind('search'),
        placeholder: 'Search',
        live: true
      }));
    }

    if (this.search) {
      const len = elements.length;
      filterOptions(this.options, this.search, this.depth, elements);
      if (len === elements.length) {
        elements.push(ioMenuItem({item: new MenuItem({label: 'No matches', mode: 'none'})}));
      }
    } else {
      elements.push(...addMenuOptions(this.options, this.depth));
    }

    this.template(elements);
  }
}
export const ioMenuTree = IoMenuTree.vConstructor;