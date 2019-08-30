import {html, IoElement} from "../../io.js";

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
  static get Properties() {
    return {
      number: 0.0,
      string: 'hello',
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
    };
  }
  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  setNumber(value) {
    this.number = value;
  }
  constructor(props) {
    super(props);
    this.setNumber = this.setNumber.bind(this);

    this.template([
      ['div', {class: 'io-table5 table'}, [
        ['io-string', {value: this.bind('string')}],
        // ['io-number', {value: this.bind('string')}],
        // ['io-boolicon', {value: this.bind('string')}],
        // ['io-switch', {value: this.bind('string')}],
        // ['io-boolean', {value: this.bind('string')}],
        // ['io-string', {value: this.bind('number')}],
        ['io-number', {ladder: true, conversion: 2, value: this.bind('number')}],
        // ['io-boolicon', {value: this.bind('number')}],
        // ['io-switch', {value: this.bind('number')}],
        // ['io-boolean', {value: this.bind('number')}],
        // ['io-string', {value: this.bind('boolean')}],
        // ['io-number', {value: this.bind('boolean')}],
        ['io-boolicon', {value: this.bind('boolean')}],
        ['io-switch', {value: this.bind('boolean')}],
        ['io-boolean', {value: this.bind('boolean')}],
      ]],
      ['div', {class: 'io-row'}, [
        ['io-slider', {value: this.bind('number'), horizontal: false, min: 0, max: 2, step: 0.01}],
        ['div', {class: 'io-column'}, [
          ['io-slider', {value: this.bind('number'), min: 0.05, step: 0.1}],
          ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
          ['io-slider', {value: this.bind('number'), min: -1.33, max: 3.5, step: 0.8}],
          ['io-number-slider', {value: this.bind('number'), min: -0.25, max: 0.25, step: 0.01}],
          // ['io-number-slider', {value: this.bind('string'), min: -0.25, max: 0.25, step: 0.01}],
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
        ], value: this.bind('number')}],
        ['io-option-menu', {options: [ -1, 0, 1, 2, 3, 4, 1337], value: this.bind('number')}],
        ['io-button', {label: 'set 0.5', action: this.setNumber, value: 0.5}],
      ]],
    ]);
  }
}

IoDemoCore.Register();
