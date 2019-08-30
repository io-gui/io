import {html} from "../../io.js";
import {IoItem} from "./item.js";

export class IoString extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        min-width: var(--io-item-height);
        border-color: var(--io-color-border-inset);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        box-shadow: var(--io-shadow-inset);
      }
      :host:before,
      :host:after {
        content: ' ';
        white-space: pre;
        visibility: hidden;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: String,
      contenteditable: true,
      role: 'textbox',
    };
  }
  _setFromTextNode() {
    const textNode = this.textNode;
    if (typeof this.value === 'string' || (textNode !== String(this.value))) {
      this.set('value', textNode);
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
  _onPointerdown() {
    this.pressed = true;
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerleave', this._onPointerleave);
    this.addEventListener('pointerup', this._onPointerup);
  }
  _onPointermove() {}
  _onPointerleave(event) {
    event.preventDefault();
    this.pressed = false;
  }
  _onPointerup() {
    this.pressed = false;
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerleave', this._onPointerleave);
    this.removeEventListener('pointerup', this._onPointerup);
    this.focus();
  }
  _onKeydown(event) {
    const rng = window.getSelection().getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);

    if (event.which == 13) {
      event.preventDefault();
      this._setFromTextNode();
    } else if (event.which == 37) {
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.which == 38) {
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.which == 39) {
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.which == 40) {
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('down');
      }
    }
  }
  changed() {
    this.title = this.label;
    this.textNode = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
    this.setAttribute('aria-invalid', (typeof this.value !== 'string') ? 'true' : false);
  }
}

IoString.Register();
