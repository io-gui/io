import {html} from "../../io.js";
import {IoItem} from "./item.js";
import {IoLayerSingleton} from "./layer.js";
import {IoLadderSingleton} from "./ladder.js";

export class IoNumber extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        min-width: var(--io-item-height);
        border-color: var(--io-inset-border-color);
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
      :host:before {
        content: '-';
      }
      :host:not([positive]):before {
        content: '';
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
      'touchstart': ['_onTouchstart', {passive: true}],
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
      if (IoLadderSingleton.expanded) {
        this.focus();
      }
      document.activeElement.blur();
      IoLayerSingleton.clickblock = true;
      IoLadderSingleton.opaque = true;
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
    // TODO: implement conversion properly in ladder
    this.set('value', event.detail.value);
  }
  _expandLadder() {
    if (!this.ladder) return;
    // TODO: disable if no PointerEvents
    IoLadderSingleton.min = this.min;
    IoLadderSingleton.max = this.max;
    IoLadderSingleton.step = this.step;
    IoLadderSingleton.value = this.value;
    IoLadderSingleton.conversion = this.conversion;
    IoLadderSingleton.expanded = true;
    // TODO: unhack
    if (IoLadderSingleton._target) {
      IoLadderSingleton.removeEventListener('value-set', IoLadderSingleton._target._onValueSet);
    }
    IoLadderSingleton._target = this;
    IoLadderSingleton.addEventListener('value-set', this._onValueSet);

    // TODO: disable nudge?
    IoLayerSingleton.setElementPosition(IoLadderSingleton, 'bottom', this.getBoundingClientRect());
    IoLayerSingleton.srcElement = this;
  }
  _onPointerDown() {}
  _onPointerMove() {}
  _onPointerUp() {}
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
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.which == 38) { // up
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.which == 39) { // right
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.which == 40) { // down
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('down');
      }
    }
  }
  _onKeyup(event) {
    if (event.which === 17) { // ctrl
      // TODO: implement keybord navigation for io-ladder
      this._expandLadder();
    }
  }
  _setFromTextNode() {
    let valueText = this.textNode;
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
    this.setAttribute('positive', this.value >= 0);
    this.setAttribute('aria-invalid', (typeof this.value !== 'number' || isNaN(this.value)) ? 'true' : false);
  }
}

IoNumber.Register();
