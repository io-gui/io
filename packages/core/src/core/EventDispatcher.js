/**
 * Converts a loose listener definition into a strongly typed ListenerDefinition array format.
 * This ensures consistent handling of listeners regardless of how they were initially defined.
 *
 * @param {ListenerDefinitionLoose} listenerDefinition - Loosely typed listener definition
 * @return {ListenerDefinition} Normalized listener definition in [string | listener, options?] format
 */
export const hardenListenerDefinition = (listenerDefinition) => {
    return Array.isArray(listenerDefinition) ? listenerDefinition : [listenerDefinition];
};
const LISTENER_OPTIONS = ['capture', 'passive'];
/**
 * Detects whether native bubbling from `node` would reach a DOM ancestor
 * that was already visited by the current synthetic bubbling dispatch.
 *
 * Edge case:
 * A single logical event can traverse one branch via synthetic ReactiveNode
 * parents, then get converted into a native CustomEvent at an IoElement
 * boundary and bubble through DOM again. Without this guard, shared ancestors
 * can receive the same event twice.
 */
const hasVisitedDomAncestor = (node, visited) => {
    if (!(node instanceof Node))
        return false;
    let current = node.parentNode;
    while (current) {
        if (visited.has(current))
            return true;
        current = current.parentNode;
    }
    return false;
};
/**
 * Converts a listener definition into a normalized Listener tuple.
 * If the first item is a string, it looks up the method on the node.
 *
 * @param {ReactiveNode | IoElement | EventTarget} node - The node instance containing potential method references
 * @param {ListenerDefinition} def - The listener definition to normalize
 * @return {Listener} Normalized [listener, options?] tuple
 */
