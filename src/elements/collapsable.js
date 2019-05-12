import {html, IoElement} from "../core/element.js";

export class IoCollapsable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        border: var(--io-theme-frame-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        background: var(--io-theme-frame-bg);
        transition: background-color 0.4s;
      }
      :host:focus-within {
        outline: none;
        background: var(--io-theme-focus-bg);
      }
      :host > io-boolean {
        border: none;
        border-radius: 0;
        background: none;
        padding: 0;
      }
      :host > io-boolean:hover {
        background: inherit;
      }
      :host > io-boolean:focus {
        border: none;
      }
      :host > io-boolean::before {
        content: '▸';
        display: inline-block;
        width: 0.65em;
        margin: 0 0.25em;
      }
      :host:not([expanded]) > io-boolean {
        line-height: 1em;
      }
      :host[expanded] > io-boolean {
        /* margin-bottom: var(--io-theme-padding); */
      }
      :host[expanded] > io-boolean::before{
        content: '▾';
      }
      :host > .io-collapsable-content {
        display: block;
        overflow: auto;
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        background: var(--io-theme-content-bg);
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
      (this.expanded && this.elements.length) ? ['div', {className: 'io-collapsable-content'}, this.elements] : null
    ]);
  }
}

IoCollapsable.Register();
