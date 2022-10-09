import { IoElement, RegisterIoElement } from '../build/iogui.js';
import '../build/iogui.js';

export class IoDemoElementsCore extends IoElement {
  static get Style() {
    return /* css */`
      :host > div {
        display: flex;
        width: 460px;
        margin: var(--io-spacing) 0;
        padding: var(--io-spacing) 0;
        border: var(--io-border);
        border-color: rgba(128, 128, 128, .125);
      }
      :host > div > :nth-child(1) {
        flex: 0 0 140px;
        text-align: right;
        margin-right: var(--io-spacing);
      }
      :host > div > io-label,
      :host > div > io-icon {
        margin-top: var(--io-spacing);
      }
    `;
  }
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
