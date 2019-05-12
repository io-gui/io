import {html, IoElement} from "../core/element.js";

const selection = window.getSelection();
const range = document.createRange();

export class IoString extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: var(--io-theme-field-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        color: var(--io-theme-field-color);
        background: var(--io-theme-field-bg);
        transition: background-color 0.4s;
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
        outline: none;
        border: var(--io-theme-focus-border);
        background: var(--io-theme-focus-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: String,
      tabindex: 0,
      contenteditable: true
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus'
    };
  }
  _onFocus() {
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
    this._select();
  }
  _onBlur() {
    this.set('value', this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.set('value', this.innerText);
    }
  }
  _select() {
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  valueChanged() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

IoString.Register();
