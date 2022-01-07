import {IoElement, RegisterIoElement} from '../../core/io-element.js';
import {IoStorageFactory as $} from '../core/storage.js';
import {Config} from './config.js';
import {Groups} from './groups.js';
import {Widgets} from './widgets.js';
import './breadcrumbs.js';

/*
 * Extends `IoElement`. Implements `IoBreadcrumbs`, `IoInspectorLink`, `IoCollapsable` and `IoProperties`.
 *
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 *
 * <io-element-demo element="io-inspector" properties='{"value": {"hello": "world"}, "config": {"type:number": ["io-slider", {"step": 0.1}], "type:string": ["io-option-menu", {"options": ["hello", "goodbye"]}]}, "crumbs": []}' config='{"value": ["io-object"], "type:object": ["io-properties"]}'></io-element-demo>
 **/

export class IoInspector extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-column;
    }
    :host > * {
      flex-shrink: 0;
    }
    :host > .inspector-header {
      margin-bottom: var(--io-spacing);
      flex-grow: 0;
    }
    :host > .inspector-header > io-breadcrumbs {
      flex: 1 1;
    }
    :host > .inspector-header > io-boolicon {
      width: calc(var(--io-spacing) + var(--io-item-height));
      align-self: stretch;
      height: auto;
    }
    :host > .inspector-header > io-boolicon:not([value]) {
      opacity: 0.25;
    }
    :host > .inspector-header > io-string {
      margin: 0 var(--io-spacing);
      padding: calc(2 * var(--io-spacing));
      align-self: stretch;
      height: auto;
    }
    :host > .inspector-header > io-string:focus {
      width: 6em;
    }
    :host > .inspector-header > io-string:empty:before {
      content: ' 🔍';
      white-space: pre;
      visibility: visible;
      opacity: 0.33;
    }
    :host > io-collapsable > io-boolean,
    :host > io-object > io-boolean {
      text-transform: capitalize;
    }
    :host > io-object > io-properties {
      border-radius: var(--io-border-radius);
      background-color: var(--io-background-color) !important;
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      box-shadow: var(--io-shadow-inset);
      padding: var(--io-spacing);
      overflow: hidden;
    }
    :host > io-object > io-properties:not([horizontal])[labeled] {
      grid-template-columns: minmax(6em, min-content) minmax(12em, 1fr);
    }
    :host > io-object > io-properties:not([horizontal])[labeled] > span.io-item {
      text-align: right;
    }
    :host io-properties > io-item.select {
      color: var(--io-color-link);
    }
    :host io-properties > io-item.select:hover {
      text-decoration: underline;
    }
    `;
  }
  static get Properties(): any {
    return {
      value: {
        type: Object,
        observe: true,
      },
      selected: {
        type: Object,
        observe: true,
      },
      search: String,
      advanced: false,
      groups: Object,
      config: Object,
      widgets: Object,
      autoExpand: ['main', 'properties'],
    };
  }
  static get Listeners() {
    return {
      'item-clicked': '_onItemClicked',
    };
  }
  constructor(props?: any) {
    super(props);
    Object.defineProperty(this, 'uuid', {value: null, writable: true});
  }
  _onItemClicked(event: CustomEvent) {
    event.stopPropagation();
    const value = event.detail.value;
    const item = event.composedPath()[0] as any;
    if (value && typeof value === 'object' && item.classList.contains('select')) {
      this.set('selected', value);
    }
  }
  valueChanged() {
    this.selected = this.value;
  }
  advancedChanged() {
    delete this._currentCfgLen;
  }
  selectedMutated() {
    clearTimeout(this._cfgTimeout);
    this._cfgTimeout = setTimeout(()=>{
      this._changed();
    }, 1000/10);
  }
  _getConfig() {
    this._config = this.__proto__._config.getConfig(this.selected, this.config);
  }
  _getGroups() {
    this._groups = this.__proto__._groups.getGroups(this.selected, this.groups, Object.getOwnPropertyNames(this._config), this.advanced);
  }
  _getWidgets() {
    this._widgets = this.__proto__._widgets.getWidgets(this.selected, this.widgets);
  }
  _getAll() {
    const propLength = Object.getOwnPropertyNames(this.selected).length;
    if (!this._config || this.selected !== this._currentCfgObj || propLength !== this._currentCfgLen) {
      this._currentCfgObj = this.selected;
      this._currentCfgLen = propLength;
      this._getConfig();
      this._getGroups();
      this._getWidgets();
    }
  }
  changed() {
    this.advanced = $({value: false, storage: 'local', key: 'inspector-show-advanced'});
    this._changedThrottled();
  }
  _changedThrottled() {
    this.throttle(this._changed, null, true);
  }
  _changed() {
    this._getAll();
    this.uuid = genUUID(this.selected);
    const elements = [
      ['div', {class: 'inspector-header io-row io-panel'}, [
        ['io-breadcrumbs', {value: this.value, selected: this.bind('selected')}],
        ['io-string', {id: 'search', value: this.bind('search'), live: true}],
        ['io-boolicon', {value: this.bind('advanced'), true: 'icons:less', false: 'icons:more'}],
      ]],
      this._widgets.main ? this._widgets.main : null
    ];

    for (const group in this._widgets.groups) {
      if (!this._groups[group]) {
        const autoExpanded = this.autoExpand.indexOf(group) !== -1;
        elements.push(
          ['io-collapsable', {
            label: group,
            expanded: $({value: autoExpanded, storage: 'local', key: this.uuid + '-' + group}),
            elements: [this._widgets.groups[group]],
            class: 'io-panel',
          }]
        );
      }
    }

    for (const group in this._groups) {
      const autoExpanded = this.autoExpand.indexOf(group) !== -1;
      elements.push(
        ['io-object', {
          label: group,
          expanded: $({value: autoExpanded, storage: 'local', key: this.uuid + '-' + group}),
          value: this.selected,
          properties: this._groups[group],
          config: this._config,
          slotted: this._widgets.groups[group] || [],
        }],
      );
    }
    this.template(elements);
  }
  static get Config() {
    return {
      'type:object': ['io-item', {class: 'select'}],
      'type:null': ['io-item', {class: 'select'}],
    };
  }
  static get Groups() {
    return {
      'Object|hidden': [/^_/],
      // TODO
      'HTMLElement|main': ['localName', 'tagName', 'nodeName', /class/i, /attribute/i],
      'HTMLElement|hidden': [/^on/, /^[A-Z0-9_]*$/, 'childElementCount'],
      'HTMLElement|content': [/content/i, /inner/i, /outer/i],
      'HTMLElement|display': [/width/i, /height/i, /top/i, /left/i, /scroll/i, /style/i],
      'HTMLElement|hierarchy': [/parent/i, /child/i, /element/i, /root/i, /slot/i, /sibling/i, /document/i],
    };
  }
  static get Widgets() {
    return {
      // 'Object': ['io-item', {label: 'This is a main widget'}],
      // 'Object|main': ['io-item', {label: 'This is a main group widget'}],
    };
  }
  // TODO: unhack
  static RegisterConfig: (config: any) => void;
  static RegisterGroups: (groups: any) => void;
  static RegisterWidgets: (widgets: any) => void;
  static Register() {
    throw new Error('Method not implemented.');
  }
}

function genUUID(object: any) {
  let UUID = 'io-object-collapse-state-' + object.constructor.name;
  UUID += '-' + object.guid || object.uuid || object.id || '';
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

IoInspector.Register = function() {
  Object.defineProperty(this.prototype, '_config', {value: new Config(this.prototype._protochain.constructors)});
  Object.defineProperty(this.prototype, '_groups', {value: new Groups(this.prototype._protochain.constructors)});
  Object.defineProperty(this.prototype, '_widgets', {value: new Widgets(this.prototype._protochain.constructors)});
};

IoInspector.RegisterConfig = function(config) {
  this.prototype._config.registerConfig(config);
};

IoInspector.RegisterGroups = function(groups) {
  this.prototype._groups.registerGroups(groups);
};

IoInspector.RegisterWidgets = function(widgets) {
  this.prototype._widgets.registerWidgets(widgets);
};

RegisterIoElement(IoInspector);

// TODO: unhack
IoInspector.Register();

IoInspector.RegisterGroups({
  'Array|main': [/^[0-9]+$/],
});
