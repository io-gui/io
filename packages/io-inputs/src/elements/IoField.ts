import { Register, ReactiveProperty, VDOMElement, IoElement, IoElementProps, span, Property, WithBinding } from 'io-gui';
import { ioIcon } from 'io-icons';

export type IoFieldProps = IoElementProps & {
  value?: WithBinding<any>,
  icon?: string,
  label?: string,
  selected?: boolean,
  disabled?: boolean,
  appearance?: 'neutral' | 'inset' | 'outset',
  pattern?: string,
};

@Register
export class IoField extends IoElement {
  static vConstructor: (arg0?: IoFieldProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        cursor: pointer;
        height: var(--io_fieldHeight);
        min-height: var(--io_fieldHeight);
        line-height: var(--io_lineHeight);
        border: var(--io_border);
        border-color: transparent;
        border-radius: var(--io_borderRadius);
        padding: var(--io_spacing) var(--io_spacing3);
        color: var(--io_color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: var(--io_fontSize);
        user-select: none;
      }
      :host[disabled] {
        opacity: 0.5;
      }
      :host[pressed] {
        border-color: var(--io_borderColorInset) !important;
        box-shadow: var(--io_shadowInset) !important;
      }
      :host :not(:last-child) {
        margin-right: var(--io_spacing2);
      }
      :host span {
        display: inline-block;
        height: var(--io_lineHeight);
        vertical-align: top;
      }
      :host[appearance=neutral] {
        color: var(--io_color);
        background-color: transparent;
      }
      :host[appearance=inset] {
        color: var(--io_colorInput);
        background-color: var(--io_bgColorInput);
        border-color: var(--io_borderColorInset);
        padding-top: calc(var(--io_spacing) + 0.05em);
        padding-bottom: calc(var(--io_spacing) - 0.05em);
        box-shadow: var(--io_shadowInset);
      }
      :host[appearance=outset] {
        border-color: var(--io_borderColorOutset);
        background-image: var(--io_gradientOutset);
        box-shadow: var(--io_shadowOutset);
      }
      :host.red,
      :host[invalid] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorRed);
        border-color: var(--io_borderColorRed);
      }
      :host.green {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorGreen);
        border-color: var(--io_borderColorGreen);
      }
      :host.blue,
      :host[selected] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorBlue);
        border-color: var(--io_borderColorBlue);
      }
      :host:focus {
        text-overflow: inherit;
        border-color: var(--io_colorBlue);
        outline: 1px auto var(--io_colorBlue);
      }
    `;
  }

  @ReactiveProperty({value: ''})
  declare value: any;

  @ReactiveProperty({type: String, value: ''})
  declare icon: string;

  @ReactiveProperty({type: String, value: '', reflect: true})
  declare label: string;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare selected: boolean;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare invalid: boolean;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare disabled: boolean;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare pressed: boolean;

  @ReactiveProperty({value: 'neutral', reflect: true})
  declare appearance: 'neutral' | 'inset' | 'outset';

  @ReactiveProperty({value: '', type: String, reflect: true})
  declare pattern: string;

  @Property(false)
  declare spellcheck: boolean;

  @Property('0')
  declare tabIndex: string;

  static get Listeners() {
    return {
      'focus': 'onFocus',
      'pointerdown': 'onPointerdown',
      'click': 'onClick',
    };
  }

  constructor(args: IoFieldProps = {}) { super(args); }

  onFocus(event: FocusEvent) {
    this.addEventListener('blur', this.onBlur);
    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('keyup', this.onKeyup);
  }
  onBlur(event: FocusEvent) {
    this.removeEventListener('blur', this.onBlur);
    this.removeEventListener('keydown', this.onKeydown);
    this.removeEventListener('keyup', this.onKeyup);
  }
  onPointerdown(event: PointerEvent) {
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerleave', this.onPointerleave);
    this.addEventListener('pointerup', this.onPointerup);
    this.pressed = true;
  }
  onPointermove(event: PointerEvent) {}
  onPointerleave(event: PointerEvent) {
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerleave', this.onPointerleave);
    this.removeEventListener('pointerup', this.onPointerup);
    this.pressed = false;
  }
  onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerleave', this.onPointerleave);
    this.removeEventListener('pointerup', this.onPointerup);
    this.pressed = false;
  }
  onClick(event?: MouseEvent) {
  }
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
    else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.dispatchEvent('io-focus-to', {source: this, direction: 'left'}, true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.dispatchEvent('io-focus-to', {source: this, direction: 'up'}, true);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.dispatchEvent('io-focus-to', {source: this, direction: 'right'}, true);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.dispatchEvent('io-focus-to', {source: this, direction: 'down'}, true);
    }
  }
  onKeyup(event: KeyboardEvent) {}

  getCaretPosition() {
    let position = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const selected = range.toString().length;
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(this as unknown as Node);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length - selected;
    }
    return position;
  }
  setCaretPosition(position: number){
    if (!position) return;
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.setStart(this.firstChild, position);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  labelChanged() {
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    } else {
      this.removeAttribute('aria-label');
    }
  }
  selectedChanged() {
    if (this.selected) {
      this.setAttribute('aria-selected', 'true');
    } else {
      this.removeAttribute('aria-selected');
    }
  }
  invalidChanged() {
    if (this.invalid) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }
  disabledChanged() {
    this.inert = this.disabled;
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
  }
  changed() {
    this.template([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.label ? span(this.label) : null,
      this.value !== undefined ? span(String(this.value)) : null,
    ]);
  }

}
export const ioField = IoField.vConstructor;

