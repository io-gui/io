import { Binding } from './binding.js';
declare type AnyConstructor = new (...args: any[]) => unknown;
declare type ReflectType = -1 | 0 | 1 | 2;
export declare type PropertyDefinitionWeak = string | number | boolean | Array<any> | null | undefined | AnyConstructor | Binding | {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding;
    reflect?: ReflectType;
    notify?: boolean;
    observe?: boolean;
};
/**
 * Property definition class
 */
export declare class PropertyDefinition {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding;
    reflect: ReflectType;
    notify: boolean;
    observe: boolean;
    /**
     * Takes a weakly typed property definition and returns a strongly typed property definition.
     * @param {PropertyDefinitionWeak} def Weakly typed property definition
     */
    constructor(def: PropertyDefinitionWeak);
}
/**
 * Assigns property definition values to another property definition, unless they are default values.
 * @param {PropertyDefinition} def Property definition
 * @param {PropertyDefinition} newDef Existing property definition
 */
export declare const assignPropertyDefinition: (def: PropertyDefinition, newDef: PropertyDefinition) => void;
/**
 * Property configuration object.
 * It is initialized from corresponding `PropertyDefinition` in `ProtoChain`.
 */
export declare class Property {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding;
    reflect: ReflectType;
    notify: boolean;
    observe: boolean;
    /**
     * Creates the property configuration object and copies values from `PropertyDefinition`.
     * @param {PropertyDefinition} propDef PropertyDefinition object
     */
    constructor(propDef: PropertyDefinition);
}
export {};
//# sourceMappingURL=property.d.ts.map