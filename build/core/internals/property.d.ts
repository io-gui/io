import { Binding } from './binding.js';
declare type Constructor = new (...args: any[]) => unknown;
declare type ReflectType = -1 | 0 | 1 | 2;
export declare type PropertyDefinitionStrong = {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect?: ReflectType;
    notify?: boolean;
    observe?: boolean;
};
export declare type PropertyDefinitionWeak = string | number | boolean | Array<any> | null | undefined | Constructor | Binding | PropertyDefinitionStrong;
/**
 * Property definition class
 */
export declare class ProtoProperty {
    value?: any;
    type?: Constructor;
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
 * @param {ProtoProperty} def Property definition
 * @param {ProtoProperty} newDef Existing property definition
 */
export declare const assignProtoProperty: (def: ProtoProperty, newDef: ProtoProperty) => void;
/**
 * Property configuration object.
 * It is initialized from corresponding `ProtoProperty` in `ProtoChain`.
 */
export declare class Property {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect: ReflectType;
    notify: boolean;
    observe: boolean;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param {ProtoProperty} propDef ProtoProperty object
     */
    constructor(propDef: ProtoProperty);
}
export {};
//# sourceMappingURL=property.d.ts.map