import { ReactiveObject, AnyConstructor } from '../nodes/ReactiveObject.js'
import { ReactiveElement } from '../elements/ReactiveElement.js'

export const fieldDecorators: WeakMap<AnyConstructor, Record<string, unknown>> = new WeakMap()

const RESERVED_ELEMENT_PROPERTIES = [
  // TODO: consider adding all native element properties?
  'class', 'style', 'id', 'key', 'children'
]

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
export function Field(initialValue: unknown = undefined) {
  return (target: typeof ReactiveElement.prototype | typeof ReactiveObject.prototype, propertyName: string) => {
    if (RESERVED_ELEMENT_PROPERTIES.includes(propertyName) && (target as typeof ReactiveElement.prototype)._isReactiveElement) {
      console.error(`Field ${propertyName} is reserved and cannot be used as a property name.`)
    }
    const constructor = target.constructor as AnyConstructor
    const properties = fieldDecorators.get(constructor) || {}
    fieldDecorators.set(constructor, properties)
    properties[propertyName] = initialValue
  }
};
