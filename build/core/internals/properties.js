import { Binding } from './propertyBinder.js';
export const sanitizePropertyDefinition = (propDef) => {
    const def = {
        value: undefined,
        type: undefined,
        binding: undefined,
        reflect: 0,
        notify: true,
        observe: false,
        readonly: false,
        strict: false,
        enumerable: true
    };
    if (propDef === undefined || propDef === null) {
        def.value = propDef;
        return def;
    }
    if (typeof propDef === 'function') {
        def.type = propDef;
        return def;
    }
    if (propDef instanceof Binding) {
        def.value = propDef.value;
        def.type = (propDef.value !== undefined && propDef.value !== null) ? propDef.value.constructor : undefined;
        def.binding = propDef;
        return def;
    }
    if (propDef && propDef.constructor === Object) {
        const detail = propDef;
        debug: {
            Object.keys(detail).forEach(key => {
                if (['value', 'type', 'reflect', 'notify', 'observe', 'readonly', 'strict', 'enumerable', 'binding'].indexOf(key) === -1) {
                    console.warn(`PropertyDefinition: Invalid field ${key}`);
                }
            });
            if (detail.type !== undefined && typeof detail.type !== 'function')
                console.warn('Incorrect type for "type" field');
            if (detail.binding !== undefined && detail.binding.constructor !== Binding)
                console.warn('Incorrect type for "binding" field');
            if (detail.reflect !== undefined && typeof detail.reflect !== 'number')
                console.warn('Incorrect type for "reflect" field');
            if (detail.notify !== undefined && typeof detail.notify !== 'boolean')
                console.warn('Incorrect type for "notify" field');
            if (detail.observe !== undefined && typeof detail.observe !== 'boolean')
                console.warn('Incorrect type for "observe" field');
            if (detail.readonly !== undefined && typeof detail.readonly !== 'boolean')
                console.warn('Incorrect type for "readonly" field');
            if (detail.strict !== undefined && typeof detail.strict !== 'boolean')
                console.warn('Incorrect type for "strict" field');
            if (detail.enumerable !== undefined && typeof detail.enumerable !== 'boolean')
                console.warn('Incorrect type for "enumerable" field');
        }
        detail.value = detail.value !== undefined ? detail.value : undefined;
        detail.type = detail.type !== undefined ? detail.type : (detail.value !== undefined && detail.value !== null) ? detail.value.constructor : undefined;
        detail.binding = detail.binding instanceof Binding ? detail.binding : undefined;
        detail.reflect = detail.reflect !== undefined ? detail.reflect : 0;
        detail.notify = detail.notify !== undefined ? detail.notify : true;
        detail.observe = detail.observe !== undefined ? detail.observe : false;
        detail.readonly = detail.readonly !== undefined ? detail.readonly : false;
        detail.strict = detail.strict !== undefined ? detail.strict : false;
        detail.enumerable = detail.enumerable !== undefined ? detail.enumerable : true;
        return detail;
    }
    if (!(propDef && propDef.constructor === Object)) {
        def.value = propDef;
        def.type = propDef.constructor;
        return def;
    }
    return def;
};
export const assignPropertyDefinition = (propDef, newPropDef) => {
    if (newPropDef.value !== undefined)
        propDef.value = newPropDef.value;
    if (newPropDef.type !== undefined)
        propDef.type = newPropDef.type;
    if (newPropDef.reflect !== 0)
        propDef.reflect = newPropDef.reflect;
    if (newPropDef.notify !== true)
        propDef.notify = newPropDef.notify;
    if (newPropDef.observe !== false)
        propDef.observe = newPropDef.observe;
    if (newPropDef.readonly !== false)
        propDef.readonly = newPropDef.readonly;
    if (newPropDef.strict !== false)
        propDef.strict = newPropDef.strict;
    if (newPropDef.enumerable !== true)
        propDef.enumerable = newPropDef.enumerable;
    if (newPropDef.binding !== undefined)
        propDef.binding = newPropDef.binding;
};
/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `PropertyDefinition`.
 */
