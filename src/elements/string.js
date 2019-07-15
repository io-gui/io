import {html} from "../io.js";
import {IoItem} from "./item.js";

export class IoString extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        border-color: var(--io-inset-border-color);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        user-select: text;
        width: 4.5em;
        height: 1.375em;
      }
      :host:empty:after {
        display: inline-block;
        content: '"';
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'textbox',
      contenteditable: true,
    };
  }
  static get Properties() {
    return {
      value: String,
    };
  }
  _setFromTextNode() {
    this._textNode = this.childNodes[0];
    if (this.childNodes.length == 2) {
      this.removeChild(this.childNodes[1]);
    }
    if (typeof this.value === 'string' || (this._textNode.nodeValue !== String(this.value))) {
      this.set('value', this._textNode.nodeValue);
    }
  }
  _onBlur(event) {
    super._onBlur(event);
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this._setFromTextNode();
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    const rng = window.getSelection().getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);

    // TODO: consider using shiftKey for better UX
    if (event.which == 13) {
      event.preventDefault();
      this._setFromTextNode();
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
    const valueText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
    if (this._textNode.nodeValue !== valueText) {
      this._textNode.nodeValue = valueText;
    }
    this.setAttribute('aria-invalid', (typeof this.value !== 'string') ? 'true' : false);
  }
}

IoString.Register();
