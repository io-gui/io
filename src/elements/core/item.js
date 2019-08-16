import {IoElement, html} from "../../io.js";
import {IoThemeSingleton as mixin} from "../../io-elements-core.js";

// NOTE: [optmization] Uses textNode and fixed size to avoid layout trashing on change.

export class IoItem extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.item};
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
  }
}

IoItem.Register();
