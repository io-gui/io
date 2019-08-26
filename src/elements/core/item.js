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
        border-color: var(--io-color-border-inset);
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
  static get Properties() {
    return {
      value: undefined,
      pressed: {
        type: Boolean,
        reflect: true,
      },
      hidden: {
        type: Boolean,
        reflect: true,
      },
      selected: {
        type: Boolean,
        reflect: true,
      },
      tabindex: 0,
    };
  }
  static get Listeners() {
    return {
      'focus': '_onFocus',
      'contextmenu': '_onContextmenu',
      'pointerdown': '_onPointerdown',
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
    Object.defineProperty(this, '_textNode', {value: document.createTextNode(""), writable: true});
    this.appendChild(this._textNode);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('keyup', this._onKeydown);
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerleave', this._onPointerleave);
    this.removeEventListener('pointerup', this._onPointerup);
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
  _onContextmenu(event) {
    event.preventDefault();
  }
  _onPointerdown(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerleave', this._onPointerleave);
    this.addEventListener('pointerup', this._onPointerup);
    this.pressed = true;
  }
  _onTouchmove() {}
  _onPointermove() {}
  _onPointerleave() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerleave', this._onPointerleave);
    this.removeEventListener('pointerup', this._onPointerup);
    this.pressed = false;
  }
  _onPointerup() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerleave', this._onPointerleave);
    this.removeEventListener('pointerup', this._onPointerup);
    this.pressed = false;
    this.focus();
  }
  _onClick() {
    this.dispatchEvent('item-clicked', {value: this.value, label: this.label}, true);
  }
  _onKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true;
      event.preventDefault();
      this._onClick(event);
    }
    else if (event.key === 'ArrowLeft') {
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
  changed() {
    if (this.label) {
      this.textNode = this.label;
      this.title = this.label;
    } else {
      let valueText;
      if (this.value && typeof this.value === 'object') {
        valueText = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
      } else {
        valueText = String(this.value);
      }
      this.textNode = valueText;
      this.title = valueText;
    }
    this.setAria();
  }
  setAria() {
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    } else {
      this.setAttribute('aria-label', false);
    }
  }
}

IoItem.Register();
