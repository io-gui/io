/**
 * An array of all inherited function names from a prototype chain that start with "on" or "_".
 * It provides a utility function `.bind(node)` that binds the functions to the specified instance of `IoNode`.
 */
export class FunctionBinder extends Array {
    /**
     * Initializes the array of all inherited function names from a prototype chain that start with "on" or "_".
     * @param {ProtoChain} protochain - Array of protochain constructors.
     */
    constructor(protochain) {
        super();
        for (let i = protochain.constructors.length; i--;) {
            const constructor = protochain.constructors[i].prototype;
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
     * Binds all functions to specified instance of `IoNode`.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bind(node) {
        for (let i = this.length; i--;)
            Object.defineProperty(node, this[i], { value: node[this[i]].bind(node) });
    }
}
//# sourceMappingURL=functionBinder.js.map