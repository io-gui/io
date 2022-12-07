import { IoElement, RegisterIoElement } from '../../core/element.js';
import {IoStorage as $} from '../../core/storage.js';
import { ObjectConfig } from './models/object-config.js';
import { ObjectGroups } from './models/object-groups.js';
import { ObjectWidgets } from './models/object-widgets.js';
import './io-breadcrumbs.js';

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 *
 * <io-element-demo element="io-inspector" properties='{"value": {"hello": "world"}, "config": {"type:number": ["io-slider", {"step": 0.1}], "type:string": ["io-option-menu", {"options": ["hello", "goodbye"]}]}, "crumbs": []}' config='{"value": ["io-object"], "type:object": ["io-properties"]}'></io-element-demo>
 **/

@RegisterIoElement
export class IoInspector extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      flex: 0 1 calc(var(--ioLineHeight) * 17.5);
    }
    :host > * {
      flex-shrink: 0;
    }
    :host > .inspector-header {
      margin-bottom: var(--ioSpacing);
      flex-grow: 0;
    }
    :host > .inspector-header > io-breadcrumbs {
      flex: 1 1;
    }
    :host > .inspector-header > io-boolean {
      width: calc(var(--ioSpacing) + var(--ioLineHeight));
      align-self: stretch;
      height: auto;
    }
    :host > .inspector-header > io-boolean:not([value]) {
      opacity: 0.25;
    }
    :host > .inspector-header > io-string {
      margin: 0 var(--ioSpacing);
      padding: calc(2 * var(--ioSpacing));
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
    :host > io-object {
      flex-basis: auto !important;
    }
    :host > io-object > io-properties {
      border-radius: var(--ioBorderRadius);
      background-color: var(--ioBackgroundColor) !important;
      border: var(--ioBorder);
      border-color: var(--ioBorderColorInset);
      padding: var(--ioSpacing);
      overflow: hidden;
    }
    :host > io-object > io-properties:not([horizontal])[labeled] {
      grid-template-columns: minmax(6em, min-content) minmax(12em, 1fr);
    }
    :host > io-object > io-properties:not([horizontal])[labeled] > span.io-field {
      text-align: right;
    }
    :host io-properties > io-field.select {
      color: var(--ioColorLink);
    }
    :host io-properties > io-field.select:hover {
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
      'io-field-clicked': '_onItemClicked',
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
      this.setProperty('selected', value);
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
      this._onChange();
    }, 1000/10);
  }
  _getObjectConfig() {
    this._config = this.__proto__._config.getObjectConfig(this.selected, this.config);
  }
  _getObjectGroups() {
    this._groups = this.__proto__._groups.getObjectGroups(this.selected, this.groups, Object.getOwnPropertyNames(this._config), this.advanced);
  }
  _getObjectWidgets() {
    this._widgets = this.__proto__._widgets.getObjectWidgets(this.selected, this.widgets);
  }
  _getAll() {
    const propLength = Object.getOwnPropertyNames(this.selected).length;
    if (!this._config || this.selected !== this._currentCfgObj || propLength !== this._currentCfgLen) {
      this._currentCfgObj = this.selected;
      this._currentCfgLen = propLength;
      this._getObjectConfig();
      this._getObjectGroups();
      this._getObjectWidgets();
    }
  }
  changed() {
    this.advanced = $({value: false, storage: 'local', key: 'inspector-show-advanced'});
    this._onhangedThrCottle();
  }
  _onhangedThrCottle() {
    this.throttle(this._onChange);
  }
  _onChange() {
    this._getAll();
    this.uuid = genUUID(this.selected);
    const elements = [
      ['div', {class: 'inspector-header io-row io-panel'}, [
        ['io-breadcrumbs', {value: this.value, selected: this.bind('selected')}],
        ['io-string', {id: 'search', value: this.bind('search'), live: true}],
        ['io-boolean', {value: this.bind('advanced'), true: 'icons:less', false: 'icons:more'}],
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
  static get ObjectConfig() {
    return {
      'type:object': ['io-field', {class: 'select'}],
      'type:null': ['io-field', {class: 'select'}],
    };
  }
  static get ObjectGroups() {
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
  static get ObjectWidgets() {
    return {
      // 'Object': ['io-field', {label: 'This is a main widget'}],
      // 'Object|main': ['io-field', {label: 'This is a main group widget'}],
    };
  }
  // TODO: unhack
  static RegisterObjectConfig: (config: any) => void;
  static RegisterObjectGroups: (groups: any) => void;
  static RegisterObjectWidgets: (widgets: any) => void;
  static Register() {
    throw new Error('Method not implemented.');
  }
}

function genUUID(object: any) {
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

IoInspector.Register = function() {
  Object.defineProperty(this.prototype, '_config', {writable: true, value: new ObjectConfig(this.prototype._protochain.constructors)});
  Object.defineProperty(this.prototype, '_groups', {writable: true, value: new ObjectGroups(this.prototype._protochain.constructors)});
  Object.defineProperty(this.prototype, '_widgets', {writable: true, value: new ObjectWidgets(this.prototype._protochain.constructors)});
};

IoInspector.RegisterObjectConfig = function(config) {
  this.prototype._config.registerObjectConfig(config);
};

IoInspector.RegisterObjectGroups = function(groups) {
  this.prototype._groups.registerObjectGroups(groups);
};

IoInspector.RegisterObjectWidgets = function(widgets) {
  this.prototype._widgets.registerObjectWidgets(widgets);
};

// TODO: unhack
IoInspector.Register();

IoInspector.RegisterObjectGroups({
  'Array|main': [/^[0-9]+$/],
});
