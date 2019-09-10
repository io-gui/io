import {IoElement} from "../../io.js";
import {IoLayerSingleton} from "../../io-core.js";
import "./menu-item.js";

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
      padding: 0;
      opacity: 1;
      transition: opacity 0.25s;
      overflow-y: scroll !important;
      padding: var(--io-spacing);
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
      border-left-width: 0;
      border-right-width: 0;
      padding: var(--io-spacing) calc(0.5 * var(--io-line-height));
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
      content: ' 🔍 Search';
      white-space: pre;
      visibility: visible;
      opacity: 0.33;
    }
    `;
  }
  static get Properties() {
    return {
      value: {
        value: null,
        notify: true,
      },
      options: {
        type: Array,
        observe: true,
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
      selectable: Boolean,
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
      $parent: HTMLElement,
      _rects: Array,
      role: 'listbox',
    };
  }
  static get Listeners() {
    return {
      'item-clicked': '_onMenuItemClicked',
      'touchstart': '_stopPropagation',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.inlayer = this.parentElement === IoLayerSingleton;
  }
  _onMenuItemClicked(event) {
    if (event.composedPath()[0].localName == 'io-menu-item') {
      event.stopPropagation();
      this.set('value', event.detail.value);
      this.dispatchEvent('item-clicked', event.detail, true);
      this.expanded = false;
      this.search = '';
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
      hamburger.option = {options: hamburgerOptions};
      this.overflow = overflow;
    } else {
      for (let i = buttons.length; i--;) {
        buttons[i].hidden = false;
      }
    }
  }
  expandedChanged() {
    if (this.expanded) {
      this.inlayer = this.parentElement === IoLayerSingleton;
      if (this.inlayer && this.$parent) {
        // TODO: unhack incorrect this.rect on first expand.
        this.requestAnimationFrameOnce(this._expandedChangedLazy);
      }
    } else {
      this.style.top = null;
      this.style.height = null;
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
    IoLayerSingleton.setElementPosition(this, this.position, pRect);
    this._clipHeight();
    this.searchable = !!this.style.height;
  }
  _clipHeight() {
    const rectTop = this.getBoundingClientRect().top;
    const rectBottom = this.lastChild.getBoundingClientRect().bottom;
    const rectHeight = rectBottom - rectTop;

    const top = this.style.top;
    if (rectTop < 0) {
      this.style.top = '0px';
      this.style.height = (rectHeight + rectTop)  + 'px';
      this.style.touchAction = 'pan-y';
    } else if (rectBottom > window.innerHeight) {
      this.style.height = (window.innerHeight - rectTop)  + 'px';
      this.style.touchAction = 'pan-y';
    } else {
      this.style.top = top;
      this.style.height = null;
      this.style.touchAction = null;
    }
  }
  get _options() {
    if (this.search) {
      const options = this.filterObjects(this.options, option => {
        if (typeof option == 'object' && !!option.value) {
          if (typeof option.value === 'string' && option.value.search(this.search) !== -1) return true;
          if (typeof option.label === 'string' && option.label.search(this.search) !== -1) return true;
          if (typeof option.hint === 'string' && option.hint.search(this.search) !== -1) return true;
        }
      });
      if (options) return options;
    }
    return this.options;
  }
  changed() {
    const itemDirection = this.horizontal ? 'bottom' : 'right';
    const elements = [];
    if (this.searchable) {
      elements.push(['io-string', {value: this.bind('search'), live: true}]);
    }
    if (this._options) {
      elements.push(...[this._options.map(option =>
        ['io-menu-item', {
          $parent: this,
          option: option,
          value: this.value,
          lazy: !this.expanded,
          direction: itemDirection,
          selectable: this.selectable,
        }]
      )]);
    }
    if (this.horizontal) {
      elements.splice(0, 0, ...this.slotted);
      elements.push(['io-menu-item', {
        label: '☰',
        title: 'select tab',
        value: this.value,
        selectable: this.selectable,
        class: 'io-hamburger',
      }]);
    }
    this.template(elements);
    this.requestAnimationFrameOnce(this._setOverflow);
  }
}

IoMenuOptions.Register();
