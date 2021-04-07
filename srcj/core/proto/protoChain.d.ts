declare type Prototype = Object & {
    constructor: Function;
};
/**
 * An array of all inherited prototypes in the prototype chain.
 */
export declare class ProtoChain extends Array<Prototype> {
    /**
     * Creates an array of inherited prototypes by traversing down the prototype chain of the specified prototype and adds each prototype to itself.
     * It terminates with `HTMLElement`, `Object` or `Array`.
     * @param {Object} prototype - Prototype object.
     */
    constructor(prototype: Prototype);
}
export {};
//# sourceMappingURL=protoChain.d.ts.map