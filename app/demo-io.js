import {Io, html} from "../build/io.js";

export class DemoIo extends Io {
  static get style() {
    return html`
      <style>
      :host div > io-string,
      :host div > io-boolean,
      :host div > io-number {
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
    };

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
          ['io-string', {value: this.values.string}],
          ['io-number', {value: this.values.string}],
          ['io-boolean', {type: 'boolean', value: this.values.string}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'number'],
          ['io-string', {value: this.values.number}],
          ['io-number', {value: this.values.number}],
          ['io-boolean', {type: 'boolean', value: this.values.number}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'boolean'],
          ['io-string', {value: this.values.boolean}],
          ['io-number', {value: this.values.boolean}],
          ['io-boolean', {type: 'boolean', value: this.values.boolean}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'NaN'],
          ['io-string', {value: this.values.NaN}],
          ['io-number', {value: this.values.NaN}],
          ['io-boolean', {type: 'boolean', value: this.values.NaN}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'null'],
          ['io-string', {value: this.values.null}],
          ['io-number', {value: this.values.null}],
          ['io-boolean', {type: 'boolean', value: this.values.null}],
        ]],
        ['div', {class: 'row narrow'}, [
          ['span', {class: 'rowlabel'}, 'undefined'],
          ['io-string', {value: this.values.undef}],
          ['io-number', {value: this.values.undef}],
          ['io-boolean', {type: 'boolean', value: this.values.undef}],
        ]],
      ]],
    ]);
  }
}

customElements.define('demo-io', DemoIo);
