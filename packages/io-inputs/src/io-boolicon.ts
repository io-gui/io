import { Register } from 'io-gui';
import { IoBoolean } from './io-boolean';

@Register
export class IoBoolicon extends IoBoolean {
  changed() {
    this.setAttribute('value', Boolean(this.value));
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    const label = this.value ? this.true : this.false;
    this.template([
      this.icon ? ['io-icon', {icon: this.icon, stroke: this.stroke}] : null,
      ['io-icon', {icon: label, stroke: this.stroke}]
    ]);
  }
}