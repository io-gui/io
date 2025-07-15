import { IoElement, ReactiveProperty, Register, IoElementProps, Node, span, div, Storage as $, HTML_ELEMENTS, ReactivityType } from 'io-gui';
import { EditorConfig, getEditorConfig } from '../utils/EditorConfig.js';
import { EditorGroups, getEditorGroups, getAllPropertyNames } from '../utils/EditorGroups.js';
import { EditorWidgets, getEditorWidget } from '../utils/EditorWidgets.js';
import { ioObject } from './IoObject.js';

export type IoPropertyEditorProps = IoElementProps & {
  value?: Record<string, any> | any[],
  properties?: string[],
  labeled?: boolean,
  orientation?: 'vertical' | 'horizontal',
  config?: EditorConfig,
  groups?: EditorGroups,
  widgets?: EditorWidgets,
};

/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
@Register
export class IoPropertyEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
      font-size: var(--io_fontSize);
    }
    :host[orientation="horizontal"] {
      flex-direction: row;
    }
    :host > .row {
      display: flex;
      flex-direction: row;
      margin: var(--io_spacing);
      padding: var(--io_spacing) 0;
      border-radius: var(--io_borderRadius);
      margin-bottom: 0;
      background-color: var(--io_bgColorLight);
    }
    :host[orientation="horizontal"] > .row {
      flex-direction: column;
    }
    :host > .row:last-of-type {
      margin-bottom: var(--io_spacing);
    }
    :host > .row > span {
      padding: var(--io_borderWidth); /* TODO: verify correctness */
      margin: var(--io_spacing);
      margin-left: var(--io_spacing2);
      line-height: var(--io_lineHeight);
      height: var(--io_lineHeight);
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

  @ReactiveProperty('debounced')
  declare reactivity: ReactivityType;

  @ReactiveProperty({type: Object, init: null})
  declare value: Object;

  @ReactiveProperty({type: Array, init: null})
  declare properties: string[];

  @ReactiveProperty(true)
  declare labeled: boolean;

  @ReactiveProperty({type: String, value: 'vertical', reflect: true})
  declare orientation: 'vertical' | 'horizontal';

  @ReactiveProperty({type: Map, init: null})
  declare config: EditorConfig;

  @ReactiveProperty({type: Map, init: null})
  declare groups: EditorGroups;

  @ReactiveProperty({type: Map, init: null})
  declare widgets: EditorWidgets;

  _onValueInput(event: CustomEvent) {
    event.stopImmediatePropagation();
    const id = (event.target as HTMLElement).id as keyof typeof this.value;
    if (id !== undefined) {
      this.value[id] = event.detail.value;
      if (!(this.value as Node)._isNode) {
        this.dispatchMutation(this.value);
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
    const widget = getEditorWidget(this.value, this.widgets);

    const properties = [];
    const vChildren = [];

    if (this.properties.length) {
      properties.push(...this.properties);
    } else {
      if (widget) {
        const widgetWithValue = {
          tag: widget.tag,
          props: Object.assign({value: this.value}, widget.props),
          children: widget.children
        };
        vChildren.push(widgetWithValue);
      }
      properties.push(...groups.Main);
    }

    const allProps = getAllPropertyNames(this.value);

    for (let i = 0; i < properties.length; i++) {
      if (allProps.includes(properties[i])) {
        const id = properties[i] as keyof typeof this.value;
        const value = this.value[id];
        const tag = config[id]!.tag;
        const props = config[id]!.props as (IoElementProps | undefined) || {};
        const finalProps: any = {id: id, value: value, '@value-input': this._onValueInput};
        Object.assign(finalProps, props);

        let children: string | undefined = undefined;
        if (HTML_ELEMENTS.includes(tag) && typeof value === 'string') {
          children = value;
        }

        if (tag === 'io-object' || tag === 'io-property-editor') {
          finalProps.config = finalProps.config || this.config;
          finalProps.groups = finalProps.groups || this.groups;
        }
        vChildren.push(div({class: 'row'}, [
          this.labeled ? span(id) : null,
          {tag: tag, props: finalProps, children: children},
        ]));
      } else {
        debug: console.warn(`IoPropertyEditor: property "${properties[i]}" not found in value`);
      }
    }

    const uuid = genIdentifier(this.value);

    if (!this.properties.length) {
      for (const group in groups) {
        if (group !== 'Main' && group !== 'Hidden' && groups[group].length) {
          vChildren.push(
            ioObject({
              label: group,
              expanded: $({value: false, storage: 'local', key: uuid + '-' + group}),
              value: this.value,
              properties: groups[group],
              config: this.config,
            }),
          );
        }
      }
    }

    this.render(vChildren);
  }
  // TODO: Remove?!
  /**
   * Returns a JSON representation of the property editor. This feature is used in testing.
   * @return {Object} JSON representation of the property editor.
   */
  // toJSON() {
  //   const json = Object.assign({}, super.toJSON(), this);
  //   return json;
  // }
}
export const ioPropertyEditor = function(arg0?: IoPropertyEditorProps) {
  return IoPropertyEditor.vConstructor(arg0);
};

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