import {IoElement} from "../core/element.js";
import {IoMenuOptions} from "./menu-options.js";
import {IoMenuLayer} from "./menu-layer.js";

export class IoMenu extends IoElement {
  static get properties() {
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
    this.parentElement.addEventListener('contextmenu', this._onContextmenu);
    this.parentElement.addEventListener('mousedown', this._onMousedown);
    this.parentElement.addEventListener('touchstart', this._onTouchstart);
    IoMenuLayer.singleton.appendChild(this.$options);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.parentElement.removeEventListener('contextmenu', this._onContextmenu);
    this.parentElement.removeEventListener('mousedown', this._onMousedown);
    this.parentElement.removeEventListener('touchstart', this._onTouchstart);
    this.parentElement.removeEventListener('touchmove', this._onTouchmove);
    this.parentElement.removeEventListener('touchend', this._onTouchend);
    if (this.$options) IoMenuLayer.singleton.removeChild(this.$options);
  }
  getBoundingClientRect() {
    return this.parentElement.getBoundingClientRect();
  }
  _onMenuItemClicked(event) {
    const item = event.composedPath()[0];
    if (item !== this) {
      event.stopImmediatePropagation();
      this.expanded = false;
      this.set('value', event.detail.value, true);
      this.dispatchEvent('io-menu-item-clicked', event.detail, true);
    }
  }
  _onContextmenu(event) {
    if (this.options.length && this.button === 2) {
      event.preventDefault();
      IoMenuLayer.singleton.setLastFocus(document.activeElement);
      this.$options._x = event.clientX - 5;
      this.$options._y = event.clientY - 5;
      this.expanded = true;
      this.$options.children[0].focus();
    }
  }
  _onMousedown(event) {
    if (this.options.length && event.button === this.button && event.button !== 2) {
      event.preventDefault();
      IoMenuLayer.singleton.setLastFocus(document.activeElement);
      this.$options._x = event.clientX - 5;
      this.$options._y = event.clientY - 5;
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
      this.$options._x = event.changedTouches[0].clientX - 5;
      this.$options._y = event.changedTouches[0].clientY - 5;
      this.expanded = true;
      this.$options.children[0].focus();
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
