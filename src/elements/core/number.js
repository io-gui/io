import {html} from "../../io.js";
import {IoItem} from "./item.js";
import {IoLayerSingleton} from "./layer.js";

import {IoNumberLadderSingleton} from "./number-ladder.js";

export class IoNumber extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        cursor: text;
        user-select: text;
        min-width: var(--io-item-height);
        border-color: var(--io-inset-border-color);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        box-shadow: var(--io-shadow-inset);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      contenteditable: true,
      role: 'textbox',
      type: 'number',
      pattern: 'pattern="[0-9]*"',
      inputmode: 'numeric',
      spellcheck: 'false',
    };
  }
  static get Properties() {
    return {
      value: Number,
      conversion: 1,
      step: 0.001,
      min: -Infinity,
      max: Infinity,
      ladder: false,
    };
  }
  // TODO: implement pointerevents
  static get Listeners() {
    return {
      'touchstart': '_onTouchstart',
      'touchend': '_onTouchend',
    };
  }
  _onTouchstart(event) {
    if (!this.ladder) return;
    this._x = event.changedTouches[0].clientX;
    this._y = event.changedTouches[0].clientY;
  }
  _onTouchend(event) {
    if (!this.ladder) return;
    event.preventDefault();
    const dx = event.changedTouches[0].clientX - this._x;
    const dy = event.changedTouches[0].clientY - this._y;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      if (IoNumberLadderSingleton.expanded) {
        this.focus();
      }
      document.activeElement.blur();
      IoLayerSingleton.clickblock = true;
      IoNumberLadderSingleton.opaque = true;
      this._expandLadder();
    }
  }
  _onFocus(event) {
    super._onFocus(event);
    this._textContentOnFocus = this.textNode;
    if (this.ladder) IoLayerSingleton.clickblock = false;
  }
  _onBlur(event) {
    super._onBlur(event);
    if (this._textContentOnFocus !== this.textNode) this._setFromTextNode();
    this.scrollTop = 0;
    this.scrollLeft = 0;
    IoLayerSingleton.expanded = false;
  }
  _onClick(event) {
    super._onClick(event);
    this._expandLadder();
  }
  _onValueSet(event) {
    this.set('value', event.detail.value / this.conversion);
  }
  _expandLadder() {
    if (!this.ladder) return;
    IoNumberLadderSingleton.expanded = true;
    IoNumberLadderSingleton.min = this.min;
    IoNumberLadderSingleton.max = this.max;
    IoNumberLadderSingleton.step = this.step;
    IoNumberLadderSingleton.value = this.value;
    // TODO: unhack
    if (IoNumberLadderSingleton._target) {
      IoNumberLadderSingleton.removeEventListener('value-set', IoNumberLadderSingleton._target._onValueSet);
    }
    IoNumberLadderSingleton._target = this;
    IoNumberLadderSingleton.addEventListener('value-set', this._onValueSet);

    // TODO: disable nudge?
    IoLayerSingleton.setElementPosition(IoNumberLadderSingleton, 'bottom', this.getBoundingClientRect());
    IoLayerSingleton.srcElement = this;
  }
  _onKeydown(event) {
    const rng = window.getSelection().getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);

    if (event.which == 13) { // enter
      event.preventDefault();
      this._setFromTextNode();
    } else if (event.which == 36) { // home
      this.textNode = this.min;
      this._setFromTextNode();
    } else if (event.which == 35) { // end
      this.textNode = this.max;
      this._setFromTextNode();
    } else if (event.which == 33) { // pgup
      const valueNumber = Number(this.textNode);
      if (typeof valueNumber == 'number' && !isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) + this.step;
      } else {
        this.textNode = this.step;
      }
      this._setFromTextNode();
    } else if (event.which == 34) { // pgdown
      const valueNumber = Number(this.textNode);
      if (typeof valueNumber == 'number' && !isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) - this.step;
      } else {
        this.textNode = -this.step;
      }
      this._setFromTextNode();
    } else if (event.which == 37) { // left
      if (event.altKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.which == 38) { // up
      if (event.altKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.which == 39) { // right
      if (event.altKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.which == 40) { // down
      if (event.altKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('down');
      }
    }
  }
  _setFromTextNode() {
    let valueText = this.textNode;
    // TODO: test conversion
    let valueNumber = Number(valueText);
    valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
    valueNumber = Math.round(valueNumber / this.step) * this.step;
    let d = Math.max(0, Math.min(100, -Math.round(Math.log(this.step) / Math.LN10)));
    valueNumber = Number(valueNumber.toFixed(d));
    if (!isNaN(valueNumber)) this.set('value', valueNumber / this.conversion);
    else this.textNode = 'NaN';
  }
  changed() {
    this.title = this.label;
    let value = this.value;
    let valueText;
    if (typeof value == 'number' && !isNaN(value)) {
      value *= this.conversion;
      let d = -Math.round(Math.log(this.step) / Math.LN10);
      d = Math.max(0, Math.min(100, d));
      value = value.toFixed(d);
      valueText = Number(String(value));
    } else {
      valueText = 'NaN';
    }
    this.textNode = valueText;
    this.setAttribute('aria-invalid', (typeof this.value !== 'number' || isNaN(this.value)) ? 'true' : false);
  }
}

IoNumber.Register();
