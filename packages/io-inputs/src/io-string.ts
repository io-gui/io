import { Register, Property, VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './io-input-base';

export type IoStringArgs = IoInputBaseArgs & ArgsWithBinding<{
  live?: boolean;
  value?: string;
  placeholder?: string;
  spellcheck?: 'true' | 'false';
}>;

/**
 * Input element for `String` data type.
 **/
@Register
export class IoString extends IoInputBase {
  static vConstructor: (arg0?: IoStringArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
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
  @Property(false)
  declare live: boolean;

  @Property('')
  declare value: string;

  @Property({value: 'text', type: String, reflect: true})
  declare type: string;

  @Property('textbox')
  declare role: string;

  @Property({value: 'inset', reflect: true})
  declare appearance: 'flush' | 'inset' | 'outset';

  @Property({value: '', type: String, reflect: true})
  declare placeholder: string;

  @Property({value: 'false', type: String, reflect: true})
  declare spellcheck: string;

  constructor(args: IoStringArgs = {}) { super(args); }

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
  disabledChanged() {
    if (this.disabled) {
      this.removeAttribute('contenteditable');
    } else {
      this.setAttribute('contenteditable', true);
    }
  }
  changed() {
    this.textNode = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
  valueChanged() {
    if (typeof this.value !== 'string') {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }
}
export const ioString = IoString.vConstructor;
