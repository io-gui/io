import { Node } from '../components/io-node.js';
/**
 * An array of all inherited prototypes in the prototype chain.
 */
export class ProtoChain extends Array {
    /**
     * Creates an array of inherited prototypes by traversing down the prototype chain of the specified prototype and adds each prototype to itself.
     * It terminates with `Node.__proto__`, `HTMLElement`, `Object` or `Array`.
     * @param {Object} prototype - Prototype object.
     */
    constructor(classConstructor) {
        super();
        let prototype = classConstructor.prototype;
        while (prototype
            && prototype.constructor !== Node.__proto__
            && prototype.constructor !== HTMLElement
            && prototype.constructor !== Object
            && prototype.constructor !== Array) {
            this.push(prototype.constructor);
            prototype = prototype.__proto__;
        }
    }
}
//# sourceMappingURL=protoChain.js.map