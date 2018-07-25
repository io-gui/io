import {html, IoElement} from "../core/element.js";
import {IoPointerMixin} from "../mixins/pointer.js";

const selection = window.getSelection();
const range = document.createRange();

export class IoNumber extends IoPointerMixin(IoElement) {
  static get style() {
    return html`<style>
      :host {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        --slider-color: #999;
      }
      :host[underslider] {
        background-image: paint(underslider);
        cursor: col-resize;
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
      conversion: 1,
      step: 0.001,
      min: -Infinity,
      max: Infinity,
      strict: true,
      underslider: {
        value: false,
        reflect: true
      },
      tabindex: 0,
      contenteditable: true
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus',
      'io-pointer-start': '_onPointerStart',
      'io-pointer-move': '_onPointerMove',
      'io-pointer-end': '_onPointerEnd'
    };
  }
  _onPointerStart() {
    // TODO: implement floating slider
    event.detail.event.preventDefault();
  }
  _onPointerMove(event) {
    // TODO: implement floating slider
    if (this.underslider) {
      event.detail.event.preventDefault();
      if (event.detail.pointer[0].distance.length() > 2) {
        const rect = this.getBoundingClientRect();
        if (this.min !== -Infinity && this.max !== Infinity && this.max > this.min) {
          const val = Math.min(1, Math.max(0, event.detail.pointer[0].position.x / rect.width));
          this.set('value', this.min + (this.max - this.min) * val);
        }
      }
    }
  }
  _onPointerEnd(event) {
    if (event.detail.pointer[0].distance.length() <= 2 && this !== document.activeElement) {
      event.detail.event.preventDefault();
      this.focus();
    }
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
    // TODO: test conversion
    let value = Math.round(Number(text) / this.step) * this.step / this.conversion;
    if (this.strict) {
      value = Math.min(this.max, Math.max(this.min, value));
    }
    if (!isNaN(value)) this.set('value', value);
  }
  changed() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value *= this.conversion;
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
      this.innerText = String(value);
    } else {
      this.innerText = 'NaN';
    }
    if (this.underslider) {
      this.style.setProperty('--slider-value', (this.value - this.min) / (this.max - this.min));
    }
  }
}

IoNumber.Register();
