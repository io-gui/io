import {IoItem} from "./item.js";

export class IoString extends IoItem {
  static get Style() {
    return /* css */`
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
    `;
  }
  static get Properties() {
    return {
      live: Boolean,
      value: String,
      contenteditable: true,
      role: 'textbox',
    };
  }
  _setFromTextNode() {
    const textNode = this.textNode;
    if (typeof this.value === 'string' && textNode !== String(this.value)) {
      this.set('value', textNode);
    }
  }
  _tryParseFromTextNode() {
    const textNode = this.textNode;
    try {
      const value = JSON.parse(textNode.replace(/[\t\n\r ]+/g, " "));
      this.set('value', value);
    } catch (error) {
      console.warn('IoString: Cannot parse value', textNode);
      console.error(error);
      this._setFromTextNode();
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
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
  }
  _onPointermove() {}
  _onPointerup() {
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    if (document.activeElement !== this) this.focus();
  }
  _onKeyup(event) {
    super._onKeyup(event);
    if (this.live) {
      const carretPosition = getCaretPosition(this);
      this._setFromTextNode();
      setCaretPosition(this, carretPosition);
    }
  }
  _onKeydown(event) {
    const rng = window.getSelection().getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);

    if (event.key == 'Enter') {
      event.preventDefault();
      if (event.shiftKey) {
        this._tryParseFromTextNode();
      } else {
        this._setFromTextNode();
      }
    } else if (event.key == 'ArrowLeft') {
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.key == 'ArrowUp') {
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.key == 'ArrowRight') {
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.key == 'ArrowDown') {
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

function getCaretPosition(el){
  let position = 0;
  const selection = window.getSelection();
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    const selected = range.toString().length;
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(el);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    position = preCaretRange.toString().length - selected;
  }
  return position;
}

function setCaretPosition(el, position){
  if (!position) return;
  const sel = window.getSelection();
  const range = document.createRange();
  range.setStart(el.firstChild, position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}