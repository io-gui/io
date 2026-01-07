import { ReactiveProtoProperty } from './ReactiveProperty.js';
import { hardenListenerDefinition } from './EventDispatcher.js';
import { reactivePropertyDecorators } from '../decorators/Property.js';
import { propertyDecorators } from '../decorators/Property.js';
import { styleDecorators } from '../decorators/Style.js';
/**
 * ProtoChain manages class inheritance metadata and configuration.
 *
 * This utility class traverses the prototype chain during class registration to:
 * - Aggregate property configurations
 * - Aggregate event listeners
 * - Aggregate CSS styles strings
 * - Auto-bind event handlers to maintain proper 'this' context
 *
 * This class is internal and instantiated during the `Register()` process.
 */
export class ProtoChain {
    /**
     * Array of inherited class constructors
     */
    constructors = [];
    /**
     * Aggregated initial value for properties declared in `static get Properties()` or @Property() decorators
    */
    properties = {};
    /**
     * Aggregated reactive property definition declared in `static get ReactiveProperties()` or @ReactiveProperty() decorators
     */
    reactiveProperties = {};
    /**
     * Aggregated listener definition declared in `static get Listeners()`
     */
    listeners = {};
    /**
     * Aggregated CSS style definition declared in `static get Style()`
     */
    style = '';
    /**
     * Array of function names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding.
     */
    handlers = [];
    /**
     * Creates an instance of `ProtoChain` for specified class constructor.
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
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
        let propertyHash = '';
        for (let i = this.constructors.length; i--;) {
            ioNodeConstructor = this.constructors[i];
            this.addPropertiesFromDecorators(ioNodeConstructor);
            propertyHash = this.addProperties(ioNodeConstructor.Properties, propertyHash);
            this.addReactivePropertiesFromDecorators(ioNodeConstructor);
            reactivePropertyHash = this.addReactiveProperties(ioNodeConstructor.ReactiveProperties, reactivePropertyHash);
            this.addListeners(ioNodeConstructor.Listeners);
            this.addStyle(ioNodeConstructor.Style);
            this.addStyleFromDecorators(ioNodeConstructor);
            this.addHandlers(ioNodeConstructor.prototype);
        }
        debug: this.validateReactiveProperties();
        // Freeze aggregated properties to prevent accidental modifications
        Object.freeze(this.constructors);
        Object.freeze(this.properties);
        Object.freeze(this.reactiveProperties);
        Object.freeze(this.listeners);
        Object.freeze(this.handlers);
    }
    /**
     * Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
     * NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.
     * @param {Node | IoElement} node - Target node instance
     */
    init(node) {
        if (this.constructors[0] !== node.constructor) {
            throw new Error(`${node.constructor.name} not registered! Use @Register decorator before using ${node.constructor.name} class.`);
        }
        for (let i = this.handlers.length; i--;) {
            Object.defineProperty(node, this.handlers[i], {
                value: node[this.handlers[i]].bind(node),
                writable: true,
                configurable: true
            });
        }
    }
    /**
     * Adds properties defined in decorators to the properties array.
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
     */
    addPropertiesFromDecorators(ioNodeConstructor) {
        const props = propertyDecorators.get(ioNodeConstructor);
        if (props)
            for (const name in props) {
                this.properties[name] = props[name];
            }
    }
    addProperties(properties = {}, prevHash = '') {
        const newHash = JSON.stringify(properties);
        if (newHash !== prevHash) {
            for (const name in properties) {
                this.properties[name] = properties[name];
            }
            prevHash = newHash;
        }
        return prevHash;
    }
    /**
     * Adds reactive properties defined in decorators to the properties array.
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
     */
    addReactivePropertiesFromDecorators(ioNodeConstructor) {
        const props = reactivePropertyDecorators.get(ioNodeConstructor);
        if (props)
            for (const name in props) {
                const protoProperty = new ReactiveProtoProperty(props[name]);
                if (!this.reactiveProperties[name])
                    this.reactiveProperties[name] = protoProperty;
                this.reactiveProperties[name].assign(protoProperty);
            }
    }
    /**
     * Adds reactive properties from `static get ReactiveProperties()` to the properties array.
     * Only process properties if they differ from superclass.
     * This prevents 'static get ReactiveProperties()' from overriding subclass properties defined in decorators.
     * @param {ReactivePropertyDefinitions} properties - Properties to add
     * @param {string} prevHash - Previous properties hash
     * @returns {string} - Updated properties hash
     */
    addReactiveProperties(properties = {}, prevHash = '') {
        const reativeProtoProperties = {};
        for (const name in properties) {
            reativeProtoProperties[name] = new ReactiveProtoProperty(properties[name]);
        }
        const newHash = JSON.stringify(reativeProtoProperties);
        if (newHash !== prevHash) {
            for (const name in properties) {
                if (!this.reactiveProperties[name])
                    this.reactiveProperties[name] = reativeProtoProperties[name];
                else
                    this.reactiveProperties[name].assign(reativeProtoProperties[name]);
            }
            prevHash = newHash;
        }
        return prevHash;
    }
    /**
     * Merges or appends a listener definitions to the existing listeners array.
     * @param {ListenerDefinitions} listenerDefs - Listener definitions to add
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
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
     */
    addStyleFromDecorators(ioNodeConstructor) {
        const style = styleDecorators.get(ioNodeConstructor);
        if (style) {
            this.style = this.style ? this.style + '\n' + style : style;
        }
    }
    /**
     * Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.
     * @param {Node} proto - Prototype object to search for handlers
     */
    addHandlers(proto) {
        const names = Object.getOwnPropertyNames(proto);
        for (let j = 0; j < names.length; j++) {
            const fn = names[j];
            if (/^on[A-Z]/.test(fn) || /^_on[A-Z]/.test(fn) || fn.endsWith('Changed') || fn.endsWith('Mutated') || fn.endsWith('Debounced') || fn.endsWith('Throttled') || fn === 'changed') {
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
        for (const name in this.reactiveProperties) {
            const prop = this.reactiveProperties[name];
            if ([String, Number, Boolean].indexOf(prop.type) !== -1) {
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
//# sourceMappingURL=ProtoChain.js.map