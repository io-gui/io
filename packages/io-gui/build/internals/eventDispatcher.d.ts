import { ChangeEvent } from '../internals/changeQueue';
import { IoNode } from '../nodes/node';
/**
 * Event listener types.
 */
export interface KeyboardEventListener {
    (event: KeyboardEvent): void;
}
export interface PointerEventListener {
    (event: PointerEvent): void;
}
export interface CustomEventListener {
    (event: CustomEvent): void;
}
export interface FocusEventListener {
    (event: FocusEvent): void;
}
export interface TouchEventListener {
    (event: TouchEvent): void;
}
export interface ChangeEventListener {
    (event: ChangeEvent): void;
}
export interface IoEventListener {
    (event: {
        detail: any;
        target: IoNode;
        path: IoNode[];
    }): void;
}
export type AnyEventListener = EventListener | KeyboardEventListener | PointerEventListener | CustomEventListener | FocusEventListener | TouchEventListener | ChangeEventListener | IoEventListener;
/**
 * Listener definition type.
 * The first item is a string (function name) or an event listener function.
 * The second item is an optional object of event listener options.
 */
export type ListenerDefinition = [string | AnyEventListener, AddEventListenerOptions?];
/**
 * Loose listener definition type.
 * It can be a string (function name), an event AnyEventListener function or a ListenerDefinition array.
 */
export type ListenerDefinitionLoose = string | AnyEventListener | ListenerDefinition;
export type Listener = [AnyEventListener, AddEventListenerOptions?];
export type Listeners = Record<string, Listener[]>;
/**
 * Converts a loose listener definition into a strongly typed ListenerDefinition array format.
 * This ensures consistent handling of listeners regardless of how they were initially defined.
 *
 * @param {ListenerDefinitionLoose} listenerDefinition - Loosely typed listener definition
 * @return {ListenerDefinition} Normalized listener definition in [string | listener, options?] format
 */
export declare const hardenListenerDefinition: (listenerDefinition: ListenerDefinitionLoose) => ListenerDefinition;
/**
 * Converts a listener definition into a normalized Listener tuple.
 * If the first item is a string, it looks up the method on the node.
 *
 * @param {IoNode | EventTarget} node - The node instance containing potential method references
 * @param {ListenerDefinition} def - The listener definition to normalize
 * @return {Listener} Normalized [listener, options?] tuple
 */
export declare const listenerFromDefinition: (node: IoNode | EventTarget, def: ListenerDefinition) => Listener;
/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `IoNode` class instances compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` return value of class.
 *  - `propListeners` specified as inline properties prefixed with "@".
 *  - `addedListeners` explicitly added/removed using `addEventListener()` and `removeEventListener()`.
 */
export declare class EventDispatcher {
    readonly node: IoNode | EventTarget;
    readonly nodeIsEventTarget: boolean;
    readonly protoListeners: Listeners;
    readonly propListeners: Listeners;
    readonly addedListeners: Listeners;
    /**
     * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
     * It initializes `protoListeners` from `ProtoChain`.
     * @param {IoNode} node owner IoNode
     */
    constructor(node: IoNode | EventTarget);
    /**
     * Sets `protoListeners` specified as `get Listeners()` class definitions.
     * Definitions from subclass replace the ones from parent class.
     * @param {IoNode} node owner IoNode
     */
    setProtoListeners(node: IoNode): void;
    /**
     * Sets `propListeners` specified as inline properties prefixed with "@".
     * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
     * @param {Record<string, any>} properties - Inline properties
     */
    applyPropListeners(properties: Record<string, any>): void;
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener to the node's `addedListeners` collection.
     * If the node is an EventTarget, also registers the listener with the DOM.
     * @param {string} name - Name of the event
     * @param {AnyEventListener} listener - Event listener handler
     * @param {AddEventListenerOptions} [options] - Event listener options
     */
    addEventListener(name: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from the node's `addedListeners` collection.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} name - Name of the event
     * @param {AnyEventListener} listener - Event listener handler
     * @param {AddEventListenerOptions} [options] - Event listener options
    */
    removeEventListener(name: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for custom event dispatch.
     * @param {string} name - Name of the event
     * @param {any} detail - Event detail data
     * @param {boolean} [bubbles] - Makes event bubble
     * @param {EventTarget} [node] - Event target override to dispatch the event from
     */
    dispatchEvent(name: string, detail?: any, bubbles?: boolean, node?: EventTarget | IoNode): void;
    /**
     * Disconnects all event listeners and removes all references for garbage collection.
     * Use this when node is discarded.
     */
    dispose(): void;
}
//# sourceMappingURL=eventDispatcher.d.ts.map