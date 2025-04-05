import { Register, IoElement, ioField, Property, IoElementArgs, ArgsWithBinding, VDOMArray } from 'io-gui';

export type IoBreadcrumbsArgs = IoElementArgs & ArgsWithBinding<{
  value?: Record<string, any> | any[];
  selected?: any;
  options?: Record<string, any> | any[];
}>;

/**
 * Breadcrumbs select element.
 * When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value.
 * Optionally, it can trim the `options` array to selected option index.
 **/
@Register
export class IoBreadcrumbs extends IoElement {
  static vConstructor: (arg0?: IoBreadcrumbsArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      padding: var(--io_spacing);
      background-color: var(--io_bgColorInput);
      overflow-x: hidden;
    }
    :host > io-input-base {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing);
      color: var(--io_colorBlue);
    }
    :host > io-input-base:hover {
      text-decoration: underline;
    }
    :host > io-input-base:first-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-left: var(--io_spacing);
    }
    :host > io-input-base:last-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-right: var(--io_spacing);
    }
    :host > io-input-base:not(:first-of-type):before {
      content: '>';
      margin: 0 var(--io_spacing);
      padding: 0 var(--io_spacing) 0 0;
      opacity: 0.25;
    }
    `;
  }
  @Property({type: Object})
  declare value: Record<string, any> | any[];

  @Property(null)
  declare selected: any;

  @Property({type: Array})
  declare options: any[];

  _onClick(event: CustomEvent) {
    this.setProperty('selected', this.options[event.detail.value]);
  }
  valueChanged() {
    this.options.length = 0;
    // TODO: check for memory leaks
    this.options.push(this.value);
  }
  selectedChanged() {
    const index = this.options.indexOf(this.selected);
    if (index !== -1) {
      // TODO: check for memory leaks
      this.options.length = index + 1;
    } else {
      // TODO: check for memory leaks
      this.options.push(this.selected);
    }
  }
  changed() {
    const elements = [];
    for (let i = 0; i < this.options.length; i++) {
      elements.push(ioField({
        class: 'select',
        '@item-clicked': this._onClick,
      }, getLabel(this.options[i] as any)));
    }
    this.template(elements);
  }
}
export const ioBreadcrumbs = IoBreadcrumbs.vConstructor;

function getLabel(object: any): string {
  if (object instanceof Array) {
    return String(`${object.constructor.name} (${object.length})`);
  } else if (typeof object === 'object') {
    return String(`${object.constructor.name}`);
  } else {
    return String(object);
  }
}
