import {Io} from "../../io.js";

export class IoDemo extends Io {
  static get style() {
    return html`<style>
      :host div > io-string,
      :host div > io-boolean,
      :host div > io-number {
        border: 1px solid #eee;
        margin: 0.25em;
      }
      :host div > io-option,
      :host div > io-object {
        display: inline-block;
        border: 1px solid #eee;
        vertical-align: top;
        margin: 0.25em;
      }
      :host div.demo {
        margin: 1em;
      }
      :host div.header, span.rowlabel {
        color: rgba(128, 122, 255, 0.75);
      }
      :host span.rowlabel {
        text-align: right;
        padding-right: 0.2em;;
      }
      :host div.row > *  {
        flex: 1;
        margin: 2px;
      }
      :host .narrow {
        display: flex;
        width: 22em;
      }
    </style>`;
  }
  static get properties() {
    return {
      number: 1337,
      string: "hello",
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      array: [1,2]
    }
  }
  constructor() {
    super();
    this.render([
      ['div', {class: 'demo'}, [
        ['div', {class: 'row narrow header'}, [
          ['span', {class: 'rowlabel'}],
          ['span', 'string'],
          ['span', 'number'],
          ['span', 'boolean'],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'string'],
          ['io-string', {value: this.bind('string')}],
          ['io-number', {value: this.bind('string')}],
          ['io-boolean', {type: 'boolean', value: this.bind('string')}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'number'],
          ['io-string', {value: this.bind('number')}],
          ['io-number', {value: this.bind('number')}],
          ['io-boolean', {type: 'boolean', value: this.bind('number')}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'boolean'],
          ['io-string', {value: this.bind('boolean')}],
          ['io-number', {value: this.bind('boolean')}],
          ['io-boolean', {type: 'boolean', value: this.bind('boolean')}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'NaN'],
          ['io-string', {value: this.bind('NaN')}],
          ['io-number', {value: this.bind('NaN')}],
          ['io-boolean', {type: 'boolean', value: this.bind('NaN')}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'null'],
          ['io-string', {value: this.bind('null')}],
          ['io-number', {value: this.bind('null')}],
          ['io-boolean', {type: 'boolean', value: this.bind('null')}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'undefined'],
          ['io-string', {value: this.bind('undefined')}],
          ['io-number', {value: this.bind('undefined')}],
          ['io-boolean', {type: 'boolean', value: this.bind('undefined')}],
        ]],
      ]],
      ['div', {class: 'demo'}, [
        ['span', {class: 'rowlabel'}, 'io-option'],
        ['io-option', {options: [
          {label: 'one', value: 1},
          {label: 'two', value: 2},
          {label: 'three', value: 3},
          {label: 'four', value: 4}
        ], value: 1}],
      ]],
      ['div', {class: 'demo'}, [
        ['span', {class: 'rowlabel'}, 'io-object'],
        ['io-object', {label: 'Obj', value: {
          "number": 1337,
          "string": 'hello',
          "boolean": true,
          "null": null,
          "NaN": NaN,
          "undef": undefined,
          "array": [1,2,3,4,"apple"]
        }, expanded: true, labeled: true}]
      ]]
    ]);
  }
}

IoDemo.Register();
