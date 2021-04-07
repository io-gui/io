/**
 * Collection of all listeners defined in the prototype chain.
 */
export class ProtoListeners {
    /**
     * Creates a collection of all listeners from protochain.
     */
    constructor(protochain) {
        for (let i = protochain.length; i--;) {
            const prop = protochain[i].constructor.Listeners;
            for (let j in prop)
                this[j] = prop[j];
            for (let j in prop)
                console.log(j, prop[j]);
        }
    }
}
//# sourceMappingURL=protoListeners.js.map