export const sanitizeListenerDefinition = (listenerDefinition) => {
    debug: {
        if (listenerDefinition instanceof Array) {
            if (typeof listenerDefinition[0] !== 'string' && typeof listenerDefinition[0] !== 'function')
                console.warn('Listeners: invalid listener type');
            if (listenerDefinition[1] && typeof listenerDefinition[1] !== 'object') {
                console.warn('Listeners: invalid listener options type');
                console.log(listenerDefinition);
            }
        }
        else {
            if (typeof listenerDefinition !== 'string' && typeof listenerDefinition !== 'function')
                console.warn('Listeners: invalid listener type');
        }
    }
    return listenerDefinition instanceof Array ? listenerDefinition : [listenerDefinition];
};
export const assignListenerDefinition = (definitions, listenerDefinition) => {
    const newListenerDefinition = sanitizeListenerDefinition(listenerDefinition);
    const i = definitions.findIndex((listener) => listener[0] === newListenerDefinition[0]);
    if (i !== -1) {
        if (definitions[i][1])
            definitions[i][1] = Object.assign(definitions[i][1], newListenerDefinition[1]);
        else if (newListenerDefinition[1])
            definitions[i][1] = newListenerDefinition[1];
    }
    else {
        definitions.push(newListenerDefinition);
    }
};
export const sanitizeListener = (node, listenerDefinition) => {
    if (typeof listenerDefinition[0] === 'string')
        listenerDefinition[0] = node[listenerDefinition[0]];
    return listenerDefinition;
};
/**
 * Event Dispatcher.
 */
