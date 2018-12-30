import {html, IoElement} from "../core/element.js";

export class IoCollapsable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid #999;
        border-radius: 3px;
        background: #ccc;
      }
      :host > io-boolean {
        border: none;
        border-radius: 0;
        background: none;
      }
      :host > io-boolean::before {
        content: '▸';
        display: inline-block;
        width: 0.65em;
        margin: 0 0.25em;
      }
      :host[expanded] > io-boolean::before{
        content: '▾';
      }
      :host > :nth-child(2) {
        display: block;
        border: 1px solid #999;
        border-radius: 3px;
        padding: 2px;
        background: #eee;
      }
    </style>`;
  }
  static get properties() {
    return {
      label: String,
      expanded: {
        type: Boolean,
        reflect: true
      },
      elements: Array,
    };
  }
  changed() {
    this.template([
      ['io-boolean', {true: this.label, false: this.label, value: this.bind('expanded')}],
      this.expanded ? ['div', this.elements] : null
    ]);
  }
}

IoCollapsable.Register();
