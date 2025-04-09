import { PropertyDefinitionLoose } from '../internals/property';
import { propertyDecorators } from '../internals/protoChain';
import { IoNode, AnyConstructor } from '../nodes/node';

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