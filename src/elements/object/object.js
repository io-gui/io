import {IoElement, RegisterIoElement} from '../../../srcj/components/io-element.js';
import './properties.js';

export class IoObject extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-panel;
    }
    :host > io-boolean {
      align-self: stretch;
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 1.125em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > :nth-child(n+2) {
      margin-top: var(--io-spacing);
    }
    `;
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
      slotted: Array,
      role: 'region',
    };
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    const elements = [['io-boolean', {true: label, false: label, value: this.bind('expanded')}]];
    if (this.expanded) {
      elements.push(['io-properties', {
        value: this.value,
        properties: this.properties,
        config: this.config,
        labeled: this.labeled,
        slotted: this.slotted,
      }]);
    }
    this.template(elements);
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}

RegisterIoElement(IoObject);
