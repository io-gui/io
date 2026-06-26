/**
 * Registers a new ReactiveObject or ReactiveElement subclass. This needs to be called for each new class that extends ReactiveObject or ReactiveElement.
 * @param {ReactiveNode} ioNodeConstructor - ReactiveObject class to register.
 *
 * @example
 * // Creating a new ReactiveObject subclass.
 * \@Register
 * class MyNode extends ReactiveObject {
 * }
 *
 * @example
 * // Creating a new ReactiveElement subclass.
 * \@Register
 * class MyIoElement extends ReactiveElement {
 * }
 *
 * @example
 * //Javascript without decorator syntax.
 * class MyNode extends ReactiveObject {
 * }
 * Register(MyNode);
*/
export function Register(ioNodeConstructor) {
    ioNodeConstructor.prototype.Register(ioNodeConstructor);
}
