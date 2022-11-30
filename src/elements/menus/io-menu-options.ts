import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { MenuOptions } from './models/menu-options.js';
import { MenuItem } from './models/menu-item.js';
import { IoLayerSingleton, NudgeDirection } from '../../core/layer.js';
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
      @apply --io-column;
      position: relative;
      align-self: flex-start;
      align-items: stretch;
      white-space: nowrap;
      user-select: none;
      background-image: none;
      opacity: 1;
      transition: opacity 0.25s;
      overflow-y: auto !important;
      flex: 0 1 auto;
    }
    :host > io-menu-item {
      align-self: stretch;
      flex: 0 0 auto;
    }
    :host > io-menu-item[hidden] {
      display: inherit;
      visibility: hidden;
      pointer-events: none;
    }
    :host[inlayer] {
      display: inline-block;
      box-shadow: var(--io-shadow);
    }
    :host[inlayer]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }
    :host[horizontal] {
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
      flex-wrap: nowrap;
      padding: 0 var(--io-spacing);
      overflow-x: hidden;
    }
    :host[horizontal] > io-menu-item {
      padding: var(--io-spacing) calc(0.5 * var(--io-line-height));
    }
    :host[horizontal] > io-menu-item:not(:first-of-type):not([role="navigation"]) {
      border-left:1px solid var(--io-color-border);
    }
    :host:not([horizontal]) > io-menu-item > * {
      min-width: 0.5em;
      padding: 0 var(--io-spacing);
    }
    :host[horizontal] > io-menu-item > .io-menu-hint,
    :host[horizontal] > io-menu-item > .io-menu-more {
      display: none;
    }

    :host[horizontal] > io-menu-item[role="navigation"] {
      position: absolute;
      right: 0;
      margin-left: auto;
    }
    :host[horizontal] > io-menu-item[role="navigation"]:after {
      content: '' !important;
      display: none !important;
    }
    :host[horizontal] > io-menu-item[role="navigation"][hidden] {
      display: inline-block;
      width: 0;
      padding: 0;
      border: 0;
      overflow: hidden;
      visibility: hidden;
    }

    :host > io-string {
      align-self: stretch;
      flex: 0 0 auto;
      min-width: 8em;
    }
    :host > io-string:empty:before {
      content: '\\1F50D';
      white-space: pre;
      margin-top: 0.5em;
      padding: 0.25em;
      visibility: visible;
      /* opacity: 0.33; */
    }
    `;
  }

  // TODO: consider specifying type without auto-initalization
  @Property({observe: true})
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
    const items = this.querySelectorAll('io-menu-item:not([role="navigation"])');
    this._overflownItems.length = 0;
    if (this.horizontal) {
      const hamburger = this.querySelector('[role="navigation"]');
      let end = this.getBoundingClientRect().right;
      let hamburgetWidth = 0;
      let last = Infinity;

      for (let i = items.length; i--;) {
        const r = items[i].getBoundingClientRect();
        const rect = rects.get(items[i]) || {right: 0, width: 0};
        if (r.right !== 0 && r.width !== 0)  {
          rect.right = r.right;
          rect.width = r.width;
          rects.set(items[i], rect);
        }

        if (hamburger) {
          hamburgetWidth = hamburger?.getBoundingClientRect().width;
        }

        if (items[i].selected) {
          end -= rect.width;
          items[i].hidden = false;
          items[i].disabled = false;
          continue;
        }

        last = Math.min(last, rect.right);
        if (i === (items.length - 1) && last < end) {
          items[i].hidden = false;
          items[i].disabled = false;
        } else if (last < (end - hamburgetWidth)) {
          items[i].hidden = false;
          items[i].disabled = false;
        } else {
          items[i].hidden = true;
          items[i].disabled = true;
          this._overflownItems.push(items[i].item);
        }
      }
      this.overflow = this._overflownItems.length ? JSON.stringify(this._overflownItems.map((item: MenuItem) => item.label)) : '';
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
        this._onExpandInLayer();
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
      this.throttle(this._clipHeight);
    }
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
      this._clipHeight();
    }
  }
  _clipHeight() {
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
        if (String(o.value).toLowerCase().search(search) !== -1) return true;
        if (o.label && o.label.toLowerCase().search(search) !== -1) return true;
        if (o.hint && o.hint.toLowerCase().search(search) !== -1) return true;
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
        direction: this.horizontal ? 'bottom' : 'right',
        depth: this.depth
      }]);
    }

    if (this.overflow) {
      const item = new MenuItem({
        label: '',
        icon: 'icons:hamburger',
        options: new MenuOptions(this._overflownItems),
      });
      elements.push(['io-menu-item', {
        depth: this.depth + 1,
        role: 'navigation',
        item: item
      }]);
    }
    this.template(elements);
  }
}
