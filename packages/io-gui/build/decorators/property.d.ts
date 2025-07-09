import { ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js';
import { Node, AnyConstructor, ReactivePropertyDefinitions } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';
export declare const propertyDecorators: WeakMap<AnyConstructor, Record<string, any>>;
export declare const reactivePropertyDecorators: WeakMap<AnyConstructor, ReactivePropertyDefinitions>;
/**
 * Declares a property and an initial value for a property.
 * @decorator
 * @param {any} initialValue - Initial value.
 * @returns {Function} Property decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends Node {
 *   \@Property('default text')
 *   declare title: string;
 * }
 */
export declare function Property(initialValue?: any): (target: Node | IoElement, propertyName: string) => void;
/**
 * Declares a reactive property and defines its inital value and behavior using a loose or strict definition.
 * @decorator
 * @param {ReactivePropertyDefinitionLoose} propertyDefinition - Property definition.
 * @returns {Function} Property decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends Node {
 *   \@ReactiveProperty({type: String, value: 'default text', reflect: true})
 *   declare title: string;
 * }
 *
 * @example
 * \@Register
 * class MyClass extends Node {
 *   \@ReactiveProperty({type: Array, init: [0, 0]})
 *   declare size: [number, number];
 * }
 */
export declare function ReactiveProperty(propertyDefinition?: ReactivePropertyDefinitionLoose): (target: Node | IoElement, propertyName: string) => void;
//# sourceMappingURL=Property.d.ts.map