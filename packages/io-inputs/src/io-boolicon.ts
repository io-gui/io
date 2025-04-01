import { Register, ioLabel } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoBoolean } from './io-boolean';

@Register
export class IoBoolicon extends IoBoolean {
  changed() {
    this.setAttribute('value', Boolean(this.value));
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    const label = this.value ? this.true : this.false;
    this.template([
      this.icon ? ioIcon({icon: this.icon, stroke: this.stroke}) : null,
      label ? ioLabel({label: label}) : null
    ]);
  }
}
export const ioBoolicon = IoBoolicon.vDOM;
