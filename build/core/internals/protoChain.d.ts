import { IoNode, IoNodeConstructor } from '../io-node.js';
import { ProtoProperty } from './property.js';
import { ListenerDefinition } from './eventDispatcher.js';
/**
 * Internal utility class that contains usefull information about class inheritance.
 * Inherited definitions are aggregated additively during prototype chain traversal in `IoNode`.
 */
export declare class ProtoChain {
    readonly constructors: Array<IoNodeConstructor<any>>;
    readonly functions: Array<string>;
    readonly properties: {
        [property: string]: ProtoProperty;
    };
    readonly listeners: {
        [property: string]: ListenerDefinition[];
    };
    readonly style: string;
    readonly observedObjectProperties: string[];
    /**
     * Creates an instance of `ProtoChain`.
     * @param {IoNodeConstructor<any>} ioNodeClass - Owner `IoNode`-derived class.
     */
    constructor(ioNodeClass: IoNodeConstructor<any>);
    /**
     * Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    autobindFunctions(node: IoNode): void;
}
//# sourceMappingURL=protoChain.d.ts.map