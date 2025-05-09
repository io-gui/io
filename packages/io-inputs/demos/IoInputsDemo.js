import { Register, IoElement, div } from 'io-gui';
import { ioField, ioString, ioNumber, ioBoolean, ioSwitch, ioButton } from 'io-inputs';

export class IoInputsDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        margin: var(--io_spacing2);
      }
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: var(--io_spacing);
        margin: var(--io_spacing);
        margin-bottom: 0;
        background-color: var(--io_bgColorDimmed);
      }
      :host .row > * {
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
      div({class: 'row'}, [
        ioField({value: this.bind('string'), inert: true}),
        ioField({value: this.bind('string')}),
        ioField({value: this.bind('string'), appearance: 'outset'}),
        ioField({value: this.bind('string'), appearance: 'inset'}),
        ioField({value: this.bind('string'), appearance: 'neutral', label: 'Label', icon: 'io:io', title: 'Title'}),
      ]),
      div({class: 'row'}, [
        ioField({value: this.bind('string'), inert: true}),
        ioField({value: this.bind('string'), invalid: this.bind('boolean')}),
        ioField({value: this.bind('string'), class: 'green'}),
        ioField({value: this.bind('string'), selected: this.bind('boolean')}),
        ioField({label: 'icon', icon: 'io:io'}), // TODO
      ]),
      div({class: 'row'}, [
        ioString({value: this.bind('string'), placeholder: 'io-string'}),
        ioString({value: this.bind('string'), placeholder: 'io-string', label: 'live', live: true}),
      ]),
      div({class: 'row'}, [
        ioNumber({value: this.bind('number')}),
        ioNumber({ladder: true, value: this.bind('number')}),
        ioNumber({conversion: 2, value: this.bind('number')}),
      ]),
      div({class: 'row'}, [
        ioBoolean({value: this.bind('boolean'), true: 'io:circle_fill', false: 'io:circle_fill_checked'}),
        ioBoolean({value: this.bind('boolean'), icon: 'io:io'}),
      ]),
      div({class: 'row'}, [
        ioSwitch({value: this.bind('boolean')}),
        ioSwitch({value: this.bind('boolean'), icon: 'io:io'}),
      ]),
      div({class: 'row'}, [
        ioButton({label: 'Button', icon: 'io:check'}),
        ioButton({label: 'Button', icon: 'io:check', appearance: 'inset'}),
        ioButton({label: 'Button', icon: 'io:check', appearance: 'flush'}),
        ioButton({label: 'Button', icon: 'io:check', appearance: 'neutral'}),
      ]),
    ]);
  }
}
Register(IoInputsDemo);
export const ioInputsDemo = IoInputsDemo.vConstructor;

