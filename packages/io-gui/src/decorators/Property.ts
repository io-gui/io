import { ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js';
import { Node, AnyConstructor, ReactivePropertyDefinitions } from '../nodes/Node.js';

export const propertyDecorators: WeakMap<AnyConstructor, Record<string, any>> = new WeakMap();
export const reactivePropertyDecorators: WeakMap<AnyConstructor, ReactivePropertyDefinitions> = new WeakMap();

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
export function Property(initialValue: any = undefined) {
  return (target: Node, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const properties = propertyDecorators.get(constructor) || {};
    propertyDecorators.set(constructor, properties);
    properties[propertyName] = initialValue;
  };
};

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
export function ReactiveProperty(propertyDefinition: ReactivePropertyDefinitionLoose = {}) {
  return (target: Node, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const properties = reactivePropertyDecorators.get(constructor) || {};
    reactivePropertyDecorators.set(constructor, properties);
    properties[propertyName] = propertyDefinition;
  };
};