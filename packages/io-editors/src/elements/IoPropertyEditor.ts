import { IoElement, Property, Register, IoElementArgs, Node, span, div, ArgsWithBinding, VDOMElement } from 'io-gui';
import { getEditorConfig, EditorConfig } from '../models/EditorConfig';

export type IoPropertyEditorArgs = IoElementArgs & ArgsWithBinding<{
  value?: Record<string, any> | any[];
  properties?: string[];
  config?: EditorConfig;
  labeled?: boolean;
}>;

/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
@Register
export class IoPropertyEditor extends IoElement {
  static vConstructor: (arg0?: IoPropertyEditorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
    }
    :host > .row {
      display: flex;
      flex-direction: row;
    }
    :host > .row > span {
      margin-top: calc(var(--io_spacing) + var(--io_borderWidth));
    }
    :host > .row > span:after {
      display: inline-block;
      padding-right: var(--io_spacing2);
      content: ':';
    }
    :host io-object > io-property-editor {
      padding-left: var(--io_lineHeight);
    }
    `;
  }

  @Property('debounced')
  declare reactivity: string;

  // TODO: remove any[] make array editor
  @Property({type: Object})
  declare value: Record<string, any> | any[];

  @Property({type: Array})
  declare properties: string[];

  @Property({type: Map})
  declare config: EditorConfig;

  @Property(true)
  declare labeled: boolean;

  _onValueInput(event: CustomEvent) {
    if (event.detail.object) return; // TODO: unhack/remove?
    const item: any = event.composedPath()[0];
    if (item === this as any) return;
    event.stopImmediatePropagation();

    const prop = Object.keys(this.$).find(key => this.$[key] === event.target) as keyof typeof this.value | undefined;

    if (prop !== undefined) {
      const value = event.detail.value;
      const oldValue = event.detail.oldValue;
      this.value[prop] = value;


      if (!(this.value as Node)._isNode) {
        const detail = {object: this.value, property: prop, value: value, oldValue: oldValue};
        this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
      }
    } else {
      debug: console.warn('IoPropertyEditor: "value-input" recieved from an input without a property id');
    }
  }
  valueMutated() {
    this.debounce(this.changed);
  }
  changed() {
    const config = getEditorConfig(this.value, this.config);
    const elements = [];
    const properties = this.properties.length ? this.properties : Object.keys(this.value);

    for (let i = 0; i < properties.length; i++) {
      if (Object.prototype.hasOwnProperty.call(this.value, properties[i])) {
        const c = properties[i] as keyof typeof this.value;
        const value = this.value[c];
        const tag = config[c]!.name;
        const props = config[c]!.props as (IoElementArgs | undefined) || {};
        const finalProps: any = {$: c, value: value, '@value-input': this._onValueInput};
        Object.assign(finalProps, props);
        elements.push(div({class: 'row'}, [
          this.labeled ? span(c) : null,
          {name: tag, props: finalProps},
        ]));
      } else {
        debug: console.warn(`IoPropertyEditor: property "${properties[i]}" not found in value`);
      }
    }
    this.template(elements);
  }
  /**
   * Returns a JSON representation of the property editor. This feature is used in testing.
   * @return {Object} JSON representation of the property editor.
   */
  toJSON() {
    const json = Object.assign({}, super.toJSON(), this);
    return json;
  }
}
export const ioPropertyEditor = IoPropertyEditor.vConstructor;