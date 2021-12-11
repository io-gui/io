export declare type ProtoChainConstructor<T extends any> = new (...args: any[]) => T;
/**
 * An array of all inherited contructors from the prototype chain.
 */
export declare class ProtoChain extends Array<ProtoChainConstructor<any[]>> {
    /**
     * Creates an array of inherited contructors by traversing down the prototype chain of the specified contructor and adds each contructor to itself.
     * It terminates when prototype chain before it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
     * @param {Object} classConstructor - Prototype object.
     */
    constructor(classConstructor: any);
}
//# sourceMappingURL=protoChain.d.ts.map