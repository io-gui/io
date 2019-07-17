import {html, IoElement} from "../../io.js";
import "./properties.js";

export class IoObject extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      border: var(--io-outset-border);
      border-radius: var(--io-border-radius);
      border-color: transparent;
      padding: var(--io-spacing);
      background: none;
    }
    :host > io-boolean {
      color: var(--io-color);
      border-color: transparent;
      background: none;
      padding: 0;
      padding-right: 0.5em !important;
      width: inherit;
      text-align: left;
      border: none;
    }
    :host > io-boolean[value] {
      margin-bottom: var(--io-spacing);
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
  static get Attributes() {
    return {
      label: {
        notify: true,
      },
      expanded: {
        type: Boolean,
        notify: true,
      },
      role: 'region',
    };
  }
  static get Properties() {
    return {
      value: Object,
      properties: Array,
      config: Object,
      labeled: true,
    };
  }
  _onButtonValueSet(event) {
    this.set('expanded', event.detail.value);
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    this.template([
      ['io-boolean', {true: label, false: label, value: this.expanded, 'on-value-set': this._onButtonValueSet}],
      this.expanded ? [
        ['io-properties', {
          class: 'io-content',
          value: this.value,
          properties: this.properties,
          config: this.config,
          labeled: this.labeled,
        }]
      ] : null
    ]);
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}

IoObject.Register();
