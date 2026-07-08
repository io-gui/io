export const fieldDecorators = new WeakMap();
const RESERVED_ELEMENT_PROPERTIES = [
    // TODO: consider adding all native element properties?
    'class', 'style', 'id', 'key', 'children'
];
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
export function Field(initialValue = undefined) {
    return (target, propertyName) => {
        if (RESERVED_ELEMENT_PROPERTIES.includes(propertyName) && target._isReactiveElement) {
            console.error(`Field ${propertyName} is reserved and cannot be used as a property name.`);
        }
        const constructor = target.constructor;
        const properties = fieldDecorators.get(constructor) || {};
        fieldDecorators.set(constructor, properties);
        properties[propertyName] = initialValue;
    };
}
;
