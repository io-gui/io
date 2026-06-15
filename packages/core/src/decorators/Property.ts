import { ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js'
import { ReactiveNode, AnyConstructor, ReactivePropertyDefinitions } from '../nodes/ReactiveNode.js'
import { IoElement } from '../elements/IoElement.js'

export const propertyDecorators: WeakMap<AnyConstructor, Record<string, unknown>> = new WeakMap()
export const reactivePropertyDecorators: WeakMap<AnyConstructor, ReactivePropertyDefinitions> = new WeakMap()

const RESERVED_ELEMENT_PROPERTIES = [
  // TODO: consider adding all native element properties?
  'class', 'style', 'id', 'key', 'children'
]

/**
 * Declares a property and an initial value for a property.
 * @decorator
 * @param {any} initialValue - Initial value.
 * @returns {Function} Property decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends ReactiveNode {
 *   \@Property('default text')
 *   declare title: string;
 * }
 */
export function Property(initialValue: unknown = undefined) {
  return (target: typeof IoElement.prototype | typeof ReactiveNode.prototype, propertyName: string) => {
    if (RESERVED_ELEMENT_PROPERTIES.includes(propertyName) && (target as typeof IoElement.prototype)._isIoElement) {
      console.error(`Property ${propertyName} is reserved and cannot be used as a property name.`)
    }
    const constructor = target.constructor as AnyConstructor
    const properties = propertyDecorators.get(constructor) || {}
    propertyDecorators.set(constructor, properties)
    properties[propertyName] = initialValue
  }
};

/**
 * Declares a reactive property and defines its inital value and behavior using a loose or strict definition.
 * @decorator
 * @param {ReactivePropertyDefinitionLoose} defLoose - Property definition.
 * @returns {Function} Property decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends ReactiveNode {
 *   \@ReactiveProperty({type: String, value: 'default text', reflect: true})
 *   declare title: string;
 * }
 *
 * @example
 * \@Register
 * class MyClass extends ReactiveNode {
 *   \@ReactiveProperty({type: Array, init: [0, 0]})
 *   declare size: [number, number];
 * }
 */
export function ReactiveProperty(defLoose: ReactivePropertyDefinitionLoose = {}) {
  return (target: typeof IoElement.prototype | typeof ReactiveNode.prototype, propertyName: string) => {
    if (RESERVED_ELEMENT_PROPERTIES.includes(propertyName) && (target as typeof IoElement.prototype)._isIoElement) {
      console.error(`ReactiveProperty ${propertyName} is reserved and cannot be used as a property name.`)
    }
    const constructor = target.constructor as AnyConstructor
    const properties = reactivePropertyDecorators.get(constructor) || {}
    reactivePropertyDecorators.set(constructor, properties)
    properties[propertyName] = defLoose
  }
};