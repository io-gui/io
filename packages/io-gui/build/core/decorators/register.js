/**
 * Register function to be called once per class.
 * @param {IoNode} ioNodeConstructor - Node class to register.
 */
export function Register(ioNodeConstructor) {
    ioNodeConstructor.prototype.Register(ioNodeConstructor);
}
//# sourceMappingURL=register.js.map