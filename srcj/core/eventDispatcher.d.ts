import { ProtoChain } from './protoChain.js';
import { IoNode } from '../components/io-node.js';
export declare type ProtoListenerType = keyof IoNode | EventListener | ProtoListenerArrayType;
export declare type ProtoListenerArrayType = [keyof IoNode | EventListener, AddEventListenerOptions?];
export declare type ProtoListenerRecord = Record<string, ProtoListenerType>;
export declare type Listener = [EventListener, AddEventListenerOptions?];
export declare type Listeners = Record<string, Listener>;
export declare type ListenersArray = Record<string, Listener[]>;
/**
 * Array of all listeners defined as `static get Listeners()` return objects in prototype chain.
 */
export declare class ProtoListeners {
    [listener: string]: ProtoListenerArrayType;
    constructor(protochain: ProtoChain);
}
/**
 * Event Dispatcher.
 */
declare class EventDispatcher {
    private readonly __node;
    private readonly __nodeIsEventTarget;
    private readonly __protoListeners;
    private readonly __propListeners;
    private readonly __addedListeners;
    private __connected;
    /**
     * Creates Event Dispatcher.
     * @param {IoNode | HTMLElement} node Node or element to add EventDispatcher to.
     * @param {ProtoListeners} [protoListeners] Protolisteners
     */
    constructor(node: IoNode | HTMLElement, protoListeners?: ProtoListeners);
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} properties - Properties.
     */
    setPropListeners(properties: Record<string, ProtoListenerType>): void;
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
     * Adds an event listener.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for custom event dispatch.
     * @param {string} type Name of the event
     * @param {Object} detail Event detail data
     * @param {boolean} [bubbles] Makes event bubble
     * @param {EventTarget} [node] Event target to dispatch from
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