import { PropertyDefinitionLoose } from '../core/Property';
import { Node, AnyConstructor, PropertyDefinitions } from '../nodes/Node';

export const propertyDecorators: WeakMap<AnyConstructor, PropertyDefinitions> = new WeakMap();

/**
 * Allows property definitions using decorator pattern.
 * @param {PropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export const Property = function(propertyDefinition: PropertyDefinitionLoose = {}) {
  return (target: Node, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const _Properties = propertyDecorators.get(constructor) || {};
    propertyDecorators.set(constructor, _Properties);
    _Properties[propertyName] = propertyDefinition;
  };
};