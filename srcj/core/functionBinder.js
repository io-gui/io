/**
 * An array of all inherited functions that start with "on" or "_".
 * It provides a utility function `.bind(node)` that binds the functions to the specified instance.
 */
export class FunctionBinder extends Array {
    /**
     * Creates a collection of all inherited functions from protochain that start with "on" or "_".
     * @param {ProtoChain} protochain - Array of protochain constructors.
     */
    constructor(protochain) {
        super();
        for (let i = protochain.length; i--;) {
            const constructor = protochain[i].prototype;
            const names = Object.getOwnPropertyNames(constructor);
            for (let j = 0; j < names.length; j++) {
                const fname = names[j];
                if (fname === 'constructor')
                    continue;
                const p = Object.getOwnPropertyDescriptor(constructor, fname);
                if (p === undefined || p.get || p.set)
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
     * Binds all functions to node instance.
     * @param {IoNode} node - IoNode instance to bind functions to.
     */
    bind(node) {
        for (let i = this.length; i--;)
            Object.defineProperty(node, this[i], { value: node[this[i]].bind(node) });
    }
}
//# sourceMappingURL=functionBinder.js.map