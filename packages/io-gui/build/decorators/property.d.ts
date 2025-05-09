import { PropertyDefinitionLoose } from '../core/Property';
import { Node, AnyConstructor, PropertyDefinitions } from '../nodes/Node';
export declare const propertyDecorators: WeakMap<AnyConstructor, PropertyDefinitions>;
/**
 * Allows property definitions using decorator pattern.
 * @param {PropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export declare const Property: (propertyDefinition?: PropertyDefinitionLoose) => (target: Node, propertyName: string) => void;
//# sourceMappingURL=Property.d.ts.map