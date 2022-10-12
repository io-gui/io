import { ProtoProperty, PropertyDecorators } from './property.js';
import { hardenListenerDeclaration, assignListenerDeclaration } from './eventDispatcher.js';
/**
 * Internal utility class that contains usefull information about class inheritance.
 * Inherited information is aggregated during prototype chain traversal in `RegisterIoNode()`.
 */
export class ProtoChain {
    /*
     * Array of inherited class constructors ending with `HTMLElement`, `Object` or `Array`.
     */
    constructors = [];
    /*
     * Array of function names that start with "on" or "_on" for auto-binding.
     */
    functions = [];
    /*
     * Aggregated property declarations declared in `static get Properties()` return ojects.
     */
    properties = {};
    /*
     * Aggregated listener declarations declared in `static get Listeners()` return ojects.
     */
    listeners = {};
    /*
     * Aggregated CSS style declarations declared in `static get Style()` return strings.
     */
    style = '';
    /*
     * Array of property names of observed object properties.
     */
    observedObjectProperties = [];
    /**
     * Creates an instance of `ProtoChain` for specified class constructor.
     * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode`-derived constructor.
     */
    constructor(ioNodeConstructor) {
        let proto = ioNodeConstructor.prototype;
        // Iterate through the prototype chain to aggregate inheritance information.
        // Terminates at `HTMLElement`, `Object` or `Array`.
        while (proto
            && (ioNodeConstructor) !== HTMLElement
            && (ioNodeConstructor) !== Object
            && (ioNodeConstructor) !== Array) {
            // Add class constructor to array
            this.constructors.push(ioNodeConstructor);
            // Add function names that start with "on" or "_" for auto-binding
            const names = Object.getOwnPropertyNames(proto);
            for (let j = 0; j < names.length; j++) {
                const fn = names[j];
                if (fn.startsWith('_on') || fn.startsWith('on')) {
                    const propDesr = Object.getOwnPropertyDescriptor(proto, fn);
                    if (propDesr === undefined || propDesr.get || propDesr.set)
                        continue;
                    if (typeof proto[fn] === 'function') {
                        if (this.functions.indexOf(fn) === -1) {
                            this.functions.push(fn);
                        }
                    }
                }
            }
            // Concatinate style strings
            if (ioNodeConstructor.Style && this.style.indexOf(ioNodeConstructor.Style) === -1) {
                this.style = ioNodeConstructor.Style + '\n' + this.style;
            }
            // Continue prototype traversal
            proto = Object.getPrototypeOf(proto);
            ioNodeConstructor = proto.constructor;
        }
        // Iterate through the prototype chain once again in reverse to
        // aggregate inherited properties and listeners.
        for (let i = this.constructors.length; i--;) {
            // Add properties from decorators
            let props = PropertyDecorators.get(this.constructors[i]);
            if (props)
                for (const name in props) {
                    const hardPropDef = new ProtoProperty(props[name]);
                    if (!this.properties[name])
                        this.properties[name] = hardPropDef;
                    this.properties[name].assign(hardPropDef);
                }
            // Add properties
            props = this.constructors[i].Properties;
            for (const name in props) {
                const hardPropDef = new ProtoProperty(props[name]);
                if (!this.properties[name])
                    this.properties[name] = hardPropDef;
                this.properties[name].assign(hardPropDef);
            }
            // Add listeners
            const listeners = this.constructors[i].Listeners;
            for (const lsnrName in listeners) {
                if (listeners[lsnrName]) {
                    this.listeners[lsnrName] = this.listeners[lsnrName] || [];
                    assignListenerDeclaration(this.listeners[lsnrName], hardenListenerDeclaration(listeners[lsnrName]));
                }
            }
        }
        // Create a list of observed object property names
        for (const name in this.properties) {
            if (this.properties[name].observe) {
                debug: {
                    const isNull = this.properties[name].value === null;
                    const isUndefined = this.properties[name].value === undefined;
                    const isObject = this.properties[name].value instanceof Object;
                    if ([String, Number, Boolean].indexOf(this.properties[name].type) !== -1 ||
                        (!isNull && !isUndefined && !isObject)) {
                        console.warn('Property `observe` is only intended for object properties!');
                    }
                }
                this.observedObjectProperties.push(name);
            }
        }
    }
    /**
     * Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    autobindFunctions(node) {
        debug: {
            if (node.constructor !== this.constructors[0]) {
                console.warn('`autobindFunctions` should be used on', this.constructors[0].name, 'instance');
            }
        }
        for (let i = this.functions.length; i--;) {
            // Using `Object.defineProperty` so we dont set the function as enumerable property.
            Object.defineProperty(node, this.functions[i], {
                value: node[this.functions[i]].bind(node),
                writable: true,
                configurable: true
            });
        }
    }
}
//# sourceMappingURL=protoChain.js.map