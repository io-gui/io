import { Binding } from './propertyBinder.js';
declare type AnyConstructor = new (...args: any[]) => unknown;
declare type ReflectType = -1 | 0 | 1 | 2;
export declare type PropertyDefinition = {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding;
    reflect: ReflectType;
    notify: boolean;
    observe: boolean;
    readonly: boolean;
    strict: boolean;
    enumerable: boolean;
};
export declare type PropertyDefinitionWeak = string | number | boolean | null | AnyConstructor | Binding | {
    value?: any;
    type?: AnyConstructor;
    reflect?: ReflectType;
    binding?: Binding;
    notify?: boolean;
    observe?: boolean;
    readonly?: boolean;
    strict?: boolean;
    enumerable?: boolean;
};
export declare const hardenPropertyDefinition: (propDef: PropertyDefinitionWeak) => PropertyDefinition;
export declare const assignPropertyDefinition: (propDef: PropertyDefinition, newPropDef: PropertyDefinition) => void;
/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `PropertyDefinition`.
 */
export declare class Property {
    value?: any;
    type?: AnyConstructor;
    reflect: number;
    notify: boolean;
    observe: boolean;
    readonly: boolean;
    strict: boolean;
    enumerable: boolean;
    binding?: Binding;
    /**
     * Creates the property configuration object and copies values from `PropertyDefinition`.
     * @param {PropertyDefinition} propDef PropertyDefinition object
     */
    constructor(propDef: PropertyDefinition);
}
/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
export declare class Properties {
    private readonly node;
    private readonly keys;
    private connected;
    /**
     * Creates the properties for specified `IoNode`.
     * @param {any} node Owner IoNode instance.
     */
    constructor(node: any);
    /**
     * Returns the property value.
     * @param {string} key property name to get value of.
     * @return {any} Peroperty value.
     */
    get(key: string): any;
    /**
     * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
     * @param {string} key Property name to set value of.
     * @param {any} value Peroperty value.
     * @param {boolean} [skipDispatch] flag to skip event dispatch.
     */
    set(key: string, value: any, skipDispatch?: boolean): void;
    /**
     * Connects all property bindings and `IoNode` properties.
     */
    connect(): void;
    /**
     * Disconnects all property bindings and `IoNode` properties.
     */
    disconnect(): void;
    /**
     * Disconnects all property bindings and `IoNode` properties.
     * Use this when properties are no loner needed.
     */
    dispose(): void;
}
export {};
//# sourceMappingURL=properties.d.ts.map