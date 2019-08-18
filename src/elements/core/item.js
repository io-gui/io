import {IoElement, html} from "../../io.js";
import {IoThemeSingleton as mixin} from "./theme.js";

// NOTE: [optmization] Uses textNode and fixed size to avoid layout trashing on change.

export class IoItem extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.item};
      }
      :host[pressed] {
        border-color: var(--io-inset-border-color);
        box-shadow: var(--io-shadow-inset);
      }
      :host[hidden] {
        display: none;
      }
      :host[selected] {
        color: var(--io-color-link);
        background-color: var(--io-background-color-light);
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
      :host:hover {
        background-color: var(--io-background-color-light);
      }
      :host:focus {
        outline: 0;
        text-overflow: inherit;
        border-color: var(--io-color-focus);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      label: {
        type: String,
        notify: true,
      },
      pressed: Boolean,
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
      'pointerdown': '_onPointerDown',
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
  _onFocus() {
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('keyup', this._onKeyup);
    this.addEventListener('click', this._onClick);
  }
  _onBlur() {
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('keyup', this._onKeyup);
    this.removeEventListener('click', this._onClick);
  }
  _onPointerDown(event) {
    this.pressed = true;
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerleave', this._onPointerLeave);
    this.addEventListener('pointerup', this._onPointerUp);
    event.preventDefault();
  }
  _onPointerMove() {}
  _onPointerLeave(event) {
    event.preventDefault();
    this.pressed = false;
  }
  _onPointerUp() {
    this.pressed = false;
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerleave', this._onPointerLeave);
    this.removeEventListener('pointerup', this._onPointerUp);
    this.focus();
  }
  _onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      this.pressed = true;
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
  _onKeyup() {
    this.pressed = false;
  }
  _onClick() {
    this.dispatchEvent('item-clicked', {value: this.value, label: this.label}, true);
  }
  changed() {
    if (this.label) {
      this.textNode = this.label;
      this.title = this.label;
      this.setAttribute('aria-label', this.label);
    } else {
      let valueText;
      if (this.value && typeof this.value === 'object') {
        valueText = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
      } else {
        valueText = String(this.value);
      }
      this.textNode = valueText;
      this.title = valueText;
      this.setAttribute('aria-label', false);
    }
  }
}

IoItem.Register();
