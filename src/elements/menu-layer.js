import {html, IoElement} from "../core/element.js";

let previousItem;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 100;
let lastFocus;

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
      $options: Array
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
    window.addEventListener('focusin', this._onWindowFocus);
    window.addEventListener('focusout', this._onWindowBlur);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onWindowScroll);
    window.removeEventListener('wheel', this._onWindowScroll);
    window.removeEventListener('focusin', this._onWindowFocus);
    window.removeEventListener('focusout', this._onWindowBlur);
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
    for (let i = this.$options.length; i--;) {
      this.$options[i].expanded = false;
    }
    this.expanded = false;
    this.collapseOnPointerup = false;
  }
  _onOptionsExpanded() {
    // TODO: optimize and simplify. Avoid redundant loop on collapseAll()
    this.expanded = !!this.$options.find(option => { return option.expanded; });
  }
  _onWindowScroll() {
    if (this.expanded) this.collapseAll();
  }
  _onWindowFocus() {
    // if (event.target.localName !== 'io-menu-item') lastFocus = event.target;
  }
  _onWindowBlur() {
    // if (event.target.localName !== 'io-menu-item') lastFocus = event.target;
    // console.log('blur', event)
    // lastFocus = null;
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
    // if (!this._preventCollapse && !this.expanded) this._preventCollapse = true;
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
    item.expanded = !!item.options.length;
    const optionschain = this._getOptionschain(item);
    this._hoveredItem = item;
    for (let i = this.$options.length; i--;) {
      if (optionschain.indexOf(this.$options[i]) === -1) {
        this.$options[i].expanded = false;
      }
    }
  }
  _onPointerdown(event) {
    this._onPointermove(event);
    if (!this._hoveredOptions) {
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
          this._hoverItems(options[i]);
          this._hoveredOptions = options[i];
          return options[i];
        }
      }
    }
    this._hoveredItem = null;
    this._hoveredOptions = null;
  }
  _hoverItems(options) {
    let items = options.querySelectorAll('io-menu-item');
    for (let i = items.length; i--;) {
      let rect = items[i].getBoundingClientRect();
      if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
        let force = options.horizontal;
        this._focusItem(items[i], force);
        this._hoveredItem = items[i];
        return;
      }
    }
    this._hoveredItem = null;
  }
  _focusItem(item, force) {
    if (item !== previousItem) {
      clearTimeout(timeoutOpen);
      clearTimeout(timeoutReset);
      if (this._v > 1 || item.parentNode !== previousParent || force) {
        previousItem = item;
        item.focus();
      } else {
        timeoutOpen = setTimeout(function() {
          previousItem = item;
          item.focus();
        }.bind(this), WAIT_TIME);
      }
      previousParent = item.parentNode;
      timeoutReset = setTimeout(function() {
        previousItem = null;
        previousParent = null;
      }.bind(this), WAIT_TIME + 1);
    }
  }
  _onPointerup() {
    if (this._hoveredItem) {
      this._hoveredItem._onBlur();
      this._hoveredItem._onClick();
    }
  }
  _onKeydown(event) {
    event.preventDefault(); // TODO: dont
    // const path = event.composedPath();
    // if (path[0].localName !== 'io-menu-item') return;
    //
    // let elem = path[0];
    // let options = elem.$parent || elem.parentElement;
    // let siblings = [...options.querySelectorAll('io-menu-item')];
    // let children = [...elem.$options.querySelectorAll('io-menu-item')];
    // let index = siblings.indexOf(elem);
    //
    // let command = '';
    //
    // if (!options.horizontal) {
    //   if (event.key == 'ArrowUp') command = 'prev';
    //   if (event.key == 'ArrowRight') command = 'in';
    //   if (event.key == 'ArrowDown') command = 'next';
    //   if (event.key == 'ArrowLeft') command = 'out';
    // } else {
    //   if (event.key == 'ArrowUp') command = 'out';
    //   if (event.key == 'ArrowRight') command = 'next';
    //   if (event.key == 'ArrowDown') command = 'in';
    //   if (event.key == 'ArrowLeft') command = 'prev';
    // }
    // if (event.key == 'Tab') command = 'next';
    // if (event.key == 'Escape') command = 'exit';
    // if (event.key == 'Enter' || event.which == 32) command = 'action';
    //
    // switch (command) {
    //   case 'action':
    //     this.runAction(elem);
    //     break;
    //   case 'prev':
    //     siblings[(index + siblings.length - 1) % (siblings.length)].focus();
    //     break;
    //   case 'next':
    //     siblings[(index + 1) % (siblings.length)].focus();
    //     break;
    //   case 'in':
    //     if (children.length) children[0].focus();
    //     break;
    //   case 'out':
    //     if (options && options.$parent) options.$parent.focus();
    //     break;
    //   case 'exit':
    //     this.collapseAll();
    //     break;
    //   default:
    //     break;
    // }
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
      if (lastFocus) lastFocus.focus();
    }
  }
}

IoMenuLayer.Register();
IoMenuLayer.singleton = new IoMenuLayer();
document.body.appendChild(IoMenuLayer.singleton);
