import { IoElement, RegisterIoElement } from '../build/iogui.js';

export class IoDemoElementsCore extends IoElement {
  static get Properties() {
    return {
      string: 'Hello IoGUI!',
      number: 0,
      boolean: false,
    };
  }
  constructor(props) {
    super(props);

    this.template([
      ['div', [
        ['io-label', {label: 'icon'}],
        ['io-icon', {icon: 'icons:io'}],
      ]],
      ['div', [
        ['io-label', {label: 'icon [stroke]'}],
        ['io-icon', {icon: 'icons:io', stroke: true}],
      ]],
      ['div', [
        ['io-label', {label: 'field'}],
        ['io-field', {value: this.bind('string')}],
      ]],
      ['div', [
        ['io-label', {label: 'string'}],
        ['io-string', {value: this.bind('string')}],
      ]],
      ['div', [
        ['io-label', {label: 'string [live]'}],
        ['io-string', {value: this.bind('string'), live: true}],
      ]],
      ['div', [
        ['io-label', {label: 'number'}],
        ['io-number', {value: this.bind('number')}],
      ]],
      ['div', [
        ['io-label', {label: 'number [ladder]'}],
        ['io-number', {ladder: true, value: this.bind('number')}],
      ]],
      ['div', [
        ['io-label', {label: 'number [x2]'}],
        ['io-number', {conversion: 2, value: this.bind('number')}],
      ]],
      ['div', [
        ['io-label', {label: 'boolean'}],
        ['io-boolean', {value: this.bind('boolean')}],
      ]],
      ['div', [
        ['io-label', {label: 'boolean [icon]'}],
        ['io-boolean', {value: this.bind('boolean'), true: 'icons:box_fill_checked', false: 'icons:box'}],
      ]],
      ['div', [
        ['io-label', {label: 'switch'}],
        ['io-switch', {value: this.bind('boolean')}],
      ]],
      ['div', [
        ['io-label', {label: 'button'}],
        ['io-button', {label: 'Button', icon: 'icons:check'}],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsCore);
