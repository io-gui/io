import {html, IoElement} from "../io-core.js";

export class IoSelectable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid #999;
        border-radius: 3px;
        padding: 1px;
        background: #ccc;
      }
      :host > .io-selectable-buttons {
        border: none;
        border-radius: 0;
        background: none;
        position: relative;
        margin-bottom: -1px;
      }
      :host > .io-selectable-buttons > io-button {
        background: #bbb;
        margin-left: 2px;
        border-radius: 3px 3px 0 0;
        border-color: #999;
      }
      :host > .io-selectable-buttons > io-button.io-selected {
        background: #eee;
        border-bottom-color: #eee;
      }
      :host > .io-selectable-content {
        display: block;
        border: 1px solid #999;
        border-radius: 2px;
        padding: 0.2em;
        background: #eee;
      }
    </style>`;
  }
  static get properties() {
    return {
      selected: Number,
      elements: Array,
    };
  }
  select(id) {
    this.selected = id;
  }
  changed() {
    const buttons = [];
    for (var i = 0; i < this.elements.length; i++) {
      const props = this.elements[i][1] || {};
      const label = props.label || props.title || props.name || this.elements[i][0];
      buttons.push(['io-button', {
        label: label,
        value: i,
        action: this.select,
        className: this.selected === i ? 'io-selected' : ''
      }]);
    }
    this.template([
      ['div', {className: 'io-selectable-buttons'}, buttons],
      ['div', {className: 'io-selectable-content'}, [this.elements[this.selected]]]
    ]);
  }
}

IoSelectable.Register();
