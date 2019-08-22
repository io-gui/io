import {html} from "../../io.js";
import {IoItem} from "../../io-elements-core.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuOptions} from "./menu-options.js";

export function filterObject(object, predicate) {
  if (predicate(object)) return object;
  for (let key in object) {
    if (predicate(object[key])) {
        return object[key];
    } else if (typeof object[key] === 'object') {
      const prop = filterObject(object[key], predicate);
      if (prop) return prop;
    }
  }
}

export class IoMenuItem extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        padding: var(--io-spacing);
        border-radius: 0;
        background: none;
        touch-action: none;
      }
      :host > * {
        overflow: visible;
        pointer-events: none;
      }
      :host > :not(:empty) {
        padding: 0 var(--io-spacing);
      }
      :host > .io-menu-icon {}
      :host > .io-menu-label {
        flex: 1 1 auto;
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
  static get Attributes() {
    return {
      expanded: {
        value: false,
        notify: true,
      },
      direction: {
        value: 'bottom',
        notify: true,
      },
    };
  }
  static get Properties() {
    return {
      expanded: Boolean,
      option: Object,
      $parent: HTMLElement,
      $options: HTMLElement,
      selectable: false,
      _depth: 0,
    };
  }
  _onMenuItemClicked(event) {
    const item = event.composedPath()[0];
    // TODO: fires twice?
    if (item !== this) {
      event.stopImmediatePropagation();
      this.expanded = false;
      this.set('value', event.detail.value);
      this.dispatchEvent('io-menu-item-clicked', event.detail, true);
    }
  }
  get _options() {
    if (this.option && this.option.options && this.option.options.length) {
      return this.option.options;
    }
    return undefined;
  }
  get _action() {
    if (this.option && typeof this.option.action === 'function') {
      return this.option.action;
    }
    return undefined;
  }
  get _value() {
    if (this.option && this.option.value !== undefined) {
      return this.option.value;
    } else if (this.option !== undefined && typeof this.option !== 'object') return this.option;
    return undefined;
  }
  get _icon() {
    if (this.option && this.option.icon !== undefined) {
      return this.option.icon;
    }
    return undefined;
  }
  get _label() {
    if (this.label) return this.label;
    if (this.option && this.option.label !== undefined) {
      return this.option.label;
    }
    if (this.option && this.option.value !== undefined) {
      return String(this.option.value);
    }
    else return String(this.option);
  }
  get _hint() {
    if (this.option && this.option.hint !== undefined) {
      return this.option.hint;
    }
    return undefined;
  }
  get _selected() {
    if (!this.selectable) return false;
    if (this.option && (this.option.selected || this.option.value === this.value)) {
      return true;
    } else if (this.value === this.option) {
      return true;
    }
    const options = this._options;
    if (options) return !!filterObject(options, (o) => { return o === this.value || o.value === this.value; });
    return false;
  }
  get _isInLayer() {
    return this.$parent && this.$parent.parentElement === IoMenuLayer.singleton;
  }
  get _menuRoot() {
    let root = this;
    while (root && root.$parent) {
      root = root.$parent;
    }
    return root;
  }
  connectedCallback() {
    super.connectedCallback();
    this._updateOptions();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._disconnectOptions();
  }
  _connectOptions() {
    if (this.$options && this.$options.parentElement !== IoMenuLayer.singleton) {
      IoMenuLayer.singleton.appendChild(this.$options);
    }
  }
  _disconnectOptions() {
    if (this.$options && this.$options.parentElement === IoMenuLayer.singleton) {
      IoMenuLayer.singleton.removeChild(this.$options);
    }
  }
  _updateOptions() {
    if (this._options) {
      if (!this.$options) {
        this.$options = new IoMenuOptions({
          $parent: this,
          expanded: this.bind('expanded'),
          value: this.value,
          options: this._options || [], // TODO: hmm
          position: this.direction,
          selectable: this.selectable,
          _depth: this._depth,
          'on-io-menu-item-clicked': this._onMenuItemClicked,
        });
      } else {
        this.$options.setProperties({
          value: this.value,
          options: this._options || [], // TODO: hmm
          position: this.direction,
          'on-io-menu-item-clicked': this._onMenuItemClicked, // TODO: this should be redundant with above. If removed io-menu-option does not recieve event.
        });
      }
    } else this._disconnectOptions();
  }
  _toggleExpanded(set) {
    if (this._options) {
      const expanded = set !== undefined ? set : !this.expanded;
      if (expanded) this._connectOptions();
      this.expanded = expanded;
      IoMenuLayer.singleton._hoveredOptions = this.$options;
    } else this.expanded = false;
  }
  _focusIn() {
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
  _onPointerdown(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    this._toggleExpanded(true);
    IoMenuLayer.singleton._hoveredItem = this;
    IoMenuLayer.singleton._onPointerdown(event); // TODO: check
    this.focus();
  }
  _onPointermove(event) {
    if (this.expanded) {
      IoMenuLayer.singleton._onPointermove(event);
    }
  }
  _onPointerup(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    IoMenuLayer.singleton._onPointerup(event);
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
        this._onClick(event);
      }
    }
    else if (event.key === 'Escape') {
      event.preventDefault();
      IoMenuLayer.singleton.expanded = false;
    } else if (this._isInLayer) {
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
  _onClick(event) {
    if (this._action) {
      this._action.apply(null, [this._value]);
    }
    if (this._value !== undefined) {
      event.stopImmediatePropagation();
      this.set('value', this._value, true);
      this.dispatchEvent('io-menu-item-clicked', {value: this._value}, true);
      this.expanded = false;
    }
  }
  _onFocus() {
    super._onFocus();
    if (this._isInLayer) {
      this._toggleExpanded(true);
    }
  }
  expandedChanged() {
    // TODO: collapse on menus outside IoMenuLayer. // TODO: test and remove!
    if (this.expanded && this.$parent && !this.$parent.expanded) {
      console.warn('This should be expanded', this.$parent.expanded);
    }
  }
  valueChanged() {
    this._updateOptions();
  }
  optionChanged() {
    this._updateOptions();
  }
  directionChanged() {
    this._updateOptions();
  }
  changed() {
    this.selected = this._selected;
    this.setAttribute('hasmore', this._options && this.direction === 'right');
    this.template([
      ['span', {class: 'io-menu-icon'}, this._icon],
      ['span', {class: 'io-menu-label'}, this._label || String(this._value)],
      ['span', {class: 'io-menu-hint'}, this._hint],
    ]);
  }
}

IoMenuItem.Register();
