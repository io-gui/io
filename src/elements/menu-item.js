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
      position: 'bottom',
      action: Function,
      button: HTMLElement,
      $parent: HTMLElement,
      $options: IoMenuOptions,
      depth: 0,
    };
  }
  static get listeners() {
    return {
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
    };
  }
  get compose() {
    return {
      $options: {
        $parent: this,
        expanded: this.bind('expanded'),
        options: this.options,
        position: this.position,
        depth: this.depth,
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
  toggleExpand(force) {
    if (this.options.length) this.expanded = !!force || !this.expanded;
    else this.expanded = false;
  }
  _onMousedown() {
    if (this.options.length) {
      IoMenuLayer.singleton.setLastFocus(this);
      this.toggleExpand(true);
      this.$options.children[0].focus();
      IoMenuLayer.singleton._focusSrc = this;
    } else {
      IoMenuLayer.singleton.setLastFocus(document.activeElement);
      this.focus();
      this._onClick();
    }
  }
  _onTouchstart() {
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    if (this.options.length) {
      IoMenuLayer.singleton.setLastFocus(this);
      this.toggleExpand(true);
      this.$options.children[0].focus();
      IoMenuLayer.singleton._focusSrc = this;
    } else {
      IoMenuLayer.singleton.setLastFocus(document.activeElement);
      this.focus();
      this._onClick();
    }
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
    event.preventDefault();
    if (event.which === 13 || event.which === 32) {
      if (this.options.length) {
        IoMenuLayer.singleton.setLastFocus(this);
        this.toggleExpand(true);
        this.$options.children[0].focus();
        // IoMenuLayer.singleton._hoveredItem = null; // TODO: ?
      } else {
        IoMenuLayer.singleton.setLastFocus(document.activeElement);
        // this.focus(); // TODO: ?
        this._onClick();
      }
    } else if (event.key == 'Escape') {
      IoMenuLayer.singleton.collapseAll();
    } else if (this.$parent && this.$parent.parentElement === IoMenuLayer.singleton) {
      let command = '';
      if (!this.$parent.horizontal) {
        if (event.key == 'ArrowUp') command = 'prev';
        if (event.key == 'ArrowRight') command = 'in';
        if (event.key == 'ArrowDown') command = 'next';
        if (event.key == 'ArrowLeft') command = 'out';
      } else {
        if (event.key == 'ArrowUp') command = 'out';
        if (event.key == 'ArrowRight') command = 'next';
        if (event.key == 'ArrowDown') command = 'in';
        if (event.key == 'ArrowLeft') command = 'prev';
      }
      if (event.key == 'Tab') command = 'next';

      const options = this.$parent;
      const siblings = [...options.children];
      const index = siblings.indexOf(this);

      switch (command) {
        case 'prev':
          siblings[(index + siblings.length - 1) % (siblings.length)].focus();
          break;
        case 'next':
          siblings[(index + 1) % (siblings.length)].focus();
          break;
        case 'in':
          if (this.$options.children.length) this.$options.children[0].focus();
          break;
        case 'out':
          // TODO: generalize
          if (this.$parent && this.$parent.$parent) {
            this.expanded = false;
            this.$parent.expanded = false;
            this.$parent.$parent.expanded = false;
            this.$parent.$parent.focus();
          }
          break;
        default:
          break;
      }
    } else {
      super._onKeydown(event);
    }
  }
  _onFocus(event) {
    super._onFocus(event);
    IoMenuLayer.singleton._onFocus(event);
  }
  _onClick() {
    if (typeof this.action === 'function') {
      this.action.apply(null, [this.value]);
    }
    if (this.button instanceof HTMLElement) {
      this.button.click(); // TODO: test
    }
    if (this.value !== undefined) {
      this.dispatchEvent('io-menu-item-clicked', {value: this.value}, true);
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
