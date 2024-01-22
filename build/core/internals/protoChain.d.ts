import { IoNode, IoNodeConstructor } from '../node.js';
import { ProtoProperty } from './property.js';
import { ListenerDeclaration } from './eventDispatcher.js';
/**
 * Internal utility class that contains usefull information about class inheritance.
 * Inherited information is aggregated during prototype chain traversal in `Register()`.
 */
export declare class ProtoChain {
    /**
     * Array of inherited class constructors ending with `HTMLElement`, `Object` or `Array`.
     */
    readonly constructors: Array<IoNodeConstructor<any>>;
    /**
     * Array of function names that start with "on" or "_" for auto-binding.
     */
    readonly functions: Array<string>;
    /**
     * Aggregated property declarations declared in `static get Properties()` return ojects.
     */
    readonly properties: {
        [property: string]: ProtoProperty;
    };
    /**
     * Aggregated listener declarations declared in `static get Listeners()` return ojects.
     */
    readonly listeners: {
        [property: string]: ListenerDeclaration[];
    };
    /**
     * Aggregated CSS style declarations declared in `static get Style()` return strings.
     */
    readonly style: string;
    /**
     * Array of property names of observed object properties.
     */
    readonly observedObjectProperties: string[];
    /**
     * Creates an instance of `ProtoChain` for specified class constructor.
     * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode`-derived constructor.
     */
    constructor(ioNodeConstructor: IoNodeConstructor<any>);
    /**
     * Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    autobindFunctions(node: IoNode): void;
}
//# sourceMappingURL=protoChain.d.ts.map