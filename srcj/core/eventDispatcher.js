export class ProtoListeners {
    constructor(protochain) {
        for (let i = protochain.length; i--;) {
            const listeners = protochain[i].Listeners;
            for (let l in listeners) {
                const listener = (listeners[l] instanceof Array) ? listeners[l] : [listeners[l]];
                this[l] = listener;
            }
        }
    }
}
/**
 * Event Dispatcher.
 */
class EventDispatcher {
    /**
     * Creates Event Dispatcher.
     */
    constructor(node, protoListeners = {}) {
        this.__protoListeners = {};
        this.__propListeners = {};
        this.__addedListeners = {};
        this.__connected = false;
        this.__node = node;
        this.__nodeIsEventTarget = node instanceof EventTarget;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__nodeIsEventTarget', { enumerable: false, writable: false });
        Object.defineProperty(this, '__protoListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, '__propListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, '__connected', { enumerable: false });
        for (let type in protoListeners) {
            const protoListener = protoListeners[type];
            const listenerObject = typeof protoListener[0] === 'function' ? protoListener[0] : this.__node[protoListener[0]];
            const listenerOptions = protoListener[1];
            this.__protoListeners[type] = [listenerObject];
            if (listenerOptions)
                this.__protoListeners[type].push(listenerOptions);
        }
    }
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} properties - Properties.
     */
    setPropListeners(properties) {
        const newPropListeners = {};
        for (let prop in properties) {
            if (prop.startsWith('on-')) {
                const type = prop.slice(3, prop.length);
                const listener = (properties[prop] instanceof Array) ? [...properties[prop]] : [properties[prop]];
                if (typeof listener[0] !== 'function')
                    listener[0] = this.__node[listener[0]];
                newPropListeners[type] = listener;
            }
        }
        const propListeners = this.__propListeners;
        for (let type in propListeners) {
            if (!newPropListeners[type]) {
                if (this.__connected && this.__nodeIsEventTarget) {
                    EventTarget.prototype.removeEventListener.call(this.__node, type, propListeners[type][0], propListeners[type][1]);
                }
                delete propListeners[type];
            }
        }
        for (let type in newPropListeners) {
            if (this.__connected && this.__nodeIsEventTarget) {
                if (!propListeners[type]) {
                    EventTarget.prototype.addEventListener.call(this.__node, type, newPropListeners[type][0], newPropListeners[type][1]);
                }
                else if ((propListeners[type][0] !== newPropListeners[type][0] || propListeners[type][1] !== newPropListeners[type][1])) {
                    EventTarget.prototype.removeEventListener.call(this.__node, type, propListeners[type][0], propListeners[type][1]);
                    EventTarget.prototype.addEventListener.call(this.__node, type, newPropListeners[type][0], newPropListeners[type][1]);
                }
            }
            propListeners[type] = newPropListeners[type];
        }
    }
    /**
     * Connects all event listeners.
     */
    connect() {
        debug: {
            if (this.__connected)
                console.error('EventDispatcher: already connected!');
        }
        if (this.__nodeIsEventTarget) {
            for (let type in this.__protoListeners) {
                EventTarget.prototype.addEventListener.call(this.__node, type, this.__protoListeners[type][0], this.__protoListeners[type][1]);
            }
            for (let type in this.__propListeners) {
                EventTarget.prototype.addEventListener.call(this.__node, type, this.__propListeners[type][0], this.__propListeners[type][1]);
            }
            for (let type in this.__addedListeners) {
                for (let i = this.__addedListeners[type].length; i--;) {
                    EventTarget.prototype.addEventListener.call(this.__node, type, this.__addedListeners[type][i][0], this.__addedListeners[type][i][1]);
                }
            }
        }
        this.__connected = true;
        return this;
    }
    /**
     * Disconnects all event listeners.
     */
    disconnect() {
        debug: {
            if (!this.__connected)
                console.error('EventDispatcher: already disconnected!');
        }
        if (this.__nodeIsEventTarget) {
            for (let type in this.__protoListeners) {
                EventTarget.prototype.removeEventListener.call(this.__node, type, this.__protoListeners[type][0], this.__protoListeners[type][1]);
            }
            for (let type in this.__propListeners) {
                EventTarget.prototype.removeEventListener.call(this.__node, type, this.__propListeners[type][0], this.__propListeners[type][1]);
            }
            for (let type in this.__addedListeners) {
                for (let i = this.__addedListeners[type].length; i--;) {
                    EventTarget.prototype.removeEventListener.call(this.__node, type, this.__addedListeners[type][i][0], this.__addedListeners[type][i][1]);
                }
            }
        }
        this.__connected = false;
        return this;
    }
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener.
     */
    addEventListener(type, listener, options) {
        this.__addedListeners[type] = this.__addedListeners[type] || [];
        debug: {
            const l = this.__addedListeners[type].findIndex(l => l[0] === listener);
            if (l !== -1)
                console.warn(`EventDispatcher: listener ${type} already added!`);
        }
        this.__addedListeners[type].push((options ? [listener, options] : [listener]));
        if (this.__connected && this.__nodeIsEventTarget) {
            EventTarget.prototype.addEventListener.call(this.__node, type, listener, options);
        }
    }
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener.
     */
    removeEventListener(type, listener, options) {
        debug: {
            if (!this.__addedListeners[type])
                console.warn(`EventDispatcher: listener ${type} not found!`);
        }
        if (!listener) {
            for (let i = 0; i < this.__addedListeners[type].length; i++) {
                if (this.__connected && this.__nodeIsEventTarget) {
                    EventTarget.prototype.removeEventListener.call(this.__node, type, this.__addedListeners[type][i][0], this.__addedListeners[type][i][1]);
                }
            }
            this.__addedListeners[type].length = 0;
            delete this.__addedListeners[type];
        }
        else {
            const l = this.__addedListeners[type].findIndex(item => item[0] = listener);
            debug: {
                if (l === -1)
                    console.warn(`EventDispatcher: listener ${type} not found!`);
            }
            this.__addedListeners[type].splice(l, 1);
            if (this.__connected && this.__nodeIsEventTarget) {
                EventTarget.prototype.removeEventListener.call(this.__node, type, listener, options);
            }
        }
    }
    /**
     * Shorthand for custom event dispatch.
     */
    dispatchEvent(type, detail = {}, bubbles = true, node = this.__node) {
        // TODO: Test with IoNode, IoElement and native element
        if (!this.__connected)
            return;
        if ((node instanceof EventTarget)) {
            EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(type, { detail: detail, bubbles: bubbles, composed: true, cancelable: true }));
        }
        else {
            if (this.__protoListeners[type] !== undefined) {
                this.__protoListeners[type][0].call(node, { detail: detail, target: node, path: [node] });
            }
            if (this.__propListeners[type] !== undefined) {
                this.__propListeners[type][0].call(node, { detail: detail, target: node, path: [node] });
            }
            if (this.__addedListeners[type] !== undefined) {
                for (let i = 0; i < this.__addedListeners[type].length; i++) {
                    this.__addedListeners[type][i][0].call(node, { detail: detail, target: node, path: [node] });
                }
            }
        }
    }
    /**
     * Disconnects all event listeners and removes all references.
     * Use this when node is no longer needed.
     */
    dispose() {
        if (this.__connected)
            this.disconnect();
        delete this.__node;
        delete this.__protoListeners;
        delete this.__propListeners;
        delete this.__addedListeners;
    }
}
export { EventDispatcher };
//# sourceMappingURL=eventDispatcher.js.map