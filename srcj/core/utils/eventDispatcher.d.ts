import { ProtoChain } from './protoChain.js';
import { Node } from '../node.js';
declare type ListenerArrayType = [string | Function, CustomEventInit | undefined];
export declare class ProtoListeners {
    [listener: string]: ListenerArrayType;
    constructor(protochain: ProtoChain);
}
/**
 * Event Dispatcher.
 */
declare class EventDispatcher {
    private readonly __node;
    private __protoListeners;
    private __propListeners;
    private __activeListeners;
    private __connected;
    /**
     * Creates Event Dispatcher.
     */
    constructor(node: Node, protoListeners: ProtoListeners);
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} props - Properties.
     */
    setPropListeners(props: Record<string, any>): void;
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
    addEventListener(type: string, listener: any, options?: Record<string, any>): void;
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener.
     */
    removeEventListener(type: string, listener?: any, options?: Record<string, any>): void;
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