import { IoNode, IoNodeConstructor } from '../node.js';
import { ProtoProperty } from './property.js';
import { ListenerDeclaration } from './eventDispatcher.js';
/**
 * Internal utility class that contains usefull information about class inheritance.
 * Inherited information is aggregated during prototype chain traversal in `RegisterIoNode()`.
 */
export declare class ProtoChain {
    readonly constructors: Array<IoNodeConstructor<any>>;
    readonly functions: Array<string>;
    readonly properties: {
        [property: string]: ProtoProperty;
    };
    readonly listeners: {
        [property: string]: ListenerDeclaration[];
    };
    readonly style: string;
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