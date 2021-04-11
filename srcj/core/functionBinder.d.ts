import { ProtoChain } from './protoChain.js';
import { IoNode } from '../components/io-node.js';
/**
 * Collection of all functions defined in the prototype chain that start with "on" or "_"
 */
declare class FunctionBinder extends Array<string> {
    /**
     * Creates a collection of all functions from protochain that start with "on" or "_".
     * @param {ProtoChain} protochain - Array of protochain constructors.
     */
    constructor(protochain: ProtoChain);
    /**
     * Binds all functions to node instance.
     * @param {IoNode} node - IoNode instance to bind functions to.
     */
    bind(node: IoNode): void;
}
export { FunctionBinder };
//# sourceMappingURL=functionBinder.d.ts.map