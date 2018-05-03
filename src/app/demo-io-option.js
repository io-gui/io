import {Io, html} from "../io.js";

export class DemoIoOption extends Io {
  static get style() {
    return html`
      <style>
      :host > io-option {
        display: inline-block;
        border: 1px solid #eee;
        vertical-align: top;
        margin: 0.25em;
      }
      </style>
    `;
  }
  constructor() {
    super();
    this.options = [
      {label: 'one', value: 1},
      {label: 'two', value: 2},
      {label: 'three', value: 3},
      {label: 'four', value: 4}
    ];
    this.render([
      ['io-option', {options: this.options, value: 1}],
      ['io-option', {options: this.options, value: 2}],
      ['io-option', {options: this.options, value: 3}],
      ['io-option', {options: this.options, value: 4}],
      ['io-option', {options: this.options, value: 5}]
    ]);
  }
}

customElements.define('demo-io-option', DemoIoOption);
