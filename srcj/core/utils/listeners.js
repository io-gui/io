/**
 * Collection of all listeners defined in the prototype chain.
 */
export class ProtoListeners {
    /**
     * Creates a collection of all listeners from protochain.
     */
    constructor(protochain) {
        for (let i = protochain.length; i--;) {
            const listeners = protochain[i].constructor.Listeners;
            for (let l in listeners)
                this[l] = listeners[l];
        }
    }
}
//# sourceMappingURL=listeners.js.map