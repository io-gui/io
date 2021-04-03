declare type Constructor = new (...args: any[]) => Object;
/**
 * An array of all prototypes in the inheritance chain.
 */
declare class ProtoChain extends Array<Constructor> {
    /**
     * Creates an array of protptypes by traversing down the prototype inheritance chain of the specified prototype and adds each prototype to itself.
     * It terminates with `HTMLElement`, `Object` or `Array`.
     */
    constructor(proto: Constructor);
}
export { ProtoChain };
//# sourceMappingURL=protochain.d.ts.map