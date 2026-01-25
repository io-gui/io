/**
 * Registers a new ReactiveNode or IoElement subclass. This needs to be called for each new class that extends ReactiveNode or IoElement.
 * @param {ReactiveNode | IoElement} ioNodeConstructor - ReactiveNode class to register.
 *
 * @example
 * // Creating a new ReactiveNode subclass.
 * \@Register
 * class MyNode extends ReactiveNode {
 * }
 *
 * @example
 * // Creating a new IoElement subclass.
 * \@Register
 * class MyIoElement extends IoElement {
 * }
 *
 * @example
 * //Javascript without decorator syntax.
 * class MyNode extends ReactiveNode {
 * }
 * Register(MyNode);
*/
export function Register(ioNodeConstructor) {
    ioNodeConstructor.prototype.Register(ioNodeConstructor);
}
//# sourceMappingURL=Register.js.map