class EventDispatcher {
    __node;
    __nodeIsEventTarget;
    __protoListeners = {};
    __propListeners = {};
    __addedListeners = {};
    __connected = false;
    /**
     * Creates Event Dispatcher for specified IoNode instance.
     * @param {IoNode} node owner IoNode.
     */
    constructor(node) {
        this.__node = node;
        this.__nodeIsEventTarget = node instanceof EventTarget;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__nodeIsEventTarget', { enumerable: false, writable: false });
        Object.defineProperty(this, '__protoListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, '__propListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, '__addedListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, '__connected', { enumerable: false });
        for (const type in node.__protochain?.listeners) {
            this.__protoListeners[type] = [];
            for (let i = 0; i < node.__protochain.listeners[type].length; i++) {
                this.__protoListeners[type].push(sanitizeListener(this.__node, node.__protochain.listeners[type][i]));
            }
        }
    }
    /**
     * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
     * @param {Object} properties - Properties.
     */
    setPropListeners(properties) {
        const newPropListeners = {};
        for (const prop in properties) {
            if (prop.startsWith('on-')) {
                const type = prop.slice(3, prop.length);
                const listenerDefinition = sanitizeListenerDefinition(properties[prop]);
                const listener = sanitizeListener(this.__node, listenerDefinition);
                newPropListeners[type] = [listener];
            }
        }
        const propListeners = this.__propListeners;
        for (const type in propListeners) {
            if (!newPropListeners[type]) {
                if (this.__connected && this.__nodeIsEventTarget) {
                    const listenerDefinition = sanitizeListenerDefinition(propListeners[type][0]);
                    const listener = sanitizeListener(this.__node, listenerDefinition);
                    EventTarget.prototype.removeEventListener.call(this.__node, type, listener[0], listener[1]);
                }
                delete propListeners[type];
            }
        }
        for (const type in newPropListeners) {
            if (this.__connected && this.__nodeIsEventTarget) {
                const listenerDefinition = sanitizeListenerDefinition(propListeners[type][0]);
                const listener = sanitizeListener(this.__node, listenerDefinition);
                const newListenerDefinition = sanitizeListenerDefinition(newPropListeners[type][0]);
                const newListener = sanitizeListener(this.__node, newListenerDefinition);
                if (!propListeners[type]) {
                    EventTarget.prototype.addEventListener.call(this.__node, type, newListener[0], newListener[1]);
                }
                else if ((listener !== newListener || listener[1] !== newListener[1])) {
                    EventTarget.prototype.removeEventListener.call(this.__node, type, listener[0], listener[1]);
                    EventTarget.prototype.addEventListener.call(this.__node, type, newListener[0], newListener[1]);
                }
            }
            propListeners[type] = newPropListeners[type];
        }
    }
    /**
     * Connects all event listeners.
     * @return {this} this
     */
    connect() {
        debug: {
            if (this.__connected)
                console.error('EventDispatcher: already connected!');
        }
        if (this.__nodeIsEventTarget) {
            // TODO: test
            for (const type in this.__protoListeners) {
                for (let i = 0; i < this.__protoListeners[type].length; i++) {
                    const listener = this.__protoListeners[type][i];
                    EventTarget.prototype.addEventListener.call(this.__node, type, listener[0], listener[1]);
                }
            }
            for (const type in this.__propListeners) {
                const listener = this.__propListeners[type][0];
                EventTarget.prototype.addEventListener.call(this.__node, type, listener[0], listener[1]);
            }
            for (const type in this.__addedListeners) {
                for (let i = this.__addedListeners[type].length; i--;) {
                    const listener = this.__addedListeners[type][i];
                    EventTarget.prototype.addEventListener.call(this.__node, type, listener[0], listener[1]);
                }
            }
        }
        this.__connected = true;
        return this;
    }
    /**
     * Disconnects all event listeners.
     * @return {this} this
     */
    disconnect() {
        debug: {
            if (!this.__connected)
                console.error('EventDispatcher: already disconnected!');
        }
        if (this.__nodeIsEventTarget) {
            // TODO: test
            for (const type in this.__protoListeners) {
                for (let i = 0; i < this.__protoListeners[type].length; i++) {
                    const listener = this.__protoListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.__node, type, listener[0], listener[1]);
                }
            }
            for (const type in this.__propListeners) {
                const listener = this.__propListeners[type][0];
                EventTarget.prototype.removeEventListener.call(this.__node, type, listener[0], listener[1]);
            }
            for (const type in this.__addedListeners) {
                for (let i = this.__addedListeners[type].length; i--;) {
                    const listener = this.__addedListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.__node, type, listener[0], listener[1]);
                }
            }
        }
        this.__connected = false;
        return this;
    }
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(type, listener, options) {
        this.__addedListeners[type] = this.__addedListeners[type] || [];
        debug: {
            const l = this.__addedListeners[type].findIndex(l => l[0] === listener);
            if (l !== -1)
                console.warn(`EventDispatcher: listener ${type} already added!`);
        }
        this.__addedListeners[type].push(options ? [listener, options] : [listener]);
        if (this.__connected && this.__nodeIsEventTarget) {
            EventTarget.prototype.addEventListener.call(this.__node, type, listener, options);
        }
    }
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(type, listener, options) {
        debug: {
            if (!this.__addedListeners[type])
                console.warn(`EventDispatcher: listener ${type} not found!`);
            if (listener && typeof listener !== 'function')
                console.warn('EventDispatcher: invalid listener type!');
            if (options && typeof options !== 'object')
                console.warn('EventDispatcher: invalid options type!');
        }
        if (!listener) {
            for (let i = 0; i < this.__addedListeners[type].length; i++) {
                if (this.__connected && this.__nodeIsEventTarget) {
                    const listener = this.__addedListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.__node, type, listener[0], listener[1]);
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
     * @param {string} type Name of the event
     * @param {Object} detail Event detail data
     * @param {boolean} [bubbles] Makes event bubble
     * @param {EventTarget} [node] Event target to dispatch from
     */
    dispatchEvent(type, detail = {}, bubbles = true, node = this.__node) {
        if (!this.__connected)
            return;
        if ((node instanceof EventTarget)) {
            EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(type, { detail: detail, bubbles: bubbles, composed: true, cancelable: true }));
        }
        else {
            if (this.__protoListeners[type] !== undefined) {
                for (let i = 0; i < this.__protoListeners[type].length; i++) {
                    const listener = this.__protoListeners[type][i];
                    listener[0].call(node, { detail: detail, target: node, path: [node] });
                }
            }
            if (this.__propListeners[type] !== undefined) {
                debug: {
                    if (this.__propListeners[type].length > 1)
                        console.warn(`EventDispatcher: __propListeners[${type}] array too long!`);
                }
                const listener = this.__propListeners[type][0];
                listener[0].call(node, { detail: detail, target: node, path: [node] });
            }
            if (this.__addedListeners[type] !== undefined) {
                for (let i = 0; i < this.__addedListeners[type].length; i++) {
                    const listener = this.__addedListeners[type][i];
                    listener[0].call(node, { detail: detail, target: node, path: [node] });
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
//# sourceMappingURL=listeners.js.map