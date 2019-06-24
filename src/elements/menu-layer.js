import {html, IoElement} from "../core/element.js";

let previousOption;
let previousParent;
let timeoutOpen;
let timeoutReset;
let WAIT_TIME = 200;
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
      :host io-menu-options:not([expanded]) {
        display: none;
      }
      :host io-menu-options {
        position: absolute;
        transform: translate3d(0, 0, 0);
        top: 0;
        left: 0;
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
      'io-menu-item-clicked': '_onMenuItemClicked',
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
    window.addEventListener('focusin', this._onWindowFocus);
    window.addEventListener('focusout', this._onWindowBlur);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onWindowScroll);
    window.removeEventListener('focusin', this._onWindowFocus);
    window.removeEventListener('focusout', this._onWindowBlur);
    this._stopAnimation();
  }
  registerOptions(options) {
    this.$options.push(options);
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
  runAction(option) {
    // if (option.options.length) option.$options.expanded = true;
    if (typeof option.action === 'function') {
      this.collapseAll();
      option.action.apply(null, [option.value]);
    } else if (option.button) {
      this.collapseAll();
      option.button.click(); // TODO: test
    }
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
    this._onPointerdown(event.changedTouches[0]);
  }
  _onTouchmove(event) {
    this._onPointermove(event.changedTouches[0]);
  }
  _onTouchend(event) {
    this._onPointerup(event);
  }
  _onContextmenu(event) {
    event.preventDefault();
    if (this.expanded) this.collapseAll();
  }
  _onFocus() {
    // const path = event.composedPath();
    // const item = path[0];
    // const optionschain = this._getOptionschain(item);
    // this._hoveredOptions = item;
    // for (let i = this.$options.length; i--;) {
    //   if (optionschain.indexOf(this.$options[i]) === -1) {
    //     this.$options[i].expanded = false;
    //   }
    // }
  }
  _onPointerdown(event) {
    this._onPointermove(event);
    // if (!this._hoveredOptions && this.collapseOnPointerup) {
    //   this.collapseAll();
    // }
  }
  _onPointermove(event) {
    // const movementX = event.clientX - this._x;
    // const movementY = event.clientY - this._y;
    // this._v = (2 * this._v + Math.abs(movementY) - Math.abs(movementX)) / 3;
    // this._x = event.clientX;
    // this._y = event.clientY;
    // let options = this.$options;
    // for (let i = options.length; i--;) {
    //   if (options[i].expanded) {
    //     let rect = options[i].getBoundingClientRect();
    //     if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
    //       this._hover(options[i]);
    //       this._hoveredOptions = options[i];
    //       return options[i];
    //     }
    //   }
    // }
    // this._hoveredItem = null;
    // this._hoveredOptions = null;
  }
  _onPointerup() {
    // if (this._hoveredItem) {
    //   this.runAction(this._hoveredItem);
    //   const root = this._getRoot(this._hoveredItem);
    //   root.dispatchEvent('io-menu-item-clicked', this._hoveredItem);
    //   setTimeout(()=>{
    //     if (this.collapseOnPointerup) this.collapseAll(); // TODO: ?
    //   }, 100);
    // } else if (!this._hoveredOptions && this.collapseOnPointerup) {
    //   this.collapseAll();
    // }
    // this.collapseOnPointerup = true;
  }
  _onKeydown(event) {
    // event.preventDefault();
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
  _hover(options) {
    // let items = options.querySelectorAll('io-menu-item');
    // for (let i = items.length; i--;) {
    //   let rect = items[i].getBoundingClientRect();
    //   if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
    //     let force = options.horizontal;
    //     this._focus(items[i], force);
    //     this._hoveredItem = items[i];
    //     return items[i];
    //   }
    // }
    // this._hoveredItem = null;
    // this._hoveredItem = null;
  }
  _focus(item, force) {
    // if (item !== previousOption) {
    //   clearTimeout(timeoutOpen);
    //   clearTimeout(timeoutReset);
    //   if (this._v > 1 || item.parentNode !== previousParent || force) {
    //     previousOption = item;
    //     item.focus();
    //   } else {
    //     timeoutOpen = setTimeout(function() {
    //       previousOption = item;
    //       item.focus();
    //     }.bind(this), WAIT_TIME);
    //   }
    //   previousParent = item.parentNode;
    //   timeoutReset = setTimeout(function() {
    //     previousOption = null;
    //     previousParent = null;
    //   }.bind(this), WAIT_TIME + 1);
    // }
  }
  _onOptionsExpanded(options) {
    this._hoveredOptions = options;
    this._setOptionsPosition(options);
    for (let i = this.$options.length; i--;) {
      if (this.$options[i].expanded) {
        this.expanded = true;
        return;
      }
    }
    this.expanded = false;
  }
  _onMenuItemClicked(event) {
    console.log(event)
  }
  _setOptionsPosition(options) {
    if (!options.$parent) return;
    let rect = options.getBoundingClientRect();
    let pRect = options.$parent.getBoundingClientRect();
     // TODO: unhack horizontal long submenu bug.
    if (options.position === 'bottom' && rect.height > (window.innerHeight - this._y)) options.position = 'right';
    //
    switch (options.position) {
      case 'pointer':
        options._x = this._x - 1 || pRect.x;
        options._y = this._y - 1 || pRect.y;
        break;
      case 'top':
        options._x = pRect.x;
        options._y = pRect.top - rect.height;
        break;
      case 'left':
        options._x = pRect.x - rect.width;
        options._y = pRect.top;
        break;
      case 'bottom':
        options._x = pRect.x;
        options._y = pRect.bottom;
        break;
      case 'right':
      default:
        options._x = pRect.right;
        options._y = pRect.y;
        if (options._x + rect.width > window.innerWidth) {
          options._x = pRect.x - rect.width;
        }
        break;
    }
    options._x = Math.max(0, Math.min(options._x, window.innerWidth - rect.width));
    options._y = Math.min(options._y, window.innerHeight - rect.height);
    options.style.left = options._x + 'px';
    options.style.top = options._y + 'px';
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
  _getRoot(item) {
    let parent = item;
    while (parent && parent.$parent) {
      parent = parent.$parent;
    }
    return parent;
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
      if (lastFocus) lastFocus.focus();
    }
  }
}

IoMenuLayer.Register();
IoMenuLayer.singleton = new IoMenuLayer();
document.body.appendChild(IoMenuLayer.singleton);
