import {html, IoElement, IoStorage as $} from "../../io.js";

export class IoDemoObject extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      max-width: 32em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    :host > :nth-child(2n+1) {
      text-align: right;
    }
    @media only screen and (max-width: 400px) {
      :host {
        grid-template-columns: 0 1fr !important;
      }
      :host > :nth-child(2n+1) {
        visibility: hidden;
      }
    }

    :host > *,
    :host .io-row > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host .io-column > *:not(:last-child) {
      margin-bottom: var(--io-spacing);
    }
    </style>`;
  }
  static get Properties() {
    return {
      class: 'io-table2',
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
  constructor(props) {
    super(props);

    this.template([
      ['io-item', {label: 'io-properties'}],
      ['div', {class: 'io-column'}, [
        ['io-properties', {value: this, properties: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined']}], //TODO: labeled?
      ]],
      ['io-item', {label: 'io-object'}],
      ['div', {class: 'io-column'}, [
        ['io-object', {value: this, label: 'io-object (filtered properties)', expanded: $('io-object1', true), properties: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined']}], //TODO: labeled?
        ['io-object', {value: this, label: 'io-object (configured property)', expanded: $('io-object2', true), properties: ['number'], config: {'number': ['io-slider', {step: 0.1}]}}],
      ]],
      ['io-item', {label: 'io-inspector'}],
      ['div', {class: 'io-column'}, [
        ['io-inspector', {value: this, expanded: ['properties']}],
      ]],
    ]);
  }
}

IoDemoObject.Register();
