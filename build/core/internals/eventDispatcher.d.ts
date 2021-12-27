import { IoNode } from '../io-node.js';
export declare type ListenerDefinitionWeak = keyof IoNode | EventListener | [keyof IoNode | EventListener, AddEventListenerOptions?];
export declare type ListenerDefinition = [keyof IoNode | EventListener, AddEventListenerOptions?];
export declare const hardenListenerDefinition: (def: ListenerDefinitionWeak) => ListenerDefinition;
export declare const assignListenerDefinition: (defs: ListenerDefinition[], def: ListenerDefinition) => void;
export declare const listenerFromDefinition: (node: IoNode, def: ListenerDefinition) => Listener;
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
     * Proxy for `addEventListener` method.
     * Adds an event listener to `addedListeners`.
     * @param {string} name Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(name: string, listener: EventListener, options?: AddEventListenerOptions): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from `addedListeners`.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} name Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(name: string, listener?: EventListener, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for custom event dispatch.
     * @param {string} name Name of the event
     * @param {Record<string, any>} detail Event detail data
     * @param {boolean} [bubbles] Makes event bubble
     * @param {EventTarget} [node] Event target override to dispatch the event from
     */
    dispatchEvent(name: string, detail?: Record<string, any>, bubbles?: boolean, node?: EventTarget | IoNode): void;
    /**
     * Disconnects all event listeners and removes all references for garbage collection.
     * Use this when node is discarded.
     */
    dispose(): void;
}
export { EventDispatcher };
//# sourceMappingURL=eventDispatcher.d.ts.map