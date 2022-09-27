import {IoElement, RegisterIoElement } from '../../iogui.js';
import {Config} from './config.js';

/*
 * Extends `IoElement`.
 *
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false. If `horizontal` property is set, keys and values are arranged horizontally.
 *
 * <io-element-demo element="io-properties" properties='{
 *   "labeled": true,
 *   "horizontal": false,
 *   "value": {"hello": "world"}
 * }' config='{
 *   "value": ["io-object"],
 *   "properties": ["io-object"],
 *   "type:object": ["io-properties"]
 * }'></io-element-demo>
 *
 * If `properties` list is set, only specified properties will be displayed.
 * By setting `config` property, `IoProperties` can be configured to use custom property editors.
 *
 * <io-element-demo element="io-properties" properties='{
 *   "labeled": true,
 *   "horizontal": false,
 *   "value": {"hello": "world"},
 *   "properties": ["number", "array"],
 *   "config": {
 *     "type:number": ["io-number-slider", {"step": 0.01}],
 *     "constructor:Array": ["io-properties", {"labeled": false, "horizontal": true, "config": {
 *       "type:number": ["io-slider", {"step": 0.1, "horizontal": false, "style": {"height": "10em"}}]
 *     }}]
 *   }
 * }' config='{
 *   "value": ["io-object"],
 *   "properties": ["io-object"],
 *   "type:object": ["io-properties"]
 * }'></io-element-demo>
 **/

const RegisterIoProperties = function (element: typeof IoProperties) {
  RegisterIoElement(element);
  Object.defineProperty(element.prototype, '_config', {writable: true, value: new Config(element.prototype._protochain.constructors)});
};

@RegisterIoProperties
export class IoProperties extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: grid;
      grid-gap: var(--io-spacing);
      justify-self: stretch;
      justify-items: start;
      white-space: nowrap;
    }
    :host[horizontal] {
      grid-auto-flow: column;
    }
    :host[horizontal][labeled] {
      grid-template-rows: auto auto;
    }
    :host:not([horizontal]) {
      grid-template-columns: auto;
    }
    :host:not([horizontal])[labeled] {
      grid-template-columns: min-content minmax(4em, 1fr);
    }
    :host > span.io-item {
      max-width: 8em !important;
      width: 100%;
    }
    :host:not([horizontal]) > * {
      max-width: 100%;
    }
    :host[labeled] > :first-child {
      grid-column: span 2;
      width: 100%;
    }
    :host > io-object {}
    :host > io-object {
      padding: 0;
      border: var(--io-border);
      border-radius: var(--io-border-radius);
      border-color: transparent;
      background-color: transparent;
      background-image: none;
    }
    :host > io-object,
    :host > io-properties,
    :host > io-number,
    :host > io-string {
      width: auto;
      justify-self: stretch;
    }
    :host io-properties {
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    `;
  }
  static get Properties(): any {
    return {
      labeled: {
        value: true,
        reflect: 'prop',
      },
      horizontal: {
        value: false,
        reflect: 'prop',
      },
      value: {
        type: Object,
        observe: true,
      },
      properties: Array,
      slotted: Array,
      config: Object,
    };
  }
  static get Config() {
    return {
      'type:string': ['io-string', {}],
      'type:number': ['io-number', {step: 0.0000001}],
      'type:boolean': ['io-boolean', {}],
      'type:object': ['io-object', {}],
      'type:null': ['io-string', {}],
      'type:undefined': ['io-string', {}],
    };
  }
  _onValueSet(event: CustomEvent) {
    if (event.detail.object) return; // TODO: unhack/remove?
    const item: any = event.composedPath()[0];
    if (item === this as any) return;
    event.stopImmediatePropagation();
    this.dispatchEvent('property-set', event.detail, false); // TODO: temp hack
    const prop = item.id;
    if (prop !== null) {
      const value = event.detail.value;
      const oldValue = event.detail.oldValue;
      this.value[prop] = value;
      const detail = {object: this.value, property: prop, value: value, oldValue: oldValue};
      this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
    }
  }
  _getConfig() {
    const propLength = Object.getOwnPropertyNames(this.value).length;
    if (!this._config || this.config !== this._currentConfig || this.value !== this._currentValue || propLength !== this._currentLength) {
      this._currentConfig = this.config;
      this._currentValue = this.value;
      this._currentLength = propLength;
      this._config = this.__proto__._config.getConfig(this.value, this.config);
      return this._config;
    }
    return this._config;
  }
  valueMutated() {
    this._changedThrottled();
  }
  changed() {
    this._changedThrottled();
  }
  _changedThrottled() {
    this.throttle(this._onChange, undefined, true); // TODO: consider async
  }
  _onChange() {
    this._config = this._getConfig();

    const config = this._config;
    const elements = [];
    const properties = this.properties.length ? this.properties : Object.keys(config);

    if (this.slotted.length) {
      elements.push(this.slotted);
    } else {
      elements.push(['slotted-dummy']);
    }

    for (let i = 0; i < properties.length; i++) {
      const c = properties[i];
      if (!this.properties.length || this.properties.indexOf(c) !== -1) {
        const tag = config[c][0];
        const protoConfig = config[c][1];
        const label = config[c].label || c;
        const itemConfig: any = {title: label, id: c, value: this.value[c], 'on-value-input': this._onValueSet};
        itemConfig.config = this.config;
        elements.push(
          this.labeled ? ['span', {class: 'io-item'}, label + ':'] : null,
          [tag, Object.assign(itemConfig, protoConfig)],
        );
      }
    }
    this.template(elements);
  }
  // TODO: unhack
  static RegisterConfig: (config: any) => void;
}

IoProperties.RegisterConfig = function(config) {
  this.prototype._config.registerConfig(config);
};

