import { ProtoProperty } from './Property.js';
import type { ReactiveNode } from './ReactiveCore.js';
import { ListenerDefinition } from './EventDispatcher.js';
import { ReactiveNodeConstructor, PropertyDefinitions, ListenerDefinitions } from '../nodes/ReactiveObject.js';
type ProtoConstructors = Array<ReactiveNodeConstructor>;
type ProtoHandlers = string[];
type ReactiveProtoProperties = {
    [property: string]: ProtoProperty;
};
type ProtoListeners = {
    [property: string]: ListenerDefinition[];
};
/**
 * Aggregates inherited property, listener, and style metadata during {@link Register}.
 */
export declare class ProtoChain {
    constructors: ProtoConstructors;
    fields: Record<string, unknown>;
    properties: ReactiveProtoProperties;
    listeners: ProtoListeners;
    style: string;
    handlers: ProtoHandlers;
    /**
     * Creates an instance of `ProtoChain` for specified class constructor.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    constructor(ioNodeConstructor: ReactiveNodeConstructor);
    /**
     * Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
     * NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.
     * @param {ReactiveNode} node - Target node instance
     */
    init(node: ReactiveNode): void;
    /**
     * Adds properties defined in decorators to the properties array.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    addFieldsFromDecorators(ioNodeConstructor: ReactiveNodeConstructor): void;
    addFields(fields?: Record<string, unknown>, prevHash?: string): string;
    /**
     * Adds reactive properties defined in decorators to the properties array.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    addPropertiesFromDecorators(ioNodeConstructor: ReactiveNodeConstructor): void;
    /**
     * Adds reactive properties from `static get Properties()` to the properties array.
     * Only process properties if they differ from superclass.
     * This prevents 'static get Properties()' from overriding subclass properties defined in decorators.
     * @param {PropertyDefinitions} properties - Fields to add
     * @param {string} prevHash - Previous properties hash
     * @returns {string} - Updated properties hash
     */
    addProperties(properties?: PropertyDefinitions, prevHash?: string): string;
    /**
     * Merges listener definitions from each class in the prototype chain into {@link listeners}.
     * Duplicate handler names update options; distinct handler names append to the array.
     * Runtime registration is handled separately: {@link EventDispatcher} uses last-wins per event name.
     * @param listenerDefs Listener definitions to add
     */
    addListeners(listenerDefs?: ListenerDefinitions): void;
    /**
     * Adds a style string to the styles array.
     * @param {string} style - Style string to add
     */
    addStyle(style?: string): void;
    /**
     * Adds style defined in decorators to the style string.
     * @param {ReactiveNodeConstructor} ioNodeConstructor - Owner `ReactiveObject` constructor.
     */
    addStyleFromDecorators(ioNodeConstructor: ReactiveNodeConstructor): void;
    /**
     * Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.
     * @param {ReactiveObject} proto - Prototype object to search for handlers
     */
    addHandlers(proto: ReactiveNode): void;
    /**
     * Validates reactive property definitions in debug mode.
     * Logs warnings for incorrect property definitions.
     * @returns {void}
     */
    validateReactiveProperties(): void;
}
export {};
