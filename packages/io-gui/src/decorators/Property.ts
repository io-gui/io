import { Node, AnyConstructor } from '../nodes/Node';

export const propertyDecorators: WeakMap<AnyConstructor, Record<string, any>> = new WeakMap();

/**
 * Sets a initial value for a property.
 * @param {any} initialValue - Initial value.
 * @return {Function} Property decorator function.
 */
export const Property = function(initialValue: any) {
  return (target: Node, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const _values = propertyDecorators.get(constructor) || {};
    propertyDecorators.set(constructor, _values);
    _values[propertyName] = initialValue;
  };
};