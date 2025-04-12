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
 * It can be configured to display custom `true` or `false` string or icon depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/
@Register
export class IoBoolean extends IoInputBase {
  static vConstructor: (arg0?: IoBooleanArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;

  @Property({value: false, type: Boolean, reflect: true})
  declare value: boolean;

  @Property({value: 'true', type: String})
  declare true: string;

  @Property({value: 'false', type: String})
  declare false: string;

  @Property({value: 'checkbox', type: String, reflect: true})
  declare type: string;

  @Property({value: 'switch', type: String})
  declare role: string;

  constructor(args: IoBooleanArgs = {}) { super(args); }

  onClick() {
    this.toggle();
    this.dispatchEvent('io-boolean-clicked', {value: this.value}, true);
  }
  toggle() {
    this.inputValue(!this.value);
  }
  init() {
    this.changed();
  }
  changed() {
    this.setAttribute('value', Boolean(this.value));
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    const label = this.value ? this.true : this.false;
    this.template([
      this.icon ? ioIcon({value: this.icon, stroke: this.stroke}) : null,
      label ? label.includes('io:') ? ioIcon({value: label}) : span(label) : null
    ]);
  }
}
export const ioBoolean = IoBoolean.vConstructor;
