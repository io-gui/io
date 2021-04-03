/**
 * Collection of all functions defined in the prototype chain that start with "on" or "_"
 */
class ProtoFunctions extends Array {
    /**
     * Creates a collection of all function from protochain that start with "on" or "_".
     * @param {ProtoChain} protochain - Array of protochain constructors.
     */
    constructor(protochain) {
        super();
        for (let i = protochain.length; i--;) {
            const constructor = protochain[i];
            const names = Object.getOwnPropertyNames(constructor);
            for (let j = 0; j < names.length; j++) {
                const fname = names[j];
                if (fname === 'constructor')
                    continue;
                const p = Object.getOwnPropertyDescriptor(constructor, fname);
                if (p.get || p.set)
                    continue;
                if (typeof constructor[fname] === 'function') {
                    if (this.indexOf(fname) === -1 && (fname.startsWith('_') || fname.startsWith('on'))) {
                        this.push(fname);
                    }
                }
            }
        }
    }
    /**
     * Binds all functions to `this`.
     */
    bind(instance) {
        for (let i = this.length; i--;) {
            Object.defineProperty(instance, this[i], { value: instance[this[i]].bind(instance) });
        }
    }
}
export { ProtoFunctions };
//# sourceMappingURL=functions.js.map