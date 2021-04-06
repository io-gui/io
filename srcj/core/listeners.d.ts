import { ProtoChain } from './protochain.js';
import { Node } from './node.js';
declare type PropListeners = Record<string, any>;
/**
 * Collection of all listeners defined in the prototype chain.
 */
declare class ProtoListeners {
    /**
     * Creates a collection of all listeners from protochain.
     */
    constructor(protochain: ProtoChain);
}
/**
 * Manager of listeners for a class **instance**.
 */
declare class Listeners {
    node: Node;
    propListeners: Record<string, any>;
    activeListeners: Record<string, any>;
    __connected: boolean;
    /**
     * Creates manager for listener.
     */
    constructor(node: Node, protoListeners?: ProtoListeners);
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} props - Properties.
     */
    setPropListeners(props: PropListeners): void;
    /**
     * Connects all event listeners.
     */
    connect(): void;
    /**
     * Disconnects all event listeners.
     */
    disconnect(): void;
    /**
     * Disconnects all event listeners and removes all references.
     * Use this when node is no longer needed.
     */
    dispose(): void;
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
}
export { ProtoListeners, Listeners };
//# sourceMappingURL=listeners.d.ts.map