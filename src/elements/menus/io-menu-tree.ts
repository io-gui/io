import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { MenuOptions } from './models/menu-options.js';
import { MenuItem } from './models/menu-item.js';
import { IoMenuItem } from './io-menu-item.js';
import { IoStorage as $ } from '../../core/storage.js';

export function addMenuOptions(options: MenuOptions, depth: number, d = 0) {
  const elements: VDOMArray[] = [];
  if (d <= depth) for (let i = 0; i < options.length; i++) {
    const item = options[i];
    if (item.options?.length) {
      const collapsableState = $({value: false, storage: 'local', key: genUUID(options, i)});
      elements.push(['io-collapsable', {
        label: item.label,
        icon: item.icon,
        expanded: item.selected || collapsableState,
        elements: [...addMenuOptions(item.options, depth, d + 1)]
      }]);
    } else {
      elements.push(['io-menu-item', {
        item: item,
        depth: d
      }]);
    }
  }
  return elements;
}

function matchItem(item: MenuItem, search: string) {
  if (!!item.value || !!item.action) {
    if (String(item.value).toLowerCase().indexOf(search) !== -1) return true;
    if (item.label && item.label.toLowerCase().indexOf(search) !== -1) return true;
    if (item.hint && item.hint.toLowerCase().indexOf(search) !== -1) return true;
  }
  return false;
}

export function filterOptions(options: MenuOptions, search: string, depth = 5, elements: VDOMArray[] = [], d = 0): any {
  search = search.toLowerCase();
  if (d <= depth) for (let i = 0; i < options.length; i++) {
    if (matchItem(options[i], search)) {
      elements.push(['io-menu-item', {
        item: options[i],
        depth: 0
      }]);
    }
    if (options[i].options) {
      filterOptions(options[i].options, search, depth, elements, d + 1);
    }
  }
}

function genUUID(options: any, i: number) {
  const option = options[i];
  let UUID = 'io-sidebar-collapse-state-' + i + '-' + options.length;
  if (option.label) UUID += '-' + option.label;
  if (option.options.length) UUID += '(' + option.options.length + ')';
  return UUID;
}

@RegisterIoElement
export class IoMenuTree extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 0 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      border-radius: var(--iotBorderRadius);
      border: var(--iotBorder);
      border-color: var(--iotBorderColorOutset);
      color: var(--iotColorField);
      background-color: var(--iotBackgroundColorDark);
      padding: var(--iotSpacing);
      align-self: flex-start;
      user-select: none;
      transition: opacity 0.25s;
      position: relative;
      min-width: calc(var(--iotFieldHeight) + calc(var(--iotSpacing2) + var(--iotBorderWidth2)));
      min-height: calc(var(--iotFieldHeight) + calc(var(--iotSpacing2) + var(--iotBorderWidth2)));
      overflow: auto;
    }

    :host io-collapsable {
      overflow: hidden;
      flex: 0 0 auto;
      border-color: transparent;
    }
    :host io-collapsable > div.io-collapsable-content {
      background-color: transparent;
      overflow: hidden;
      flex: 0 0 auto;
    }
    
    :host io-menu-item {
      background-color: transparent;
      flex: 0 0 auto;
      border-radius: 0;
      position: relative;
      overflow: visible;
    }
    :host io-menu-item[depth="1"] {
      padding-left: calc(var(--iotLineHeight) * 1);
    }
    :host io-menu-item[depth="2"] {
      padding-left: calc(var(--iotLineHeight) * 2);
    }
    :host io-menu-item[depth="3"] {
      padding-left: calc(var(--iotLineHeight) * 3);
    }
    :host io-menu-item[depth="4"] {
      padding-left: calc(var(--iotLineHeight) * 4);
    }
    :host io-menu-item[depth="5"] {
      padding-left: calc(var(--iotLineHeight) * 5);
    }
    :host io-menu-item[depth="6"] {
      padding-left: calc(var(--iotLineHeight) * 6);
    }
    /* Item spacing */
    :host io-menu-item {
      margin-bottom: var(--iotBorderWidth);
    }
    :host io-menu-item:first-of-type {
      margin-top: var(--iotSpacing);
    }

    /* Item divider */
    :host io-menu-item:not(:last-of-type)::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
    }
    :host io-menu-item:not(:last-of-type)::before {
      right: 0;
      bottom: calc(var(--iotBorderWidth) * -2);
      border-bottom: var(--iotBorder);
      border-bottom-color: var(--iotColor);
      opacity: 0.05;
    }

    /* Search field */
    :host > .search {
      border-radius: 0;
      flex: 0 0 auto;
    }
    `;
  }

  @Property({observe: true, type: MenuOptions, reflect: true})
  declare options: MenuOptions;

  @Property(false)
  declare searchable: boolean;

  @Property('')
  declare search: string;

  @Property(Infinity)
  declare depth: number;

  @Property({type: Array})
  declare slotted: VDOMArray[];

  @Property('listbox')
  declare role: string;

  @Property(undefined)
  declare $parent?: IoMenuItem;

  static get Listeners() {
    return {
      'item-clicked': '_onItemClicked',
      'touchstart': '_stopPropagation',
    };
  }

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
    const elements: VDOMArray[] = [...this.slotted];

    if (this.searchable) {
      elements.push(['io-string', {
        $: 'search',
        role: 'search',
        class: 'search',
        value: this.bind('search'),
        placeholder: 'Search',
        live: true
      }]);
    }

    if (this.search) {
      const len = elements.length;
      filterOptions(this.options, this.search, this.depth, elements);
      if (len === elements.length) {
        elements.push(['io-menu-item', {item: new MenuItem({label: 'No matches', select: 'none'})}]);
      }
    } else {
      elements.push(...addMenuOptions(this.options, this.depth));
    }

    this.template(elements);
  }
}
