import { IoNode } from '../io-node.js';
import { ProtoProperty } from './properties.js';
import { ProtoListenerArrayType } from './eventDispatcher.js';
declare type Constructor<T extends HTMLElement | Array<any> | unknown> = new (...args: any[]) => T;
/**
 * Internal utility class that contains usefull information about inherited constructors, function names and properties,
 * as well as some utility functions. Inherited information is gathered automatically by prototype chain traversal
 * that terminates when it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
 */
export declare class ProtoChain {
    readonly constructors: Array<Constructor<any>>;
    readonly functions: Array<string>;
    readonly properties: {
        [property: string]: ProtoProperty;
    };
    readonly listeners: {
        [listener: string]: ProtoListenerArrayType;
    };
    /**
     * Creates an instance of `ProtoChain` and initializes the arrays of inherited contructors and function names and properties.
     * @param {Constructor} nodeConstructor - Prototype object.
     */
    constructor(nodeConstructor: Constructor<any>);
    /**
     * Binds all functions from the `.functions` list to specified instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bindFunctions(node: IoNode): void;
}
export {};
//# sourceMappingURL=protoChain.d.ts.map