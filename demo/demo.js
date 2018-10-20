import {html, IoElement} from "../build/io.js";

export class IoDemo extends IoElement {
  static get style() {
    return html`<style>
      :host .demo {
        margin: 1em;
        padding: 0.5em;
        background: #eee;
      }
      :host .label {
        padding: 0.25em;
        margin: -0.5em -0.5em 0.5em -0.5em;
        background: #ccc;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 'hello'
    };
  }
  constructor() {
    super();
    this.template([
      ['div', {className: 'demo'}, [
        ['div', {className: 'label'}, 'io-element'],
        ['io-element', 'io-element'],
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'label'}, 'io-interative'],
        ['io-interative', 'io-interative'],
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'label'}, 'io-node'],
        ['io-node', 'io-node'],
      ]]
    ]);
  }
}

IoDemo.Register();
