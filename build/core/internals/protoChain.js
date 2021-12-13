/**
 * Automatically generated array of all contructors inherited from the prototype chain.
 */
export class ProtoChain extends Array {
    /**
     * Creates an array of inherited contructors by traversing down the prototype chain of the specified contructor and adds each contructor to itself.
     * It terminates the prototype chain before it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
     * @param {Constructor} constructor - Prototype object.
     */
    constructor(constructor) {
        super();
        let prototype = constructor.prototype;
        while (prototype
            && prototype.constructor.name !== 'classConstructor'
            && prototype.constructor !== HTMLElement
            && prototype.constructor !== Object
            && prototype.constructor !== Array) {
            this.push(prototype.constructor);
            prototype = prototype.__proto__;
        }
    }
}
//# sourceMappingURL=protoChain.js.map