import { Register, IoElement, ReactiveProperty, VDOMElement, IoOverlaySingleton as Overlay, NudgeDirection, ThemeSingleton, IoElementProps, WithBinding, Property, nudge } from 'io-gui';
import { ioString } from 'io-inputs';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem, IoMenuItem } from './IoMenuItem.js';
import { ioMenuHamburger } from './IoMenuHamburger.js';
import { IoContextMenu } from './IoContextMenu.js';
import { getMenuDescendants, getMenuSiblings } from '../utils/MenuDOMUtils.js';
import { searchMenuOptions } from '../utils/MenuNodeUtils.js';

const rects = new WeakMap();

// TODO: improve focusto nav and in-layer navigation.

export type IoMenuOptionsProps = IoElementProps & {
  options?: WithBinding<MenuOptions>,
  expanded?: WithBinding<boolean>,
  horizontal?: boolean,
  searchable?: boolean,
  search?: WithBinding<string>,
  direction?: NudgeDirection,
  depth?: number,
  noPartialCollapse?: boolean,
  widget?: VDOMElement | null,
  $parent?: IoMenuItem | IoContextMenu,
};

/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
@Register
export class IoMenuOptions extends IoElement {
  static vConstructor: (arg0?: IoMenuOptionsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
      padding: var(--io_spacing) 0;
      user-select: none;
      transition: opacity 0.3s ease-in-out;
    }
    :host[horizontal] {
      flex-direction: row;
      align-self: stretch;
      padding: 0 var(--io_spacing);
    }
    :host[inoverlay] {
      overflow-y: auto;
      box-shadow: 1px 1px 16px var(--io_shadowColor),
                  1px 1px 8px var(--io_shadowColor), 
                  1px 1px 4px var(--io_shadowColor);
    }
    :host[inoverlay]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }
    :host > io-menu-item {
      border-radius: 0;
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
    :host > io-menu-item[hidden] ~ span.divider {
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
    :host:not([horizontal]) > #search {
      margin: var(--io_spacing);
      margin-top: 0;
    }
    :host[horizontal] > #search {
      margin: var(--io_spacing);
      margin-left: 0;
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

  @ReactiveProperty({type: MenuOptions})
  declare options: MenuOptions;

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean;

  @ReactiveProperty({value: false, reflect: true})
  declare horizontal: boolean;

  @ReactiveProperty(false)
  declare searchable: boolean;

  @ReactiveProperty('')
  declare search: string;

  @ReactiveProperty({value: 'none', reflect: true})
  declare direction: NudgeDirection;

  @ReactiveProperty(100)
  declare depth: number;

  @ReactiveProperty(false)
  declare noPartialCollapse: boolean;

  @ReactiveProperty({value: '', reflect: true})
  declare overflow: string;

  @ReactiveProperty(null)
  declare widget: VDOMElement | null;

  @ReactiveProperty(undefined)
  declare $parent?: IoMenuItem;

  @Property('listbox')
  declare role: string;

  // TODO: make non-reactive
  @ReactiveProperty({type: Array})
  declare private _overflownItems: MenuItem[];

  static get Listeners() {
    return {
      'touchstart': ['stopPropagation', {passive: false}],
      'io-focus-to': 'onIoFocusTo',
    };
  }
  get inoverlay() {
    return Overlay.contains(this.parentElement);
  }
  constructor(args: IoMenuOptionsProps = {}) {
    super(args);
    this.setOverflow = this.setOverflow.bind(this);
    this.debounce(this.setOverflow);
  }
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.inoverlay) {
      this.setAttribute('inoverlay', 'true');
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  onIoFocusTo(event: CustomEvent) {
    const source = event.detail.source;
    const direction = event.detail.direction;
    const siblings = getMenuSiblings(source);
    const index = siblings.indexOf(source);

    const inoverlay = this.inoverlay;

    let parentIsAbove = false;
    let parentIsBelow = false;
    let parentIsLeft = false;
    let parentIsRight = false;

    if (this.$parent) {
      const rect = this.getBoundingClientRect();
      const parentRect = this.$parent.getBoundingClientRect();
      parentIsAbove = rect.top > parentRect.top;
      parentIsBelow = rect.bottom < parentRect.bottom;
      parentIsLeft = rect.left > parentRect.left;
      parentIsRight = rect.right < parentRect.right;
    }

    let command = '';

    if (this.horizontal) {
      if (direction === 'right' && inoverlay) command = 'next';
      if (direction === 'left' && inoverlay) command = 'prev';
      if (direction === 'left' && index === 0 && parentIsLeft) command = 'out';
      if (direction === 'right' && index === siblings.length - 1 && parentIsRight) command = 'out';
      if (direction === 'up' && parentIsAbove) command = 'out';
      if (direction === 'down' && parentIsBelow) command = 'out';
    } else {
      if (direction === 'down' && inoverlay) command = 'next';
      if (direction === 'up' && inoverlay) command = 'prev';
      if (direction === 'up' && index === 0 && parentIsAbove) command = 'out';
      if (direction === 'down' && index === siblings.length - 1 && parentIsBelow) command = 'out';
      if (direction === 'left' && parentIsLeft) command = 'out';
      if (direction === 'right' && parentIsRight) command = 'out';
    }

    if (command) {
      if (command === 'next') {
        siblings[(index + 1) % siblings.length].focus();
      } else if (command === 'prev') {
        siblings[(index - 1 + siblings.length) % siblings.length].focus();
      } else if (command === 'out') {
        if (this.$parent) this.$parent.focus();
      }
      event.stopPropagation();
    }
  }
  onResized() {
    this.debounce(this.setOverflow);
  }
  setOverflow() {
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
  collapse() {
    const itemWasFocused = this.contains(document.activeElement);
    const searchHadInput = this.searchable && !!this.search;
    getMenuDescendants(this).forEach(descendant => {
      descendant.expanded = false;
    });
    this.expanded = false;
    if (searchHadInput && itemWasFocused && !this.inoverlay) {
      this.search = '';
      this.$.search.focus();
    }
  }
  expandedChanged() {
    if (this.expanded) {
      if (this.inoverlay) {
        this.debounce(this.onExpandInOverlay);
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
    // TODO: focus drifts when filtered item is clicked
    if (this.inoverlay && this.$parent) {
      this.debounce(this.onExpandInOverlay);
    }
    this.debounce(this.setOverflow);
  }
  // TODO: Move functionality to Overlay
  onExpandInOverlay() {
    if (this.$parent) {
      nudge(this, this.$parent, this.direction, true);
    }
  }
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
      } else {
        for (let i = 0; i < filteredItems.length; i++) {
          elements.push(ioMenuItem({item: filteredItems[i], depth: 0}));
        }
      }
    } else {
      let direction: 'left' | 'right' | 'up' | 'down' = this.horizontal ? 'down' : 'right';
      if (this.horizontal && this.direction === 'up') {
        direction = 'up';
      }
      for (let i = 0; i < this.options.length; i++) {
        elements.push(ioMenuItem({
          item: this.options[i],
          direction: direction,
          $parent: this,
          depth: this.depth
        }));
        if (i < this.options.length - 1) {
          elements.push({tag: 'span', props: {class: 'divider'}});
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