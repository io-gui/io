import {html} from "../../io.js";
import {IoPanel} from "../../io-core.js";
import "./properties.js";

export class IoObject extends IoPanel {
  static get Style() {
    return html`<style>
    :host > io-boolean {
      text-align: left;
      align-self: stretch;
      width: auto;
    }
    :host > io-properties {
      display: grid !important;
      padding: calc(2 * var(--io-spacing)) var(--io-spacing) !important;
    }
    :host:not([expanded]) > io-properties {
      display: none;
    }
    </style>`;
  }
  static get Properties() {
    return {
      value: Object,
      properties: Array,
      config: Object,
      labeled: true,
      label: {
        reflect: 1,
      },
      expanded: {
        type: Boolean,
        reflect: 1,
      },
      role: 'region',
    };
  }
  _onButtonValueSet(event) {
    this.set('expanded', event.detail.value);
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    this.template([
      ['io-boolean', {true: '▾ ' + label, false: '▸ ' + label, value: this.expanded, 'on-value-set': this._onButtonValueSet}],
      this.expanded ? [
        ['io-properties', {
          class: 'io-frame',
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
