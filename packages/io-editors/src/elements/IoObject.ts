import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, VDOMElement, Property } from 'io-gui';
import { ioBoolean } from 'io-inputs';
import { ioPropertyEditor } from './IoPropertyEditor';
import { EditorConfig } from '../utils/EditorConfig';
import { EditorGroups } from '../utils/EditorGroups';
import { EditorWidgets } from '../utils/EditorWidgets';

export type IoObjectProps = IoElementProps & {
  value?: Record<string, any> | any[],
  properties?: string[],
  labeled?: boolean,
  label?: string,
  expanded?: WithBinding<boolean>,
  config?: EditorConfig,
  groups?: EditorGroups,
  widgets?: EditorWidgets,
};

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
@Register
export class IoObject extends IoElement {
  static vConstructor: (arg0?: IoObjectProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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

  @ReactiveProperty()
  declare value: Record<string, any> | any[];

  @ReactiveProperty({type: Array})
  declare properties: string[];

  @ReactiveProperty(true)
  declare labeled: boolean;

  @ReactiveProperty('')
  declare label: string;

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean;

  @ReactiveProperty({type: Map})
  declare config: EditorConfig;

  @ReactiveProperty({type: Map})
  declare groups: EditorGroups;

  @ReactiveProperty({type: Map})
  declare widgets: EditorWidgets;

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