import { PropertyDefinitionLoose, propertyDecorators } from '../internals/property';
import { IoNode, Constructor } from '../node';

/**
 * Allows property definitions using decorator pattern.
 * @param {PropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export const Property = function(propertyDefinition: PropertyDefinitionLoose) {
  return (target: IoNode, propertyName: string) => {
    const constructor = target.constructor as Constructor;
    const _Properties = propertyDecorators.get(constructor) || {};
    propertyDecorators.set(constructor, _Properties);
    _Properties[propertyName] = propertyDefinition;
  };
};