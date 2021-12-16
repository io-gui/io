import { Binding } from './propertyBinder.js';
declare type AnyConstructor = new (...args: any[]) => unknown;
declare type ReflectType = -1 | 0 | 1 | 2;
declare type PropertyDefinitionDetail = {
    value?: any;
    type?: AnyConstructor;
    reflect?: ReflectType;
    notify?: boolean;
    observe?: boolean;
    readonly?: boolean;
    strict?: boolean;
    enumerable?: boolean;
    binding?: Binding;
};
export declare type PropertyDefinition = string | number | boolean | AnyConstructor | null | Binding | PropertyDefinitionDetail;
export declare class ProtoProperty {
    value: any;
    type?: AnyConstructor;
    reflect: ReflectType;
    notify: boolean;
    observe: boolean;
    readonly: boolean;
    strict: boolean;
    enumerable: boolean;
    binding?: Binding;
    constructor(propertyDefinition?: PropertyDefinition);
    assign(propertyDefinition: PropertyDefinition): this;
}
/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `ProtoProperty`.
 */
export declare class Property {
    value?: any;
    type?: AnyConstructor;
    reflect?: number;
    notify?: boolean;
    observe?: boolean;
    readonly?: boolean;
    strict?: boolean;
    enumerable?: boolean;
    binding?: Binding;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param {ProtoProperty} protoProp ProtoProperty object
     */
    constructor(protoProp: ProtoProperty);
}
/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
export declare class Properties {
    private readonly __node;
    private readonly __keys;
    private __connected;
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