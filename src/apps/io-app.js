import {Io} from "../io/io.js"
import {html} from "../io/ioutil.js"
import {IoBoolean} from "../io/io-value/io-boolean.js"
import {IoNumber} from "../io/io-value/io-number.js"
import {IoObject} from "../io/io-object/io-object.js"
import {IoOption} from "../io/io-option/io-option.js"

export class IoApp extends Io {
  static get style() {
    return html`
      <style>
      :host {
        font-family: "Lucida Grande", sans-serif;
      }
      :host div > io-string,
      :host div > io-option,
      :host div > io-boolean,
      :host div > io-number,
      :host div > io-object {
        border: 1px solid #eee;
        vertical-align: top;
        margin: 0.25em;
      }
      :host div.row {
        display: flex;
        flex-direction: row;
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
      :host div.area {
        background: rgba(128,128,128,0.2);
      }
      :host .narrow {
        width: 22em;
      }
      </style>
    `;
  }
  constructor() {
    super();
    this.values = {
      "number": 1337,
      "string": 'hello',
      "boolean": true,
      "null": null,
      "NaN": NaN,
      "undef": undefined,
      "array": [1,2,3,4,"apple"]
    }
    var suboptions1 = [
      {label: 'sub_sub_one', value: 1, action: console.log},
      {label: 'sub_sub_two', value: 2, action: console.log},
      {label: 'sub_sub_three', value: 3, action: console.log},
      {label: 'sub_sub_four', value: 4, action: console.log},
      {label: 'sub_sub_five', value: 5, action: console.log}
    ]
    var suboptions0 = [
      {label: 'sub_one', options: suboptions1},
      {label: 'sub_two', options: suboptions1},
      {label: 'sub_three', options: suboptions1},
      {label: 'sub_four', options: suboptions1},
      {label: 'sub_five', options: suboptions1}
    ]
    var longOptions = [];
    // TODO: investigate performance issue
    for (var i = 0; i < 10; i++) {
      let r = Math.random();
      longOptions[i] = {label: String(r), value: r, action: console.log, icon: 'ξ', hint: 'log'};
    }
    this.menuoptions = [
      {label: 'one', options: suboptions0},
      {label: 'two', value: 2, action: console.log},
      {label: 'three', value: 3, action: console.log},
      {label: 'four', value: 4, action: console.log},
      {label: 'five', options: suboptions0},
      {label: 'long', options: longOptions, hint: 'list', icon: '⚠'}
    ]
    this.options = [
      {label: 'one', value: 1},
      {label: 'two', value: 2},
      {label: 'three', value: 3},
      {label: 'four', value: 4}
    ]
    this.values.object = this.values;

    this.render([
      ['div', {className: 'demo'}, [
        ['h3', 'io-string io-number and io-boolean.'],
        ['io-string', {value: this.values.string}],
        ['io-number', {value: this.values.number, step: 0.1}],
        ['io-boolean', {value: this.values.boolean}],
      ]],
      ['div', {className: 'demo'}, [
        ['h3', 'matrix with various data types and type elements.'],
        ['div', {className: 'row narrow header'}, [
          ['span', {className: 'rowlabel'}],
          ['span', 'string'],
          ['span', 'number'],
          ['span', 'boolean'],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'string'],
          ['io-string', {value: this.values.string}],
          ['io-number', {value: this.values.string}],
          ['io-boolean', {type: 'boolean', value: this.values.string}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'number'],
          ['io-string', {value: this.values.number}],
          ['io-number', {value: this.values.number}],
          ['io-boolean', {type: 'boolean', value: this.values.number}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'boolean'],
          ['io-string', {value: this.values.boolean}],
          ['io-number', {value: this.values.boolean}],
          ['io-boolean', {type: 'boolean', value: this.values.boolean}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'NaN'],
          ['io-string', {value: this.values.NaN}],
          ['io-number', {value: this.values.NaN}],
          ['io-boolean', {type: 'boolean', value: this.values.NaN}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'null'],
          ['io-string', {value: this.values.null}],
          ['io-number', {value: this.values.null}],
          ['io-boolean', {type: 'boolean', value: this.values.null}],
        ]],
        ['div', {className: 'row narrow'}, [
          ['span', {className: 'rowlabel'}, 'undefined'],
          ['io-string', {value: this.values.undef}],
          ['io-number', {value: this.values.undef}],
          ['io-boolean', {type: 'boolean', value: this.values.undef}],
        ]],
      ]],
      ['div', {className: 'demo'}, [
        ['h3', 'io-option'],
        ['io-option', {options: this.options, value: 1}],
        ['io-option', {options: this.options, value: 2}],
        ['io-option', {options: this.options, value: 3}],
        ['io-option', {options: this.options, value: 4}],
        ['io-option', {options: this.options, value: 5}],
      ]],
      ['div', {className: 'demo area'}, [
        ['h3', 'io-menu (click to expand)'],
        ['io-menu', {options: this.menuoptions, position: 'pointer'}]
      ]],
      ['div', {className: 'demo'}, [
        ['h3', 'io-object with various property types.'],
        ['io-object', {value: this.values, expanded: true, labeled: true}],
        ['io-object', {value: this.values, expanded: true, labeled: true}]
      ]]
    ]);
  }
}

customElements.define('io-app', IoApp);
