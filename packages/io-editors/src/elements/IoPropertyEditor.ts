import { IoElement, Property, Register, IoElementArgs, Node, span, div, ArgsWithBinding, VDOMElement, Storage as $ } from 'io-gui';
import { getEditorConfig, EditorConfig } from '../utils/EditorConfig';
import { EditorGroups, getEditorGroups } from '../utils/EditorGroups';
import { ioObject } from './IoObject';

export type IoPropertyEditorArgs = IoElementArgs & ArgsWithBinding<{
  value?: Record<string, any> | any[];
  properties?: string[];
  config?: EditorConfig;
  groups?: EditorGroups;
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
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > .row {
      display: flex;
      flex-direction: row;
      margin: var(--io_spacing);
      padding: var(--io_spacing) 0;
      border-radius: var(--io_borderRadius);
      margin-bottom: 0;
      background-color: var(--io_bgColorDimmed);
    }
    :host > .row:last-of-type {
      margin-bottom: var(--io_spacing);
    }
    :host > .row > span {
      margin: var(--io_spacing);
      margin-left: var(--io_spacing2);
      text-wrap: nowrap;
    }
    :host > .row > span:after {
      display: inline-block;
      margin-left: var(--io_spacing);
      opacity: 0.5;
      content: ':';
    }
    :host io-object {
      margin-right: var(--io_spacing);
    }
    `;
  }

  @Property('debounced')
  declare reactivity: string;

  @Property({type: Object})
  declare value: Object;

  @Property({type: Array})
  declare properties: string[];

  @Property({type: Map})
  declare config: EditorConfig;

  @Property({type: Map})
  declare groups: EditorGroups;

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
    const groups = getEditorGroups(this.value, this.groups);

    const properties = [];
    const elements = [];

    if (this.properties.length) {
      properties.push(...this.properties);
    } else {
      properties.push(...groups.main);
    }

    for (let i = 0; i < properties.length; i++) {
      if (Object.prototype.hasOwnProperty.call(this.value, properties[i])) {
        const c = properties[i] as keyof typeof this.value;
        const value = this.value[c];
        const tag = config[c]!.name;
        const props = config[c]!.props as (IoElementArgs | undefined) || {};
        const finalProps: any = {$: c, value: value, '@value-input': this._onValueInput};
        Object.assign(finalProps, props);

        if (tag === 'io-object' || tag === 'io-property-editor') {
          finalProps.config = finalProps.config || this.config;
          finalProps.groups = finalProps.groups || this.groups;
        }
        elements.push(div({class: 'row'}, [
          this.labeled ? span(c) : null,
          {name: tag, props: finalProps},
        ]));
      } else {
        debug: console.warn(`IoPropertyEditor: property "${properties[i]}" not found in value`);
      }
    }

    const uuid = genIdentifier(this.value);

    if (!this.properties.length) {
      for (const group in groups) {
        if (group !== 'main' && groups[group].length) {
          elements.push(
            ioObject({
              label: group,
              expanded: $({value: true, storage: 'local', key: uuid + '-' + group}),
              value: this.value,
              properties: groups[group],
              config: this.config,
            }),
          );
        }
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

// TODO: consider using WeakMap instead of UUID.
function genIdentifier(object: any) {
  let UUID = 'io-object-collapse-state-' + object.constructor.name;
  UUID += '-' + (object.guid || object.uuid || object.id || '');
  const props = JSON.stringify(Object.keys(object));
  let hash: any = 0;
  for (let i = 0; i < props.length; i++) {
    hash = ((hash << 5) - hash) + props.charCodeAt(i);
    hash |= 0;
  }
  hash = (-hash).toString(16);
  UUID += '-' + hash;
  return UUID;
}