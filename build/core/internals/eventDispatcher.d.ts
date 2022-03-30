import { IoNode } from '../io-node.js';
declare type CustomEventListener = (event: CustomEvent) => void;
declare type AnyEventListener = CustomEventListener | EventListener;
export declare type ListenerDefinitionWeak = string | AnyEventListener | [string | AnyEventListener, AddEventListenerOptions?];
export declare type ListenerDefinition = [string | AnyEventListener, AddEventListenerOptions?];
/**
 * Takes weakly typed listener definition and returns stronly typed listener definition.
 * @param {ListenerDefinitionWeak} def Weakly typed listener definition
 * @return {ListenerDefinition} Stronly typed listener definition
 */
export declare const hardenListenerDefinition: (def: ListenerDefinitionWeak) => ListenerDefinition;
/**
 * Assigns listener definition to an existing array of listener definitions.
 * @param {ListenerDefinition[]} defs Array of listener definitions
 * @param {ListenerDefinition} def Listener definition
 */
export declare const assignListenerDefinition: (defs: ListenerDefinition[], def: ListenerDefinition) => void;
/**
 * Takes a node and a listener definition and returns a listener.
 * @param {IoNode} node `IoNode` instance
 * @param {ListenerDefinition} def Listener definition
 * @return {Listener} Listener
 */
export declare const listenerFromDefinition: (node: IoNode | HTMLElement, def: ListenerDefinition) => Listener;
export declare type Listener = [AnyEventListener, AddEventListenerOptions?];
export declare type Listeners = Record<string, Listener[]>;
/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `IoNode` classes compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` class declarations
 *  - `propListeners` specified as inline properties prefixed with "on-"
 *  - `addedListeners` explicitly added using `addEventListener()`
 */
export declare class EventDispatcher {
    readonly node: IoNode | HTMLElement;
    readonly isEventTarget: boolean;
    readonly protoListeners: Listeners;
    readonly propListeners: Listeners;
    readonly addedListeners: Listeners;
    /**
     * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
     * It initializes `protoListeners` from `ProtoChain`.
     * @param {IoNode} node owner IoNode
     */
    constructor(node: IoNode | HTMLElement);
    /**
     * Sets `protoListeners` specified as `get Listeners()` class declarations.
     * @param {IoNode} node owner IoNode
     */
    setProtoListeners(node: IoNode): void;
    /**
     * Sets `propListeners` specified as inline properties prefixed with "on-".
     * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
     * @param {Record<string, any>} properties Inline properties
     */
    applyPropListeners(properties: Record<string, any>): void;
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener to `addedListeners`.
     * @param {string} name Name of the event
     * @param {AnyEventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(name: string, listener: AnyEventListener, options?: AddEventListenerOptions): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from `addedListeners`.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} name Name of the event
     * @param {AnyEventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(name: string, listener?: AnyEventListener, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for custom event dispatch.
     * @param {string} name Name of the event
     * @param {any} detail Event detail data
     * @param {boolean} [bubbles] Makes event bubble
     * @param {EventTarget} [node] Event target override to dispatch the event from
     */
    dispatchEvent(name: string, detail?: any, bubbles?: boolean, node?: EventTarget | IoNode): void;
    /**
     * Disconnects all event listeners and removes all references for garbage collection.
     * Use this when node is discarded.
     */
    dispose(): void;
}
export {};
//# sourceMappingURL=eventDispatcher.d.ts.map