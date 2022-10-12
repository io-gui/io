import { Constructor, IoNode } from '../node.js';
import { Binding } from './binding.js';
declare type Reflect = 'attr' | 'none' | 'prop' | 'both';
/**
 * Declares default value, type and reactive behavior of the property.
 */
export declare type PropertyDeclaration = {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect?: Reflect;
    notify?: boolean;
    observe?: boolean;
};
/**
 * Allows weak declaration of properties by specifying only partial declarations such as default value or type.
 */
export declare type PropertyDeclarationWeak = string | number | boolean | Array<any> | null | undefined | Constructor | Binding | PropertyDeclaration;
/**
 * Finalized property definition created from property declaration.
 */
export declare class ProtoProperty {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect?: Reflect;
    notify?: boolean;
    observe?: boolean;
    /**
     * Takes a weakly typed property declaration and returns full property definition with unscpecified fileds inferred.
     * @param {PropertyDeclarationWeak} def Weakly typed property definition
     */
    constructor(def: PropertyDeclarationWeak);
    /**
     * Assigns values of another ProtoProperty to itself, unless they are default values.
     * @param {ProtoProperty} protoProp Source ProtoProperty
     */
    assign(protoProp: ProtoProperty): void;
}
/**
 * PropertyInstance object constructed from `ProtoProperty`.
 */
export declare class PropertyInstance {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect: Reflect;
    notify: boolean;
    observe: boolean;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param {ProtoProperty} propDef ProtoProperty object
     */
    constructor(propDef: ProtoProperty);
}
export declare type PropertyDeclarations = Record<string, PropertyDeclarationWeak>;
export declare const PropertyDecorators: WeakMap<Constructor, PropertyDeclarations>;
/**
 * Allows property declarations using decorator pattern.
 * @param {PropertyDeclarationWeak} propertyDefinition Property declaration.
 * @return {Function} Property decorator function.
 */
export declare const IoProperty: (propertyDefinition: PropertyDeclarationWeak) => (target: IoNode, propertyName: string) => void;
export {};
//# sourceMappingURL=property.d.ts.map