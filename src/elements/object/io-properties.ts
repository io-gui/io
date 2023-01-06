import { IoElement, RegisterIoElement, VDOMArray } from '../../core/element.js';
import { ObjectConfig } from './models/object-config.js';
import { Property } from '../../core/internals/property.js';


const RegisterIoProperties = function (element: typeof IoProperties) {
  RegisterIoElement(element);
  Object.defineProperty(element.prototype, '_config', {writable: true, value: new ObjectConfig(element.prototype._protochain.constructors)});
};

/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
@RegisterIoProperties
export class IoProperties extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      color: var(--iotColorField);
      background-color: var(--iotBackgroundColor);
    }
    :host > .io-row {
      display: flex;
      flex-direction: row;
    }
    :host > .io-row > io-label {
      margin-top: calc(var(--iotSpacing) + var(--iotBorderWidth));
    }
    :host > .io-row > io-label:after {
      display: inline-block;
      content: ':';
    }
    :host io-object > io-properties {
      padding-left: var(--iotLineHeight);
    }
    `;
  }

  @Property({type: [Object, Array], observe: true})
  declare value: Record<string, any> | any[];

  @Property({type: Array})
  declare properties: string[];

  @Property({type: Object})
  declare config: Record<string, any>;

  @Property({type: Array})
  declare slotted: VDOMArray;

  @Property(true)
  declare labeled: boolean;

  static get ObjectConfig() {
    return {
      'type:string': ['io-string', {appearance: 'neutral'}],
      'type:number': ['io-number', {appearance: 'neutral', step: 0.0001}],
      'type:null': ['io-string', {appearance: 'neutral'}],
      'type:undefined': ['io-string', {appearance: 'neutral'}],
      'type:boolean': ['io-boolean'],
      'type:object': ['io-object'],
    };
  }
  _onValueSet(event: CustomEvent) {
    if (event.detail.object) return; // TODO: unhack/remove?
    const item: any = event.composedPath()[0];
    if (item === this as any) return;
    event.stopImmediatePropagation();
    this.dispatchEvent('property-set', event.detail, false); // TODO: temp hack
    const prop = item.id as keyof typeof this.value;
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
    this.throttle(this._onChange, undefined, 0); // TODO: consider async
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
      const c = properties[i] as keyof typeof this.value;
      if (!this.properties.length || this.properties.indexOf(c) !== -1) {
        const tag = config[c][0];
        const protoConfig = config[c][1];
        const label = config[c].label || c;
        const itemConfig: any = {title: label, id: c, value: this.value[c], '@value-input': this._onValueSet};
        itemConfig.config = this.config;
        if (tag === 'io-object') {
          itemConfig.label = label + ': ' + this.value[c].constructor.name;
          elements.push([tag, Object.assign(itemConfig, protoConfig)]);
        } else {
          elements.push(['div', {class: 'io-row'}, [
            this.labeled ? ['io-label', {label: label}] : null,
            [tag, Object.assign(itemConfig, protoConfig)],
          ]]);
        }
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

