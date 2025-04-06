import { Register, IoElement } from 'io-gui';
import { ioInputBase, ioString, ioNumber, ioBoolean, ioSwitch, ioButton } from 'io-inputs';

export class IoInputsDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        margin-bottom: var(--io_spacing);
      }
      :host .row > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
    `;
  }
  static get Properties() {
    return {
      string: 'Hello!',
      number: 1,
      boolean: true,
    };
  }
  init() {
    this.template([
      ['div', {class: 'row'}, [
        ioInputBase({value: this.bind('string')}),
        ioInputBase({value: this.bind('string'), appearance: 'outset'}),
        ioInputBase({value: this.bind('string'), appearance: 'inset'}),
        ioInputBase({value: this.bind('string'), appearance: 'neutral'}),
      ]],
      ['div', {class: 'row'}, [
        ioInputBase({value: this.bind('string'), invalid: true}),
        ioInputBase({value: this.bind('string'), class: 'green'}),
        ioInputBase({value: this.bind('string'), selected: this.bind('boolean')}),
        ioInputBase({icon: 'io:io'}),
      ]],
      ['div', {class: 'row'}, [
        ioString({value: this.bind('string'), placeholder: 'io-string'}),
        ioString({value: this.bind('string'), placeholder: 'io-string', live: true}),
      ]],
      ['div', {class: 'row'}, [
        ioNumber({value: this.bind('number')}),
        ioNumber({ladder: true, value: this.bind('number')}),
        ioNumber({conversion: 2, value: this.bind('number')}),
      ]],
      ['div', {class: 'row'}, [
        ioBoolean({value: this.bind('boolean'), true: 'io:io', false: 'io:io_logo'}),
        ioBoolean({value: this.bind('boolean')}),
      ]],
      ['div', {class: 'row'}, [
        ioSwitch({value: this.bind('boolean')}),
      ]],
      ['div', {class: 'row'}, [
        ioButton({label: 'Button', icon: 'io:check'}),
        ioButton({label: 'Button', icon: 'io:check', appearance: 'inset'}),
        ioButton({label: 'Button', icon: 'io:check', appearance: 'flush'}),
        ioButton({label: 'Button', icon: 'io:check', appearance: 'neutral'}),
      ]],
    ]);
  }
}
Register(IoInputsDemo);
export const ioInputsDemo = IoInputsDemo.vConstructor;

