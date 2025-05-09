import { Register, Property, span, PropsWithBinding, VDOMElement, Default } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoField, IoFieldProps } from './IoField';

export type IoButtonProps = IoFieldProps & PropsWithBinding<{
  action?: Function;
}>;

/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
@Register
export class IoButton extends IoField {
  static vConstructor: (arg0?: IoButtonProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        text-align: center;
        color: var(--io_colorStrong);
      }
      :host > io-icon {
        margin-right: var(--io_spacing);
      }
      :host > span {
        vertical-align: top;
      }
    `;
  }
  @Property({value: undefined, type: undefined, reflect: false})
  declare value: any;

  @Property(undefined)
  declare action?: Function;

  @Property({value: 'outset', type: String, reflect: true})
  declare appearance: 'inset' | 'outset' | 'neutral';

  @Default('button')
  declare role: string;

  constructor(args: IoButtonProps = {}) { super(args); }

  onPointerdown(event: PointerEvent) {
    event.preventDefault();
    super.onPointerdown(event);
  }
  onKeydown(event: KeyboardEvent) {
    super.onKeydown(event);
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true;
    }
  }
  onKeyup(event: KeyboardEvent) {
    super.onKeyup(event);
    this.pressed = false;
  }
  onClick(event: MouseEvent) {
    if (typeof this.action === 'function') this.action(this.value);
    this.dispatchEvent('io-button-clicked', {value: this.value}, true);
  }
  init() {
    this.changed();
  }
  changed() {
    this.setAttribute('aria-pressed', String(this.pressed));
    this.template([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.label ? span(this.label) : null
    ]);
  }
}
export const ioButton = IoButton.vConstructor;