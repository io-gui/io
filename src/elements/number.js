import {html, IoElement} from "../core/element.js";

export class IoNumber extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-inset-border-color);
        padding: var(--io-spacing);
        color: var(--io-field-color);
        background-color: var(--io-field-background-color);
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
        outline: 1px solid var(--io-focus-color);
        outline-offset: -1px;
      }
      :host[aria-invalid] {
        color: var(--io-error-color);
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
      role: 'textbox',
      type: {
        value: 'number',
        reflect: true
      },
      pattern: {
        value: 'pattern="[0-9]*"',
        reflect: true,
      },
      inputmode: {
        value: 'numeric',
        reflect: true,
      },
      tabindex: 0,
      contenteditable: true,
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus'
    };
  }
  constructor(props) {
    super(props);
    this.setAttribute('spellcheck', 'false');
  }
  _onFocus() {
    this._innerTextOnFocus = this.innerText;
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
  }
  _onBlur() {
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
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
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
      this.innerText = Number(String(value));
    } else {
      this.innerText = 'NaN';
    }
    this.setAttribute('aria-invalid', (typeof this.value !== 'number' || isNaN(this.value)) ? 'true' : false);
    this.setAttribute('aria-valuemin', this.min !== -Infinity ? this.min : false);
    this.setAttribute('aria-valuemax', this.max !== Infinity ? this.max : false);
  }
}

IoNumber.Register();
