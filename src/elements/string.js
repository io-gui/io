import {html, IoElement} from "../core/element.js";
import {IoItem} from "./item.js";

export class IoString extends IoItem {
  static get style() {
    return html`<style>
      :host {
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-inset-border-color);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        user-select: text;
      }
      :host:empty:after {
        display: inline-block;
        content: '"';
      }
    </style>`;
  }
  static get properties() {
    return {
      value: String,
      role: 'textbox',
      contenteditable: true,
    };
  }
  _onBlur(event) {
    super._onBlur(event);
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    if (typeof this.value === 'string' || (this.innerText !== String(this.value))) {
      this.set('value', this.innerText);
    }
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    const rng = window.getSelection().getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
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
  changed() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
    this.setAttribute('aria-invalid', (typeof this.value !== 'string') ? 'true' : false);
  }
}

IoString.Register();
