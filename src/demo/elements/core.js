import {html, IoElement, IoStorageFactory as $} from "../../io.js";

const boolean = $({key: 'demo:boolean', value: false});
const string = $({key: 'demo:string', value: 'Hello io!'});
const number = $({key: 'demo:number', value: 0});

export class IoDemoCore extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      max-width: 32em;
      padding: var(--io-spacing);
    }
    :host .io-table5 {
      max-width: 32em;
    }
    :host .io-table5 > * {
      width: auto;
    }
    :host > *,
    :host .io-row > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host > *,
    :host .io-column > *:not(:last-child) {
      margin-bottom: var(--io-spacing);
    }
    </style>`;
  }
  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  setNumber(value) {
    number.value = value;
  }
  constructor(props) {
    super(props);
    this.setNumber = this.setNumber.bind(this);

    this.template([
      ['div', {class: 'io-table5 table'}, [
        ['io-string', {value: string}],
        ['io-number', {ladder: true, conversion: 2, value: number}],
        ['io-boolicon', {value: boolean}],
        ['io-switch', {value: boolean}],
        ['io-boolean', {value: boolean}],
      ]],
      ['div', {class: 'io-row'}, [
        ['io-slider', {value: number, horizontal: false, min: 0, max: 2, step: 0.25}],
        ['div', {class: 'io-column'}, [
          ['io-slider', {value: number, min: 0.05, step: 0.1}],
          ['io-slider', {value: number, min: 0, max: 2, step: 1}],
          ['io-slider', {value: number, min: -1.33, max: 3.5, step: 0.8}],
          ['io-number-slider', {value: number, min: -0.25, max: 0.25, step: 0.01}],
        ]],
      ]],
      ['div', {class: 'io-table3 table'}, [
        ['io-option-menu', {options: [
          {label: 'negative one', value: -1},
          {label: 'zero', value: 0},
          {label: 'half', value: 0.5},
          {label: 'one', value: 1},
          {label: 'two', value: 2},
          {label: 'three', value: 3},
          {label: 'four', value: 4},
          {label: 'leet', value: 1337},
        ], value: number}],
        ['io-option-menu', {options: [ -1, 0, 1, 2, 3, 4, 1337], value: number}],
        ['io-button', {label: 'set 0.5', action: this.setNumber, value: 0.5}],
      ]],
    ]);
  }
}

IoDemoCore.Register();
