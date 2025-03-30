import { IoElement, Property, Register, IoElementArgs, IoNode, Constructor } from 'io-gui';
import { getEditorConfig, PropertyConfig } from './models/editor-config.js';
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
      color: var(--io_colorField);
      background-color: var(--io_bgColor);
    }
    :host > .io-row {
      display: flex;
      flex-direction: row;
    }
    :host > .io-row > io-label {
      margin-top: calc(var(--io_spacing) + var(--io_borderWidth));
    }
    :host > .io-row > io-label:after {
      display: inline-block;
      content: ':';
    }
    :host io-object > io-property-editor {
      padding-left: var(--io_lineHeight);
    }
    `;
  }

  // TODO: remove any[] make array editor
  @Property({type: Object})
  declare value: Record<string, any> | any[];

  @Property({type: Array})
  declare properties: string[];

  @Property({type: Map})
  declare config: Map<Constructor, PropertyConfig[]>;

  @Property(true)
  declare labeled: boolean;

  _onValueInput(event: CustomEvent) {
    if (event.detail.object) return; // TODO: unhack/remove?
    const item: any = event.composedPath()[0];
    if (item === this as any) return;
    event.stopImmediatePropagation();
    const prop = item.id as keyof typeof this.value;
    if (prop !== null) {
      if (!(this.value as IoNode)._isIoNode) {
        const value = event.detail.value;
        const oldValue = event.detail.oldValue;
        this.value[prop] = value;
        const detail = {object: this.value, property: prop, value: value, oldValue: oldValue};
        this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
      }
    } else {
      debug: console.warn('IoPropertyEditor: "value-input" recieved from an input without a property id');
    }
  }
  valueMutated() {
    this.changed();
  }
  changed() {
    const config = getEditorConfig(this.value, this.config);
    const elements = [];
    const properties = this.properties.length ? this.properties : Object.keys(this.value);

    for (let i = 0; i < properties.length; i++) {
      if (Object.prototype.hasOwnProperty.call(this.value, properties[i])) {
        const c = properties[i] as keyof typeof this.value;
        const value = this.value[c];
        const tag = config[c][0];
        const props = config[c][1] as (IoElementArgs | undefined) || {};
        const label = props.label || c;
        const finalProps: any = {title: label, id: c, value: value, '@value-input': this._onValueInput};
        Object.assign(finalProps, props);
        if (tag === 'io-object') {
          elements.push(['div', {class: 'io-row'}, [
            this.labeled ? ['io-label', {label: label}] : null,
            [tag, finalProps],
          ]]);
        } else {
          elements.push(['div', {class: 'io-row'}, [
            this.labeled ? ['io-label', {label: label}] : null,
            [tag, finalProps],
          ]]);
        }
      } else {
        debug: console.warn(`IoPropertyEditor: property "${properties[i]}" not found in value`);
      }
    }
    this.template(elements);
  }
}
