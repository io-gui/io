export const propertyDecorators = new WeakMap();
const RESERVED_ELEMENT_PROPERTIES = [
    // TODO: consider adding all native element properties?
    'class', 'style', 'id', 'key', 'children'
];
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
export function Property(defLoose = {}) {
    return (target, propertyName) => {
        if (RESERVED_ELEMENT_PROPERTIES.includes(propertyName) && target._isReactiveElement) {
            console.error(`Property ${propertyName} is reserved and cannot be used as a property name.`);
        }
        const constructor = target.constructor;
        const properties = propertyDecorators.get(constructor) || {};
        propertyDecorators.set(constructor, properties);
        properties[propertyName] = defLoose;
    };
}
;
