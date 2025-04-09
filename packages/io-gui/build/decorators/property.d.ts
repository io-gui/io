import { PropertyDefinitionLoose } from '../core/Property';
import { IoNode } from '../nodes/Node';
/**
 * Allows property definitions using decorator pattern.
 * @param {PropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export declare const Property: (propertyDefinition: PropertyDefinitionLoose) => (target: IoNode, propertyName: string) => void;
//# sourceMappingURL=Property.d.ts.map