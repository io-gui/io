import { ProtoChain } from './protoChain.js';
import { IoNode } from '../components/io-node.js';
export declare type ProtoListenerType = keyof IoNode | EventListenerOrEventListenerObject | ProtoListenerArrayType;
export declare type ProtoListenerArrayType = [keyof IoNode | EventListenerOrEventListenerObject, AddEventListenerOptions?];
export declare type ProtoListenerRecord = Record<string, ProtoListenerType>;
export declare type Listener = [EventListenerOrEventListenerObject, AddEventListenerOptions?];
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
     */
    constructor(node: IoNode | HTMLElement, protoListeners?: ProtoListeners);
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} properties - Properties.
     */
    setPropListeners(properties: Record<string, ProtoListenerType>): void;
    /**
     * Connects all event listeners.
     */
    connect(): this;
    /**
     * Disconnects all event listeners.
     */
    disconnect(): this;
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener.
     */
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener.
     */
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for custom event dispatch.
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