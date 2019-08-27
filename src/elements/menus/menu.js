import {IoElement} from "../../io.js";
import {IoLayerSingleton} from "../../io-elements-core.js";
import {IoOptionMenus} from "./menu-options.js";

export class IoMenu extends IoElement {
  static get Properties() {
    return {
      value: null,
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      button: 0,
      selectable: false,
      $options: IoOptionMenus,
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
    IoLayerSingleton.appendChild(this.$options);
    this._parent = this.parentElement;
    this.parentElement.addEventListener('contextmenu', this._onContextmenu, {passive: true});
    this.parentElement.addEventListener('mousedown', this._onMousedown, {passive: true});
    this.parentElement.addEventListener('touchstart', this._onTouchstart, {passive: true});
    this.parentElement.style.userSelect = 'none';
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoLayerSingleton.removeChild(this.$options);
    this._parent.removeEventListener('contextmenu', this._onContextmenu, {passive: true});
    this._parent.removeEventListener('mousedown', this._onMousedown, {passive: true});
    this._parent.removeEventListener('touchstart', this._onTouchstart, {passive: true});
    this._parent.removeEventListener('touchmove', this._onTouchmove, {passive: true});
    this._parent.removeEventListener('touchend', this._onTouchend, {passive: true});
    this._parent.style.userSelect = null;
  }
  getBoundingClientRect() {
    return this.parentElement.getBoundingClientRect();
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
  _onContextmenu() {
    if (this.options.length && this.button === 2) {
      this.expanded = true;
    }
  }
  _onMousedown(event) {
    if (this.options.length && event.button === this.button && event.button !== 2) {
      this.expanded = true;
    }
  }
  _onTouchstart() {
    if (this.options.length && this.button !== 2) {
      this.parentElement.addEventListener('touchmove', this._onTouchmove, {passive: true});
      this.parentElement.addEventListener('touchend', this._onTouchend, {passive: true});
      this.expanded = true;
    }
  }
  _onTouchmove() {
    // IoLayerSingleton._onTouchmove(event);
  }
  _onTouchend() {
    this.parentElement.removeEventListener('touchmove', this._onTouchmove, {passive: true});
    this.parentElement.removeEventListener('touchend', this._onTouchend, {passive: true});
    // IoLayerSingleton._onTouchend(event);
  }
}

IoMenu.Register();
