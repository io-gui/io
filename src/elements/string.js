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
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-inset-border-color);
        padding: var(--io-padding);
        color: var(--io-field-color);
        background-color: var(--io-field-background-color);
      }
      :host:focus {
        overflow: hidden;
        text-overflow: clip;
        outline: none;
        border-color: var(--io-focus-color);
      }
      :host[aria-invalid] {
        color: var(--io-error-color);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: String,
      role: 'textbox',
      tabindex: 0,
      contenteditable: true,
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
    if (typeof this.value === 'string' || (this.innerText !== String(this.value))) {
      this.set('value', this.innerText);
    }
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
  }
  _onKeydown(event) {
    const rng = window.getSelection().getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0].length;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);

    if (event.which == 13) {
      event.preventDefault();
      if (typeof this.value === 'string' || (this.innerText !== String(this.value))) {
        this.set('value', this.innerText);
      }
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
  _select() {
    range.selectNodeContents(this.childNodes[0]);
    range.setStart(this.childNodes[0], 0);
    range.setEnd(this.childNodes[0], this.childNodes[0].length);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  valueChanged() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
    this.setAttribute('aria-invalid', typeof this.value !== 'string');
  }
}

IoString.Register();
