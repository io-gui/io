import { IoElement, RegisterIoElement } from '../../core/element.js';
import './io-properties.js';

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.
 *
 * <io-element-demo element="io-object" properties='{"expanded": true, "label": "Custom Object Label", "labeled": true, "value": {"hello": "world"}}'></io-element-demo>
 **/
@RegisterIoElement
export class IoObject extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      /* Panel */
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      border-radius: var(--iotBorderRadius);
      border: var(--iotBorder);
      border-color: var(--iotBorderColorOutset);
      color: var(--iotColorField);
      background-color: var(--iotBackgroundColorDimmed);
      padding: var(--iotSpacing);
      /*  */
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      flex: 0 1 calc(var(--iotLineHeight) * 17.5);
    }
    :host io-properties {
      flex-basis: auto;
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
      margin-top: var(--iotSpacing);
    }
    `;
  }
  static get Properties(): any {
    return {
      value: {
        type: Object
      },
      properties: Array,
      config: Object,
      labeled: true,
      label: {
        reflect: true,
      },
      expanded: {
        type: Boolean,
        reflect: true,
      },
      slotted: Array,
      role: 'region',
    };
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    const elements: any = [['io-boolean', {true: label, false: label, value: this.bind('expanded')}]];
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
