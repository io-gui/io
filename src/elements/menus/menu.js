import {IoElement} from "../../io.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuOptions} from "./menu-options.js";

export class IoMenu extends IoElement {
  static get Properties() {
    return {
      value: null,
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      button: 0,
      selectable: false,
      $options: IoMenuOptions,
    };
  }
  get compose() {
    return {
      $options: {
        $parent: this,
        expanded: this.bind('expanded'),
        selectable: this.bind('selectable'),
        options: this.options,
        position: this.position,
        'on-io-menu-item-clicked': this._onMenuItemClicked,
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this.parentElement.addEventListener('contextmenu', this._onContextmenu, {passive: true});
    this.parentElement.addEventListener('mousedown', this._onMousedown, {passive: true});
    this.parentElement.addEventListener('touchstart', this._onTouchstart, {passive: true});
    this.parentElement.style.userSelect = 'none';
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener('contextmenu', this._onContextmenu, {passive: true});
    this._parent.removeEventListener('mousedown', this._onMousedown, {passive: true});
    this._parent.removeEventListener('touchstart', this._onTouchstart, {passive: true});
    this._parent.removeEventListener('touchmove', this._onTouchmove, {passive: true});
    this._parent.removeEventListener('touchend', this._onTouchend, {passive: true});
    this._disconnectOptions();
    this._parent.style.userSelect = null;
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
  _expand() {
    this.expanded = true;
    IoMenuLayer.singleton._hoveredOptions = this.$options;
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
      this._connectOptions();
      IoMenuLayer.singleton._onMousedown(event);
      this._expand();
    }
  }
  _onMousedown(event) {
    if (this.options.length && event.button === this.button && event.button !== 2) {
      this._connectOptions();
      IoMenuLayer.singleton._onMousedown(event);
      this._expand();
    }
  }
  _onTouchstart(event) {
    if (this.options.length && this.button !== 2) {
      this._connectOptions();
      this.parentElement.addEventListener('touchmove', this._onTouchmove, {passive: true});
      this.parentElement.addEventListener('touchend', this._onTouchend, {passive: true});
      IoMenuLayer.singleton._onTouchstart(event);
      this._expand();
    }
  }
  _onTouchmove(event) {
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    this.parentElement.removeEventListener('touchmove', this._onTouchmove, {passive: true});
    this.parentElement.removeEventListener('touchend', this._onTouchend, {passive: true});
    IoMenuLayer.singleton._onTouchend(event);
  }
}

IoMenu.Register();
