import {html} from "../core/element.js";
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
        pointer-events: none;
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
      direction: 'bottom',
      action: Function,
      $parent: HTMLElement,
      $options: IoMenuOptions,
      _depth: 0,
    };
  }
  get compose() {
    return {
      $options: {
        $parent: this,
        expanded: this.bind('expanded'),
        options: this.options,
        position: this.direction,
        _depth: this._depth,
      }
    };
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
  _toggleExpanded(set) {
    if (this.options.length) this.expanded = set !== undefined ? set : !this.expanded;
    else this.expanded = false;
  }
  _focusIn() {
    IoMenuLayer.singleton.setLastFocus(this);
    if (this.expanded) setTimeout(() => {
      if (this.$options.children.length) this.$options.children[0].focus();
    });
  }
  _focusOut() {
    if (this.$parent && this.$parent.$parent) {
      this.$parent.expanded = false;
      this.$parent.$parent.expanded = false;
      this.$parent.$parent.focus();
    }
  }
  _onMousedown() {
    IoMenuLayer.singleton.setLastFocus(this);
    this.focus();
    this._toggleExpanded(true);
    IoMenuLayer.singleton._onMousemove(event);
  }
  _onTouchstart(event) {
    if (event.cancelable) {
      event.preventDefault();
      this.addEventListener('touchmove', this._onTouchmove);
      this.addEventListener('touchend', this._onTouchend);
      IoMenuLayer.singleton.setLastFocus(this);
      this.focus();
      this._toggleExpanded(true);
      IoMenuLayer.singleton._onTouchmove(event);
    }
  }
  _onTouchmove(event) {
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
  _onKeydown(event) {
    let command = '';
    if (this.direction === 'left' || this.direction === 'right') {
      if (event.key === 'ArrowUp') command = 'prev';
      if (event.key === 'ArrowRight') command = 'in';
      if (event.key === 'ArrowDown') command = 'next';
      if (event.key === 'ArrowLeft') command = 'out';
    } else {
      if (event.key === 'ArrowUp') command = 'out';
      if (event.key === 'ArrowRight') command = 'next';
      if (event.key === 'ArrowDown') command = 'in';
      if (event.key === 'ArrowLeft') command = 'prev';
    }
    if (event.key === 'Tab') command = 'next';

    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      if (this.options.length) {
        this._toggleExpanded(true);
        this._focusIn();
      } else {
        this._onClick();
      }
    }
    else if (event.key === 'Escape') {
      event.preventDefault();
      IoMenuLayer.singleton.collapseAll();
    } else if (this.$parent && this.$parent.parentElement === IoMenuLayer.singleton) {
      const options = this.$parent;
      const siblings = [...options.children];
      const index = siblings.indexOf(this);
      if (command) event.preventDefault();
      switch (command) {
        case 'prev':
          this.expanded = false;
          siblings[(index + siblings.length - 1) % (siblings.length)].focus();
          break;
        case 'next':
          this.expanded = false;
          siblings[(index + 1) % (siblings.length)].focus();
          break;
        case 'in':
          this._focusIn();
          break;
        case 'out':
          this.expanded = false;
          this._focusOut();
          break;
        default:
          break;
      }
    } else {
      if (this.expanded && command === 'in') {
        this._focusIn();
      } else {
        this.expanded = false;
        super._onKeydown(event);
      }
    }
  }
  _onClick() {
    if (typeof this.action === 'function') {
      this.action.apply(null, [this.value]);
    }
    if (this.value !== undefined) {
      this.dispatchEvent('io-menu-item-clicked', {value: this.value}, true);
    }
  }
  _onFocus() {
    super._onFocus();
    if (this.$parent && this.$parent.parentElement === IoMenuLayer.singleton) {
      this._toggleExpanded(true);
    }
  }
  optionsChanged() {
    this._connectOptions();
    this.setAttribute('hasmore', !!this.options.length && this.direction === 'right');
  }
  changed() {
    this.template([
      ['span', {class: 'io-menu-icon'}, this.icon],
      ['span', {class: 'io-menu-label'}, this.label || String(this.value)],
      ['span', {class: 'io-menu-hint'}, this.hint],
    ]);
  }
}

IoMenuItem.Register();
