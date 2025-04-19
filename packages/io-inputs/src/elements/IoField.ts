import { Register, Property, VDOMElement, ArgsWithBinding, IoElement, IoElementArgs, span } from 'io-gui';
import { ioIcon } from 'io-icons';

export type IoFieldArgs = IoElementArgs & ArgsWithBinding<{
  value?: any;
  icon?: string;
  label?: string;
  selected?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  tabindex?: '-1' | '0' | '' | '1' | '2' | '3';
  appearance?: 'neutral' | 'inset' | 'outset';
}>;

@Register
export class IoField extends IoElement {
  static vConstructor: (arg0?: IoFieldArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      --ioField: {
        height: var(--io_fieldHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        border: var(--io_border);
        border-color: transparent;
        padding: var(--io_spacing) var(--io_spacing3);
        color: var(--io_color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :host {
        @apply --ioField;
      }
      :host :not(:last-child) {
        margin-right: var(--io_spacing2);
      }
      :host span {
        display: inline-block;
        height: var(--io_lineHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        color: var(--io_color);
        vertical-align: top;
      }
      :host[appearance=neutral] {
        color: var(--io_color);
        background-color: transparent;
      }
      :host[appearance=inset] {
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
        border-color: var(--io_colorRed);
      }
      :host.green {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorGreen);
        border-color: var(--io_colorGreen);
      }

      :host.blue,
      :host[selected] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorBlue);
        border-color: var(--io_colorBlue);
      }
      :host:focus {
        text-overflow: inherit;
      }
      :host[disabled] {
        pointer-events: none !important;
        opacity: 0.5;
        user-select: none;
      }
    `;
  }

  @Property({value: '', type: String})
  declare value: any;

  @Property({type: String, value: ''})
  declare icon: string;

  @Property({type: String, value: '', reflect: true})
  declare label: string;

  @Property({value: false, type: Boolean, reflect: true})
  declare selected: boolean;

  @Property({value: false, type: Boolean, reflect: true})
  declare invalid: boolean;

  @Property({value: false, type: Boolean, reflect: true})
  declare disabled: boolean;

  @Property({value: '0', type: String, reflect: true})
  declare tabindex: string;

  @Property({value: 'neutral', reflect: true})
  declare appearance: 'neutral' | 'inset' | 'outset';

  constructor(args: IoFieldArgs = {}) { super(args); }

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
    if (this.disabled) {
      this.tabindex = '';
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.tabindex = '0';
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

