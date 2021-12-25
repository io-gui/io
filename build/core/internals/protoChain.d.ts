import { IoNode, IoNodeConstructor } from '../io-node.js';
import { PropertyDefinition } from './properties.js';
import { ListenerDefinition } from './eventDispatcher.js';
/**
 * Internal utility class that contains usefull information about inherited constructors, function names, properties, listeners,
 * as well as some utility functions. Inherited information is gathered automatically by prototype chain traversal
 * that terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
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
    /**
     * Creates an instance of `ProtoChain` and initializes the arrays of inherited contructors, function names, properties and listeners.
     * @param {Constructor} nodeConstructor - Prototype object.
     */
    constructor(nodeConstructor: IoNodeConstructor<any>);
    /**
     * Binds all functions from the `.functions` list to specified instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bindFunctions(node: IoNode): void;
    dispose(): void;
}
//# sourceMappingURL=protoChain.d.ts.map