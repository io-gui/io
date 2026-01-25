import { ReactiveNode } from '../nodes/ReactiveNode.js';
import { IoElement } from '../elements/IoElement.js';
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
export declare function Register(ioNodeConstructor: typeof ReactiveNode | typeof IoElement): void;
//# sourceMappingURL=Register.d.ts.map