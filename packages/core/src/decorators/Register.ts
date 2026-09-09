import { ReactiveObject } from '../nodes/ReactiveObject.js'
import { ReactiveElement } from '../elements/ReactiveElement.js'

/**
 * Registers a new ReactiveObject or ReactiveElement subclass. This needs to be called for each new class that extends ReactiveObject or ReactiveElement.
 * @param {ReactiveNode} ioNodeConstructor - ReactiveObject class to register.
 *
 * @example
 * // Creating a new ReactiveObject subclass.
 * \@Register
 * class MyObject extends ReactiveObject {
 * }
 *
 * @example
 * // Creating a new ReactiveElement subclass.
 * \@Register
 * class MyElement extends ReactiveElement {
 * }
 *
 * @example
 * //Javascript without decorator syntax.
 * class MyObject extends ReactiveObject {
 * }
 * Register(MyObject);
*/
export function Register(ioNodeConstructor: typeof ReactiveObject | typeof ReactiveElement) {
  ioNodeConstructor.prototype.Register(ioNodeConstructor as typeof ReactiveObject & typeof ReactiveElement)
}