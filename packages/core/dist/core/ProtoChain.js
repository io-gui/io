import { ProtoProperty } from './Property.js';
import { hardenListenerDefinition } from './EventDispatcher.js';
import { propertyDecorators } from '../decorators/Property.js';
import { fieldDecorators } from '../decorators/Field.js';
import { styleDecorators } from '../decorators/Style.js';
/**
 * Aggregates inherited property, listener, and style metadata during {@link Register}.
 */
export class ProtoChain {
    constructors = [];
    fields = {};
    properties = {};
    listeners = {};
    style = '';
    handlers = [];
    /**
     * Creates an instance of `ProtoChain` for specified class constructor.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    constructor(ioNodeConstructor) {
        let proto = ioNodeConstructor.prototype;
        // Iterate through the prototype chain to aggregate constructors.
        // Terminates at `HTMLElement`, `Object` or `Array`.
        while (proto
            && (ioNodeConstructor) !== HTMLElement
            && (ioNodeConstructor) !== Object) {
            this.constructors.push(ioNodeConstructor);
            proto = Object.getPrototypeOf(proto);
            ioNodeConstructor = proto.constructor;
        }
        // Iterate through the prototype chain in reverse to aggregate inherited properties and listeners.
        let reactivePropertyHash = '';
        let fieldHash = '';
        for (let i = this.constructors.length; i--;) {
            ioNodeConstructor = this.constructors[i];
            this.addFieldsFromDecorators(ioNodeConstructor);
            fieldHash = this.addFields(ioNodeConstructor.Fields, fieldHash);
            this.addPropertiesFromDecorators(ioNodeConstructor);
            reactivePropertyHash = this.addProperties(ioNodeConstructor.Properties, reactivePropertyHash);
            this.addListeners(ioNodeConstructor.Listeners);
            this.addStyle(ioNodeConstructor.Style);
            this.addStyleFromDecorators(ioNodeConstructor);
            this.addHandlers(ioNodeConstructor.prototype);
        }
        debug: this.validateReactiveProperties();
        // Freeze aggregated properties to prevent accidental modifications
        Object.freeze(this.constructors);
        Object.freeze(this.fields);
        Object.freeze(this.properties);
        Object.freeze(this.listeners);
        Object.freeze(this.handlers);
    }
    /**
     * Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
     * NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.
     * @param {ReactiveNode} node - Target node instance
     */
    init(node) {
        if (this.constructors[0] !== node.constructor) {
            throw new Error(`${node.constructor.name} not registered! Use @Register decorator before using ${node.constructor.name} class.`);
        }
        for (let i = this.handlers.length; i--;) {
            const handlerName = this.handlers[i];
            const handler = node[handlerName];
            Object.defineProperty(node, handlerName, {
                value: handler.bind(node),
                writable: true,
                configurable: true
            });
        }
    }
    /**
     * Adds properties defined in decorators to the properties array.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    addFieldsFromDecorators(ioNodeConstructor) {
        const props = fieldDecorators.get(ioNodeConstructor);
        if (props)
            for (const name in props) {
                this.fields[name] = props[name];
            }
    }
    addFields(fields = {}, prevHash = '') {
        const newHash = JSON.stringify(fields);
        if (newHash !== prevHash) {
            for (const name in fields) {
                this.fields[name] = fields[name];
            }
            prevHash = newHash;
        }
        return prevHash;
    }
    /**
     * Adds reactive properties defined in decorators to the properties array.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    addPropertiesFromDecorators(ioNodeConstructor) {
        const props = propertyDecorators.get(ioNodeConstructor);
        if (props)
            for (const name in props) {
                const protoProperty = new ProtoProperty(props[name]);
                if (!this.properties[name])
                    this.properties[name] = protoProperty;
                this.properties[name].assign(protoProperty);
            }
    }
    /**
     * Adds reactive properties from `static get Properties()` to the properties array.
     * Only process properties if they differ from superclass.
     * This prevents 'static get Properties()' from overriding subclass properties defined in decorators.
     * @param {PropertyDefinitions} properties - Fields to add
     * @param {string} prevHash - Previous properties hash
     * @returns {string} - Updated properties hash
     */
    addProperties(properties = {}, prevHash = '') {
        const reativeProtoProperties = {};
        for (const name in properties) {
            reativeProtoProperties[name] = new ProtoProperty(properties[name]);
        }
        const newHash = JSON.stringify(reativeProtoProperties);
        if (newHash !== prevHash) {
            for (const name in properties) {
                if (!this.properties[name])
                    this.properties[name] = reativeProtoProperties[name];
                else
                    this.properties[name].assign(reativeProtoProperties[name]);
            }
            prevHash = newHash;
        }
        return prevHash;
    }
    /**
     * Merges listener definitions from each class in the prototype chain into {@link listeners}.
     * Duplicate handler names update options; distinct handler names append to the array.
     * Runtime registration is handled separately: {@link EventDispatcher} uses last-wins per event name.
     * @param listenerDefs Listener definitions to add
     */
    addListeners(listenerDefs) {
        for (const name in listenerDefs) {
            if (listenerDefs[name]) {
                const lsnDef = hardenListenerDefinition(listenerDefs[name]);
                const listeners = this.listeners[name] = this.listeners[name] || [];
                const i = listeners.findIndex(def => def[0] === lsnDef[0]);
                if (i !== -1) {
                    if (listeners[i][1])
                        listeners[i][1] = Object.assign(listeners[i][1], lsnDef[1]);
                    else if (lsnDef[1])
                        listeners[i][1] = lsnDef[1];
                }
                else {
                    listeners.push(lsnDef);
                }
            }
        }
    }
    /**
     * Adds a style string to the styles array.
     * @param {string} style - Style string to add
     */
    addStyle(style) {
        if (style && this.style.indexOf(style) === -1) {
            this.style = this.style ? this.style + '\n' + style : style;
        }
    }
    ;
    /**
     * Adds style defined in decorators to the style string.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    addStyleFromDecorators(ioNodeConstructor) {
        const style = styleDecorators.get(ioNodeConstructor);
        if (style) {
            this.style = this.style ? this.style + '\n' + style : style;
        }
    }
    /**
     * Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.
     * @param {ReactiveObject} proto - Prototype object to search for handlers
     */
    addHandlers(proto) {
        const names = Object.getOwnPropertyNames(proto);
        for (let j = 0; j < names.length; j++) {
            const fn = names[j];
            if (/^on[A-Z]/.test(fn) || /^_on[A-Z]/.test(fn) || fn.endsWith('Changed') || fn.endsWith('Mutated') || fn.endsWith('Debounced') || fn.endsWith('Throttled') || fn === 'mutated') {
                const propDesr = Object.getOwnPropertyDescriptor(proto, fn);
                if (propDesr === undefined || propDesr.get || propDesr.set)
                    continue;
                if (typeof proto[fn] === 'function') {
                    if (this.handlers.indexOf(fn) === -1) {
                        this.handlers.push(fn);
                    }
                }
            }
        }
    }
    ;
    /**
     * Validates reactive property definitions in debug mode.
     * Logs warnings for incorrect property definitions.
     * @returns {void}
     */
    validateReactiveProperties() {
        for (const name in this.properties) {
            const prop = this.properties[name];
            if (prop.type === String || prop.type === Number || prop.type === Boolean) {
                if (prop.type === Boolean && prop.value !== undefined && typeof prop.value !== 'boolean' ||
                    prop.type === Number && prop.value !== undefined && typeof prop.value !== 'number' ||
                    prop.type === String && prop.value !== undefined && typeof prop.value !== 'string') {
                    console.warn(`Reactive property "${name}" value "${prop.value}" type for ${prop.type.name} property!`);
                }
            }
            else {
                const isNull = prop.value === null;
                const isUndefined = prop.value === undefined;
                if (typeof prop.type === 'function' && !(prop.value instanceof prop.type) && !isNull && !isUndefined) {
                    console.warn(`Reactive property "${name}" value "${prop.value}" type for ${prop.type.name} property!`);
                }
            }
        }
    }
}
