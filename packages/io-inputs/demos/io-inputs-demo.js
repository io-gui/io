import { Register, IoElement } from 'io-gui';

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
        ['io-field', {value: this.bind('string')}],
        ['io-field', {value: this.bind('string'), appearance: 'outset'}],
        ['io-field', {value: this.bind('string'), appearance: 'inset'}],
        ['io-field', {value: this.bind('string'), appearance: 'neutral'}],
      ]],
      ['div', {class: 'row'}, [
        ['io-field', {value: this.bind('string'), invalid: true}],
        ['io-field', {value: this.bind('string'), class: 'green'}],
        ['io-field', {value: this.bind('string'), selected: this.bind('boolean')}],
        ['io-field', {icon: 'io:io'}],
      ]],
      ['div', {class: 'row'}, [
        ['io-string', {value: this.bind('string'), placeholder: 'io-string'}],
        ['io-string', {value: this.bind('string'), placeholder: 'io-string', live: true}],
      ]],
      ['div', {class: 'row'}, [
        ['io-number', {value: this.bind('number')}],
        ['io-number', {ladder: true, value: this.bind('number')}],
        ['io-number', {conversion: 2, value: this.bind('number')}],
      ]],
      ['div', {class: 'row'}, [
        ['io-boolicon', {value: this.bind('boolean'), true: 'io:io', false: 'io:io_logo'}],
        ['io-boolean', {value: this.bind('boolean')}],
      ]],
      ['div', {class: 'row'}, [
        ['io-switch', {value: this.bind('boolean')}],
      ]],
      ['div', {class: 'row'}, [
        ['io-button', {label: 'Button', icon: 'io:check'}],
        ['io-button', {label: 'Button', icon: 'io:check', appearance: 'inset'}],
        ['io-button', {label: 'Button', icon: 'io:check', appearance: 'flush'}],
        ['io-button', {label: 'Button', icon: 'io:check', appearance: 'neutral'}],
      ]],
    ]);
  }
}

Register(IoInputsDemo);

export const ioInputsDemo = IoInputsDemo._vDOMFactory;

