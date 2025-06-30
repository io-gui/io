import { Register, IoElement, ReactiveProperty, VDOMElement, IoElementProps, WithBinding, span } from 'io-gui';
import { ioBreadcrumbs } from './IoBreadcrumbs.js';
import { ioPropertyEditor } from './IoPropertyEditor.js';
import { EditorConfig } from '../utils/EditorConfig.js';
import { EditorGroups, getAllPropertyNames } from '../utils/EditorGroups.js';
import { EditorWidgets } from '../utils/EditorWidgets.js';
import { ioPropertyLink } from './IoPropertyLink.js';

export type IoInspectorProps = IoElementProps & {
  value?: Record<string, any> | any[],
  selected?: WithBinding<Record<string, any> | any[]>,
  search?: WithBinding<string>,
  config?: EditorConfig,
  groups?: EditorGroups,
  widgets?: EditorWidgets,
};

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsible` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
@Register
export class IoInspector extends IoElement {
  static vConstructor: (arg0?: IoInspectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      flex: 0 1 calc(var(--io_lineHeight) * 17.5);
      padding: var(--io_spacing);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-breadcrumbs {
      margin: 0 var(--io_spacing);
      z-index: 1;
    }
    :host > span {
      padding: var(--io_spacing) var(--io_spacing3);
      color: var(--io_colorStrong);
    }
    :host io-property-editor > .row > span {
      min-width: 6em;
      text-align: right;
    }
    `;
  }
  @ReactiveProperty()
  declare value: Record<string, any> | any[];

  @ReactiveProperty()
  declare selected: Record<string, any> | any[];

  @ReactiveProperty('')
  declare search: string;

  @ReactiveProperty({type: Map})
  declare config: EditorConfig;

  @ReactiveProperty({type: Map})
  declare groups: EditorGroups;

  @ReactiveProperty({type: Map})
  declare widgets: EditorWidgets;

  static get Listeners() {
    return {
      'io-button-clicked': 'onLinkClicked',
    };
  }
  onLinkClicked(event: CustomEvent) {
    event.stopPropagation();
    const value = event.detail.value;
    const item = event.composedPath()[0] as any;
    if (value && typeof value === 'object') {
      if (item.localName === 'io-property-link' || item.className === 'back-button') {
        this.setProperty('selected', value);
      }
    }
  }
  valueChanged() {
    this.selected = this.value;
  }
  selectedChanged() {
    this.search = '';
  }
  selectedMutated() {
    clearTimeout(this._cfgTimeout);
    this._cfgTimeout = setTimeout(()=>{
      this._onChange();
    }, 1000/10);
  }
  changed() {
    this._onChangedThrottled();
  }
  _onChangedThrottled() {
    this.throttle(this._onChange);
  }
  _onChange() {
    const vChildren = [
      ioBreadcrumbs({value: this.value, selected: this.bind('selected'), search: this.bind('search')}),
    ];

    const config = new Map(this.config);

    if (!config.has(Object)) config.set(Object, []);
    config.get(Object)!.push([Object, ioPropertyLink({showName: true})]);

    const properties = [];
    if (this.search) {
      for (const [key] of getAllPropertyNames(this.selected)) {
        if (key.toLowerCase().includes(this.search.toLowerCase())) {
          properties.push(key);
        }
      }
    }

    if (this.search && properties.length === 0) {
      vChildren.push(
        span(`No results found for "${this.search}"`),
      );
    } else {
      vChildren.push(
        ioPropertyEditor({
          value: this.selected,
          config: config,
          groups: this.groups,
          widgets: this.widgets,
          properties: properties,
        }),
      );
    }

    this.render(vChildren);
  }
}
export const ioInspector = IoInspector.vConstructor;


