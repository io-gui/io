import {IoElement} from "../../io.js";
import {IoMenuOptions} from "./menu-options.js";
import {IoMenuLayer} from "./menu-layer.js";

export class IoMenu extends IoElement {
  static get Properties() {
    return {
      value: null,
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      button: 0,
      $options: IoMenuOptions,
    };
  }
  get compose() {
    return {
      $options: {
        $parent: this,
        expanded: this.bind('expanded'),
        options: this.options,
        position: this.position,
        'on-io-menu-item-clicked': this._onMenuItemClicked,
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this.parentElement.addEventListener('contextmenu', this._onContextmenu);
    this.parentElement.addEventListener('mousedown', this._onMousedown);
    this.parentElement.addEventListener('touchstart', this._onTouchstart);
    this.parentElement.style.userSelect = 'none';
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener('contextmenu', this._onContextmenu);
    this._parent.removeEventListener('mousedown', this._onMousedown);
    this._parent.removeEventListener('touchstart', this._onTouchstart);
    this._parent.removeEventListener('touchmove', this._onTouchmove);
    this._parent.removeEventListener('touchend', this._onTouchend);
    this._disconnectOptions();
    this._parent.style.userSelect = null;
    delete this._parent;
  }
  getBoundingClientRect() {
    return this.parentElement.getBoundingClientRect();
  }
  _connectOptions() {
    if (this.$options.parentElement !== IoMenuLayer.singleton) {
      IoMenuLayer.singleton.appendChild(this.$options);
    }
  }
  _disconnectOptions() {
    if (this.$options.parentElement === IoMenuLayer.singleton) {
      IoMenuLayer.singleton.removeChild(this.$options);
    }
  }
  _onMenuItemClicked(event) {
    const item = event.composedPath()[0];
    if (item !== this) {
      event.stopImmediatePropagation();
      this.set('value', event.detail.value);
      this.dispatchEvent('io-menu-item-clicked', event.detail, true);
      this.expanded = false;
    }
  }
  _onContextmenu(event) {
    if (this.options.length && this.button === 2) {
      event.preventDefault();
      IoMenuLayer.singleton.setLastFocus(document.activeElement);
      IoMenuLayer.singleton._x = event.clientX;
      IoMenuLayer.singleton._y = event.clientY;
      this._connectOptions();
      this.expanded = true;
      this.$options.children[0].focus();
    }
  }
  _onMousedown(event) {
    if (this.options.length && event.button === this.button && event.button !== 2) {
      event.preventDefault();
      IoMenuLayer.singleton.setLastFocus(document.activeElement);
      IoMenuLayer.singleton._x = event.clientX;
      IoMenuLayer.singleton._y = event.clientY;
      this._connectOptions();
      this.expanded = true;
      this.$options.children[0].focus();
    }
  }
  _onTouchstart(event) {
    if (this.options.length && event.cancelable && this.button !== 2) {
      event.preventDefault();
      this.parentElement.addEventListener('touchmove', this._onTouchmove);
      this.parentElement.addEventListener('touchend', this._onTouchend);
      IoMenuLayer.singleton.setLastFocus(document.activeElement);
      IoMenuLayer.singleton._x = event.changedTouches[0].clientX;
      IoMenuLayer.singleton._y = event.changedTouches[0].clientY;
      this._connectOptions();
      this.expanded = true;
      this.$options.children[0].focus();
      IoMenuLayer.singleton._onTouchmove(event);
    }
  }
  _onTouchmove(event) {
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    this.parentElement.removeEventListener('touchmove', this._onTouchmove);
    this.parentElement.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
}

IoMenu.Register();
