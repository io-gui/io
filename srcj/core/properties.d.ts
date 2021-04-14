import { Binding } from './propertyBinder.js';
import { ProtoChain } from './protoChain.js';
declare type Constructor = new (...args: any[]) => Object;
declare type ReflectType = -1 | 0 | 1 | 2;
export declare type ProtoPropertyDefinition = {
    value?: any;
    type?: Constructor;
    reflect?: ReflectType;
    notify?: boolean;
    observe?: boolean;
    readonly?: boolean;
    strict?: boolean;
    enumerable?: boolean;
    binding?: Binding;
};
export declare type ProtoPropertyType = string | number | boolean | Constructor | null | Binding | ProtoPropertyDefinition;
export declare type ProtoPropertyRecord = Record<string, ProtoPropertyType>;
declare class ProtoProperty {
    value: any;
    type?: Constructor;
    reflect: ReflectType;
    notify: boolean;
    observe: boolean;
    readonly: boolean;
    strict: boolean;
    enumerable: boolean;
    binding?: Binding;
    constructor(prop?: ProtoPropertyType);
    assign(prop?: ProtoPropertyType): this;
}
/**
 * Array of all properties defined as `static get Properties()` return objects in prototype chain.
 */
declare class ProtoProperties {
    [property: string]: ProtoProperty;
    constructor(protochain: ProtoChain);
}
/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `ProtoProperty`.
 */
declare class Property {
    value?: any;
    type?: Constructor;
    reflect?: number;
    notify?: boolean;
    observe?: boolean;
    readonly?: boolean;
    strict?: boolean;
    enumerable?: boolean;
    binding?: Binding;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     */
    constructor(protoProp: ProtoProperty);
}
/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
declare class Properties {
    private readonly __node;
    private readonly __keys;
    private __connected;
    /**
     * Creates the properties for specified `IoNode`.
     */
    constructor(node: any, protoProps: ProtoProperties);
    /**
     * Returns the property value.
     */
    get(key: string): any;
    /**
     * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
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
export { ProtoProperty, ProtoProperties, Property, Properties };
//# sourceMappingURL=properties.d.ts.map