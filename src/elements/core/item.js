import {IoElement, html} from "../../io.js";
import {IoThemeSingleton as mixin} from "../../io-elements-core.js";

export class Item {
  constructor(value) {
    if (typeof value === 'object' && (value.options !== undefined || value.action !== undefined || value.value !== undefined)) {
      Object.assign(this, value);
    } else {
      this.value = value;
    }
    if (this.label === undefined) {
      if (this.value instanceof Array) {
        this.label = String(`${this.value.constructor.name} (${this.value.length})`);
      } else if (typeof this.value === 'object') {
        this.label = String(`${this.value.constructor.name}`);
      } else if (this.value !== undefined) {
        this.label = String(this.value);
      } else {
        console.warn('Option must have label or value!');
      }
    }
  }
}

// NOTE: [optmization] Uses textNode and fixed size in em to avoid layout trashing on change.

export class IoItem extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.item};
      }
      :host {
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-wrap: nowrap;
        white-space: nowrap;
        color: var(--io-color);
        background-color: var(--io-background-color);
      }
      :host:hover {
        background-color: var(--io-background-color-light);
      }
      :host:focus {
        outline: 0;
        text-overflow: inherit;
        border-color: var(--io-color-focus);
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
      :host[hidden] {
        display: none;
      }
      :host[selected] {
        color: var(--io-color-link);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      label: {
        notify: true,
      },
      hidden: Boolean,
      selected: Boolean,
      tabindex: 0,
    };
  }
  static get Properties() {
    return {
      value: undefined,
    };
  }
  static get Listeners() {
    return {
      'focus': '_onFocus',
      // 'touchstart': '_onTouchstart',
      // 'mousedown': '_onMousedown',
    };
  }
  get textNode() {
    this.flattenTextNode(this);
    return this._textNode.nodeValue;
  }
  set textNode(value) {
    this.flattenTextNode(this);
    this._textNode.nodeValue = String(value);
  }
  constructor(props) {
    super(props);
    this._textNode = document.createTextNode("");
    this.appendChild(this._textNode);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('click', this._onClick);
  }
  // _onTouchstart() {}
  // _onMousedown() {
  //   this.focus();
  // }
  _onFocus() {
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('click', this._onClick);
  }
  _onBlur() {
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('click', this._onClick);
  }
  _onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      this._onClick(event);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusTo('left');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusTo('up');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusTo('right');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusTo('down');
    }
  }
  _onClick() {
    this.dispatchEvent('item-clicked', {value: this.value, label: this.label}, true);
  }
  changed() {
    let valueText = String(this.value);
    if (this.value && typeof this.value === 'object') {
      valueText = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
    }
    valueText = this.label || valueText;
    this.textNode = valueText;
    this.title = valueText;
  }
}

IoItem.Register();
