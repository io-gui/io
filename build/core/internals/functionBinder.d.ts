import { ProtoChain } from './protoChain.js';
import { IoNode } from '../io-node.js';
/**
 * An array of all inherited function names from a prototype chain that start with "on" or "_".
 * It provides a utility function `.bind(node)` that binds the functions to the specified instance of `IoNode`.
 */
export declare class FunctionBinder extends Array<string> {
    /**
     * Initializes the array of all inherited function names from a prototype chain that start with "on" or "_".
     * @param {ProtoChain} protochain - Array of protochain constructors.
     */
    constructor(protochain: ProtoChain);
    /**
     * Binds all functions to specified instance of `IoNode`.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bind(node: IoNode): void;
}
//# sourceMappingURL=functionBinder.d.ts.map