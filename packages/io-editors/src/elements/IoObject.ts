import { Register, IoElement, Property, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
import { ioBoolean } from 'io-inputs';
import { ioPropertyEditor } from './IoPropertyEditor';
import { EditorConfig } from '../utils/EditorConfig';
import { EditorGroups } from '../utils/EditorGroups';
import { EditorWidgets } from '../utils/EditorWidgets';

export type IoObjectArgs = IoElementArgs & ArgsWithBinding<{
  value?: Record<string, any> | any[];
  properties?: string[];
  config?: EditorConfig;
  groups?: EditorGroups;
  widgets?: EditorWidgets;
  labeled?: boolean;
  label?: string;
  expanded?: boolean;
}>;

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
@Register
export class IoObject extends IoElement {
  static vConstructor: (arg0?: IoObjectArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-boolean {
      padding: var(--io_spacing) var(--io_spacing2);
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
    :host > io-property-editor {
      margin: var(--io_spacing);
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
    }
    `;
  }

  @Property({})
  declare value: Record<string, any> | any[];

  @Property({type: Array})
  declare properties: string[];

  @Property({type: Map})
  declare config: EditorConfig;

  @Property({type: Map})
  declare groups: EditorGroups;

  @Property({type: Map})
  declare widgets: EditorWidgets;

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
    const elements: VDOMElement[] = [];
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
        groups: this.groups,
        widgets: this.widgets,
        labeled: this.labeled,
      }));
    }
    this.template(elements);
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}
export const ioObject = IoObject.vConstructor;