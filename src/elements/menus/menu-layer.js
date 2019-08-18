import {IoElement, html} from "../../io.js";

let lastFocus = null;
window.addEventListener('focusin', _onWindowFocusIn, {capture: false});
function _onWindowFocusIn() {
  lastFocus = document.activeElement;
}

export class IoMenuLayer extends IoElement {
  static get Style() {
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
        user-select: none;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
        /* background: rgba(0, 0, 0, 0.1); */
      }
      :host[expanded] {
        visibility: visible;
        pointer-events: all;
      }
      :host > io-menu-options {
        position: absolute;
        touch-action: none;
        box-shadow: var(--io-shadow);
        transform: translate3d(0, 0, 0);
        top: 0;
        left: 0;
        max-width: 90vw !important;
      }
      :host io-menu-item:hover {
        background-color: inherit;
      }
      :host io-menu-item:focus {
        background-color: var(--io-background-color-light);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      expanded: {
        value: false,
        notify: true,
      },
    };
  }
  static get Properties() {
    return {
      lastFocus: HTMLElement,
      $options: Array,
    };
  }
  static get Listeners() {
    return {
      'mousedown': '_onMousedown',
      'mousemove': '_onMousemove',
      'mouseup': '_onMouseup',
      'touchstart': ['_onTouchstart', {passive: true}],
      'touchmove': ['_onTouchmove', {passive: true}],
      'touchend': ['_onTouchend', {passive: true}],
      'contextmenu': '_onContextmenu',
    };
  }
  constructor(props) {
    super(props);
    this._menuRoot = null;
    this._hoveredItem = null;
    this._hoveredOptions = null;
    this._startAnimation = this._startAnimation.bind(this);
    this._stopAnimation = this._stopAnimation.bind(this);
    this._x = 0;
    this._y = 0;
    this._v = 0;
    this.addEventListener('focusin', this._onFocusIn, {capture: true});
  }
  _onFocusIn() {
    if (lastFocus) {
      const isInside = lastFocus.$parent && lastFocus.$parent.parentElement === this;
      this.lastFocus = isInside ? this.lastFocus : lastFocus;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onWindowScroll, {capture: true, passive: true});
    window.addEventListener('wheel', this._onWindowScroll, {capture: true, passive: true});
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onWindowScroll, {capture: true, passive: true});
    window.removeEventListener('wheel', this._onWindowScroll, {capture: true, passive: true});
    this._stopAnimation();
  }
  registerOptions(options) {
    this.$options.push(options);
    clearTimeout(this.__timeout);
    this.__timeout = setTimeout(()=> {
      this.$options.sort((a, b) => { return a._depth < b._depth ? -1 : 1; });
    });
  }
  unregisterOptions(options) {
    this.$options.splice(this.$options.indexOf(options), 1);
  }
  collapseAll() {
    for (let i = this.$options.length; i--;) {
      if (this.$options[i].parentElement === this) {
        this.$options[i].expanded = false;
      }
    }
    this.expanded = false;
  }
  collapseSiblings(item) {
    const optionschain = this._getParentOptions(item);
    for (let i = this.$options.length; i--;) {
      if (optionschain.indexOf(this.$options[i]) === -1) {
        if (this.$options[i].parentElement === this) {
          this.$options[i].expanded = false;
        }
      }
    }
  }
  _onOptionsExpanded(options) {
    this._menuRoot = options.$parent._menuRoot || options.$parent;
    this.expanded = !!this.$options.find(option => { return option.parentElement === this && option.expanded; });
  }
  _onWindowScroll() {
    if (this.expanded) this.collapseAll();
  }
  _onMousedown(event) {
    event.preventDefault();
    this._onPointerdown(event);
    this._onPointermove(event);
  }
  _onMousemove(event) {
    event.preventDefault();
    this._onPointermove(event);
  }
  _onMouseup(event) {
    event.preventDefault();
    this._onPointerup(event);
  }
  _onTouchstart(event) {
    this._onPointerdown(event.changedTouches[0]);
    this._onPointermove(event.changedTouches[0]);
  }
  _onTouchmove(event) {
    this._onPointermove(event.changedTouches[0]);
  }
  _onTouchend(event) {
    this._onPointerup(event);
  }
  _onContextmenu(event) {
    event.preventDefault();
    this.collapseAll();
  }
  _onPointerdown(event) {
    this._x = event.clientX;
    this._y = event.clientY;
    if (!this._hoveredItem) {
      this.collapseAll();
    } else if (this.lastFocus === this._hoveredItem && this.lastFocus.expanded) {
      this.collapseAll();
    }
  }
  _onPointermove(event) {
    const movementX = event.clientX - this._x;
    const movementY = event.clientY - this._y;
    this._v = (2 * this._v + Math.abs(movementY) - Math.abs(movementX)) / 3;
    this._x = event.clientX;
    this._y = event.clientY;
    let options = this.$options;
    for (let i = options.length; i--;) {
      if (options[i].expanded) {
        let rect = options[i].getBoundingClientRect();
        if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
          this._hoveredOptions = options[i];
          let items = options[i].querySelectorAll('io-menu-item');
          for (let j = items.length; j--;) {
            const optionschain = this._getParentOptions(items[j]);
            let rect = items[j].getBoundingClientRect();
            if (optionschain.indexOf(this._menuRoot) !== -1) {
              if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
                let force = options[i].horizontal;
                this._focusItem(items[j], force);
                this._hoveredItem = items[j];
                return;
              }
            }

          }
          return options[i];
        }
      }
    }

    this._hoveredOptions = null;
    this._hoveredItem = null;

    if (this.lastFocus) {
      let rect = this.lastFocus.getBoundingClientRect();
      if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
        this._focusItem(this.lastFocus);
        return;
      }
    }

    let rect = this._menuRoot.getBoundingClientRect();
    if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
      this._hoveredItem = this._menuRoot;
      return;
    }
  }
  _focusItem(item, force) {
    if (item !== this.__prevItem) {
      const WAIT_TIME = 100;
      clearTimeout(this.__timeoutOpen);
      clearTimeout(this.__timeoutReset);
      if (this._v > 1 || item.parentNode !== this.__prevParent || force) {
        this.__prevItem = item;
        this._hoveredItem = item;
        if (typeof item._toggleExpanded === 'function') {
          item._toggleExpanded(true);
          item.focus();
          this.collapseSiblings(item);
        }
      } else {
        this.__timeoutOpen = setTimeout(function() {
          this.__prevItem = item;
          this._hoveredItem = item;
          if (typeof item._toggleExpanded === 'function') {
            item._toggleExpanded(true);
            item.focus();
            this.collapseSiblings(item);
          }
        }.bind(this), WAIT_TIME);
      }
      this.__prevParent = item.parentNode;
      this.__timeoutReset = setTimeout(function() {
        this.__prevItem = null;
        this.__prevParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  _onPointerup(event) {
    if (this._hoveredItem) {
      const collapse = !this._hoveredItem._options;
      // TODO: unhack. this is necessary for touch only
      if (event.type === 'touchend' && this._hoveredItem._onClick) {
        event.preventDefault();
        this._hoveredItem._onClick(event);
      }
      if (collapse) {
        this.collapseAll();
      }
    } else if (this._hoveredOptions) {
      // TODO
    } else {
      this.collapseAll();
    }
  }
  _getParentOptions(item) {
    const chain = [];
    if (item.$options) chain.push(item.$options);
    let parent = item.$parent;
    while (parent) {
      chain.push(parent);
      parent = parent.$parent;
    }
    return chain;
  }
  _moveHovered() {
    let options = this._hoveredOptions;
    if (options) {
      let rect = options.getBoundingClientRect();
      if (rect.height > window.innerHeight) {
        if (this._y < 100 && rect.top < 0) {
          let scrollSpeed = (100 - this._y) / 5000;
          let overflow = rect.top;
          options._y = options._y - Math.ceil(overflow * scrollSpeed) + 1;
        } else if (this._y > window.innerHeight - 100 && rect.bottom > window.innerHeight) {
          let scrollSpeed = (100 - (window.innerHeight - this._y)) / 5000;
          let overflow = (rect.bottom - window.innerHeight);
          options._y = options._y - Math.ceil(overflow * scrollSpeed) - 1;
        }
        options.style.left = options._x + 'px';
        options.style.top = options._y + 'px';
      }
    }
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
      setTimeout(()=> {
        if (this.lastFocus) {
          // Prevent focus and scroll to lastFocus element if outside window.
          let rect = this.lastFocus.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth) {
            this.lastFocus.focus();
          }
          this.lastFocus = null;
        }
      });
    }
  }
}

IoMenuLayer.Register();
IoMenuLayer.singleton = new IoMenuLayer();

document.body.appendChild(IoMenuLayer.singleton);
