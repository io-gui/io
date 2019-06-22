import {html, IoElement} from "../core/element.js";

export class IoCollapsable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        border: var(--io-outset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-outset-border-color);
        padding: var(--io-spacing);
        background: var(--io-background-color-dark);
        background-image: var(--io-collapsable-gradient);
        transition: background-color 0.4s;
      }
      :host > io-boolean {
        color: var(--io-color);
        border-color: transparent;
        background: none;
        padding: 0;
        padding-right: 0.5em !important;;
      }
      :host > io-boolean:hover {
        background: none;
        border-image: none;
      }
      :host > io-boolean::before {
        display: inline-block;
        content: '▸';
        line-height: 1em;
        width: 0.5em;
        padding: 0 0.5em 0 0;
      }
      :host[expanded] > io-boolean::before{
        content: '▾';
      }
      :host > .io-content {
        display: flex;
        flex-direction: column;
        overflow: auto;
        border-radius: var(--io-border-radius);
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        padding: var(--io-spacing);
        background: var(--io-background-color);
      }
      :host:not([expanded]) > .io-content {
        display: none;
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
      role: 'region',
    };
  }
  _onButtonValueSet(event) {
    this.set('expanded', event.detail.value);
  }
  changed() {
    this.template([
      ['io-boolean', {true: this.label, false: this.label, value: this.expanded, 'on-value-set': this._onButtonValueSet}],
      ['div', {id: 'content', class: 'io-content'}, (this.expanded && this.elements.length) ? this.elements : [null]],
    ]);
    this.children[0].setAttribute('aria-expanded', String(this.expanded));
  }
}

IoCollapsable.Register();
