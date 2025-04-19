import { Register, Property, span, VDOMElement, ArgsWithBinding } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoInputBase, IoInputBaseArgs } from './IoInputBase';

export type IoBooleanArgs = IoInputBaseArgs & ArgsWithBinding<{
  value?: boolean;
  true?: string;
  false?: string;
}>;

/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` strings.
 **/
@Register
export class IoBoolean extends IoInputBase {
  static vConstructor: (arg0?: IoBooleanArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  static get Style() {
    return /* css */`
      :host {
        padding: var(--io_spacing);
      }
    `;
  }

  @Property({value: false, type: Boolean, reflect: true})
  declare value: boolean;

  @Property({value: 'true', type: String})
  declare true: string;

  @Property({value: 'false', type: String})
  declare false: string;

  @Property({value: 'checkbox', type: String, reflect: true})
  declare role: string;

  constructor(args: IoBooleanArgs = {}) { super(args); }

  onPointerdown(event: PointerEvent) {
    event.preventDefault();
    super.onPointerdown(event);
  }
  onClick() {
    this.toggle();
    this.dispatchEvent('io-boolean-clicked', {value: this.value}, true);
  }
  toggle() {
    this.inputValue(!this.value);
  }
  init() {
    this.valueChanged();
    this.changed();
  }
  valueChanged() {
    this.invalid = typeof this.value !== 'boolean';
    this.setAttribute('aria-checked', String(!!this.value));
  }
  changed() {
    const value = this.value ? this.true : this.false;
    this.template([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.label ? span(this.label + ':') : null,
      value ? value.includes('io:') ? ioIcon({value: value}) : span(value) : null
    ]);
  }
}
export const ioBoolean = IoBoolean.vConstructor;
