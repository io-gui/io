import {html, IoElement} from "../io-core.js";

export class IoSelectable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        padding: 0.1em;
      }
      :host[orientation=vertical] {
        flex-direction: row;
      }
      :host > .io-selectable-buttons {
        border: none;
        border-radius: 0;
        background: none;
        position: relative;
        display: flex;
        flex: 0 1 auto;
      }
      :host > .io-selectable-content {
        border: 1px solid #999;
        border-radius: 2px;
        padding: 0.2em;
        background: #eee;
        flex: 1 1 auto;
        overflow: auto;
      }
      /* :host > .io-selectable-content > * {
        flex: 0 1 auto;
        width: auto !important;
      } */
      :host[orientation=horizontal] > .io-selectable-buttons {
        flex-direction: row;
        margin-bottom: -1px;
        padding: 0 0.2em;
      }
      :host[orientation=vertical] > .io-selectable-buttons {
        flex-direction: column;
        margin-right: -1px;
        padding: 0.2em 0;
      }
      :host[orientation=vertical] > .io-selectable-buttons > io-button {
        flex: 0 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host > .io-selectable-buttons > io-button:first-of-type,
      :host > .io-selectable-buttons > io-button:last-of-type {
        overflow: visible;
        text-overflow: clip;
      }
      :host > .io-selectable-buttons > io-button {
        background: #bbb;
        border-color: #999;
      }
      :host[orientation=horizontal] > .io-selectable-buttons > io-button {
        margin-left: 2px;
        border-radius: 3px 3px 0 0;
      }
      :host[orientation=vertical] > .io-selectable-buttons > io-button {
        margin-top: 1px;
        border-radius: 3px 0 0 3px;
      }
      :host > .io-selectable-buttons > io-button.io-selected {
        background: #eee;
      }
      :host[orientation=horizontal] > .io-selectable-buttons > io-button.io-selected {
        border-bottom-color: #eee;
      }
      :host[orientation=vertical] > .io-selectable-buttons > io-button.io-selected {
        border-right-color: #eee;
      }
    </style>`;
  }
  static get properties() {
    return {
      selected: Number,
      elements: Array,
      orientation: {
        value: 'horizontal',
        reflect: true,
      },
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
        title: label,
        value: i,
        action: this.select,
        className: this.selected === i ? 'io-selected' : ''
      }]);
    }
    this.template([
      ['div', {className: 'io-selectable-buttons'}, buttons],
      ['div', {className: 'io-selectable-content'}, [this.elements[this.selected]]],
    ]);
  }
}

IoSelectable.Register();
