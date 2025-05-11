import { Register, Property, IoOverlaySingleton, VDOMElement, WithBinding, Default, focusTo } from 'io-gui';
import { IoNumberLadderSingleton } from './IoNumberLadder';
import { IoField, IoFieldProps } from './IoField';

export type IoNumberProps = Omit<IoFieldProps, 'value'> & {
  value?: WithBinding<number>;
  live?: boolean;
  conversion?: number;
  step?: number;
  min?: number;
  max?: number;
  ladder?: boolean;
};

/**
 * Input element for `Number` data type.
 * It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
 * If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
 * Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 **/
@Register
export class IoNumber extends IoField {
  static vConstructor: (arg0?: IoNumberProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        font-family: monospace;
      }
      :host[placeholder]:empty:before {
        content: attr(placeholder);
        visibility: visible;
        color: var(--io_colorInput);
        padding: 0 calc(var(--io_spacing) + var(--io_borderWidth));
        opacity: 0.5;
      }
    `;
  }

  @Property({value: 0, type: Number})
  declare value: number;

  @Property({value: false, type: Boolean})
  declare live: boolean;

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

  @Property({value: 'inset', type: String, reflect: true})
  declare appearance: 'neutral' | 'inset' | 'outset';

  @Default(true)
  declare contentEditable: boolean;

  @Property({value: 'pattern="[0-9]*"', type: String, reflect: true})
  declare pattern: string;

  @Default('numeric')
  declare inputMode: string;

  @Default('textbox')
  declare role: string;

  private _pointer = '';

  constructor(args: IoNumberProps = {}) { super(args); }

  get textNode() {
    this._flattenTextNode(this);
    return this._textNode.nodeValue;
  }
  set textNode(value) {
    this._flattenTextNode(this);
    this._textNode.nodeValue = String(value);
  }

  onBlur(event: FocusEvent) {
    super.onBlur(event);
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
  onPointerdown(event: PointerEvent) {
    if (this._pointer === 'touch') event.preventDefault();
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
    if (document.activeElement === this as unknown as Element && event.button === 0) return;
    this._pointer = event.pointerType;
  }
  onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
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
  onFocus(event: FocusEvent) {
    super.onFocus(event);
    if (this._pointer === 'touch') {
      IoNumberLadderSingleton.expanded = false;
    }
  }
  _expandLadder() {
    IoNumberLadderSingleton.src = this;
    IoNumberLadderSingleton.expanded = true;
  }
  onKeydown(event: KeyboardEvent) {
    const rng = (window.getSelection() as Selection).getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this as unknown as Node);

    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._setFromTextNode();
    } else if (event.key === 'Home') { // home
      this.textNode = this.min;
      this._setFromTextNode();
    } else if (event.key === 'End') { // end
      this.textNode = this.max;
      this._setFromTextNode();
    } else if (event.key === 'PageUp') { // pgup
      const valueNumber = Number(this.textNode);
      if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) + this.step;
      } else {
        this.textNode = this.step;
      }
      this._setFromTextNode();
    } else if (event.key === 'PageDown') { // pgdown
      const valueNumber = Number(this.textNode);
      if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
        this.textNode = Number(this.textNode) - this.step;
      } else {
        this.textNode = -this.step;
      }
      this._setFromTextNode();
    } else if (event.key === 'ArrowLeft') { // left
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        focusTo(this, 'left');
      }
    } else if (event.key === 'ArrowUp') { // up
      if (IoNumberLadderSingleton.expanded) {
        const upStep = IoNumberLadderSingleton.querySelector('.io-up1');
        if (upStep) upStep.focus();
      } else if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        focusTo(this, 'up');
      }
    } else if (event.key === 'ArrowRight') { // right
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        focusTo(this, 'right');
      }
    } else if (event.key === 'ArrowDown') { // down
      if (IoNumberLadderSingleton.expanded) {
        const downStep = IoNumberLadderSingleton.querySelector('.io-down1');
        if (downStep) downStep.focus();
      } else if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        focusTo(this, 'down');
      }
    }
  }
  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Control') { // ctrl
      this._expandLadder(); // TODO: toggle ladder
    } else if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      IoOverlaySingleton.expanded = false;
    }

    if (this.live) {
      const carretPosition = this.getCaretPosition();
      this._setFromTextNode();
      this.setCaretPosition(carretPosition);
    }
  }
  _setFromTextNode() {
    const valueText = this.textNode;
    let valueNumber = Number(valueText) / this.conversion;
    valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
    valueNumber = Math.round(valueNumber / this.step) * this.step;
    const d = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
    valueNumber = Number(valueNumber.toFixed(d));
    if (!isNaN(valueNumber)) {
      this._properties.get('invalid')!.value = false;
      this.removeAttribute('invalid');
      this.removeAttribute('aria-invalid');
      this.inputValue(valueNumber);
    } else {
      this._properties.get('invalid')!.value = true;
      this.setAttribute('invalid', 'true');
      this.setAttribute('aria-invalid', 'true');
    }
  }
  init() {
    this.disabledChanged();
    this.changed();
  }
  changed() {
    this.setAttribute('aria-valuenow', this.value);
    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    this.setAttribute('aria-valuestep', this.step);
    if (typeof this.value !== 'number' || isNaN(this.value)) {
      this.setAttribute('invalid', 'true');
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('invalid');
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
export const ioNumber = IoNumber.vConstructor;