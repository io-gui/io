import { Constructor, IoNode } from '../node.js';
import { Binding } from './binding.js';
/**
 * Declares default value, type and reactive behavior of the property.
 */
export type PropertyDeclaration = {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect?: boolean;
    reactive?: boolean;
    observe?: boolean;
    init?: any;
};
/**
 * Allows loose declaration of properties by specifying only partial declarations such as default value or type.
 */
export type PropertyDeclarationLoose = string | number | boolean | Array<any> | null | undefined | Constructor | Binding | PropertyDeclaration;
/**
 * Finalized property definition created from property declaration.
 */
export declare class ProtoProperty {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect?: boolean;
    reactive?: boolean;
    observe?: boolean;
    init?: any;
    /**
     * Takes a loosely typed property declaration and returns full property definition with unscpecified fileds inferred.
     * @param {PropertyDeclarationLoose} def Loosely typed property definition
     */
    constructor(def: PropertyDeclarationLoose);
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
    reflect: boolean;
    reactive: boolean;
    observe: boolean;
    init?: any;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param node owner IoNode instance
     * @param propDef ProtoProperty object
     */
    constructor(node: IoNode, propDef: ProtoProperty);
}
export type PropertyDeclarations = Record<string, PropertyDeclarationLoose>;
export declare const PropertyDecorators: WeakMap<Constructor, PropertyDeclarations>;
/**
 * Allows property declarations using decorator pattern.
 * @param propertyDefinition Property declaration.
 * @return Property decorator function.
 */
export declare const Property: (propertyDefinition: PropertyDeclarationLoose) => (target: IoNode, propertyName: string) => void;
//# sourceMappingURL=property.d.ts.map