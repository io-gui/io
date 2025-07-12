import { Register, ReactiveProperty, VDOMElement, WithBinding, Property } from 'io-gui';
import { IoNumberLadderSingleton } from './IoNumberLadder.js';
import { IoField, IoFieldProps } from './IoField.js';

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

  @ReactiveProperty({value: 0, type: Number})
  declare value: number;

  @ReactiveProperty({value: false, type: Boolean})
  declare live: boolean;

  @ReactiveProperty({value: 1, type: Number})
  declare conversion: number;

  @ReactiveProperty({value: 0.0001, type: Number})
  declare step: number;

  @ReactiveProperty({value: -Infinity, type: Number})
  declare min: number;

  @ReactiveProperty({value: Infinity, type: Number})
  declare max: number;

  @ReactiveProperty({value: false, type: Boolean})
  declare ladder: boolean;

  @ReactiveProperty({value: 'inset', type: String, reflect: true})
  declare appearance: 'neutral' | 'inset' | 'outset';

  @Property('true')
  declare contentEditable: string;

  @ReactiveProperty({value: 'pattern="[0-9]*"', type: String, reflect: true})
  declare pattern: string;

  @Property('numeric')
  declare inputMode: string;

  @Property('textbox')
  declare role: string;

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
    if (event.pointerType === 'touch') event.preventDefault();
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
    if (document.activeElement === this as unknown as Element && event.button === 0) return;
  }
  onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
    if (this.ladder || event.button === 1) {
      if (event.pointerType === 'touch') {
        event.preventDefault();
        (document.activeElement as HTMLElement).blur();
      } else {
        if (document.activeElement !== this as unknown as Element) {
          this.focus();
          this.setCaretPosition(this.textNode!.length);
        }
      }
      this.expandLadder();
    } else {
      if (document.activeElement !== this as unknown as Element) {
        this.focus();
        this.setCaretPosition(this.textNode!.length);
      }
    }
  }
  expandLadder() {
    IoNumberLadderSingleton.src = this;
    IoNumberLadderSingleton.expanded = true;
  }
  collapseLadder() {
    IoNumberLadderSingleton.expanded = false;
  }
  onKeydown(event: KeyboardEvent) {
    const range = (window.getSelection() as Selection).getRangeAt(0);
    const rangeStart = range.startOffset;
    const rangeEnd = range.endOffset;
    const length = this.childNodes[0] ? (this.childNodes[0] as Text).length : 0;
    const rangeInside = range.startContainer === range.endContainer && (range.startContainer === this.childNodes[0] || range.startContainer === this as unknown as Node);

    switch (event.key) {
      case 'Escape':
      case 'Enter':
      case ' ':
        event.preventDefault();
        this._setFromTextNode();
        break;
      case 'Home':
        event.preventDefault();
        this.textNode = String(this.min);
        this._setFromTextNode();
        break;
      case 'End':
        event.preventDefault();
        this.textNode = String(this.max);
        this._setFromTextNode();
        break;
      case 'ArrowLeft':
        if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        }
        // TODO: shift step
        break;
      case 'ArrowUp':
        if (IoNumberLadderSingleton.expanded) {
          event.preventDefault();
          const upStep = IoNumberLadderSingleton.querySelector('.io-up1') as HTMLElement;
          if (upStep) upStep.focus();
        } else if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        }
        break;
      case 'ArrowRight':
        if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        }
        // TODO: shift step
        break;
      case 'ArrowDown':
        if (IoNumberLadderSingleton.expanded) {
          event.preventDefault();
          const downStep = IoNumberLadderSingleton.querySelector('.io-down1') as HTMLElement;
          if (downStep) downStep.focus();
        } else if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        }
        break;
    }
  }
  onKeyup(event: KeyboardEvent) {
    // TODO: move to onkeydown?
    if (event.key === 'Control' || event.key === 'Shift') {
      IoNumberLadderSingleton.expanded ? this.collapseLadder() : this.expandLadder();
    } else if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      this.collapseLadder();
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
      this._reactiveProperties.get('invalid')!.value = false;
      this.removeAttribute('invalid');
      this.removeAttribute('aria-invalid');
      this.inputValue(valueNumber);
    } else {
      this._reactiveProperties.get('invalid')!.value = true;
      this.setAttribute('invalid', 'true');
      this.setAttribute('aria-invalid', 'true');
    }
  }
  ready() {
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
export const ioNumber = function(arg0?: IoNumberProps) {
  return IoNumber.vConstructor(arg0);
};