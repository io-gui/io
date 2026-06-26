import { ReactiveObject, AnyConstructor } from '../nodes/ReactiveObject.js';
import { ReactiveElement } from '../elements/ReactiveElement.js';
export declare const fieldDecorators: WeakMap<AnyConstructor, Record<string, unknown>>;
/**
 * Declares a property and an initial value for a property.
 * @decorator
 * @param {any} initialValue - Initial value.
 * @returns {Function} Field decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends ReactiveObject {
 *   \@Field('default text')
 *   declare title: string;
 * }
 */
export declare function Field(initialValue?: unknown): (target: typeof ReactiveElement.prototype | typeof ReactiveObject.prototype, propertyName: string) => void;
