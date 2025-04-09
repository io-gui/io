import { Register } from '../decorators/Register';
import { Property } from '../decorators/Property';
import { VDOMElement } from '../core/VDOM';
import { ArgsWithBinding } from '../nodes/Node';
import { IoElement, IoElementArgs } from './IoElement';

export type IoFieldArgs = IoElementArgs & ArgsWithBinding<{
  appearance?: 'flush' | 'inset' | 'outset' | 'neutral';
  selected?: boolean;
  invalid?: boolean;
  disabled?: boolean;
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
      :host[appearance=neutral] {
        color: var(--io_color);
        background-color: transparent;
      }
      :host[appearance=inset] {
        border-color: var(--io_borderColorInset);
        padding-top: calc(var(--io_spacing) + 0.05em);
        padding-bottom: calc(var(--io_spacing) - 0.05em);
      }
      :host[appearance=outset] {
        border-color: var(--io_borderColorOutset);
        background-image: var(--io_gradientOutset);
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
  @Property({value: 'neutral', reflect: true})
  declare appearance: 'flush' | 'inset' | 'outset' | 'neutral';

  @Property({value: false, type: Boolean, reflect: true})
  declare selected: boolean;

  @Property({value: false, type: Boolean, reflect: true})
  declare invalid: boolean;

  @Property({value: false, type: Boolean, reflect: true})
  declare disabled: boolean;

  constructor(args: IoFieldArgs = {}) { super(args); }

  disabledChanged() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', this.disabled);
    } else {
      this.removeAttribute('aria-disabled');
    }
  }

}
export const ioField = IoField.vConstructor;

