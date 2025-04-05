import { Register, IoElement, VDOMArray, Property, AnyConstructor, IoElementArgs, ArgsWithBinding } from 'io-gui';
import './io-property-editor.js';
import { PropertyConfig } from './models/editor-config.js';
import { ioBoolean } from 'io-inputs';
import { ioPropertyEditor } from './io-property-editor.js';

export type IoObjectArgs = IoElementArgs & ArgsWithBinding<{
  value?: Record<string, any> | any[];
  properties?: string[];
  config?: Map<AnyConstructor, PropertyConfig[]>;
  labeled?: boolean;
  label?: string;
  expanded?: boolean;
}>;

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
@Register
export class IoObject extends IoElement {
  static vConstructor: (arg0?: IoObjectArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
  static get Style() {
    return /* css */`
    :host {
      /* Panel */
      display: flex;
      flex-direction: column; */
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing);
      color: var(--io_colorInput);
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
  declare config: Map<AnyConstructor, PropertyConfig[]>;

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
    elements.push(ioBoolean({
      appearance: 'neutral',
      true: label,
      false: label,
      value: this.bind('expanded')}
    ));
    if (this.expanded) {
      elements.push(ioPropertyEditor({
        value: this.value,
        properties: this.properties,
        config: this.config,
        labeled: this.labeled,
      }));
    }
    this.template(elements);
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}
export const ioObject = IoObject.vConstructor;