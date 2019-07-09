import {html} from "../core/element.js";
import {IoItem} from "./item.js";

export class IoNumber extends IoItem {
  static get style() {
    return html`<style>
      :host {
        white-space: nowrap;
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-inset-border-color);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        user-select: text;
      }
    </style>`;
  }
  static get attributes() {
    return {
      role: 'textbox',
      type: 'number',
      pattern: 'pattern="[0-9]*"',
      inputmode: 'numeric',
      contenteditable: true,
    };
  }
  static get properties() {
    return {
      value: Number,
      conversion: 1,
      step: 0.001,
      min: -Infinity,
      max: Infinity,
      strict: true,
    };
  }
  constructor(props) {
    super(props);
    this.setAttribute('spellcheck', 'false');
  }
  _onFocus(event) {
    super._onFocus(event);
    this._innerTextOnFocus = this.innerText;
  }
  _onBlur(event) {
    super._onBlur(event);
    if (this._innerTextOnFocus !== this.innerText) this.setFromText(this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    const rng = window.getSelection().getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);

    // TODO: implement home/end for min/max

    if (event.which == 13) {
      event.preventDefault();
      this.setFromText(this.innerText);
    } else if (event.which == 37) {
      if (rngInside && start === end && start === 0) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.which == 38) {
      if (rngInside && start === end && start === 0) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.which == 39) {
      if (rngInside && start === end && start === length) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.which == 40) {
      if (rngInside && start === end && start === length) {
        event.preventDefault();
        this.focusTo('down');
      }
    }
  }
  setFromText(text) {
    // TODO: test conversion
    let value = Math.round(Number(text) / this.step) * this.step / this.conversion;
    if (this.strict) {
      value = Math.min(this.max, Math.max(this.min, value));
    }
    if (!isNaN(value)) this.set('value', value);
    else this.innerText = 'NaN';
  }
  changed() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value *= this.conversion;
      let d = -Math.round(Math.log(this.step) / Math.LN10);
      d = Math.max(0, Math.min(100, d));
      value = value.toFixed(d);
      this.innerText = Number(String(value));
    } else {
      this.innerText = 'NaN';
    }
    this.setAttribute('aria-invalid', (typeof this.value !== 'number' || isNaN(this.value)) ? 'true' : false);
  }
}

IoNumber.Register();
