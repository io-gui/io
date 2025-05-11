import { ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty';
import { Node, AnyConstructor, ReactivePropertyDefinitions } from '../nodes/Node';
export declare const reactivePropertyDecorators: WeakMap<AnyConstructor, ReactivePropertyDefinitions>;
/**
 * Allows property definitions using decorator pattern.
 * @param {ReactivePropertyDefinitionLoose} propertyDefinition - Property definition.
 * @return {Function} Property decorator function.
 */
export declare const ReactiveProperty: (propertyDefinition?: ReactivePropertyDefinitionLoose) => (target: Node, propertyName: string) => void;
//# sourceMappingURL=ReactiveProperty.d.ts.map