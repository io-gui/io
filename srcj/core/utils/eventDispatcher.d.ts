import { Node } from '../node.js';
/**
 * Event Dispatcher.
 */
declare class EventDispatcher {
    private readonly __node;
    private readonly __propListeners;
    private readonly __activeListeners;
    private __connected;
    /**
     * Creates Event Dispatcher.
     */
    constructor(node: Node);
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