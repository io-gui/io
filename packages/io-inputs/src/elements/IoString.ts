import { Register, Property, VDOMElement, PropsWithBinding, Default } from 'io-gui';
import { IoInputBase, IoInputBaseProps } from './IoInputBase';

export type IoStringProps = IoInputBaseProps & PropsWithBinding<{
  value?: string;
  live?: boolean;
  placeholder?: string;
  appearance?: 'neutral' | 'inset' | 'outset';
  role?: string;
}>;

/**
 * Input element for `String` data type.
 **/
@Register
export class IoString extends IoInputBase {
  static vConstructor: (arg0?: IoStringProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
  @Property({value: '', type: String})
  declare value: string;

  @Property({value: false, type: Boolean})
  declare live: boolean;

  @Property({value: '', type: String, reflect: true})
  declare placeholder: string;

  @Property({value: 'inset', reflect: true})
  declare appearance: 'neutral' | 'inset' | 'outset';

  @Default(true)
  declare contentEditable: boolean;

  @Default('textbox')
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
  _tryParseFromTextNode() {
    const textNode = this.textNode;
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
      this.setCaretPosition(this.textNode.length);
    }
  }
  onKeydown(event: KeyboardEvent) {
    const rng = (window.getSelection() as Selection).getRangeAt(0);
    const start = rng.startOffset;
    const end = rng.endOffset;
    const length = this.childNodes[0] ? this.childNodes[0].length : 0;
    const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this as unknown as Node);

    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.shiftKey) {
        this._tryParseFromTextNode();
      } else {
        this._setFromTextNode();
      }
    } else if (event.key === 'ArrowLeft') {
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('left');
      }
    } else if (event.key === 'ArrowUp') {
      if (event.ctrlKey || (rngInside && start === end && start === 0)) {
        event.preventDefault();
        this.focusTo('up');
      }
    } else if (event.key === 'ArrowRight') {
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('right');
      }
    } else if (event.key === 'ArrowDown') {
      if (event.ctrlKey || (rngInside && start === end && start === length)) {
        event.preventDefault();
        this.focusTo('down');
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
  init() {
    this.disabledChanged();
  }
  valueChanged() {
    this.invalid = (typeof this.value !== 'string' && this.value !== null && this.value !== undefined);
  }
  changed() {
    this.textNode = String(this.value || '').replace(new RegExp(' ', 'g'), '\u00A0');
  }
}
export const ioString = IoString.vConstructor;
