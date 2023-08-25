import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import './io-properties.js';

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.
 **/
@RegisterIoElement
export class IoObject extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      /* Panel */
      display: flex;
      flex-direction: column; */
      padding-left: var(--iotSpacing);
      padding-right: var(--iotSpacing);
      color: var(--iotColorField);
      background-color: var(--iotBackgroundColor);
    }
    :host > io-boolean {
      padding-left: 0;
      padding-right: 0;
      align-self: stretch;
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 0.75em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    `;
  }

  @Property({})
  declare value: Record<string, any> | any[];

  @Property({type: Array})
  declare properties: string[];

  @Property({type: Object})
  declare config: Record<string, any>;

  @Property({type: Array})
  declare slotted: VDOMArray;

  @Property(true)
  declare labeled: boolean;

  @Property('')
  declare label: string;

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Property('region')
  declare role: string;

  changed() {
    const label = this.label || this.value.constructor.name;
    const elements: VDOMArray[] = [];
    elements.push(['io-boolean', {
      appearance: 'neutral',
      true: label,
      false: label,
      value: this.bind('expanded')}
    ]);
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
