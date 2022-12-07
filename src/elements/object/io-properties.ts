import { IoElement, RegisterIoElement } from '../../core/element.js';
import { ObjectConfig } from './models/object-config.js';

/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 *
 * <io-element-demo element="io-properties" properties='{
 *   "labeled": true,
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
 *   "value": {"hello": "world"},
 *   "properties": ["number", "array"],
 *   "config": {
 *     "type:number": ["io-number-slider", {"step": 0.01}],
 *     "constructor:Array": ["io-properties", {"labeled": false "config": {
 *       "type:number": ["io-slider", {"step": 0.1, "style": {"height": "10em"}}]
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
  Object.defineProperty(element.prototype, '_config', {writable: true, value: new ObjectConfig(element.prototype._protochain.constructors)});
};

// TODO: consider implementing horizontal layout

@RegisterIoProperties
export class IoProperties extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      flex: 0 1 calc(var(--iotLineHeight) * 17.5);
    }
    :host > .io-row:first-of-type {
      margin-top: var(--iotSpacing);
    }
    :host > .io-row {
      /* --io-row */
      display: flex;
      flex: 1 1;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
      /*  */
      white-space: nowrap;
      margin-bottom: var(--iotSpacing);
    }
    :host > .io-row > io-label {
      margin-top: var(--iotSpacing);
      text-align: right;
      margin-right: var(--iotSpacing);
      flex: 0 0 calc(var(--iotLineHeight) * 4);
    }
    :host > .io-row > io-label:after {
      display: inline-block;
      content: ':';
    }
    `;
  }
  static get Properties(): any {
    return {
      labeled: {
        value: true,
        reflect: true,
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
  static get ObjectConfig() {
    return {
      'type:string': ['io-string', {}],
      'type:number': ['io-number', {step: 0.0001}],
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
  _getObjectConfig() {
    const propLength = Object.getOwnPropertyNames(this.value).length;
    if (!this._config || this.config !== this._currentObjectConfig || this.value !== this._currentValue || propLength !== this._currentLength) {
      this._currentObjectConfig = this.config;
      this._currentValue = this.value;
      this._currentLength = propLength;
      this._config = this.__proto__._config.getObjectConfig(this.value, this.config);
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
    this._config = this._getObjectConfig();

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
        elements.push(['div', {class: 'io-row'}, [
          this.labeled ? ['io-label', {label: label}] : null,
          [tag, Object.assign(itemConfig, protoConfig)],
        ]]
        );
      }
    }
    this.template(elements);
  }
  // TODO: unhack
  static RegisterObjectConfig: (config: any) => void;
}

IoProperties.RegisterObjectConfig = function(config) {
  this.prototype._config.registerObjectConfig(config);
};

