import {html, IoElement} from "../src/io.js";

export class IoDemo extends IoElement {
  static get style() {
    return html`<style>
      :host .demo {
        margin: 1em;
        padding: 0.5em;
        background: #eee;
      }
      :host .demoLabel {
        padding: 0.25em;
        margin: -0.5em -0.5em 0.5em -0.5em;
        background: #ccc;
      }
      :host .row > *  {
        flex: 1;
      }
      :host .row {
        display: flex;
        width: 22em;
      }
      :host .label {
        color: rgba(128, 122, 255, 0.75);
      }
      :host .padded {
        padding: 1em;
      }
      :host io-string,
      :host io-boolean,
      :host io-button,
      :host io-number {
        background-color: #ddd;
        margin: 1px;
      }
    </style>`;
  }
  static get properties() {
    return {
      number: 0,
      string: "hello",
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined
    };
  }
  setNumber(value) {
    this.number = value;
  }
  constructor() {
    super();
    this.serfRef = this;
    this.template([
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-string / io-number / io-boolean'],
        ['div', {className: 'row label'}, [
          ['span'],
          ['span', 'io-string'],
          ['span', 'io-number'],
          ['span', 'io-boolean'],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'string'],
          ['io-string', {id: 'string', value: this.bind('string')}],
          ['io-number', {value: this.bind('string')}],
          ['io-boolean', {type: 'boolean', value: this.bind('string')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'number'],
          ['io-string', {value: this.bind('number')}],
          ['io-number', {id: 'number', value: this.bind('number')}],
          ['io-boolean', {type: 'boolean', value: this.bind('number')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'boolean'],
          ['io-string', {value: this.bind('boolean')}],
          ['io-number', {value: this.bind('boolean')}],
          ['io-boolean', {id: 'boolean', type: 'boolean', value: this.bind('boolean')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'NaN'],
          ['io-string', {value: this.bind('NaN')}],
          ['io-number', {value: this.bind('NaN')}],
          ['io-boolean', {type: 'boolean', value: this.bind('NaN')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'null'],
          ['io-string', {value: this.bind('null')}],
          ['io-number', {value: this.bind('null')}],
          ['io-boolean', {type: 'boolean', value: this.bind('null')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'undefined'],
          ['io-string', {value: this.bind('undefined')}],
          ['io-number', {value: this.bind('undefined')}],
          ['io-boolean', {type: 'boolean', value: this.bind('undefined')}],
        ]]
      ]],
      ['div', {className: 'demo button'}, [
        ['div', {className: 'demoLabel'}, 'io-button'],
        ['io-button'],
        ['io-button', {label: 'set 0', action: this.setNumber, value: 0}],
        ['io-button', {label: 'set 1', action: this.setNumber, value: 1}],
        ['io-button', {label: 'set 2', action: this.setNumber, value: 2}],
        ['io-button', {label: 'set 3', action: this.setNumber, value: 3}],
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-object'],
        ['io-object', {value: this, expanded: true, labeled: true}]
      ]]
    ]);
  }
}

IoDemo.Register();
