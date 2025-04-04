import { Register, Property, ioText, VDOMArray, ArgsWithBinding } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoInputBase, IoInputBaseArgs } from './io-input-base';

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
  static get Style() {
    return /* css */`
      :host {
        background-color: transparent;
        padding: var(--io_spacing) var(--io_spacing);
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
  declare type: string;

  @Property({value: 'switch', type: String})
  declare role: string;

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
      label ? ioText(label) : null
    ]);
  }
  static vDOM: (arg0?: IoBooleanArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export const ioBoolean = IoBoolean.vDOM;
