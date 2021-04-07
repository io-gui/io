import { Binding } from './utils/bindingManager.js';
import { ProtoChain } from './utils/protoChain.js';
declare type Constructor = new (...args: any[]) => Object;
/**
 * Property configuration object for a class **prototype**.
 * It is generated from property definitions in `static get Properties()` return object.
 */
declare class ProtoProperty {
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
     * Creates the property configuration object and sets the default values.
     */
    constructor(prop?: string | Record<string, any> | any, noDefaults?: boolean);
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
 * Collection of all property configurations for a class **prototype**.
 * Property configurations are inferred from all property definitions in the prototype chain.
 */
declare class ProtoProperties {
    /**
     * Creates all property configurations for specified prototype chain.
     */
    constructor(protochain: ProtoChain);
}
/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
declare class Properties {
    __node: any;
    __connected: boolean;
    __keys: Array<string>;
    /**
     * Creates the properties for specified `Node`.
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
     * Connects all property bindings and `Node` properties.
     */
    connect(): void;
    /**
     * Disconnects all property bindings and `Node` properties.
     */
    disconnect(): void;
    /**
     * Disconnects all property bindings and `Node` properties.
     * Use this when properties are no loner needed.
     */
    dispose(): void;
}
export { ProtoProperty, ProtoProperties, Property, Properties };
//# sourceMappingURL=properties.d.ts.map