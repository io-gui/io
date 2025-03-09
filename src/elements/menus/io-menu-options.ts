import { IoElement, VDOMArray } from '../../core/element.js';
import { Register } from '../../core/node.js';
import { Property } from '../../core/decorators/property.js';
import { MenuOptions } from './models/menu-options.js';
import { IoMenuItem } from './io-menu-item.js';
import { MenuItem } from './models/menu-item.js';
import { IoOverlaySingleton, NudgeDirection } from '../../core/overlay.js';
import { IoThemeSingleton } from '../../core/theme.js';
import { filterOptions } from './io-menu-tree.js';

const rects = new WeakMap();

/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
@Register
export class IoMenuOptions extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      border-radius: var(--iotBorderRadius);
      background-color: var(--iotBgColorDimmed);
      position: relative;
    }
    :host[horizontal] {
      flex-direction: row;
      align-self: stretch;
      padding: 0 var(--iotSpacing);
    }
    :host:not([horizontal]) {
      flex-direction: column;
      padding: var(--iotSpacing) 0;
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
      height: calc(var(--iotFieldHeight) + var(--iotSpacing2));
      border-left: none;
      border-right: none;
      border-width: calc(var(--iotSpacing) + var(--iotBorderWidth)) var(--iotBorderWidth);
    }
    :host:not([horizontal]) > io-menu-item {
      border-top: none;
      border-bottom: none;
      border-width: var(--iotBorderWidth) var(--iotSpacing);
    }
    :host > io-menu-item[selected][direction="up"] {
      border-color: var(--iotColorBlue) transparent transparent transparent;
    }
    :host > io-menu-item[selected][direction="down"] {
      border-color: transparent transparent var(--iotColorBlue) transparent;
    }
    :host > io-menu-item[selected][direction="right"] {
      border-color: transparent var(--iotColorBlue) transparent transparent;
    }
    :host > io-menu-item[selected][direction="left"] {
      border-color: transparent transparent transparent var(--iotColorBlue);
    }

    /* Item divider */
    :host > [hidden] ~ span.divider {
      border-color: red;
      display: none;
    }
    :host > span.divider {
      flex: 0 0 0;
      border: var(--iotBorder);
      border-color: var(--iotBorderColorInset);
      margin: var(--iotSpacing);
      opacity: 0.5;
    }

    /* Remove hints from horizontal menu */
    :host[horizontal] > io-menu-item > .hint {
      display: none;
    }

    /* Search field */
    :host:not([horizontal]) > .search {
      margin: var(--iotSpacing);
      margin-top: 0;
    }
    :host[horizontal] > .search {
      margin-right: var(--iotBorderWidth);
      flex: 0 0 10em;
    }

    /* Hamburger menu for overflow items */
    :host > io-menu-hamburger {
      border-color: transparent !important;
      background-color: transparent !important;
    }
    :host[horizontal] > io-menu-hamburger {
      position: absolute;
      right: var(--iotSpacing);
      padding: var(--iotSpacing);
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
  declare slotted: VDOMArray[];

  @Property('listbox')
  declare role: string;

  @Property(undefined)
  declare $parent?: IoMenuItem;

  @Property({type: Array, reactive: false})
  declare private _overflownItems: MenuItem[];

  static get Listeners() {
    return {
      'item-clicked': '_onItemClicked',
      'touchstart': ['_stopPropagation', {passive: false}],
    };
  }

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
      const end = this.getBoundingClientRect().right - (IoThemeSingleton.iotBorderWidth + IoThemeSingleton.iotSpacing);
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
        elements.push(['io-menu-item', {item: new MenuItem({label: 'No matches', mode: 'none'})}]);
      }
    } else {
      let direction = this.horizontal ? 'down' : 'right';
      if (this.horizontal && this.direction === 'up') {
        direction = 'up';
      }
      for (let i = 0; i < this.options.length; i++) {
        elements.push(['io-menu-item', {
          class: 'item',
          item: this.options[i],
          direction: direction,
          depth: this.depth
        }]);
        if (i < this.options.length - 1) {
          elements.push(['span', {class: 'divider'}]);
        }
      }
    }

    if (this.overflow) {
      elements.push(['io-menu-hamburger', {
        depth: this.depth + 1,
        role: 'navigation',
        direction: 'down',
        item: new MenuItem({
          options: new MenuOptions(this._overflownItems),
        })
      }]);
    }
    this.template(elements);
  }
}
