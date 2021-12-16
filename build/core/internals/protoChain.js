import { ProtoProperty } from './properties.js';
/**
 * Internal utility class that contains usefull information about inherited constructors, function names, properties, listeners,
 * as well as some utility functions. Inherited information is gathered automatically by prototype chain traversal
 * that terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
 */
export class ProtoChain {
    /*
     * Automatically generated array of all constructors inherited from the prototype chain.
     */
    constructors = [];
    /*
     * Automatically generated array of all function names that start with "on" or "_" inherited from the prototype chain.
     */
    functions = [];
    /*
     * Automatically generated array of all properties defined as `static get Properties()` return objects in inherited classes.
     */
    properties = {};
    /*
     * Automatically generated array of all listeners defined as `static get Listeners()` return objects in inherited classes.
     */
    listeners = {};
    /**
     * Creates an instance of `ProtoChain` and initializes the arrays of inherited contructors, function names, properties and listeners.
     * @param {Constructor} nodeConstructor - Prototype object.
     */
    constructor(nodeConstructor) {
        let proto = nodeConstructor.prototype;
        while (proto
            && nodeConstructor.name !== 'classConstructor'
            && (nodeConstructor) !== HTMLElement
            && (nodeConstructor) !== Object
            && (nodeConstructor) !== Array) {
            // Add constructor
            this.constructors.push(nodeConstructor);
            // Add function names
            const fnames = Object.getOwnPropertyNames(proto);
            for (let j = 0; j < fnames.length; j++) {
                const fname = fnames[j];
                if (fname === 'constructor')
                    continue;
                const prop = Object.getOwnPropertyDescriptor(proto, fname);
                if (prop === undefined || prop.get || prop.set)
                    continue;
                if (typeof proto[fname] === 'function') {
                    if (this.functions.indexOf(fname) === -1 && (fname.startsWith('_') || fname.startsWith('on'))) {
                        this.functions.push(fname);
                    }
                }
            }
            // Continue prototype traversal
            proto = proto.__proto__;
            nodeConstructor = proto.constructor;
        }
        // Properties and listeners are assigned in reverse
        // TODO: change assignment direction and add to loop above for optimizatrion.
        for (let i = this.constructors.length; i--;) {
            // Add properties
            const props = this.constructors[i].Properties;
            for (const p in props) {
                if (!this.properties[p])
                    this.properties[p] = new ProtoProperty(props[p]);
                else
                    this.properties[p].assign(props[p]);
                // TODO: Document or reconsider.
                if (p.charAt(0) === '_') {
                    this.properties[p].notify = false;
                    this.properties[p].enumerable = false;
                }
            }
            // Add listeners
            const listeners = this.constructors[i].Listeners;
            for (const l in listeners) {
                if (listeners[l]) {
                    const listener = (listeners[l] instanceof Array) ? listeners[l] : [listeners[l]];
                    if (!this.listeners[l])
                        this.listeners[l] = [listener];
                }
            }
        }
    }
    /**
     * Binds all functions from the `.functions` list to specified instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bindFunctions(node) {
        for (let i = this.functions.length; i--;) {
            Object.defineProperty(node, this.functions[i], { value: node[this.functions[i]].bind(node) });
        }
    }
    dispose() {
        console.log('TODO');
    }
}
//# sourceMappingURL=protoChain.js.map