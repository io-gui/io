var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { Binding } from '../../core/internals/binding.js';
// const configCache = new WeakMap<object, Record<string, VDOMArray>>();
export class ProtoObjectConfig extends Map {
    constructor(constructors) {
        super();
        for (let i = 0; i < constructors.length; i++) {
            const configs = constructors[i].Config;
            if (!configs)
                continue;
            for (let i = 0; i < configs.length; i++) {
                const config = configs[i];
                const object = config[0];
                const properties = config[1];
                let objectMap;
                if (this.has(object)) {
                    objectMap = this.get(object);
                }
                else {
                    objectMap = new Map();
                    this.set(object, objectMap);
                }
                for (let j = 0; j < properties.length; j++) {
                    const propConstructor = properties[j][0];
                    const config = [...properties[j][1]];
                    objectMap.set(propConstructor, config);
                }
            }
        }
    }
    getObjectConfig(object) {
        if (!(object instanceof Object)) {
            debug: {
                console.warn('`getObjectConfig` should be used on Object instance');
            }
            return;
        }
        // if (configCache.has(object)) return configCache.get(object)!;
        const flatMap = new Map();
        for (const [constructorKey, propertyTypes] of this) {
            if (object instanceof constructorKey) {
                for (const [propertyTypeKey, config] of propertyTypes) {
                    flatMap.set(propertyTypeKey, config);
                }
            }
        }
        const finalConfigs = {};
        for (const [key, value] of Object.entries(object)) {
            const realValue = value instanceof Binding ? value.value : value;
            for (const [propertyTypeKey, configCandidate] of flatMap) {
                let config;
                if (typeof propertyTypeKey === 'function' && realValue instanceof propertyTypeKey) {
                    config = configCandidate;
                }
                else if (typeof propertyTypeKey === 'function' && realValue.constructor === propertyTypeKey) {
                    config = configCandidate;
                }
                else if (typeof propertyTypeKey === 'string' && key === propertyTypeKey) {
                    config = configCandidate;
                }
                else if (propertyTypeKey === null && realValue === null) {
                    config = configCandidate;
                }
                else if (propertyTypeKey === undefined && realValue === undefined) {
                    config = configCandidate;
                }
                if (config) {
                    finalConfigs[key] = config;
                }
            }
        }
        debug: {
            for (const [key, value] of Object.entries(object)) {
                if (!finalConfigs[key]) {
                    console.warn('No config found for', key, value);
                    console.log(finalConfigs, object);
                }
            }
        }
        // configCache.set(object, finalConfigs);
        return finalConfigs;
    }
}
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
let IoProperties = class IoProperties extends IoElement {
    static get Style() {
        return /* css */ `
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
    static get Config() {
        return [
            [Object, [
                    [null, ['io-string', { appearance: 'neutral' }]],
                    [undefined, ['io-string', { appearance: 'neutral' }]],
                    [String, ['io-string', { appearance: 'neutral' }]],
                    [Number, ['io-number', { appearance: 'neutral', step: 0.0001 }]],
                    [Boolean, ['io-boolean']],
                    [Object, ['io-object']],
                ]],
            [Array, [
                    [Number, ['io-number', { appearance: 'neutral', step: 0.0001 }]],
                ]]
        ];
    }
    _onValueInput(event) {
        if (event.detail.object)
            return; // TODO: unhack/remove?
        const item = event.composedPath()[0];
        if (item === this)
            return;
        event.stopImmediatePropagation();
        this.dispatchEvent('property-set', event.detail, false); // TODO: temp hack
        const prop = item.id;
        if (prop !== null) {
            const value = event.detail.value;
            const oldValue = event.detail.oldValue;
            this.value[prop] = value;
            const detail = { object: this.value, property: prop, value: value, oldValue: oldValue };
            this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
        }
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
        const config = this.__proto__._protoConfig.getObjectConfig(this.value);
        Object.assign(config, this.config);
        const elements = [];
        const properties = this.properties.length ? this.properties : Object.keys(this.value);
        if (this.widget.length) {
            elements.push(this.widget);
        }
        else {
            elements.push(['widget-dummy']);
        }
        for (let i = 0; i < properties.length; i++) {
            const c = properties[i];
            const value = this.value[c];
            const tag = config[c][0];
            const props = config[c][1] || {};
            const label = props.label || c;
            const finalProps = { title: label, id: c, config: config, value: value, '@value-input': this._onValueInput };
            Object.assign(finalProps, props);
            if (tag === 'io-object') {
                finalProps.label = label + ': ' + value.constructor.name;
                elements.push([tag, finalProps]);
            }
            else {
                elements.push(['div', { class: 'io-row' }, [
                        this.labeled ? ['io-label', { label: label }] : null,
                        [tag, finalProps],
                    ]]);
            }
        }
        this.template(elements);
    }
    Register(ioNodeConstructor) {
        super.Register(ioNodeConstructor);
        Object.defineProperty(ioNodeConstructor.prototype, '_protoConfig', { writable: true, value: new ProtoObjectConfig(ioNodeConstructor.prototype._protochain.constructors) });
    }
};
__decorate([
    Property({ observe: true })
], IoProperties.prototype, "value", void 0);
__decorate([
    Property({ type: Array })
], IoProperties.prototype, "properties", void 0);
__decorate([
    Property({ type: Object })
], IoProperties.prototype, "config", void 0);
__decorate([
    Property({ type: Array })
], IoProperties.prototype, "widget", void 0);
__decorate([
    Property(true)
], IoProperties.prototype, "labeled", void 0);
IoProperties = __decorate([
    Register
], IoProperties);
export { IoProperties };
//# sourceMappingURL=io-properties.js.map