export class Property {
    //Property value.
    value = undefined;
    //Constructor of the property value.
    type = undefined;
    //Reflects to HTML attribute [-1, 0, 1 or 2]
    reflect = 0;
    //Enables change handlers and events.
    notify = true;
    //Observe object mutations for this property.
    observe = false;
    //Makes the property readonly. // TODO: document and test
    readonly = false;
    //Enforce stric typing. // TODO: document and test
    strict = false;
    //Makes property enumerable.
    enumerable = true;
    //Binding object.
    binding = undefined;
    /**
     * Creates the property configuration object and copies values from `PropertyDefinition`.
     * @param {PropertyDefinition} propDef PropertyDefinition object
     */
    constructor(propDef) {
        this.value = propDef.value;
        if (propDef.type !== undefined)
            this.type = propDef.type;
        if (propDef.reflect !== undefined)
            this.reflect = propDef.reflect;
        if (propDef.notify !== undefined)
            this.notify = propDef.notify;
        if (propDef.observe !== undefined)
            this.observe = propDef.observe;
        if (propDef.readonly !== undefined)
            this.readonly = propDef.readonly;
        if (propDef.strict !== undefined)
            this.strict = propDef.strict;
        if (propDef.enumerable !== undefined)
            this.enumerable = propDef.enumerable;
        if (propDef.binding !== undefined)
            this.binding = propDef.binding;
        // TODO: move to PropertyDefinition
        if (this.binding instanceof Binding)
            this.value = this.binding.value;
        else if (this.value === undefined) {
            if (typeof this.type === 'function') {
                if (this.type === Boolean)
                    this.value = false;
                else if (this.type === String)
                    this.value = '';
                else if (this.type === Number)
                    this.value = 0;
                else if (this.type === Array)
                    this.value = [];
                else if (this.type === Object)
                    this.value = {};
                else
                    this.value = new this.type();
            }
        }
        else {
            if (this.type === Array && this.value instanceof Array) {
                this.value = [...this.value];
            }
            else if (this.type === Object && this.value instanceof Object) {
                this.value = Object.assign({}, this.value);
            }
        }
        // TODO: move to PropertyDefinition
        debug: {
            if ([-1, 0, 1, 2].indexOf(this.reflect) === -1) {
                console.error(`Invalid reflect value ${this.reflect}!`);
            }
        }
    }
}
/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
export class Properties {
    __node;
    __keys = [];
    __connected = false;
    /**
     * Creates the properties for specified `IoNode`.
     * @param {any} node Owner IoNode instance.
     */
    constructor(node) {
        Object.defineProperty(this, '__node', { enumerable: false, configurable: true, value: node });
        Object.defineProperty(this, '__connected', { enumerable: false });
        for (const prop in node.__protochain.properties) {
            this.__keys.push(prop);
            const protoProp = node.__protochain.properties;
            const property = new Property(protoProp[prop]);
            Object.defineProperty(this, prop, {
                value: property,
                enumerable: protoProp[prop].enumerable,
                configurable: true
            });
            const value = property.value;
            if (value !== undefined && value !== null) {
                // TODO: document special handling of object and node values
                if (typeof value === 'object') {
                    node.queue(prop, value, undefined);
                    if (value.__isIoNode && node.__connected)
                        value.connect(node);
                }
                else if (property.reflect !== undefined && property.reflect >= 1 && node.__isIoElement) {
                    // TODO: figure out how to resolve bi-directionsl reflection when attributes are set in html (role, etc...)
                    node.setAttribute(prop, value);
                }
            }
            const binding = property.binding;
            // TODO: unhack passing __properties from constructor;
            if (binding)
                binding.addTarget(node, prop, this);
        }
        Object.defineProperty(this, '__keys', { enumerable: false, configurable: true });
    }
    /**
     * Returns the property value.
     * @param {string} key property name to get value of.
     * @return {any} Peroperty value.
     */
    get(key) {
        return this[key].value;
    }
    /**
     * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
     * @param {string} key Property name to set value of.
     * @param {any} value Peroperty value.
     * @param {boolean} [skipDispatch] flag to skip event dispatch.
     */
    set(key, value, skipDispatch) {
        const prop = this[key];
        const oldValue = prop.value;
        if (value !== oldValue) {
            const node = this.__node;
            const binding = (value instanceof Binding) ? value : undefined;
            if (binding) {
                const oldBinding = prop.binding;
                if (oldBinding && binding !== oldBinding) {
                    oldBinding.removeTarget(node, key);
                }
                binding.addTarget(node, key);
                value = binding.value;
            }
            else {
                if (prop.strict && prop.type && !(value instanceof prop.type)) {
                    debug: {
                        console.warn(`IoGUI strict type mismatch for "${key}" property! Value automatically converted to "${prop.type.name}."`);
                    }
                    value = new prop.type(value);
                }
            }
            prop.value = value;
            debug: {
                if (prop.type === String) {
                    if (typeof value !== 'string') {
                        console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
                    }
                }
                else if (prop.type === Number) {
                    if (typeof value !== 'number') {
                        console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
                    }
                }
                else if (prop.type === Boolean) {
                    if (typeof value !== 'boolean') {
                        console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
                    }
                }
                else if (prop.type) {
                    if (!(value instanceof prop.type)) {
                        console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
                    }
                }
            }
            if (value && value.__isIoNode && !value.__isIoElement)
                value.connect(node);
            if (oldValue && oldValue.__isIoNode && oldValue.__connected && !oldValue.__isIoElement)
                oldValue.disconnect(node);
            if (prop.notify && oldValue !== value) {
                node.queue(key, value, oldValue);
                if (node.__connected && !skipDispatch) {
                    node.queueDispatch();
                }
            }
            if (prop.reflect !== undefined && prop.reflect >= 1 && node.__isIoElement)
                node.setAttribute(key, value);
        }
    }
    /**
     * Connects all property bindings and `IoNode` properties.
     */
    connect() {
        debug: {
            if (this.__connected)
                console.error('Properties: already connected!');
        }
        for (let i = this.__keys.length; i--;) {
            const p = this.__keys[i];
            const property = this[p];
            if (property.binding) {
                property.binding.addTarget(this.__node, p);
            }
            // TODO: investigate and test element property connections - possible clash with element's native `disconenctedCallback()`
            if (property.value && property.value.__isIoNode && !property.value.__connected && !property.value.__isIoElement) {
                property.value.connect(this.__node);
            }
        }
        this.__connected = true;
    }
    /**
     * Disconnects all property bindings and `IoNode` properties.
     */
    disconnect() {
        debug: {
            // TODO: debug
            // if (!this.__connected) console.error('Properties: already disconnected!');
        }
        for (let i = this.__keys.length; i--;) {
            const p = this.__keys[i];
            const property = this[p];
            if (property.binding) {
                property.binding.removeTarget(this.__node, p);
            }
            // TODO: investigate and test element property connections
            // possible clash with element's native `disconenctedCallback()`
            // TODO: fix BUG - diconnecting already disconencted.
            if (property.value && property.value.__isIoNode && !property.value.__isIoElement) {
                // TODO: remove this workaround once the bug is fixed properly.
                if (property.value.__connections.indexOf(this.__node) !== -1) {
                    property.value.disconnect(this.__node);
                }
            }
        }
        this.__connected = false;
    }
    /**
     * Disconnects all property bindings and `IoNode` properties.
     * Use this when properties are no loner needed.
     */
    dispose() {
        this.disconnect();
        delete this.__node;
        delete this.__keys;
    }
}
//# sourceMappingURL=properties.js.map