export const listenerFromDefinition = (node, def) => {
    const handlerDef = def[0];
    const options = def[1];
    debug: {
        if (typeof handlerDef !== 'string' && typeof handlerDef !== 'function') {
            console.error('listenerFromDefinition: Listener must be a function or method name');
        }
        if (options) {
            if (typeof options !== 'object') {
                console.error('listenerFromDefinition: Listener options must be an object');
            }
            else {
                const invalidOptions = Object.keys(options).filter(k => !LISTENER_OPTIONS.includes(k));
                if (invalidOptions.length > 0) {
                    console.error(`listenerFromDefinition: Invalid listener options: ${invalidOptions.join(', ')}`);
                }
            }
        }
        if (typeof handlerDef === 'string' && !(handlerDef in node)) {
            console.error(`listenerFromDefinition: Method "${handlerDef}" not found on node`);
        }
    }
    const handler = typeof handlerDef === 'string' ? node[handlerDef] : handlerDef;
    return options ? [handler, options] : [handler];
};
/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `ReactiveNode` class instances compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` return value of class.
 *  - `propListeners` specified as inline properties prefixed with "@".
 *  - `addedListeners` explicitly added/removed using `addEventListener()` and `removeEventListener()`.
 */
export class EventDispatcher {
    node;
    nodeIsEventTarget;
    protoListeners = {};
    propListeners = {};
    addedListeners = {};
    /**
     * Creates an instance of `EventDispatcher` for specified `ReactiveNode` instance.
     * It initializes `protoListeners` from `ProtoChain`.
     * @param {ReactiveNode | IoElement | EventTarget} node owner ReactiveNode
     */
    constructor(node) {
        this.node = node;
        this.nodeIsEventTarget = node instanceof EventTarget;
        this.setProtoListeners(node);
    }
    /**
     * Sets `protoListeners` specified as `get Listeners()` class definitions.
     * Definitions from subclass replace the ones from parent class.
     * @param {ReactiveNode | IoElement} node owner ReactiveNode
     */
    setProtoListeners(node) {
        for (const name in node._protochain?.listeners) {
            for (let i = 0; i < node._protochain.listeners[name].length; i++) {
                const listener = listenerFromDefinition(node, node._protochain.listeners[name][i]);
                this.protoListeners[name] = [listener];
            }
            if (this.nodeIsEventTarget && this.protoListeners[name]) {
                const listener = this.protoListeners[name][0];
                EventTarget.prototype.addEventListener.call(this.node, name, listener[0], listener[1]);
            }
        }
    }
    /**
     * Sets `propListeners` specified as inline properties prefixed with "@".
     * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
     * @param {Record<string, any>} properties - Inline properties
     */
    applyPropListeners(properties) {
        // Create and object with new listeners
        const newPropListeners = {};
        for (const prop in properties) {
            if (!prop.startsWith('@'))
                continue;
            const name = prop.slice(1);
            const definition = hardenListenerDefinition(properties[prop]);
            const listener = listenerFromDefinition(this.node, definition);
            newPropListeners[name] = [listener];
        }
        // Remove listeners that are no longer specified
        const propListeners = this.propListeners;
        for (const name in propListeners) {
            if (!newPropListeners[name]) {
                if (this.nodeIsEventTarget) {
                    const listener = propListeners[name][0];
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
                delete propListeners[name];
            }
        }
        // Add new listeners and remove old ones if they are different
        for (const name in newPropListeners) {
            if (this.nodeIsEventTarget) {
                const newListener = newPropListeners[name][0];
                if (propListeners[name]) {
                    const oldListener = propListeners[name][0];
                    if ((oldListener !== newListener || newListener[1] && (JSON.stringify(oldListener[1]) !== JSON.stringify(newListener[1])))) {
                        EventTarget.prototype.removeEventListener.call(this.node, name, oldListener[0], oldListener[1]);
                    }
                }
                EventTarget.prototype.addEventListener.call(this.node, name, newListener[0], newListener[1]);
            }
            propListeners[name] = newPropListeners[name];
        }
    }
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener to the node's `addedListeners` collection.
     * If the node is an EventTarget, also registers the listener with the DOM.
     * @param {string} name - Name of the event
     * @param {AnyEventListener} listener - Event listener handler
     * @param {AddEventListenerOptions} [options] - Event listener options
     */
    addEventListener(name, listener, options) {
        debug: {
            if (typeof listener !== 'function') {
                console.error('EventDispatcher.addEventListener: Invalid listener type - must be a function');
            }
            if (options) {
                if (typeof options !== 'object') {
                    console.error('EventDispatcher.addEventListener: Invalid listener options type - must be an object');
                }
                else {
                    const invalidOptions = Object.keys(options).filter(k => !LISTENER_OPTIONS.includes(k));
                    if (invalidOptions.length > 0) {
                        console.warn(`EventDispatcher.addEventListener: Invalid listener options: ${invalidOptions.join(', ')}`);
                    }
                }
            }
        }
        // Initialize listener array if needed
        if (!this.addedListeners[name]) {
            this.addedListeners[name] = [];
        }
        // Check for duplicate listener
        const existingIndex = this.addedListeners[name].findIndex(l => l[0] === listener);
        if (existingIndex !== -1) {
            debug: console.warn(`EventDispatcher.addEventListener: Listener for '${name}' event already added`, this.node);
            return;
        }
        // Create and store listener tuple
        const listenerTuple = options ? [listener, options] : [listener];
        this.addedListeners[name].push(listenerTuple);
        if (this.nodeIsEventTarget) {
            EventTarget.prototype.addEventListener.call(this.node, name, listener, options);
        }
    }
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from the node's `addedListeners` collection.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} name - Name of the event
     * @param {AnyEventListener} listener - Event listener handler
     * @param {AddEventListenerOptions} [options] - Event listener options
    */
    removeEventListener(name, listener, options) {
        debug: {
            if (listener && typeof listener !== 'function') {
                console.error('EventDispatcher.removeEventListener: Invalid listener type!');
            }
            if (options) {
                if (typeof options !== 'object') {
                    console.error('EventDispatcher.removeEventListener: Invalid listener options type - must be an object');
                }
                else {
                    const invalidOptions = Object.keys(options).filter(k => !LISTENER_OPTIONS.includes(k));
                    if (invalidOptions.length > 0) {
                        console.warn(`EventDispatcher.removeEventListener: Invalid listener options: ${invalidOptions.join(', ')}`);
                    }
                }
            }
            if (!this.addedListeners[name]) {
                console.error(`EventDispatcher.removeEventListener: Listener ${name} not found!`);
            }
        }
        if (!this.addedListeners[name])
            return;
        if (!listener) {
            for (let i = 0; i < this.addedListeners[name].length; i++) {
                if (this.nodeIsEventTarget) {
                    const listener = this.addedListeners[name][i];
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
            }
            this.addedListeners[name].length = 0;
        }
        else {
            const index = this.addedListeners[name].findIndex(item => item[0] === listener);
            debug: if (index === -1) {
                console.error(`EventDispatcher.removeEventListener: Listener ${name} not found!`);
            }
            if (index !== -1) {
                this.addedListeners[name].splice(index, 1);
                if (this.nodeIsEventTarget) {
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener, options);
                }
            }
        }
        if (this.addedListeners[name].length === 0) {
            delete this.addedListeners[name];
        }
    }
    /**
     * Shorthand for custom event dispatch.
     * @param {string} name - Name of the event
     * @param {any} detail - Event detail data
     * @param {boolean} [bubbles] - Makes event bubble
     * @param {ReactiveNode | IoElement | EventTarget} [node] - Event target override to dispatch the event from
     */
    dispatchEvent(name, detail, bubbles = true, node = this.node, path = [], visited = new Set()) {
        if (this.node._disposed)
            return;
        if (visited.has(node))
            return;
        visited.add(node);
        path = [...path, node];
        if ((node instanceof EventTarget)) {
            const bubblesNative = bubbles && !hasVisitedDomAncestor(node, visited);
            EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(name, { detail: detail, bubbles: bubblesNative, composed: true, cancelable: true }));
        }
        else {
            const payload = { detail: detail, target: node, path: path };
            if (this.protoListeners[name]) {
                for (let i = 0; i < this.protoListeners[name].length; i++) {
                    const handler = this.protoListeners[name][i][0];
                    handler.call(node, payload);
                }
            }
            if (this.propListeners[name]) {
                debug: if (this.propListeners[name].length > 1) {
                    console.error(`EventDispatcher.dispathEvent: PropListeners[${name}] array too long!`);
                }
                const handler = this.propListeners[name][0][0];
                handler.call(node, payload);
            }
            if (this.addedListeners[name]) {
                for (let i = 0; i < this.addedListeners[name].length; i++) {
                    const handler = this.addedListeners[name][i][0];
                    handler.call(node, payload);
                }
            }
            if (bubbles) {
                for (const parent of node._parents) {
                    if ((parent._isNode || parent._isIoElement) && !parent._disposed && !visited.has(parent)) {
                        // TODO: implement stopPropagation() and stopImmediatePropagation()
                        parent._eventDispatcher.dispatchEvent(name, detail, bubbles, parent, path, visited);
                    }
                }
            }
        }
    }
    /**
     * Disconnects all event listeners and removes all references for garbage collection.
     * Use this when node is discarded.
     */
    dispose() {
        for (const name in this.protoListeners) {
            if (this.nodeIsEventTarget) {
                for (let i = 0; i < this.protoListeners[name].length; i++) {
                    const listener = this.protoListeners[name][i];
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
            }
            this.protoListeners[name].length = 0;
            delete this.protoListeners[name];
        }
        for (const name in this.propListeners) {
            if (this.nodeIsEventTarget) {
                const listener = this.propListeners[name][0];
                EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
            }
            this.propListeners[name].length = 0;
            delete this.propListeners[name];
        }
        for (const name in this.addedListeners) {
            if (this.nodeIsEventTarget) {
                for (let i = this.addedListeners[name].length; i--;) {
                    const listener = this.addedListeners[name][i];
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
            }
            this.addedListeners[name].length = 0;
            delete this.addedListeners[name];
        }
        delete this.node;
        delete this.protoListeners;
        delete this.propListeners;
        delete this.addedListeners;
    }
}
//# sourceMappingURL=EventDispatcher.js.map