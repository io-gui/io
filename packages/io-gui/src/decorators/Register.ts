import { Node } from '../nodes/Node';

/**
 * Registers a new Node or IoElement subclass. This needs to be called for each new class that extends Node or IoElement.
 * @param {Node} ioNodeConstructor - Node class to register.
 *
 * @example
 * // Creating a new Node subclass.
 * \@Register
 * class MyNode extends Node {
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
 * class MyNode extends Node {
 * }
 * Register(MyNode);
*/
export function Register(ioNodeConstructor: typeof Node) {
  ioNodeConstructor.prototype.Register(ioNodeConstructor);
}