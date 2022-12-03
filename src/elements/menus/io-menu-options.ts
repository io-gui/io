import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { MenuOptions } from './models/menu-options.js';
import { MenuItem } from './models/menu-item.js';
import { IoLayerSingleton, NudgeDirection } from '../../core/layer.js';
import { IoThemeSingleton } from '../../core/theme.js';
import { IoMenuItem } from './io-menu-item.js';

const rects = new WeakMap();

/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
@RegisterIoElement
export class IoMenuOptions extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-panel;
      align-self: flex-start;
      user-select: none;
      transition: opacity 0.25s;
      position: relative;
      min-width: calc(var(--io-field-height) + calc(var(--io-spacing2) + var(--io-border-width2)));
      min-height: calc(var(--io-field-height) + calc(var(--io-spacing2) + var(--io-border-width2)));
    }

    :host[inlayer] {
      min-width: 8em;
      box-shadow: var(--io-shadow);
      overflow-y: auto !important;
      position: absolute;
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
      /* align-self: stretch; */
      /* justify-self: stretch; */
      /* overflow-x: hidden; */
    }

    /* Item spacing */
    :host:not([horizontal]) > .item {
      margin-bottom: var(--io-border-width);
    }
    :host:not([horizontal]) > .item:first-of-type {
      margin-top: var(--io-spacing);
    }
    :host[horizontal] > .item {
      margin-left: var(--io-border-width);
      padding: var(--io-spacing) calc(0.75 * var(--io-line-height));
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
      bottom: calc(var(--io-border-width) * -2);
      border-bottom: var(--io-border);
      border-bottom-color: var(--io-color);
      opacity: 0.05;
    }
    :host[horizontal] > .item:not(:last-of-type)::before {
      top: 0;
      right: calc(var(--io-border-width) * -2);
      border-right: var(--io-border);
      border-right-color: var(--io-color);
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
      margin-left: var(--io-border-width);
      flex: 0 0 8em;
    }

    /* Hamburger menu for overflow items */
    :host > .hamburger {
      border-color: transparent !important; 
    }
    :host[horizontal] > .hamburger {
      position: absolute;
      right: var(--io-spacing2);
      padding: var(--io-spacing);
    }
    :host > .hamburger > .hasmore {
      display: none;
    }
    `;
  }

  @Property({observe: true, type: MenuOptions})
  declare options: MenuOptions;

  @Property({value: false, reflect: 'prop'})
  declare expanded: boolean;

  @Property({value: false, reflect: 'prop'})
  declare horizontal: boolean;

  @Property(false)
  declare searchable: boolean;

  @Property('')
  declare search: string;

  @Property({value: 'right', reflect: 'prop'})
  declare position: NudgeDirection;

  @Property(Infinity)
  declare depth: number;

  @Property(false)
  declare noPartialCollapse: boolean;

  @Property({value: '', reflect: 'prop'})
  declare overflow: string;

  @Property({value: false, reflect: 'prop'})
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
      'touchstart': '_stopPropagation',
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
      const end = this.getBoundingClientRect().right - (IoThemeSingleton.ioBorderWidth + IoThemeSingleton.ioSpacing);
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
      IoLayerSingleton.setElementPosition(this as unknown as HTMLElement, this.position, pRect);
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
  _filterOptions(options: any, search: string, _depth = 5, _chain: any[] = [], _i = 0): any {
    function predicateFn(o: any) {
      if (!!o.value || !!o.action) {
        if (String(o.value).toLowerCase().indexOf(search) !== -1) return true;
        if (o.label && o.label.toLowerCase().indexOf(search) !== -1) return true;
        if (o.hint && o.hint.toLowerCase().indexOf(search) !== -1) return true;
      }
      return false;
    }
    const result: any[] = [];
    if (_chain.indexOf(options) !== -1) return result; _chain.push(options);
    if (_i > _depth) return result; _i++;
    if (predicateFn(options) && result.indexOf(options) === -1) result.push(options);
    for (const key in options) {
      const item = options[key];
      if (predicateFn(item) && result.indexOf(item) === -1) result.push(item);
      if (typeof item === 'object') {
        const results = this._filterOptions(item, search, _depth, _chain, _i);
        for (let i = 0; i < results.length; i++) {
          if (result.indexOf(results[i]) === -1) result.push(results[i]);
        }
      }
    }
    return result;
  }
  changed() {
    const elements: VDOMArray[] = [...this.slotted];
    let options = this.options;
    if (this.searchable) {
      elements.push(['io-string', {
        id: 'search',
        role: 'search',
        class: 'search',
        value: this.bind('search'),
        placeholder: 'Search',
        live: true
      }]);
    }
    if (this.search) {
      options = this._filterOptions(this.options, this.search.toLowerCase());
      options = options.length ? options : new MenuOptions([new MenuItem({select: 'none', label: 'No matches'})]);
    }

    for (let i = 0; i < options.length; i++) {
      elements.push(['io-menu-item', {
        item: options[i],
        class: 'item',
        direction: this.horizontal ? 'down' : 'right',
        depth: this.depth
      }]);
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
