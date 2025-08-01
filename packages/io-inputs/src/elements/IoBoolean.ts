import { Register, ReactiveProperty, span, WithBinding, Property } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoField, IoFieldProps } from './IoField.js';

export type IoBooleanProps = IoFieldProps & {
  value?: WithBinding<boolean>,
  true?: string,
  false?: string,
};

/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` strings.
 **/
@Register
export class IoBoolean extends IoField {

  static get Style() {
    return /* css */`
      :host {
        padding: var(--io_spacing);
      }
    `;
  }

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare value: boolean;

  @ReactiveProperty({value: 'true', type: String})
  declare true: string;

  @ReactiveProperty({value: 'false', type: String})
  declare false: string;

  @Property('checkbox')
  declare role: string;

  constructor(args: IoBooleanProps = {}) { super(args); }

  onClick() {
    this.toggle();
    this.dispatch('io-boolean-clicked', {value: this.value}, true);
  }
  toggle() {
    this.inputValue(!this.value);
  }
  ready() {
    this.valueChanged();
    this.changed();
  }
  valueChanged() {
    this.invalid = typeof this.value !== 'boolean';
    this.setAttribute('aria-checked', String(!!this.value));
  }
  changed() {
    const value = this.value ? this.true : this.false;
    this.render([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.label ? span(this.label + ':') : null,
      value ? value.includes('io:') ? ioIcon({value: value}) : span(value) : null
    ]);
  }
}
export const ioBoolean = function(arg0?: IoBooleanProps) {
  return IoBoolean.vConstructor(arg0);
};
