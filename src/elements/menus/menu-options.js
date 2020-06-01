import {IoElement, Options, OptionItem} from '../../iogui.js';
import {IoLayerSingleton as Layer} from '../core/layer.js';
import './menu-item.js';

const rects = new WeakMap();

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
  static get Properties() {
    return {
      options: {
        type: Options,
        observe: true,
        strict: true,
      },
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
  _onItemClicked(event) {
    const item = event.composedPath()[0];
    const d = event.detail;
    if (item.localName == 'io-string') {
      event.stopImmediatePropagation();
      return;
    }
    if (item !== this) {
      event.stopImmediatePropagation();
      if (d.value !== undefined && d.selectable !== false) this.set('value', d.value);
      this.dispatchEvent('item-clicked', d, true);
      this.requestAnimationFrameOnce(this._collapse);
    }
  }
  // Prevents IoLayer from stopping scroll in clipped options
  _stopPropagation(event) {
    event.stopPropagation();
  }
  onResized() {
    this.requestAnimationFrameOnce(this._setOverflow);
  }
  _setOverflow() {
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
      // hamburger.__properties.option.value = new OptionItem({options: new Options(hamburgerOptions)});
      this.overflow = overflow;
    } else {
      for (let i = buttons.length; i--;) {
        buttons[i].hidden = false;
      }
    }
  }
  _collapse() {
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
        this._expandedChangedLazy();
        // TODO: unhack incorrect this.rect on first expand.
        this.throttle(this._expandedChangedLazy, null, true);
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
      this.requestAnimationFrameOnce(this._clipHeight);
    }
  }
  _expandedChangedLazy() {
    const pRect = this.$parent.getBoundingClientRect();
    Layer.setElementPosition(this, this.position, pRect);
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
  get _options() {
    if (this.search) {
      const s = this.search.toLowerCase();
      const options = this.filterObjects(this.options, o => {
        if (!!o.value || !!o.action) {
          if (String(o.value).toLowerCase().search(s) !== -1) return true;
          if (o.label && o.label.toLowerCase().search(s) !== -1) return true;
          if (o.hint && o.hint.toLowerCase().search(s) !== -1) return true;
        }
      });
      return options.length ? options : new Options([new OptionItem({label: 'No matches'})]);
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
      elements.push(...[this._options.map((option) => {
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
        option: new OptionItem({
          options: this._options
        }),
        lazy: false,
      }]);
    }
    this.template(elements);
    this.requestAnimationFrameOnce(this._setOverflow);
  }
}

IoMenuOptions.Register();
