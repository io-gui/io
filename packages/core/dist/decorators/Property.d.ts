import { PropertyDefinitionLoose } from '../core/Property.js';
import { ReactiveObject, AnyConstructor, PropertyDefinitions } from '../nodes/ReactiveObject.js';
import { ReactiveElement } from '../elements/ReactiveElement.js';
export declare const propertyDecorators: WeakMap<AnyConstructor, PropertyDefinitions>;
/**
 * Declares a reactive property and defines its inital value and behavior using a loose or strict definition.
 * @decorator
 * @param {PropertyDefinitionLoose} defLoose - Field definition.
 * @returns {Function} Field decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends ReactiveObject {
 *   \@Property({type: String, value: 'default text', reflect: true})
 *   declare title: string;
 * }
 *
 * @example
 * \@Register
 * class MyClass extends ReactiveObject {
 *   \@Property({type: Array, init: [0, 0]})
 *   declare size: [number, number];
 * }
 */
export declare function Property(defLoose?: PropertyDefinitionLoose): (target: typeof ReactiveElement.prototype | typeof ReactiveObject.prototype, propertyName: string) => void;
