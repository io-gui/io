import {html, IoElement} from "../core/element.js";

export class IoCollapsable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > io-boolean {
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
    </style>`;
  }
  static get properties() {
    return {
      label: String,
      expanded: {
        type: Boolean,
        value: true,
        reflect: true
      },
      elements: Array
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
