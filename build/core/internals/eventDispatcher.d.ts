import { IoNode } from '../io-node.js';
export declare type ListenerDefinitionWeak = keyof IoNode | EventListener | [keyof IoNode | EventListener, AddEventListenerOptions?];
export declare type ListenerDefinition = [keyof IoNode | EventListener, AddEventListenerOptions?];
export declare const hardenListenerDefinition: (listenerDefinition: ListenerDefinitionWeak) => ListenerDefinition;
export declare const assignListenerDefinition: (definitions: ListenerDefinition[], listenerDefinition: ListenerDefinition) => void;
export declare const listenerFromDefinition: (node: IoNode, listenerDefinition: ListenerDefinition) => Listener;
export declare type Listener = [EventListener, AddEventListenerOptions?];
export declare type Listeners = Record<string, Listener[]>;
/**
 * `EventDispatcher` responsible for handling listeners and dispatching events.
 * It maintains three independent lists of listeners:
 *   1. `protoListeners` specified as `get Listeners()` class declarations.
 *   2. `propListeners` specified as inline properties prefixed with "on-"
 *   3. `addedListeners` explicitly added using `addEventListener()`.
 */
declare class EventDispatcher {
    private readonly node;
    private readonly isEventTarget;
    private readonly protoListeners;
    private readonly propListeners;
    private readonly addedListeners;
    private connected;
    /**
     * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
     * It initializes `protoListeners` from `ProtoChain`.
     * @param {IoNode} node owner IoNode.
     */
    constructor(node: IoNode);
    /**
     * Sets `propListeners` specified as inline properties prefixed with "on-".
     * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
     * @param {Record<string, any>} properties - Inline properties.
     */
    setPropListeners(properties: Record<string, any>): void;
    /**
     * Removes all `protoListeners`.
     */
    removeProtoListeners(): void;
    /**
     * Removes all `propListeners`.
     */
    removePropListeners(): void;
    /**
     * Removes all `addedListeners`.
     */
    removeAddedListeners(): void;
    /**
     * Connects all event listeners.
     * @return {this} this
     */
    connect(): this;
    /**
     * Disconnects all event listeners.
     * @return {this} this
     */
    disconnect(): this;
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener to `addedListeners`.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from `addedListeners`.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(type: string, listener?: EventListener, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for custom event dispatch.
     * @param {string} type Name of the event
     * @param {Record<string, any>} detail Event detail data
     * @param {boolean} [bubbles] Makes event bubble
     * @param {EventTarget} [node] Event target override to dispatch the event from
     */
    dispatchEvent(type: string, detail?: Record<string, any>, bubbles?: boolean, node?: EventTarget | IoNode): void;
    /**
     * Disconnects all event listeners and removes all references.
     * Use this when node is no longer needed.
     */
    dispose(): void;
}
export { EventDispatcher };
//# sourceMappingURL=eventDispatcher.d.ts.map