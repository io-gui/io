import { IoNode, IoNodeConstructor } from '../io-node.js';
import { PropertyDefinition } from './property.js';
import { ListenerDefinition } from './eventDispatcher.js';
/**
 * Internal utility class that contains usefull information about class inheritance such as:
 * - Array of inherited class constructors ending with `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`
 * - Array of function names that start with "on" or "_" for auto-binding
 * - Property definitions declared in `static get Properties()` return oject
 * - Listener definitions declared in `static get Listeners()` return oject
 * - CSS style string declared in `static get Style()` return string
 * - Array of property names of observed object properties
 *
 * Inherited information is aggregated automatically by prototype chain traversal that
 * It collects information from inhertited classes specified in static getters in an additive manner,
 * respecting the order of inheritance.
 */
export declare class ProtoChain {
    readonly constructors: Array<IoNodeConstructor<any>>;
    readonly functions: Array<string>;
    readonly properties: {
        [property: string]: PropertyDefinition;
    };
    readonly listeners: {
        [property: string]: ListenerDefinition[];
    };
    readonly style: string;
    readonly observedObjects: string[];
    /**
     * Creates an instance of `ProtoChain`.
     * @param {IoNodeConstructor<any>} ioNodeClass - Owner `IoNode`-derived class.
     */
    constructor(ioNodeClass: IoNodeConstructor<any>);
    /**
     * Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bindFunctions(node: IoNode): void;
}
//# sourceMappingURL=protoChain.d.ts.map