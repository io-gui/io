import { Register, IoElement, VDOMArray, Property, Constructor } from 'io-gui';
import './io-property-editor.js';
import { PropertyConfig } from './models/editor-config.js';

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.
 **/
@Register
export class IoObject extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      /* Panel */
      display: flex;
      flex-direction: column; */
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing);
      color: var(--io_colorField);
      background-color: var(--io_bgColor);
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

  @Property({type: Map})
  declare config: Map<Constructor, PropertyConfig[]>;

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
      elements.push(['io-property-editor', {
        value: this.value,
        properties: this.properties,
        config: this.config,
        labeled: this.labeled,
      }]);
    }
    this.template(elements);
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}
