import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { MenuOptions } from './models/menu-options.js';
import { MenuItem } from './models/menu-item.js';
import { IoLayerSingleton, NudgeDirection } from '../../core/layer.js';
import { IoThemeSingleton } from '../../core/theme.js';
import { IoMenuItem } from './io-menu-item.js';
import { filterOptions } from './io-menu-tree.js';

const rects = new WeakMap();

/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
@RegisterIoElement
export class IoMenuOptions extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      /* Panel */
      display: flex;
      flex: 0 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      border-radius: var(--iotBorderRadius);
      border: var(--iotBorder);
      border-color: var(--iotBorderColorOutset);
      color: var(--iotColorField);
      background-color: var(--iotBackgroundColorDark);
      padding: var(--iotSpacing);
      user-select: none;
      transition: opacity 0.25s;
      position: relative;
      min-width: calc(var(--iotFieldHeight) + calc(var(--iotSpacing2) + var(--iotBorderWidth2)));
      min-height: calc(var(--iotFieldHeight) + calc(var(--iotSpacing2) + var(--iotBorderWidth2)));
    }

    :host[inlayer] {
      min-width: 8em;
      overflow-y: auto !important;
    }
    :host[inlayer]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }

    :host > .item {
      border-radius: 0;
      position: relative;
      overflow: visible;
    }

    :host[horizontal] {
      flex-direction: row;
      align-self: stretch;
    }

    /* Item spacing */
    :host:not([horizontal]) > .item {
      margin-bottom: var(--iotBorderWidth);
    }
    :host:not([horizontal]) > .item:first-of-type {
      margin-top: var(--iotSpacing);
    }
    :host[horizontal] > .item {
      margin-left: var(--iotBorderWidth);
      padding: var(--iotSpacing) calc(0.75 * var(--iotLineHeight));
    }

    /* Item divider */
    :host > .item:not(:last-of-type)::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
    }
    :host:not([horizontal]) > .item:not(:last-of-type)::before {
      right: 0;
      bottom: calc(var(--iotBorderWidth) * -2);
      border-bottom: var(--iotBorder);
      border-bottom-color: var(--iotColor);
      opacity: 0.05;
    }
    :host[horizontal] > .item:not(:last-of-type)::before {
      top: 0;
      right: calc(var(--iotBorderWidth) * -2);
      border-right: var(--iotBorder);
      border-right-color: var(--iotColor);
      opacity: 0.25;
    }

    /* Remove hints from horizontal menu */
    :host[horizontal] > .item > .hint {
      display: none;
    }

    /* Search field */
    :host > .search {
      border-radius: 0;
      flex: 0 0 auto;
    }
    :host[horizontal] > .search {
      margin-left: var(--iotBorderWidth);
      flex: 0 0 8em;
    }

    /* Hamburger menu for overflow items */
    :host > .hamburger {
      border-color: transparent !important; 
    }
    :host[horizontal] > .hamburger {
      position: absolute;
      right: var(--iotSpacing2);
      padding: var(--iotSpacing);
    }
    :host > .hamburger > .hasmore {
      display: none;
    }
    `;
  }

  @Property({observe: true, type: MenuOptions, reflect: true})
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

  @Property({type: Array})
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
    // Prevents IoLayer from stopping scroll in clipped options
    event.stopPropagation();
  }
  init() {
    this.throttle(this._onSetOverflow);
  }
  onResized() {
    this.throttle(this._onSetOverflow);
  }

  _onSetOverflow() {
    const items = this.querySelectorAll('.item');
    this._overflownItems.length = 0;
    if (this.horizontal) {
      const hamburger = this.querySelector('.hamburger');
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
          this._overflownItems.push(items[i].item);
        } else if (i === (items.length - 1) && last < end) {
          items[i].hidden = false;
        } else if (last < (end - hamburgetWidth * 1.5)) {
          items[i].hidden = false;
        } else {
          hasOwerflown = true;
          items[i].hidden = true;
          this._overflownItems.push(items[i].item);
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
        this.throttle(this._onExpandInLayer);
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
  _onExpandInLayer() {
    debug: {
      if (!this.$parent) {
        console.warn('IoMenuOptions: $parent property mandatory when expanding inside `IoLayerSingleton`.');
        console.log(this);
      }
    }
    if (this.$parent) {
      const pRect = this.$parent.getBoundingClientRect();
      IoLayerSingleton.setElementPosition(this as unknown as HTMLElement, this.direction, pRect);
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
          item: this.options[i],
          class: 'item',
          direction: direction,
          depth: this.depth
        }]);
      }
    }

    if (this.overflow) {
      elements.push(['io-menu-item', {
        depth: this.depth + 1,
        role: 'navigation',
        class: 'hamburger',
        direction: 'down',
        item: new MenuItem({
          label: '',
          icon: 'icons:hamburger',
          options: new MenuOptions(this._overflownItems),
        })
      }]);
    }
    this.template(elements);
  }
}
