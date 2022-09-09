import {IoElement, RegisterIoElement, Binding} from '../../iogui.js';
import {Options} from '../../models/options.js';
import {Item} from '../../models/item.js';
import {IoLayerSingleton as Layer} from '../core/layer.js';
import {IoMenuItem} from './menu-item.js';

const rects = new WeakMap();

/*
 * Extends `IoElement`. Implements `IoMenuItem` and `IoLayerSingleton`.
 *
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 *
 * <io-element-demo element="io-menu-options" properties='{
 *   "value": "hello world",
 *   "selectable": true,
 *   "searchable": true,
 *   "search": "",
 *   "expanded": false,
 *   "horizontal": false,
 *   "options": ["one", "two", "three"]
 * }' config='{
 *   "type:object": ["io-object"]
 * }'></io-element-demo>
 **/
@RegisterIoElement
export class IoMenuOptions extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-panel;
      box-sizing: border-box;
      align-self: flex-start;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      white-space: nowrap;
      user-select: none;
      background-image: none;
      opacity: 1;
      transition: opacity 0.25s;
      overflow-y: auto !important;
      padding: 0;
    }
    :host > io-menu-item {
      align-self: stretch;
      flex: 0 0 auto;
    }
    :host[inlayer] {
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
    }
    :host[horizontal] > io-menu-item {
      padding: var(--io-spacing) calc(0.5 * var(--io-line-height));
    }
    :host[horizontal] > io-menu-item {
      border-right:1px solid var(--io-color-border);
    }
    :host:not([horizontal]) > io-menu-item > * {
      min-width: 0.5em;
      padding: 0 var(--io-spacing);
    }
    :host[horizontal] > io-menu-item > .io-menu-hint,
    :host[horizontal] > io-menu-item > .io-menu-more {
      display: none;
    }
    :host[horizontal] > io-menu-item.io-hamburger {
      margin-left: auto;
    }
    :host[horizontal] > io-menu-item.io-hamburger:after {
      content: '';
      display: none;
    }
    :host[horizontal] > io-menu-item.io-hamburger[hidden] {
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
      padding: 0 0.25em;
      visibility: visible;
      opacity: 0.33;
    }
    `;
  }
  static get Properties(): any {
    return {
      options: {
        type: Options,
        observe: true,
      },
      value: null,
      expanded: {
        value: false,
        reflect: 1,
      },
      horizontal: {
        type: Boolean,
        reflect: 1,
      },
      position: 'right',
      depth: Infinity,
      searchable: Boolean,
      search: String,
      overflow: {
        type: Boolean,
        reflect: 1,
      },
      inlayer: {
        type: Boolean,
        reflect: 1,
      },
      slotted: Array,
      $parent: null,
      _rects: Array,
      role: 'listbox',
    };
  }
  static get Listeners() {
    return {
      'item-clicked': '_onItemClicked',
      'touchstart': '_stopPropagation',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.inlayer = this.parentElement === Layer;
  }
  _onItemClicked(event: CustomEvent) {
    const item = event.composedPath()[0] as unknown as IoMenuItem;
    const d = event.detail as Item;
    if (item.localName === 'io-string') {
      event.stopImmediatePropagation();
      return;
    }
    if (item !== (this as any)) {
      event.stopImmediatePropagation();
      if (d.value !== undefined && d.selectable !== false) this.setValue(d.value);
      this.dispatchEvent('item-clicked', d, true);
      this.throttle(this._onCollapse);
    }
  }
  // Prevents IoLayer from stopping scroll in clipped options
  _stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
  onResized() {
    this.throttle(this._onSetOverflow);
  }
  _onSetOverflow() {
    const buttons = this.querySelectorAll('io-menu-item:not(.io-hamburger)');
    if (this.horizontal) {
      const hamburger = this.querySelector('.io-hamburger');
      if (!buttons.length) return;

      let end = this.getBoundingClientRect().right;
      let overflow = false;
      let last = Infinity;
      hamburger.hidden = true;
      const hamburgerOptions = [];

      for (let i = buttons.length; i--;) {
        const r = buttons[i].getBoundingClientRect();
        const rect = rects.get(buttons[i]) || {right: 0, width: 0};
        if (r.right !== 0 && r.width !== 0)  {
          rect.right = r.right;
          rect.width = r.width;
          rects.set(buttons[i], rect);
        }

        if (hamburger.hidden && overflow) {
          hamburger.hidden = false;
          end -= hamburger.getBoundingClientRect().width;
        }

        if (buttons[i].selected) {
          end -= rect.width;
          buttons[i].hidden = false;
          continue;
        }

        last = Math.min(last, rect.right);
        if (last < end) {
          buttons[i].hidden = false;
        } else {
          buttons[i].hidden = true;
          hamburgerOptions.push(buttons[i].option);
          overflow = true;
        }
      }
      // hamburger._properties.props.option.value = new Item({options: new Options(hamburgerOptions)});
      this.overflow = overflow;
    } else {
      for (let i = buttons.length; i--;) {
        buttons[i].hidden = false;
      }
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
      this.inlayer = this.parentElement === Layer;
      if (this.inlayer && this.$parent) {
        this._onExpandedChangedLazy();
        // TODO: unhack incorrect this.rect on first expand.
        this.throttle(this._onExpandedChangedLazy);
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
  _onExpandedChangedLazy() {
    const pRect = this.$parent.getBoundingClientRect();
    Layer.setElementPosition(this as unknown as HTMLElement, this.position, pRect);
    this._clipHeight();
    this.searchable = !!this.style.height;
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
  _filterOptions(object: any, predicate: (object: any) => boolean, _depth = 5, _chain: any[] = [], _i = 0): any {
    const result: any[] = [];
    if (_chain.indexOf(object) !== -1) return result; _chain.push(object);
    if (_i > _depth) return result; _i++;
    if (predicate(object) && result.indexOf(object) === -1) result.push(object);
    for (const key in object) {
      const value = object[key] instanceof Binding ? object[key].value : object[key];
      if (predicate(value) && result.indexOf(value) === -1) result.push(value);
      if (typeof value === 'object') {
        const results = this._filterOptions(value, predicate, _depth, _chain, _i);
        for (let i = 0; i < results.length; i++) {
          if (result.indexOf(results[i]) === -1) result.push(results[i]);
        }
      }
    }
    return result;
  }
  get _options() {
    if (this.search) {
      const s = this.search.toLowerCase();
      const options = this._filterOptions(this.options, o => {
        if (!!o.value || !!o.action) {
          if (String(o.value).toLowerCase().search(s) !== -1) return true;
          if (o.label && o.label.toLowerCase().search(s) !== -1) return true;
          if (o.hint && o.hint.toLowerCase().search(s) !== -1) return true;
        }
        return false;
      });
      return options.length ? options : new Options([new Item({label: 'No matches'})]);
    }
    return this.options;
  }
  changed() {
    const itemDirection = this.horizontal ? 'bottom' : 'right';
    const elements = [];
    if (this.searchable) {
      elements.push(['io-string', {id: 'search', value: this.bind('search'), live: true}]);
    }
    if (this._options) {
      elements.push(...[this._options.map((option: any) => {
        return ['io-menu-item', {
            $parent: this,
            option: option,
            direction: itemDirection,
            depth: this.depth,
            lazy: false,
          }];
        }
      )]);
    }
    if (this.horizontal) {
      elements.splice(0, 0, ...this.slotted);
      elements.push(['io-menu-item', {
        label: '\u2630',
        icon: '\u2630',
        title: 'select tab',
        depth: this.depth + 1,
        class: 'io-hamburger',
        option: new Item({
          options: this._options
        }),
        lazy: false,
      }]);
    }
    this.template(elements);
    this.throttle(this._onSetOverflow);
  }
}
