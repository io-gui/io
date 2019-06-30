import {html} from "../core/element.js";
import {IoItem} from "./item.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuOptions} from "./menu-options.js";

export class IoMenuItem extends IoItem {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        padding: calc(2 * var(--io-spacing));
        background: none;
      }
      :host > * {
        padding: 0 var(--io-spacing);
        pointer-events: none;
      }
      :host > .io-menu-icon {}
      :host > .io-menu-label {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host > .io-menu-hint {
        opacity: 0.25;
      }
      :host[hasmore]:after {
        content: '▸';
      }
      :host {
        border: var(--io-border-width) solid transparent;
      }
      :host[selected][direction="top"],
      :host[selected][direction="bottom"] {
        border-bottom-color: var(--io-color-link);
      }
      :host[selected][direction="right"],
      :host[selected][direction="left"] {
        border-left-color: var(--io-color-link);
      }
    </style>`;
  }
  static get properties() {
    return {
      expanded: Boolean,
      option: Object,
      direction: {
        value: 'bottom',
        reflect: 1,
      },
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
        value: this.value,
        options: this._options || [], // TODO: hmm
        position: this.direction,
        _depth: this._depth,
        'on-io-menu-item-clicked': this._onMenuItemClicked,
      }
    };
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
  get _options() {
    if (this.option && this.option.options && this.option.options.length) {
      return this.option.options;
    }
  }
  get _action() {
    if (this.option && this.option.action && typeof this.option.action === 'function') {
      return this.option.action;
    }
  }
  get _value() {
    if (this.option && this.option.value && this.option.value !== undefined) {
      return this.option.value;
    }
  }
  get _icon() {
    if (this.option && this.option.icon && this.option.icon !== undefined) {
      return this.option.icon;
    }
  }
  get _label() {
    if (this.label) return this.label;
    if (this.option && this.option.label && this.option.label !== undefined) {
      return this.option.label;
    }
  }
  get _hint() {
    if (this.option && this.option.hint && this.option.hint !== undefined) {
      return this.option.hint;
    }
  }
  get _selected() {
    return (this.option && (this.option.selected || this.option.value === this.value));
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
    if (this._options) {
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
    if (this._options) this.expanded = set !== undefined ? set : !this.expanded;
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
      if (this._options) {
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
    if (this._action) {
      this._action.apply(null, [this._value]);
    }
    if (this._value !== undefined) {
      this.expanded = false;
      this.set('value', this._value, true);
      this.dispatchEvent('io-menu-item-clicked', {value: this._value}, true);
    }
  }
  _onFocus() {
    super._onFocus();
    if (this.$parent && this.$parent.parentElement === IoMenuLayer.singleton) {
      this._toggleExpanded(true);
    }
  }
  expandedChanged() {
    if (this.expanded && this.$parent) {
      if (!this.$parent.expanded) console.warn('This should be expanded'); // TODO: remove
    }
  }
   optionChanged() {
    this._connectOptions();
  }
  changed() {
    this.setAttribute('hasmore', this._options && this.direction === 'right');
    // this.selected = this._selected;
    // console.log('asd', this);
    this.template([
      this._icon ? ['span', {class: 'io-menu-icon'}, this._icon] : null,
      ['span', {class: 'io-menu-label'}, this._label || String(this._value)],
      this._hint ? ['span', {class: 'io-menu-hint'}, this._hint] : null,
    ]);
  }
}

IoMenuItem.Register();
