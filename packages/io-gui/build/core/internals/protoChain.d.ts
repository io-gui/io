import { ProtoProperty } from './property';
import { ListenerDefinition } from './eventDispatcher';
import { IoNode, IoNodeConstructor, AnyConstructor, PropertyDefinitions, ListenerDefinitions } from '../node';
type ProtoConstructors = Array<IoNodeConstructor<any>>;
type ProtoHandlers = string[];
type ProtoProperties = {
    [property: string]: ProtoProperty;
};
type ProtoListeners = {
    [property: string]: ListenerDefinition[];
};
export declare const propertyDecorators: WeakMap<AnyConstructor, PropertyDefinitions>;
/**
 * ProtoChain manages class inheritance metadata and configuration.
 *
 * This utility class traverses the prototype chain during class registration to:
 * - Aggregate property configurations
 * - Aggregate event listeners
 * - Aggregate CSS styles strings
 * - Auto-bind event handlers to maintain proper 'this' context
 *
 * This class is internal and instantiated during the `Register()` process.
 */
export declare class ProtoChain {
    /**
     * Array of inherited class constructors
     */
    constructors: ProtoConstructors;
    /**
     * Aggregated property definition declared in `static get Properties()`
     */
    properties: ProtoProperties;
    /**
     * Aggregated listener definition declared in `static get Listeners()`
     */
    listeners: ProtoListeners;
    /**
     * Aggregated CSS style definition declared in `static get Style()`
     */
    styles: string;
    /**
     * Array of function names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding.
     */
    handlers: ProtoHandlers;
    /**
     * Array of property names of mutation-observed object properties.
     */
    observedObjectProperties: string[];
    /**
     * Array of property names of mutation-observed IoNode properties.
     */
    observedIoNodeProperties: string[];
    /**
     * Creates an instance of `ProtoChain` for specified class constructor.
     * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode` constructor.
     */
    constructor(ioNodeConstructor: IoNodeConstructor<any>);
    /**
     * Adds properties defined in decorators to the properties array.
     * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode` constructor.
     */
    addPropertiesFromDecorators(ioNodeConstructor: IoNodeConstructor<any>): void;
    /**
     * Adds static properties from `static get Properties()` to the properties array.
     * Only process properties if they differ from superclass.
     * This prevents 'static get Properties()' from overriding subclass properties defined in decorators.
     * @param {PropertyDefinitions} properties - Properties to add
     * @param {string} prevHash - Previous properties hash
     * @returns {string} - Updated properties hash
     */
    addStaticProperties(properties?: PropertyDefinitions, prevHash?: string): string;
    /**
     * Merges or appends a listener definitions to the existing listeners array.
     * @param {ListenerDefinitions} listenerDefs - Listener definitions to add
     */
    addListeners(listenerDefs?: ListenerDefinitions): void;
    /**
     * Adds a style string to the styles array.
     * @param {string} style - Style string to add
     */
    addStyles(style?: string): void;
    /**
     * Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.
     * @param {IoNode} proto - Prototype object to search for handlers
     */
    addHandlers(proto: IoNode): void;
    /**
     * Creates observedObjectProperties array.
     * @returns {string[]} - Array of property names that are observed as native objects.
     */
    getObservedObjectProperties(): string[];
    /**
     * Creates observedIoNodeProperties array.
     * @returns {string[]} - Array of property names that are observed as IoNode objects.
     */
    getObservedIoNodeProperties(): string[];
    /**
     * Debug only.
     * Validates property definitions.
     * Logs warnings for incorrect property definitions.
     * @returns {void}
     */
    validateProperties(): void;
    /**
     * Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
     * NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.
     * @param {IoNode} node - Target node instance
     */
    autobindHandlers(node: IoNode): void;
}
export {};
//# sourceMappingURL=protoChain.d.ts.map