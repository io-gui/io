import { ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty';
import { Node, AnyConstructor, ReactivePropertyDefinitions } from '../nodes/Node';

export const reactivePropertyDecorators: WeakMap<AnyConstructor, ReactivePropertyDefinitions> = new WeakMap();

/**
 * Allows property definitions using decorator pattern.
 * @param {ReactivePropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export const ReactiveProperty = function(propertyDefinition: ReactivePropertyDefinitionLoose = {}) {
  return (target: Node, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const _Properties = reactivePropertyDecorators.get(constructor) || {};
    reactivePropertyDecorators.set(constructor, _Properties);
    _Properties[propertyName] = propertyDefinition;
  };
};