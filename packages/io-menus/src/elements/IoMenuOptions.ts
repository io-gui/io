import { Register, IoElement, Property, VDOMElement, IoOverlaySingleton, NudgeDirection, ThemeSingleton, IoElementArgs, ArgsWithBinding } from 'io-gui';
import { ioString } from 'io-inputs';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem, IoMenuItem } from './IoMenuItem.js';
import { filterOptions } from './IoMenuTree.js';
import { ioMenuHamburger } from './IoMenuHamburger.js';
import { IoContextMenu } from './IoContextMenu.js';
const rects = new WeakMap();

export type IoMenuOptionsArgs = IoElementArgs & ArgsWithBinding<{
  options?: MenuOptions;
  expanded?: boolean;
  horizontal?: boolean;
  searchable?: boolean;
  search?: string;
  direction?: NudgeDirection;
  depth?: number;
  noPartialCollapse?: boolean;
  inlayer?: boolean;
  slotted?: VDOMElement[];
  $parent?: IoMenuItem | IoContextMenu;
}>;

/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
@Register
export class IoMenuOptions extends IoElement {
  static vConstructor: (arg0?: IoMenuOptionsArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      border-radius: var(--io_borderRadius);
      background-color: var(--io_bgColorDimmed);
      position: relative;
    }
    :host[horizontal] {
      flex-direction: row;
      align-self: stretch;
      padding: 0 var(--io_spacing);
    }
    :host:not([horizontal]) {
      flex-direction: column;
      padding: var(--io_spacing) 0;
    }
    :host[inlayer] {
      min-width: 8em;
    }
    :host[inlayer]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }

    /* Menu Items */
    :host > io-menu-item {
      background-color: transparent;
      border-radius: 0;
    }
    :host[horizontal] > io-menu-item {
      height: calc(var(--io_fieldHeight) + var(--io_spacing2));
      border-left: none;
      border-right: none;
      border-width: calc(var(--io_spacing) + var(--io_borderWidth)) var(--io_borderWidth);
    }
    :host:not([horizontal]) > io-menu-item {
      border-top: none;
      border-bottom: none;
      border-width: var(--io_borderWidth) var(--io_spacing);
    }
    :host > io-menu-item[selected][direction="up"] {
      border-color: var(--io_colorBlue) transparent transparent transparent;
    }
    :host > io-menu-item[selected][direction="down"] {
      border-color: transparent transparent var(--io_colorBlue) transparent;
    }
    :host > io-menu-item[selected][direction="right"] {
      border-color: transparent var(--io_colorBlue) transparent transparent;
    }
    :host > io-menu-item[selected][direction="left"] {
      border-color: transparent transparent transparent var(--io_colorBlue);
    }

    /* Item divider */
    :host > [hidden] ~ span.divider {
      border-color: red;
      display: none;
    }
    :host > span.divider {
      flex: 0 0 0;
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      margin: var(--io_spacing);
      opacity: 0.5;
    }

    /* Remove hints from horizontal menu */
    :host[horizontal] > io-menu-item > .hint {
      display: none;
    }

    /* Search field */
    :host:not([horizontal]) > .search {
      margin: var(--io_spacing);
      margin-top: 0;
    }
    :host[horizontal] > .search {
      margin-right: var(--io_borderWidth);
      flex: 0 0 10em;
    }

    /* Hamburger menu for overflow items */
    :host > io-menu-hamburger {
      border-color: transparent !important;
      background-color: transparent !important;
    }
    :host[horizontal] > io-menu-hamburger {
      position: absolute;
      right: var(--io_spacing);
      padding: var(--io_spacing);
    }
    `;
  }

  @Property({type: MenuOptions})
  declare options: MenuOptions;

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Property({value: false, reflect: true})
  declare horizontal: boolean;

  @Property(false)
  declare searchable: boolean;

  @Property('')
  declare search: string;

  @Property({value: 'none', reflect: true})
  declare direction: NudgeDirection;

  @Property(100)
  declare depth: number;

  @Property(false)
  declare noPartialCollapse: boolean;

  @Property({value: '', reflect: true})
  declare overflow: string;

  @Property({value: false, reflect: true})
  declare inlayer: boolean;

  @Property({type: Array})
  declare slotted: VDOMElement[];

  @Property('listbox')
  declare role: string;

  @Property(undefined)
  declare $parent?: IoMenuItem;

  // TODO: make non-reactive
  @Property({type: Array})
  declare private _overflownItems: MenuItem[];

  static get Listeners() {
    return {
      'item-clicked': '_onItemClicked',
      'touchstart': ['_stopPropagation', {passive: false}],
    };
  }

  constructor(args: IoMenuOptionsArgs = {}) { super(args); }

  _onItemClicked(event: CustomEvent) {
    const item = event.composedPath()[0] as unknown as IoMenuItem;
    const d = event.detail as MenuItem;
    if (item.localName === 'io-string') {
      event.stopImmediatePropagation();
      return;
    }
    if (item !== (this as any)) {
      event.stopImmediatePropagation();
      this.dispatchEvent('item-clicked', d, true);
      this.throttle(this._onCollapse);
    }
  }
  _stopPropagation(event: MouseEvent) {
    // Prevents IoOverlay from stopping scroll in clipped options
    event.stopPropagation();
  }
  init() {
    this.throttle(this._onSetOverflow);
  }
  onResized() {
    this.throttle(this._onSetOverflow);
  }

  _onSetOverflow() {
    if (this._disposed) return;
    const items = this.querySelectorAll('.item');
    this._overflownItems.length = 0;
    if (this.horizontal) {
      const hamburger = this.querySelector('io-menu-hamburger');
      const hamburgetWidth = hamburger?.getBoundingClientRect().width || 0;
      const end = this.getBoundingClientRect().right - (ThemeSingleton.borderWidth + ThemeSingleton.spacing);
      let last = Infinity;
      let hasOwerflown = false;

      for (let i = items.length; i--;) {
        const r = items[i].getBoundingClientRect();
        const rect = rects.get(items[i].item) || {right: 0, width: 0};
        if (r.right !== 0 && r.width !== 0)  {
          rect.right = r.right;
          rect.width = r.width;
          rects.set(items[i].item, rect);
        }

        last = Math.min(last, rect.right);
        if (this.noPartialCollapse && hasOwerflown) {
          items[i].hidden = true;
          this._overflownItems.unshift(items[i].item);
        } else if (i === (items.length - 1) && last < end) {
          items[i].hidden = false;
        } else if (last < (end - hamburgetWidth * 1.5)) {
          items[i].hidden = false;
        } else {
          hasOwerflown = true;
          items[i].hidden = true;
          this._overflownItems.unshift(items[i].item);
        }
      }

      if (this._overflownItems.length) {
        this.overflow = JSON.stringify(this._overflownItems.map((item: MenuItem) => item.label));
      } else {
        this.overflow = '';
      }
    } else {
      this.overflow = '';
    }
  }
  _onCollapse() {
    const focusSearch = this.selectable && !!this.search && !this.inlayer;
    this.setProperties({
      search: '',
      expanded: false,
    });
    if (focusSearch) this.$.search.focus();
  }
  expandedChanged() {
    if (this.expanded) {
      if (this.inlayer) {
        this.throttle(this._onExpandInOverlay);
      }
    } else {
      this.style.top = null;
      this.style.height = null;
      this.style.touchAction = null;
      this.scrollTop = 0;
      this.search = '';
    }
  }
  searchChanged() {
    if (this.inlayer && this.$parent) {
      this.throttle(this._onClipHeight);
    }
    this.throttle(this._onSetOverflow);
  }
  _onExpandInOverlay() {
    debug: {
      if (!this.$parent) {
        console.warn('IoMenuOptions: $parent property mandatory when expanding inside `IoOverlaySingleton`.');
      }
    }
    if (this.$parent) {
      const pRect = this.$parent.getBoundingClientRect();
      IoOverlaySingleton.setElementPosition(this as unknown as HTMLElement, this.direction, pRect);
      this._onClipHeight();
    }
  }
  _onClipHeight() {
    this.scrollTop = 0;
    if (!this.firstChild) return;

    const rectTop = this.firstChild.getBoundingClientRect().top;
    const rectBottom = this.lastChild.getBoundingClientRect().bottom;
    const rectHeight = rectBottom - rectTop;

    if (rectTop < 0) {
      this.style.top = '0px';
      this.style.height = (rectHeight + rectTop)  + 'px';
      this.style.touchAction = 'pan-y';
    } else if (rectBottom > window.innerHeight) {
      this.style.height = (window.innerHeight - rectTop)  + 'px';
      this.style.touchAction = 'pan-y';
    } else {
      this.style.height = null;
      this.style.touchAction = null;
    }
  }

  changed() {
    const elements: VDOMElement[] = [...this.slotted];

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
      let direction: 'left' | 'right' | 'up' | 'down' = this.horizontal ? 'down' : 'right';
      if (this.horizontal && this.direction === 'up') {
        direction = 'up';
      }
      for (let i = 0; i < this.options.length; i++) {
        elements.push(ioMenuItem({
          class: 'item',
          item: this.options[i],
          direction: direction,
          depth: this.depth
        }));
        if (i < this.options.length - 1) {
          elements.push({name: 'span', props: {class: 'divider'}});
        }
      }
    }

    if (this.overflow) {
      elements.push(ioMenuHamburger({
        depth: this.depth + 1,
        role: 'navigation',
        direction: 'down',
        item: new MenuItem({
          options: new MenuOptions({
            items: this._overflownItems,
          }),
        })
      }));
    }
    this.template(elements);
  }
}
export const ioMenuOptions = IoMenuOptions.vConstructor;