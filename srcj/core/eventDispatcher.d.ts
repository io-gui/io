import { ProtoChain } from './protoChain.js';
import { Node } from '../components/io-node.js';
declare type ProtoListenerType = keyof Node | EventListenerOrEventListenerObject | ProtoListenerArrayType;
declare type ProtoListenerArrayType = [keyof Node | EventListenerOrEventListenerObject, AddEventListenerOptions | undefined];
export declare class ProtoListeners {
    [listener: string]: ProtoListenerArrayType;
    constructor(protochain: ProtoChain);
}
/**
 * Event Dispatcher.
 */
declare class EventDispatcher {
    private readonly __node;
    private __protoListeners;
    private __propListeners;
    private __connectedListeners;
    private __disconnectedListeners;
    private readonly __listenerOptions;
    private __connected;
    /**
     * Creates Event Dispatcher.
     */
    constructor(node: Node, protoListeners: ProtoListeners);
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} properties - Properties.
     */
    setPropListeners(properties: Record<string, ProtoListenerType>): void;
    /**
     * Connects all event listeners.
     */
    connect(): void;
    /**
     * Disconnects all event listeners.
     */
    disconnect(): void;
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
    dispatchEvent(type: string, detail?: Record<string, any>, bubbles?: boolean, src?: HTMLElement | any): void;
    /**
     * Disconnects all event listeners and removes all references.
     * Use this when node is no longer needed.
     */
    dispose(): void;
}
export { EventDispatcher };
//# sourceMappingURL=eventDispatcher.d.ts.map