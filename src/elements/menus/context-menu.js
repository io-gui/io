import {IoElement} from "../../io.js";
import {IoLayerSingleton} from "../../io-core.js";
import {IoMenuOptions} from "./menu-options.js";

export class IoContextMenu extends IoElement {
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
        value: this.bind('value'),
        expanded: this.bind('expanded'),
        selectable: this.bind('selectable'),
        options: this.options,
        position: this.position,
        'on-io-menu-item-clicked': this._onOptionItemClicked,
        'on-expanded-changed': IoLayerSingleton.onChildExpanded,
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    IoLayerSingleton.appendChild(this.$options);
    IoLayerSingleton.addEventListener('pointermove', this._onLayerPointermove);
    this._parent = this.parentElement;
    this._parent.style.userSelect = 'none';
    this._parent.style.webkitUserSelect = 'none';
    this._parent.style.webkitTouchCallout = 'default';
    this._parent.addEventListener('contextmenu', this._onContextmenu);
    this._parent.addEventListener('pointerdown', this._onPointerdown);
    this._parent.addEventListener('click', this._onClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoLayerSingleton.removeChild(this.$options);
    IoLayerSingleton.removeEventListener('pointermove', this._onLayerPointermove);
    this._parent.style.userSelect = null;
    this._parent.style.webkitUserSelect = null;
    this._parent.style.webkitTouchCallout = null;
    this._parent.removeEventListener('contextmenu', this._onContextmenu);
    this._parent.removeEventListener('pointerdown', this._onPointerdown);
    this._parent.removeEventListener('click', this._onClick);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onOptionItemClicked(event) {
    if (event.composedPath()[0] !== this) {
      event.stopPropagation();
      this.set('value', event.detail.value);
      this.dispatchEvent('item-clicked', event.detail, true);
      this.expanded = false;
    }
  }
  _onContextmenu(event) {
    event.preventDefault();
    if (this.button === 2) {
      this.expand(event);
    }
  }
  _onPointerdown(event) {
    this._parent.setPointerCapture(event.pointerId);
    this._parent.addEventListener('pointermove', this._onPointermove);
    this._parent.addEventListener('pointerup', this._onPointerup);
    if (event.pointerType === 'mouse') {
      if (event.button === this.button && event.button !== 2) {
        this.expand(event);
      }
    }
    clearTimeout(this._contextTimeout);
    // iOS Safari contextmenu event emulation.
    this._contextTimeout = setTimeout(() => {
      event.preventDefault();
      this.expand(event);
    }, 1000);
  }
  _onPointermove(event) {
    clearTimeout(this._contextTimeout);
    if (this.expanded) {
      const item = this.$options.querySelector('io-menu-item');
      if (item) item._onPointermove(event);
    }
  }
  _onPointerup() {
    clearTimeout(this._contextTimeout);
    if (this.expanded) {
      const item = this.$options.querySelector('io-menu-item');
      if (item) item._onPointerup(event);
    }
    this._parent.releasePointerCapture(event.pointerId);
    this._parent.removeEventListener('pointermove', this._onPointermove);
    this._parent.removeEventListener('pointerup', this._onPointerup);
  }
  _onLayerPointermove(event) {
    if (this.expanded) this._onPointermove(event);
  }
  _onClick(event) {
    if (event.button === this.button && event.button !== 2) this.expand(event);
  }
  expand(event) {
    if (!this.expanded && this.options.length) {
      IoLayerSingleton._x = event.clientX;
      IoLayerSingleton._y = event.clientY;
      this.expanded = true;
    }
  }
}

IoContextMenu.Register();
