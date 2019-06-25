import {IoElement, html} from "../core/element.js";
import {IoItem} from "./item.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuOptions} from "./menu.js";

export class IoMenuItem extends IoItem {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        padding: calc(2 * var(--io-spacing));
      }
      :host > * {
        padding: 0 var(--io-spacing);
      }
      :host > .io-menu-icon {}
      :host > .io-menu-label {
        flex: 1 1 auto;
      }
      :host > .io-menu-hint {
        opacity: 0.25;
      }
      :host[hasmore]:after {
        content: '▸';
      }
    </style>`;
  }
  static get properties() {
    return {
      expanded: Boolean,
      icon: String,
      hint: String,
      options: Array,
      position: 'bottom',
      action: Function,
      button: HTMLElement,
      position: 'bottom',
      $parent: HTMLElement,
      $options: IoMenuOptions,
    };
  }
  static get listeners() {
    return {
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
    };
  }
  // TODO: test
  get compose() {
    return {
      $options: {
        $parent: this,
        expanded: this.bind('expanded'),
        options: this.bind('options'),
        position: this.bind('position'),
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this._connectOptions();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._disconnectOptions();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _connectOptions() {
    if (this.options.length) {
      if (!this.$options.parentNode) {
        IoMenuLayer.singleton.appendChild(this.$options);
      }
    } else this._disconnectOptions();
  }
  _disconnectOptions() {
    if (this.$options.parentNode) {
      this.$options.parentNode.removeChild(this.$options);
    }
  }
  _expandOptions() {
    if (this.options.length) this.expanded = true;
  }
  _onMousedown() {
    IoMenuLayer.singleton._onMousedown(event);
    this._expandOptions();
  }
  _onTouchstart() {
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchstart(event);
    this._expandOptions();
  }
  _onTouchmove(event) {
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
  _onKeydown(event) {
    if (event.which == 13 || event.which == 32) {
      this._expandOptions();
      this.dispatchEvent('io-menu-item-clicked', {value: this.value, options: this.options}, true);
    } else {
      IoMenuLayer.singleton._onKeydown(event);
    }
  }
  _onFocus(event) {
    super._onFocus(event);
    IoMenuLayer.singleton._onFocus(event);
  }
  _onClick() {
    if (typeof this.action === 'function') {
      this.action.apply(null, [option.value]);
    }
    if (this.button instanceof HTMLElement) {
      // TODO: test
      this.button.click();
    }
    if (this.value !== undefined) {
      this.dispatchEvent('io-menu-item-clicked', {value: this.value, options: this.options}, true);
    }
  }
  changed() {
    this._connectOptions();
    this.setAttribute('hasmore', !!this.options.length && this.position === 'right');
    this.template([
      ['span', {class: 'io-menu-icon'}, this.icon],
      ['span', {class: 'io-menu-label'}, this.label || String(this.value)],
      ['span', {class: 'io-menu-hint'}, this.hint],
    ]);
  }
}

IoMenuItem.Register();
