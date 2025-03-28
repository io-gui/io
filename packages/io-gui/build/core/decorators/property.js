import { propertyDecorators } from '../internals/protoChain';
/**
 * Allows property definitions using decorator pattern.
 * @param {PropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export const Property = function (propertyDefinition) {
    return (target, propertyName) => {
        const constructor = target.constructor;
        const _Properties = propertyDecorators.get(constructor) || {};
        propertyDecorators.set(constructor, _Properties);
        _Properties[propertyName] = propertyDefinition;
    };
};
//# sourceMappingURL=property.js.map