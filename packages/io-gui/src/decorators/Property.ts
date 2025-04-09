import { PropertyDefinitionLoose } from '../core/Property';
import { propertyDecorators } from '../core/ProtoChain';
import { IoNode, AnyConstructor } from '../nodes/Node';

/**
 * Allows property definitions using decorator pattern.
 * @param {PropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export const Property = function(propertyDefinition: PropertyDefinitionLoose) {
  return (target: IoNode, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const _Properties = propertyDecorators.get(constructor) || {};
    propertyDecorators.set(constructor, _Properties);
    _Properties[propertyName] = propertyDefinition;
  };
};