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
    constructor(node, protoListeners) {
        this.__propListeners = {};
        this.__activeListeners = {};
        // private __inactiveListeners: Record<string, EventListenerOrEventListenerObject[]> = {};
        this.__listenerOptions = new WeakMap();
        this.__connected = false;
        this.__node = node;
        this.__protoListeners = protoListeners;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__protoListeners', { enumerable: false });
        Object.defineProperty(this, '__propListeners', { enumerable: false });
        Object.defineProperty(this, '__activeListeners', { enumerable: false });
        Object.defineProperty(this, '__listenerOptions', { enumerable: false, writable: false });
        Object.defineProperty(this, '__connected', { enumerable: false });
    }
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} properties - Properties.
     */
    setPropListeners(properties) {
        // TODO: Unset propListeners, test.
        const listeners = this.__propListeners;
        const newListeners = {};
        for (let prop in properties) {
            if (prop.startsWith('on-')) {
                const type = prop.slice(3, prop.length);
                const listener = (properties[prop] instanceof Array)
                    ? [properties[prop][0], properties[prop][1]]
                    : [properties[prop]];
                if (typeof listener[0] !== 'function')
                    listener[0] = this.__node[listener[0]];
                newListeners[type] = listener;
            }
        }
        for (let type in newListeners) {
            if (listeners[type]) {
                this.__node.removeEventListener(type, listeners[type][0], listeners[type][1]);
            }
            listeners[type] = newListeners[type];
            if (this.__connected) {
                this.__node.addEventListener(type, listeners[type][0], newListeners[type][1]);
            }
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
        this.__connected = true;
        for (let type in this.__protoListeners) {
            const isFunction = typeof this.__protoListeners[type][0] === 'function';
            const listener = isFunction ? this.__protoListeners[type][0] : this.__node[this.__protoListeners[type][0]];
            this.addEventListener(type, listener, this.__protoListeners[type][1]);
        }
        for (let type in this.__propListeners) {
            this.addEventListener(type, this.__propListeners[type][0], this.__propListeners[type][1]);
        }
        // // TODO: sort out!
        // for (let type in this.__inactiveListeners) {
        //   for (let j = this.__inactiveListeners[type].length; j--;) {
        //     const listener = this.__inactiveListeners[type][j];
        //     // const i = this.__activeListeners[type].indexOf(listener);
        //     // if (i === -1) {
        //       const options = this.__listenerOptions.get(listener);
        //       this.addEventListener(type, listener, options);
        //     // }
        //     this.__inactiveListeners[type].splice(j, 1);
        //   }
        // }
    }
    /**
     * Disconnects all event listeners.
     */
    disconnect() {
        debug: {
            if (!this.__connected)
                console.error('EventDispatcher: already disconnected!');
        }
        this.__connected = false;
        for (let l in this.__protoListeners) {
            const isFunction = typeof this.__protoListeners[l][0] === 'function';
            const listener = isFunction ? this.__protoListeners[l][0] : this.__node[this.__protoListeners[l][0]];
            this.removeEventListener(l, listener, this.__protoListeners[l][1]);
        }
        for (let l in this.__propListeners) {
            this.removeEventListener(l, this.__propListeners[l][0], this.__propListeners[l][1]);
        }
        // // TODO: sort out!
        // for (let type in this.__activeListeners) {
        //   this.__inactiveListeners[type] = this.__inactiveListeners[type] || [];
        //   for (let j = this.__activeListeners[type].length; j--;) {
        //     const listener = this.__activeListeners[type][j];
        //     const options = this.__listenerOptions.get(listener);
        //     this.removeEventListener(type, listener, options);
        //     this.__inactiveListeners[type].push(listener);
        //   }
        // }
    }
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener.
     */
    addEventListener(type, listener, options) {
        this.__activeListeners[type] = this.__activeListeners[type] || [];
        const i = this.__activeListeners[type].indexOf(listener);
        if (i === -1) {
            if (this.__node.__isIoElement) {
                HTMLElement.prototype.addEventListener.call(this.__node, type, listener, options);
            }
            this.__activeListeners[type].push(listener);
            this.__listenerOptions.set(listener, options);
        }
    }
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener.
     */
    removeEventListener(type, listener, options) {
        if (this.__activeListeners[type] !== undefined) {
            const i = this.__activeListeners[type].indexOf(listener);
            // TODO `listener === undefined` removing all listeners needs iterator.
            // TODO `options === undefined` should get options from `__listenerOptions`.
            if (i !== -1 || listener === undefined) {
                if (this.__node.__isIoElement) {
                    HTMLElement.prototype.removeEventListener.call(this.__node, type, listener, options);
                }
                this.__activeListeners[type].splice(i, 1);
            }
        }
    }
    /**
     * Shorthand for custom event dispatch.
     */
    dispatchEvent(type, detail = {}, bubbles = true, src = this.__node) {
        if ((src instanceof HTMLElement || src === window)) {
            HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, { detail: detail, bubbles: bubbles, composed: true, cancelable: true }));
        }
        else {
            const active = this.__activeListeners;
            if (active[type] !== undefined) {
                const array = active[type].slice(0);
                for (let i = 0; i < array.length; i++) {
                    array[i].call(src, { detail: detail, target: src, path: [src] });
                    // TODO: consider bubbling.
                }
            }
        }
    }
    /**
     * Disconnects all event listeners and removes all references.
     * Use this when node is no longer needed.
     */
    dispose() {
        // TODO: test
        if (this.__connected)
            this.disconnect();
    }
}
export { EventDispatcher };
//# sourceMappingURL=eventDispatcher.js.map