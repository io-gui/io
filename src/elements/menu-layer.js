import {html, IoElement} from "../core/element.js";
// import {IoMenuItem} from "./menu-item.js";

const WAIT_TIME = 100;

export class IoMenuLayer extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: block;
        visibility: hidden;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100000;
        background: rgba(0, 0, 0, 0.2);
        user-select: none;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
      }
      :host[expanded] {
        visibility: visible;
        pointer-events: all;
      }
      :host > io-menu-options:not([expanded]) {
        display: none;
      }
      :host > io-menu-options {
        position: absolute;
        transform: translate3d(0, 0, 0);
        top: 0;
        left: 0;
      }
      :host io-menu-item:hover {
        background-color: inherit;
      }
      :host io-menu-item:focus {
        background-color: var(--io-background-color-light);
      }
    </style>`;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: true,
      },
      lastFocus: HTMLElement,
      $options: Array,
    };
  }
  static get listeners() {
    return {
      'mousedown': '_onMousedown',
      'mousemove': '_onMousemove',
      'mouseup': '_onMouseup',
      'touchstart': '_onTouchstart',
      'touchmove': '_onTouchmove',
      'touchend': '_onTouchend',
      'contextmenu': '_onContextmenu',
    };
  }
  constructor(props) {
    super(props);
    this._hoveredItem = null;
    this._hoveredOptions = null;
    this._x = 0;
    this._y = 0;
    this._v = 0;
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onWindowScroll);
    window.addEventListener('wheel', this._onWindowScroll);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onWindowScroll);
    window.removeEventListener('wheel', this._onWindowScroll);
    this._stopAnimation();
  }
  registerOptions(options) {
    this.$options.push(options);
    clearTimeout(this.__timeout);
    this.__timeout = setTimeout(()=> {
      this.$options.sort((a, b) => { return a.depth < b.depth ? -1 : 1; });
    });
  }
  unregisterOptions(options) {
    this.$options.splice(this.$options.indexOf(options), 1);
  }
  collapseAll() {
    // if (this._preserveExpanded) {
    //   this._preserveExpanded = false;
    //   return;
    // }
    for (let i = this.$options.length; i--;) {
      if (this.$options[i].parentElement === this) {
        this.$options[i].expanded = false;
      }
    }
    this.expanded = false;
  }
  _onOptionsExpanded() {
    // TODO: optimize and simplify. Avoid redundant loop on collapseAll()
    this.expanded = !!this.$options.find(option => { return option.expanded; });
  }
  _onWindowScroll() {
    if (this.expanded) this.collapseAll();
  }
  _onMousedown(event) {
    this._onPointerdown(event);
  }
  _onMousemove(event) {
    this._onPointermove(event);
  }
  _onMouseup(event) {
    this._onPointerup(event);
  }
  _onTouchstart(event) {
    event.preventDefault();
    this._onPointerdown(event.changedTouches[0]);
  }
  _onTouchmove(event) {
    event.preventDefault();
    this._onPointermove(event.changedTouches[0]);
  }
  _onTouchend(event) {
    event.preventDefault();
    this._onPointerup(event);
  }
  _onContextmenu(event) {
    event.preventDefault();
    if (this.expanded) this.collapseAll();
  }
  _onFocus() {
    const path = event.composedPath();
    const item = path[0];

    if (item.$parent && item.$parent.parentElement === this) {

      item.expanded = !!item.options.length;

      const optionschain = this._getOptionschain(item);
      this._hoveredItem = item;
      for (let i = this.$options.length; i--;) {
        if (optionschain.indexOf(this.$options[i]) === -1) {
          // if (this.$options[i].parentElement === this) {
            this.$options[i].expanded = false;
          // }
        }
      }

    }
  }
  _onPointerdown(event) {
    this._onPointermove(event);
    if (!this._hoveredItem) {
      this.collapseAll();
    }
  }
  _onPointermove(event) {
    const movementX = event.clientX - this._x;
    const movementY = event.clientY - this._y;
    this._v = (2 * this._v + Math.abs(movementY) - Math.abs(movementX)) / 3;
    this._x = event.clientX;
    this._y = event.clientY;
    this._hoveredOptions = null;
    this._hoveredItem = null;
    let options = this.$options;
    for (let i = options.length; i--;) {
      if (options[i].expanded) {
        this._hoveredOptions = options[i];
        let rect = options[i].getBoundingClientRect();
        if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
          let items = options[i].querySelectorAll('io-menu-item');
          for (let j = items.length; j--;) {
            let rect = items[j].getBoundingClientRect();
            if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
              let force = options[i].horizontal;
              this._focusItem(items[j], force);
              this._hoveredItem = items[j];
              return;
            }
          }
          return options[i];
        }
      }
    }
    const _focusSrc = IoMenuLayer.singleton._focusSrc;
    let rect = _focusSrc.getBoundingClientRect();
    if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
      this._hoveredItem = _focusSrc;
    }
  }
  _focusItem(item, force) {
    if (item !== this.__prevItem) {
      clearTimeout(this.__timeoutOpen);
      clearTimeout(this.__timeoutReset);
      if (this._v > 1 || item.parentNode !== this.__prevParent || force) {
        // if(this.__prevItem) this.__prevItem.expanded = false;
        this.__prevItem = item;
        // item.expanded = true;
        item.focus();
        // this._onFocus();
      } else {
        this.__timeoutOpen = setTimeout(function() {
          // if(this.__prevItem) this.__prevItem.expanded = false;
          this.__prevItem = item;
          // item.expanded = true;
          item.focus();
          // this._onFocus();
        }.bind(this), WAIT_TIME);
      }
      this.__prevParent = item.parentNode;
      this.__timeoutReset = setTimeout(function() {
        this.__prevItem = null;
        this.__prevParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  setLastFocus(element) {
    const isInside = element.$parent && element.$parent.parentElement === this;
    this.lastFocus = isInside ? this.lastFocus : element;
  }
  _onPointerup() {
    if (this._hoveredItem) {
      const collapse = !this._hoveredItem.options.length && this._hoveredItem !== IoMenuLayer.singleton._focusSrc;
      if (collapse) this._hoveredItem._onClick();
      if (collapse) this.collapseAll();
    } else {
      this.collapseAll();
    }
  }
  _getOptionschain(item) {
    const chain = [];
    if (item.$options) chain.push(item.$options);
    let parent = item.$parent;
    while (parent) {
      if (parent.localName == 'io-menu-options') chain.push(parent);
      parent = parent.$parent;
    }
    return chain;
  }
  _moveHovered() {
    // let options = this._hoveredOptions;
    // if (options) {
    //   let rect = options.getBoundingClientRect();
    //   if (rect.height > window.innerHeight) {
    //     if (this._y < 100 && rect.top < 0) {
    //       let scrollSpeed = (100 - this._y) / 5000;
    //       let overflow = rect.top;
    //       options._y = options._y - Math.ceil(overflow * scrollSpeed) + 1;
    //     } else if (this._y > window.innerHeight - 100 && rect.bottom > window.innerHeight) {
    //       let scrollSpeed = (100 - (window.innerHeight - this._y)) / 5000;
    //       let overflow = (rect.bottom - window.innerHeight);
    //       options._y = options._y - Math.ceil(overflow * scrollSpeed) - 1;
    //     }
    //     options.style.left = options._x + 'px';
    //     options.style.top = options._y + 'px';
    //   }
    // }
  }
  _startAnimation() {
    this._moveHovered();
    this._rAF_ID = requestAnimationFrame(this._startAnimation);
  }
  _stopAnimation() {
    if (this._rAF_ID) cancelAnimationFrame(this._rAF_ID);
  }
  expandedChanged() {
    if (this.expanded) {
      this._startAnimation();
    } else {
      this._hoveredItem = null;
      this._hoveredOptions = null;
      this._stopAnimation();
      if (this.lastFocus) {
        this.lastFocus.focus();
        delete this.lastFocus;
      }
    }
  }
}

IoMenuLayer.Register();
IoMenuLayer.singleton = new IoMenuLayer();
document.body.appendChild(IoMenuLayer.singleton);
