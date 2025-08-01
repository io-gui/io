import { ReactiveProtoProperty } from './ReactiveProperty.js';
import { ListenerDefinition } from './EventDispatcher.js';
import { Node, NodeConstructor, ReactivePropertyDefinitions, ListenerDefinitions } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';
type ProtoConstructors = Array<NodeConstructor>;
type ProtoHandlers = string[];
type ReactiveProtoProperties = {
    [property: string]: ReactiveProtoProperty;
};
type ProtoListeners = {
    [property: string]: ListenerDefinition[];
};
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
     * Aggregated initial value for properties declared in `static get Properties()` or @Property() decorators
    */
    properties: Record<string, any>;
    /**
     * Aggregated reactive property definition declared in `static get ReactiveProperties()` or @ReactiveProperty() decorators
     */
    reactiveProperties: ReactiveProtoProperties;
    /**
     * Aggregated listener definition declared in `static get Listeners()`
     */
    listeners: ProtoListeners;
    /**
     * Aggregated CSS style definition declared in `static get Style()`
     */
    style: string;
    /**
     * Array of function names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding.
     */
    handlers: ProtoHandlers;
    /**
     * Creates an instance of `ProtoChain` for specified class constructor.
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
     */
    constructor(ioNodeConstructor: NodeConstructor);
    /**
     * Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
     * NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.
     * @param {Node | IoElement} node - Target node instance
     */
    init(node: Node | IoElement): void;
    /**
     * Adds properties defined in decorators to the properties array.
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
     */
    addPropertiesFromDecorators(ioNodeConstructor: NodeConstructor): void;
    addProperties(properties?: Record<string, any>, prevHash?: string): string;
    /**
     * Adds reactive properties defined in decorators to the properties array.
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
     */
    addReactivePropertiesFromDecorators(ioNodeConstructor: NodeConstructor): void;
    /**
     * Adds reactive properties from `static get ReactiveProperties()` to the properties array.
     * Only process properties if they differ from superclass.
     * This prevents 'static get ReactiveProperties()' from overriding subclass properties defined in decorators.
     * @param {ReactivePropertyDefinitions} properties - Properties to add
     * @param {string} prevHash - Previous properties hash
     * @returns {string} - Updated properties hash
     */
    addReactiveProperties(properties?: ReactivePropertyDefinitions, prevHash?: string): string;
    /**
     * Merges or appends a listener definitions to the existing listeners array.
     * @param {ListenerDefinitions} listenerDefs - Listener definitions to add
     */
    addListeners(listenerDefs?: ListenerDefinitions): void;
    /**
     * Adds a style string to the styles array.
     * @param {string} style - Style string to add
     */
    addStyle(style?: string): void;
    /**
     * Adds style defined in decorators to the style string.
     * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
     */
    addStyleFromDecorators(ioNodeConstructor: NodeConstructor): void;
    /**
     * Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.
     * @param {Node} proto - Prototype object to search for handlers
     */
    addHandlers(proto: Node | IoElement): void;
    /**
     * Validates reactive property definitions in debug mode.
     * Logs warnings for incorrect property definitions.
     * @returns {void}
     */
    validateReactiveProperties(): void;
}
export {};
//# sourceMappingURL=ProtoChain.d.ts.map