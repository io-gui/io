import { Register, Property, IoOverlaySingleton } from 'io-gui';
import { IoNumberLadderSingleton } from './io-number-ladder.js';
import { IoField } from './io-field';
/**
 * Input element for `Number` data type.
 * It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
 * If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
 * Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 **/
@Register
export class IoNumber extends IoField {
  static get Style() {
    return /* css */`
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        font-family: monospace;
        padding-left: var(--io_spacing3);
        padding-right: var(--io_spacing3);
      }
    `;
  }

  @Property('textbox')
  declare role: string;

  @Property({value: 0, type: Number})
  declare value: number;

  @Property({value: 1, type: Number})
  declare conversion: number;

  @Property({value: 0.0001, type: Number})
  declare step: number;

  @Property({value: -Infinity, type: Number})
  declare min: number;

  @Property({value: Infinity, type: Number})
  declare max: number;

  @Property({value: false, type: Boolean})
  declare ladder: boolean;

  @Property({value: true, type: Boolean})
  declare contenteditable: boolean;

  @Property({value: 'number', type: String, reflect: true})
  declare type: string;

  @Property({value: 'pattern="[0-9]*"', type: String, reflect: true})
  declare pattern: string;

  @Property({value: 'numeric', type: String, reflect: true})
  declare inputmode: string;

  @Property({value: 'false', type: String, reflect: true})
  declare spellcheck: string;

  @Property({value: 'inset', type: String, reflect: true})
  declare appearance: 'flush' | 'inset' | 'outset';

  private _pointer = '';

  _onBlur(event: FocusEvent) {
    super._onBlur(event);
    this._setFromTextNode();
    this.scrollTop = 0;
    this.scrollLeft = 0;
    // TODO: unhack race condition
    setTimeout(() => {
      if ((document.activeElement as Element).parentElement !== IoNumberLadderSingleton as unknown as Element) {
        IoNumberLadderSingleton.expanded = false;
      }
    });
  }
  _onPointerdown(event: PointerEvent) {
    if (this._pointer === 'touch') event.preventDefault();
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    if (document.activeElement === this as unknown as Element && event.button === 0) return;
    this._pointer = event.pointerType;
  }
  _onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    if (this.ladder || event.button === 1) {
      if (this._pointer === 'touch') {
        event.preventDefault();
        (document.activeElement as HTMLElement).blur();
      } else {
        if (document.activeElement !== this as unknown as Element) {
          this.focus();
          this.setCaretPosition(this.textNode.length);
        }
      }
      this._expandLadder();
    } else {
      if (document.activeElement !== this as unknown as Element) {
        this.focus();
        this.setCaretPosition(this.textNode.length);
      }
    }
  }
  _onFocus(event: FocusEvent) {
    super._onFocus(event);
    if (this._pointer === 'touch') {
      IoNumberLadderSingleton.expanded = false;
    }
  }
  _expandLadder() {
    IoNumberLadderSingleton.src = this;
    IoNumberLadderSingleton.expanded = true;
  }
  _onKeydown(event: KeyboardEvent) {
    const rng = (window.getSelection() as Selection).getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this as unknown as Node);

    if (event.which === 27 || event.which === 13 || event.which === 32) { //  esc || enter || space
      event.preventDefault();
      this._setFromTextNode();
    } else if (event.which === 36) { // home
      this.textNode = this.min;
      this._setFromTextNode();
    } else if (event.which === 35) { // end
      this.textNode = this.max;
      this._setFromTextNode();
    } else if (event.which === 33) { // pgup
      const valueNumber = Number(this.textNode);
      if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) + this.step;
      } else {
        this.textNode = this.step;
      }
      this._setFromTextNode();
    } else if (event.which === 34) { // pgdown
      const valueNumber = Number(this.textNode);
      if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) - this.step;
      } else {
        this.textNode = -this.step;
      }
      this._setFromTextNode();
    } else if (event.which === 37) { // left
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.which === 38) { // up
      if (IoNumberLadderSingleton.expanded) {
        const upStep = IoNumberLadderSingleton.querySelector('.io-up1');
        if (upStep) upStep.focus();
      } else if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.which === 39) { // right
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.which === 40) { // down
      if (IoNumberLadderSingleton.expanded) {
        const downStep = IoNumberLadderSingleton.querySelector('.io-down1');
        if (downStep) downStep.focus();
      } else if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('down');
      }
    }
  }
  _onKeyup(event: KeyboardEvent) {
    if (event.which === 17) { // ctrl
      this._expandLadder();
    } else if (event.which === 27 || event.which === 13 || event.which === 32) { // esc || enter || space
      IoOverlaySingleton.expanded = false;
    }
  }
  _setFromTextNode() {
    const valueText = this.textNode;
    let valueNumber = Number(valueText) / this.conversion;
    valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
    valueNumber = Math.round(valueNumber / this.step) * this.step;
    const d = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
    valueNumber = Number(valueNumber.toFixed(d));
    if (!isNaN(valueNumber)) this.inputValue(valueNumber);
    else this.textNode = 'NaN';
  }
  init() {
    this.changed();
  }
  changed() {
    this.setAttribute('value', this.value);
    this.setAttribute('aria-valuenow', this.value);
    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    this.setAttribute('aria-valuestep', this.step);
    if (typeof this.value !== 'number' || isNaN(this.value)) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
    let value = this.value;
    let valueText;
    if (typeof value === 'number' && !isNaN(value)) {
      value *= this.conversion;
      let d = -Math.floor(Math.log(this.step * this.conversion) / Math.LN10);
      d = Math.max(0, Math.min(100, d));
      value = Number(value.toFixed(d));
      valueText = String(value);
    } else {
      valueText = 'NaN';
    }
    this.setAttribute('value', valueText);
    this.setAttribute('positive', this.value >= 0);
    this.textNode = valueText;
  }
}
export const ioNumber = IoNumber.vDOM;