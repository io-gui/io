import {IoElement, html} from "../core/element.js";

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

export class IoItem extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: inline-block;
        cursor: pointer;
        background-color: var(--io-background-color);
        color: var(--io-color);
        padding: var(--io-spacing);
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
      }
      :host:hover {
        background-color: var(--io-background-color-light);
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
        border-color: var(--io-color-focus);
        outline: 0;
      }
      :host[aria-invalid] {
        text-decoration: underline;
        text-decoration-style: dashed;
        text-decoration-color: var(--io-color-error);
        border-color: var(--io-color-error);
      }
      :host[hidden] {
        display: none;
      }
      :host[selected] {
        color: var(--io-color-link);
      }
    </style>`;
  }
  static get attributes() {
    return {
      label: {
        notify: true,
      },
      hidden: Boolean,
      selected: Boolean,
      tabindex: 0,
    };
  }
  static get properties() {
    return {
      value: undefined,
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus',
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('click', this._onClick);
  }
  _onTouchstart() {}
  _onMousedown() {
    this.focus();
  }
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
    let label = String(this.value);
    if (this.value && typeof this.value === 'object') {
      label = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
    }
    this.title = this.label || label;
    this.innerText = this.label || label;
  }
}

IoItem.Register();
