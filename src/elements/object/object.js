import {html, IoElement} from "../../io.js";
import {IoThemeSingleton as mixin} from "../../io-elements-core.js";
import "./properties.js";

export class IoObject extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      ${mixin.panel}
    }
    :host > io-boolean {
      text-align: left;
      align-self: stretch;
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
      ['io-boolean', {class: 'io-item', true: '▾ ' + label, false: '▸ ' + label, value: this.expanded, 'on-value-set': this._onButtonValueSet}],
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
