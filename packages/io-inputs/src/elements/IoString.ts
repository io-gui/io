import { Register, ReactiveProperty, Property, WithBinding } from 'io-gui';
import { IoField, IoFieldProps } from './IoField.js';

export type IoStringProps = IoFieldProps & {
  value?: WithBinding<string>,
  live?: boolean,
  placeholder?: string,
  appearance?: 'neutral' | 'inset' | 'outset',
};

/**
 * Input element for `String` data type.
 **/
@Register
export class IoString extends IoField {
  static get Style() {
    return /* css */`
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
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
  @ReactiveProperty({value: '', type: String})
  declare value: string;

  @ReactiveProperty({value: false, type: Boolean})
  declare live: boolean;

  @ReactiveProperty({value: '', type: String, reflect: true})
  declare placeholder: string;

  @ReactiveProperty({value: 'inset', reflect: true})
  declare appearance: 'neutral' | 'inset' | 'outset';

  @Property('true')
  declare contentEditable: string;

  @Property('textbox')
  declare role: string;

  constructor(args: IoStringProps = {}) { super(args); }

  get textNode() {
    this._flattenTextNode(this);
    return this._textNode.nodeValue;
  }
  set textNode(value) {
    this._flattenTextNode(this);
    this._textNode.nodeValue = String(value);
  }

  _setFromTextNode() {
    const textNode = this.textNode;
    if (typeof this.value === 'string' && textNode !== String(this.value)) {
      this.inputValue(textNode);
    }
  }
  // TODO: reconsider this feature
  _setObjectFromTextNodeJSON() {
    const textNode = this.textNode!;
    try {
      const value = JSON.parse(textNode.replace(/[\t\n\r ]+/g, ' '));
      this.inputValue(value);
    } catch (error) {
      console.warn('IoString: Cannot parse value', textNode);
      console.error(error);
      this._setFromTextNode();
    }
  }
  onBlur(event: FocusEvent) {
    super.onBlur(event);
    this._setFromTextNode();
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  onPointerdown(event: PointerEvent) {
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
  }

  onPointermove(event: PointerEvent) {}

  onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
    if (document.activeElement !== this as unknown as Element) {
      this.focus();
      this.setCaretPosition(this.textNode!.length);
    }
  }
  onKeydown(event: KeyboardEvent) {
    const range = (window.getSelection() as Selection).getRangeAt(0);
    const rangeStart = range.startOffset;
    const rangeEnd = range.endOffset;
    const length = this.childNodes[0] ? (this.childNodes[0] as Text).length : 0;
    const rangeInside = range.startContainer === range.endContainer && (range.startContainer === this.childNodes[0] || range.startContainer === this as unknown as Node);

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (event.shiftKey) {
          // TODO: reconsider this feature
          this._setObjectFromTextNodeJSON();
        } else {
          this._setFromTextNode();
        }
        break;
      case 'ArrowLeft':
        if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: 'ArrowLeft'}, true);
        }
        break;
      case 'ArrowUp':
        if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: 'ArrowUp'}, true);
        }
        break;
      case 'ArrowRight':
        if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: 'ArrowRight'}, true);
        }
        break;
      case 'ArrowDown':
        if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: 'ArrowDown'}, true);
        }
        break;
      default:
        if (['Tab', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        }
    }
  }
  onKeyup(event: KeyboardEvent) {
    super.onKeyup(event);
    if (this.live) {
      const carretPosition = this.getCaretPosition();
      this._setFromTextNode();
      this.setCaretPosition(carretPosition);
    }
  }
  ready() {
    this.disabledChanged();
  }
  valueChanged() {
    this.invalid = (typeof this.value !== 'string' && this.value !== null && this.value !== undefined);
  }
  changed() {
    this.textNode = String(this.value || '');
  }
}
export const ioString = function(arg0?: IoStringProps) {
  return IoString.vConstructor(arg0);
};
