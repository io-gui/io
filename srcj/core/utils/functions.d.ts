import { ProtoChain } from '../protochain.js';
import { Node } from '../node.js';
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
     * @param {Node} node - Node instance to bind functions to.
     */
    bind(node: Node): void;
}
export { FunctionBinder };
//# sourceMappingURL=functions.d.ts.map