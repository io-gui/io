declare type Constructor<T extends any> = new (...args: any[]) => T;
/**
 * An array of all inherited prototypes in the prototype chain.
 */
export declare class ProtoChain extends Array<Constructor<any[]>> {
    /**
     * Creates an array of inherited prototypes by traversing down the prototype chain of the specified prototype and adds each prototype to itself.
     * It terminates with `Node.__proto__`, `HTMLElement`, `Object` or `Array`.
     * @param {Object} prototype - Prototype object.
     */
    constructor(classConstructor: any);
}
export {};
//# sourceMappingURL=protoChain.d.ts.map