import { ProtoChain } from './protochain.js';
/**
 * Collection of all functions defined in the prototype chain that start with "on" or "_"
 */
declare class ProtoFunctions extends Array {
    /**
     * Creates a collection of all function from protochain that start with "on" or "_".
     * @param {ProtoChain} protochain - Array of protochain constructors.
     */
    constructor(protochain: ProtoChain);
    /**
     * Binds all functions to `this`.
     */
    bind(instance: any): void;
}
export { ProtoFunctions };
//# sourceMappingURL=functions.d.ts.map