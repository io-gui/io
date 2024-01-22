import { IoNode, CustomEventListener } from '../node.js';
/**
 * Declares default listeners.
 */
export type ListenerDeclaration = [string | CustomEventListener, AddEventListenerOptions?];
/**
 * Allows loose declaration of listeners by specifying only partial declarations such as function or function name.
 */
export type ListenerDeclarationLoose = string | CustomEventListener | ListenerDeclaration;
/**
 * Takes loosely typed listener declaration and returns stronly typed listener declaration.
 * @param {ListenerDeclarationLoose} def Loosely typed listener declaration
 * @return {ListenerDeclaration} Stronly typed listener declaration
 */
export declare const hardenListenerDeclaration: (def: ListenerDeclarationLoose) => ListenerDeclaration;
/**
 * Assigns source listener declaration to an existing array of listener declarations.
 * @param {ListenerDeclaration[]} defs Array of listener declarations
 * @param {ListenerDeclaration} srcDef Source listener declaration
 */
export declare const assignListenerDeclaration: (defs: ListenerDeclaration[], srcDef: ListenerDeclaration) => void;
/**
 * Takes a node and a listener declaration and returns a listener.
 * @param {IoNode} node `IoNode` instance
 * @param {ListenerDeclaration} def Listener declaration
 * @return {Listener} Listener
 */
export declare const listenerFromDefinition: (node: IoNode | HTMLElement, def: ListenerDeclaration) => Listener;
export type Listener = [CustomEventListener, AddEventListenerOptions?];
export type Listeners = Record<string, Listener[]>;
export type ListenersDeclaration = Record<string, ListenerDeclarationLoose>;
/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `IoNode` class instances compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` class declarations.
 *  - `propListeners` specified as inline properties prefixed with "".
 *  - `addedListeners` explicitly added/removed using `addEventListener()` and `removeEventListener()`.
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
     * Sets `propListeners` specified as inline properties prefixed with "".
     * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
     * @param {Record<string, any>} properties Inline properties
     */
    applyPropListeners(properties: Record<string, any>): void;
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener to `addedListeners`.
     * @param {string} name Name of the event
     * @param {CustomEventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(name: string, listener: CustomEventListener, options?: AddEventListenerOptions): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from `addedListeners`.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} name Name of the event
     * @param {CustomEventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(name: string, listener?: CustomEventListener, options?: AddEventListenerOptions): void;
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
//# sourceMappingURL=eventDispatcher.d.ts.map