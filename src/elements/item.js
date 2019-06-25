import {IoElement, html} from "../core/element.js";

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
        outline: 1px solid var(--io-color-focus);
        outline-offset: -1px;
      }
      :host[aria-invalid] {
        color: var(--io-color-error);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: undefined,
      label: String,
      tabindex: 0
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus',
    };
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
  _onBlur(event) {
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('click', this._onClick);
  }
  _onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      this._onClick();
    } else if (event.which == 37) {
      event.preventDefault();
      this.focusTo('left');
    } else if (event.which == 38) {
      event.preventDefault();
      this.focusTo('up');
    } else if (event.which == 39) {
      event.preventDefault();
      this.focusTo('right');
    } else if (event.which == 40) {
      event.preventDefault();
      this.focusTo('down');
    }
  }
  _onClick(event) {
    event;
  }
  changed() {
    this.title = this.label || String(this.value);
    this.innerText = this.label || String(this.value);
  }
}

IoItem.Register();
