export const propertyDecorators = new WeakMap();
export const reactivePropertyDecorators = new WeakMap();
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
export function Property(initialValue = undefined) {
    return (target, propertyName) => {
        const constructor = target.constructor;
        const properties = propertyDecorators.get(constructor) || {};
        propertyDecorators.set(constructor, properties);
        properties[propertyName] = initialValue;
    };
}
;
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
export function ReactiveProperty(defLoose = {}) {
    return (target, propertyName) => {
        const constructor = target.constructor;
        const properties = reactivePropertyDecorators.get(constructor) || {};
        reactivePropertyDecorators.set(constructor, properties);
        properties[propertyName] = defLoose;
    };
}
;
//# sourceMappingURL=Property.js.map