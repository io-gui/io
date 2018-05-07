import {Io, html} from "../io.js";

export class DemoIoObject extends Io {
  static get style() {
    return html`
      <style>
      :host > io-object {
        border: 1px solid #eee;
        vertical-align: top;
        margin: 0.25em;
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
    this.values.object = this.values;
    this.render([
      ['io-object', {value: this.values, expanded: true, labeled: true}],
      ['io-object', {value: this.values, expanded: true, labeled: true}],
      ['io-object', {value: this.values, expanded: true, labeled: true}]
    ]);
  }
}

DemoIoObject.Register();
