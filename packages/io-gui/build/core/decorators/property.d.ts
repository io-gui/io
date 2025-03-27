import { PropertyDefinitionLoose } from '../internals/property';
import { IoNode } from '../node';
/**
 * Allows property definitions using decorator pattern.
 * @param {PropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export declare const Property: (propertyDefinition: PropertyDefinitionLoose) => (target: IoNode, propertyName: string) => void;
//# sourceMappingURL=property.d.ts.map