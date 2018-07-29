import {html, IoElement} from "../core/element.js";

const selection = window.getSelection();
const range = document.createRange();

export class IoColorHex extends IoElement {
  static get style() {
    return html`<style>
      :host {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :host::before {
        opacity: 0.25;
        content: '0x';
      }
      :host > .red {
        color: red;
      }
      :host > .green {
        color: green;
      }
      :host > .blue {
        color: blue;
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Number,
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
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.setFromText(this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.setFromText(this.innerText);
    }
  }
  _select() {
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  setFromText(text) {
    let value = Math.round(Number(text));
    if (!isNaN(value)) this.set('value', value);
  }
  changed() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value = value.toFixed(-Math.round(Math.log(1) / Math.LN10));
      this.innerText = ( '000000' + this.value.toString( 16 ) ).slice( - 6 );
    } else {
      this.innerText = 'NaN';
    }
  }
}

IoColorHex.Register();
