import { Node, AnyConstructor } from '../nodes/Node';

export const propertyDefaults: WeakMap<AnyConstructor, Record<string, any>> = new WeakMap();

/**
 * Sets a default value for a property.
 * @param {any} defaultValue - Default value.
 * @return {Function} Property decorator function.
 */
export const Default = function(defaultValue: any) {
  if (typeof defaultValue === 'function') {
    defaultValue = defaultValue();
  } else if (defaultValue instanceof Array) {
    defaultValue = defaultValue.slice();
  } else if (typeof defaultValue === 'object') {
    defaultValue = Object.assign({}, defaultValue);
  }
  return (target: Node, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const _Defaults = propertyDefaults.get(constructor) || {};
    propertyDefaults.set(constructor, _Defaults);
    _Defaults[propertyName] = defaultValue;
  };
};