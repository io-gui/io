import { RegisterIoElement as RegisterIoElement$1, IoElement as IoElement$1 } from './iogui.js';

/**
 * Property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
class ChangeQueue$1 {
    __node;
    __changes = [];
    __dispatching = false;
    /**
     * Creates change queue for the specified owner instance of `IoNode`.
     * @param {IoNode} node - Owner node.
     */
    constructor(node) {
        this.__node = node;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__changes', { enumerable: false, writable: false });
        Object.defineProperty(this, '__dispatching', { enumerable: false });
    }
    /**
     * Adds property change payload to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated in-queue.
     * @param {string} property - Property name.
     * @param {any} value Property value.
     * @param {any} oldValue Old property value.
     */
    queue(property, value, oldValue) {
        const i = this.__changes.findIndex(change => change.property === property);
        if (i === -1) {
            this.__changes.push(new Change(property, value, oldValue));
        }
        else {
            this.__changes[i].value = value;
        }
    }
    /**
     * Dispatches and clears the queue.
     * For each property change in the queue:
     *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
     *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
     * If owner node is not connected dispatch is aborted.
     * After all changes are dispatched it invokes `.applyCompose()` and `.changed()` functions od the owner node instance.
     */
    dispatch() {
        if (this.__dispatching === true || !this.__node.__connected)
            return;
        this.__dispatching = true;
        let changed = false;
        while (this.__changes.length) {
            // TODO: convert to FIFO
            const i = this.__changes.length - 1;
            // const i = 0;
            const change = this.__changes[i];
            this.__changes.splice(i, 1);
            const property = change.property;
            if (change.value !== change.oldValue) {
                changed = true;
                if (this.__node[property + 'Changed'])
                    this.__node[property + 'Changed'](change);
                this.__node.dispatchEvent(property + '-changed', change);
            }
        }
        if (changed) {
            this.__node.applyCompose();
            this.__node.changed();
        }
        this.__dispatching = false;
    }
    /**
     * Clears the queue and removes the node reference.
     * Use this when node queue is no longer needed.
     */
    dispose() {
        this.__changes.length = 0;
        delete this.__node;
        delete this.__changes;
    }
}
/**
 * Property change payload
 */
class Change {
    property;
    value;
    oldValue;
    /**
     * Creates property change payload.
     * @param {string} property - Property name.
     * @param {*} value - New property value.
     * @param {*} oldValue - Old property value.
     */
    constructor(property, value, oldValue) {
        this.property = property;
        this.value = value;
        this.oldValue = oldValue;
    }
}

class FakeIoNode$1 {
    __connected = true;
    prop1ChangeCounter = 0;
    prop1Change;
    prop2ChangeCounter = 0;
    prop2Change;
    changeCounter = 0;
    applyComposeCounter = 0;
    eventDispatchCounter = 0;
    eventName;
    eventChange;
    eventRegister = [];
    changeRegister = [];
    prop1Changed(change) {
        this.prop1Change = change;
        this.prop1ChangeCounter++;
        this.changeRegister.push('prop1Changed');
    }
    prop2Changed(change) {
        this.prop2Change = change;
        this.prop2ChangeCounter++;
        this.changeRegister.push('prop2Changed');
    }
    dispatchEvent(eventName, change) {
        this.eventDispatchCounter++;
        this.eventName = eventName;
        this.eventChange = change;
        this.eventRegister.push(eventName);
    }
    changed() {
        this.changeCounter++;
    }
    applyCompose() {
        this.applyComposeCounter++;
    }
}
class ChangeQueue {
    run() {
        describe('ChangeQueue', () => {
            it('Should initialize with correct default values', () => {
                const node = new FakeIoNode$1();
                const changeQueue = new ChangeQueue$1(node);
                chai.expect(changeQueue.__node).to.be.equal(node);
                chai.expect(JSON.stringify(changeQueue.__changes)).to.be.equal('[]');
                chai.expect(changeQueue.__changes.length).to.be.equal(0);
                chai.expect(changeQueue.__dispatching).to.be.equal(false);
            });
            it('Should dispatch change events with correct payloads', () => {
                const node = new FakeIoNode$1();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.queue('test', 1, 0);
                changeQueue.queue('test', 2, 1);
                chai.expect(changeQueue.__changes.length).to.be.equal(1);
                changeQueue.dispatch();
                chai.expect(changeQueue.__changes.length).to.be.equal(0);
                chai.expect(node.eventName).to.be.equal('test-changed');
                chai.expect(node.eventChange?.property).to.be.equal('test');
                chai.expect(node.eventChange?.value).to.be.equal(2);
                chai.expect(node.eventChange?.oldValue).to.be.equal(0);
                chai.expect(node.eventDispatchCounter).to.be.equal(1);
                chai.expect(node.changeCounter).to.be.equal(1);
                chai.expect(node.applyComposeCounter).to.be.equal(1);
                changeQueue.queue('test2', 0, -1);
                changeQueue.queue('test3', 2, 1);
                chai.expect(changeQueue.__changes.length).to.be.equal(2);
                changeQueue.dispatch();
                chai.expect(changeQueue.__changes.length).to.be.equal(0);
                // TODO: convert to FIFO
                chai.expect(node.eventName).to.be.equal('test2-changed');
                chai.expect(node.eventChange?.property).to.be.equal('test2');
                chai.expect(node.eventChange?.value).to.be.equal(0);
                chai.expect(node.eventChange?.oldValue).to.be.equal(-1);
                // chai.expect(node.eventChange?.property).to.be.equal('test3');
                // chai.expect(node.eventChange?.value).to.be.equal(2);
                // chai.expect(node.eventChange?.oldValue).to.be.equal(1);
                chai.expect(node.eventDispatchCounter).to.be.equal(3);
                chai.expect(node.prop1ChangeCounter).to.be.equal(0);
                chai.expect(node.changeCounter).to.be.equal(2);
                chai.expect(node.applyComposeCounter).to.be.equal(2);
            });
            it('Should invoke handler functions with correct payloads', () => {
                const node = new FakeIoNode$1();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.queue('prop1', 1, 0);
                changeQueue.queue('prop1', 2, 1);
                changeQueue.dispatch();
                chai.expect(node.prop1ChangeCounter).to.be.equal(1);
                chai.expect(node.changeCounter).to.be.equal(1);
                chai.expect(node.applyComposeCounter).to.be.equal(1);
                chai.expect(node.prop1Change?.property).to.be.equal('prop1');
                chai.expect(node.prop1Change?.value).to.be.equal(2);
                chai.expect(node.prop1Change?.oldValue).to.be.equal(0);
            });
            it('Should handle changes in first-in, first-out (FIFO) order', () => {
                const node = new FakeIoNode$1();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.queue('prop1', 1, 0);
                changeQueue.queue('prop1', 3, 0);
                changeQueue.queue('prop2', 2, 0);
                changeQueue.dispatch();
                // TODO: convert to FIFO
                chai.expect(JSON.stringify(node.changeRegister)).to.be.equal('["prop2Changed","prop1Changed"]');
                chai.expect(JSON.stringify(node.eventRegister)).to.be.equal('["prop2-changed","prop1-changed"]');
                // chai.expect(JSON.stringify(node.changeRegister)).to.be.equal('["prop1Changed","prop2Changed"]');
                // chai.expect(JSON.stringify(node.eventRegister)).to.be.equal('["prop1-changed","prop2-changed"]');
            });
            it('Should skip dispatch if value is same as oldValue', () => {
                const node = new FakeIoNode$1();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.queue('prop1', 0, 0);
                changeQueue.dispatch();
                chai.expect(node.prop1ChangeCounter).to.be.equal(0);
            });
            it('Should abort dispatch if owner node is disconnected', () => {
                const node = new FakeIoNode$1();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.queue('prop1', 1, 0);
                node.__connected = false;
                changeQueue.dispatch();
                chai.expect(node.prop1ChangeCounter).to.be.equal(0);
                node.__connected = true;
                changeQueue.dispatch();
                chai.expect(node.prop1ChangeCounter).to.be.equal(1);
            });
            it('Should dispose correctly', () => {
                const node = new FakeIoNode$1();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.dispose();
                chai.expect(changeQueue.__node).to.be.equal(undefined);
                chai.expect(changeQueue.__changes).to.be.equal(undefined);
            });
        });
    }
}

/**
 * Automatically generated array of all contructors inherited from the prototype chain.
 * An array of all inherited function names from a prototype chain that start with "on" or "_".
 * It provides a utility function `.bind(node)` that binds the functions to the specified instance of `IoNode`.
 */
class ProtoChain$1 {
    constructors = [];
    functions = [];
    /**
     * Creates an array of inherited contructors by traversing down the prototype chain of the specified contructor and adds each contructor to itself.
     * It terminates the prototype chain before it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
     * Initializes the array of all inherited function names from a prototype chain that start with "on" or "_".
     * @param {Constructor} constructor - Prototype object.
     */
    constructor(constructor) {
        let prototype = constructor.prototype;
        while (prototype
            && prototype.constructor.name !== 'classConstructor'
            && prototype.constructor !== HTMLElement
            && prototype.constructor !== Object
            && prototype.constructor !== Array) {
            this.constructors.push(prototype.constructor);
            const fnames = Object.getOwnPropertyNames(prototype.constructor.prototype);
            for (let j = 0; j < fnames.length; j++) {
                const fname = fnames[j];
                if (fname === 'constructor')
                    continue;
                const p = Object.getOwnPropertyDescriptor(prototype.constructor.prototype, fname);
                if (p === undefined || p.get || p.set)
                    continue;
                if (typeof prototype.constructor.prototype[fname] === 'function') {
                    if (this.functions.indexOf(fname) === -1 && (fname.startsWith('_') || fname.startsWith('on'))) {
                        this.functions.push(fname);
                    }
                }
            }
            prototype = prototype.__proto__;
        }
    }
    /**
     * Binds all functions to specified instance of `IoNode`.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bindFunctions(node) {
        for (let i = this.functions.length; i--;)
            Object.defineProperty(node, this.functions[i], { value: node[this.functions[i]].bind(node) });
    }
}

/**
 * Array of all listeners defined as `static get Listeners()` return objects in prototype chain.
 */
class ProtoListeners {
    constructor(protochain) {
        for (let i = protochain.constructors.length; i--;) {
            const listeners = protochain.constructors[i].Listeners;
            for (const l in listeners) {
                const listener = (listeners[l] instanceof Array) ? listeners[l] : [listeners[l]];
                this[l] = listener;
            }
        }
    }
}
/**
 * Event Dispatcher.
 */
class EventDispatcher$1 {
    __node;
    __nodeIsEventTarget;
    __protoListeners = {};
    __propListeners = {};
    __addedListeners = {};
    __connected = false;
    /**
     * Creates Event Dispatcher.
     * @param {IoNode | HTMLElement} node Node or element to add EventDispatcher to.
     * @param {ProtoListeners} [protoListeners] Protolisteners
     */
    constructor(node, protoListeners = {}) {
        this.__node = node;
        this.__nodeIsEventTarget = node instanceof EventTarget;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__nodeIsEventTarget', { enumerable: false, writable: false });
        Object.defineProperty(this, '__protoListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, '__propListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, '__connected', { enumerable: false });
        for (const type in protoListeners) {
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
        for (const prop in properties) {
            if (prop.startsWith('on-')) {
                const type = prop.slice(3, prop.length);
                const listener = (properties[prop] instanceof Array) ? [...properties[prop]] : [properties[prop]];
                if (typeof listener[0] !== 'function')
                    listener[0] = this.__node[listener[0]];
                newPropListeners[type] = listener;
            }
        }
        const propListeners = this.__propListeners;
        for (const type in propListeners) {
            if (!newPropListeners[type]) {
                if (this.__connected && this.__nodeIsEventTarget) {
                    EventTarget.prototype.removeEventListener.call(this.__node, type, propListeners[type][0], propListeners[type][1]);
                }
                delete propListeners[type];
            }
        }
        for (const type in newPropListeners) {
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
     * @return {this} this
     */
    connect() {
        if (this.__nodeIsEventTarget) {
            for (const type in this.__protoListeners) {
                EventTarget.prototype.addEventListener.call(this.__node, type, this.__protoListeners[type][0], this.__protoListeners[type][1]);
            }
            for (const type in this.__propListeners) {
                EventTarget.prototype.addEventListener.call(this.__node, type, this.__propListeners[type][0], this.__propListeners[type][1]);
            }
            for (const type in this.__addedListeners) {
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
     * @return {this} this
     */
    disconnect() {
        if (this.__nodeIsEventTarget) {
            for (const type in this.__protoListeners) {
                EventTarget.prototype.removeEventListener.call(this.__node, type, this.__protoListeners[type][0], this.__protoListeners[type][1]);
            }
            for (const type in this.__propListeners) {
                EventTarget.prototype.removeEventListener.call(this.__node, type, this.__propListeners[type][0], this.__propListeners[type][1]);
            }
            for (const type in this.__addedListeners) {
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
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(type, listener, options) {
        this.__addedListeners[type] = this.__addedListeners[type] || [];
        this.__addedListeners[type].push((options ? [listener, options] : [listener]));
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

class IoNode11 {
    handler1Count = 0;
    handler1Detail;
    static get Listeners() {
        return {
            'event1': 'handler1',
        };
    }
    handler1(event) {
        this.handler1Count++;
        this.handler1Detail = event.detail;
    }
}
class IoNode2$1 extends IoNode11 {
    handler2Count = 0;
    handler3Count = 0;
    handler2Detail;
    handler3Detail;
    static get Listeners() {
        return {
            'event2': ['handler2', { capture: true }],
        };
    }
    handler2(event) {
        this.handler2Count++;
        this.handler2Detail = event.detail;
    }
    handler3(event) {
        this.handler3Count++;
        this.handler3Detail = event.detail;
    }
}
class TestDivEventDispatchElement extends HTMLElement {
    handler3Count = 0;
    handler3Detail;
    handler3(event) {
        this.handler3Count++;
        this.handler3Detail = event.detail;
    }
}
window.customElements.define('test-div-event-dispatch', TestDivEventDispatchElement);
class EventDispatcher {
    run() {
        describe('EventDispatcher', () => {
            it('Should initialize with correct default values', () => {
                const node = new IoNode2$1();
                const protochain = new ProtoChain$1(IoNode2$1);
                const protoListeners = new ProtoListeners(protochain);
                const eventDispatcher = new EventDispatcher$1(node, protoListeners);
                chai.expect(eventDispatcher.__node).to.be.equal(node);
                chai.expect(typeof eventDispatcher.__protoListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.__propListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.__addedListeners).to.be.equal('object');
                chai.expect(eventDispatcher.__connected).to.be.equal(false);
            });
            it('Should include all listeners from protochain', () => {
                const node = new IoNode2$1();
                const protochain = new ProtoChain$1(IoNode2$1);
                const protoListeners = new ProtoListeners(protochain);
                const eventDispatcher = new EventDispatcher$1(node, protoListeners);
                chai.expect(JSON.stringify(eventDispatcher.__protoListeners)).to.be.equal('{"event1":[null],"event2":[null,{"capture":true}]}');
                chai.expect(eventDispatcher.__protoListeners.event1[0]).to.be.equal(node.handler1);
                chai.expect(eventDispatcher.__protoListeners.event2[0]).to.be.equal(node.handler2);
            });
            it('Should set property listeners correctly', () => {
                const node = new IoNode2$1();
                const protochain = new ProtoChain$1(IoNode2$1);
                const protoListeners = new ProtoListeners(protochain);
                const eventDispatcher = new EventDispatcher$1(node, protoListeners);
                const handler4 = () => { };
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event3":[null],"event4":[null]}');
                chai.expect(eventDispatcher.__propListeners.event3[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__propListeners.event4[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event5': ['handler3'], 'on-event6': [handler4] });
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event5":[null],"event6":[null]}');
                chai.expect(eventDispatcher.__propListeners.event5[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__propListeners.event6[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event7': ['handler3', { capture: true }], 'on-event8': [handler4, { capture: true }] });
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{"event7":[null,{"capture":true}],"event8":[null,{"capture":true}]}');
                chai.expect(eventDispatcher.__propListeners.event7[0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.__propListeners.event8[0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({});
                chai.expect(JSON.stringify(eventDispatcher.__propListeners)).to.be.equal('{}');
            });
            it('Should add/remove listeners correctly', () => {
                const node = new IoNode2$1();
                const protochain = new ProtoChain$1(IoNode2$1);
                const protoListeners = new ProtoListeners(protochain);
                const eventDispatcher = new EventDispatcher$1(node, protoListeners);
                const listener1 = () => { };
                const listener2 = () => { };
                eventDispatcher.addEventListener('event1', listener1);
                eventDispatcher.addEventListener('event1', listener2, { capture: true });
                chai.expect(JSON.stringify(eventDispatcher.__addedListeners)).to.be.equal('{"event1":[[null],[null,{"capture":true}]]}');
                chai.expect(eventDispatcher.__addedListeners.event1[0][0]).to.be.equal(listener1);
                chai.expect(eventDispatcher.__addedListeners.event1[1][0]).to.be.equal(listener2);
                eventDispatcher.removeEventListener('event1', listener1);
                chai.expect(JSON.stringify(eventDispatcher.__addedListeners)).to.be.equal('{"event1":[[null,{"capture":true}]]}');
                chai.expect(eventDispatcher.__addedListeners.event1[0][0]).to.be.equal(listener2);
                eventDispatcher.removeEventListener('event1');
                chai.expect(JSON.stringify(eventDispatcher.__addedListeners)).to.be.equal('{}');
            });
            it('Should dispatch events only when connected', () => {
                const node = new IoNode2$1();
                const protochain = new ProtoChain$1(IoNode2$1);
                const protoListeners = new ProtoListeners(protochain);
                const eventDispatcher = new EventDispatcher$1(node, protoListeners);
                let handler4Count = 0;
                const handler4 = () => {
                    handler4Count++;
                };
                let handler5Count = 0;
                const handler5 = () => {
                    handler5Count++;
                };
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                eventDispatcher.addEventListener('event5', handler5);
                eventDispatcher.dispatchEvent('event1');
                eventDispatcher.dispatchEvent('event2');
                eventDispatcher.dispatchEvent('event3');
                eventDispatcher.dispatchEvent('event4');
                eventDispatcher.dispatchEvent('event5');
                chai.expect(node.handler1Count).to.be.equal(0);
                chai.expect(node.handler2Count).to.be.equal(0);
                chai.expect(node.handler3Count).to.be.equal(0);
                chai.expect(handler4Count).to.be.equal(0);
                chai.expect(handler5Count).to.be.equal(0);
                eventDispatcher.connect();
                eventDispatcher.dispatchEvent('event1');
                eventDispatcher.dispatchEvent('event2');
                eventDispatcher.dispatchEvent('event3');
                eventDispatcher.dispatchEvent('event4');
                eventDispatcher.dispatchEvent('event5');
                chai.expect(node.handler1Count).to.be.equal(1);
                chai.expect(node.handler2Count).to.be.equal(1);
                chai.expect(node.handler3Count).to.be.equal(1);
                chai.expect(handler4Count).to.be.equal(1);
                chai.expect(handler5Count).to.be.equal(1);
                eventDispatcher.disconnect();
                eventDispatcher.dispatchEvent('event1');
                eventDispatcher.dispatchEvent('event2');
                eventDispatcher.dispatchEvent('event3');
                eventDispatcher.dispatchEvent('event4');
                eventDispatcher.dispatchEvent('event5');
                chai.expect(node.handler1Count).to.be.equal(1);
                chai.expect(node.handler2Count).to.be.equal(1);
                chai.expect(node.handler3Count).to.be.equal(1);
                chai.expect(handler4Count).to.be.equal(1);
                chai.expect(handler5Count).to.be.equal(1);
            });
            it('Should dispatch events with correct event detail', () => {
                const node = new IoNode2$1();
                const protochain = new ProtoChain$1(IoNode2$1);
                const protoListeners = new ProtoListeners(protochain);
                const eventDispatcher = new EventDispatcher$1(node, protoListeners).connect();
                let handler4Detail;
                const handler4 = (event) => {
                    handler4Detail = event.detail;
                };
                let handler5Detail;
                const handler5 = (event) => {
                    handler5Detail = event.detail;
                };
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                eventDispatcher.addEventListener('event5', handler5);
                eventDispatcher.dispatchEvent('event1', 'detail1');
                eventDispatcher.dispatchEvent('event2', 'detail2');
                eventDispatcher.dispatchEvent('event3', 'detail3');
                eventDispatcher.dispatchEvent('event4', 'detail4');
                eventDispatcher.dispatchEvent('event5', 'detail5');
                chai.expect(node.handler1Detail).to.be.equal('detail1');
                chai.expect(node.handler2Detail).to.be.equal('detail2');
                chai.expect(node.handler3Detail).to.be.equal('detail3');
                chai.expect(handler4Detail).to.be.equal('detail4');
                chai.expect(handler5Detail).to.be.equal('detail5');
            });
            it('Should add/remove/dispatch events on HTML elements', () => {
                const element = document.createElement('test-div-event-dispatch');
                const eventDispatcher = new EventDispatcher$1(element);
                let handler4Count = 0;
                let handler4Detail;
                const handler4 = (event) => {
                    handler4Count++;
                    handler4Detail = event.detail;
                };
                let handler5Count = 0;
                let handler5Detail;
                const handler5 = (event) => {
                    handler5Count++;
                    handler5Detail = event.detail;
                };
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                eventDispatcher.addEventListener('event5', handler5);
                element.dispatchEvent(new CustomEvent('event3', { detail: 'detail3' }));
                element.dispatchEvent(new CustomEvent('event4', { detail: 'detail4' }));
                element.dispatchEvent(new CustomEvent('event5', { detail: 'detail5' }));
                chai.expect(element.handler3Count).to.be.equal(0);
                chai.expect(handler4Count).to.be.equal(0);
                chai.expect(handler5Count).to.be.equal(0);
                eventDispatcher.connect();
                element.dispatchEvent(new CustomEvent('event3', { detail: 'detail3' }));
                element.dispatchEvent(new CustomEvent('event4', { detail: 'detail4' }));
                element.dispatchEvent(new CustomEvent('event5', { detail: 'detail5' }));
                chai.expect(element.handler3Count).to.be.equal(1);
                chai.expect(handler4Count).to.be.equal(1);
                chai.expect(handler5Count).to.be.equal(1);
                chai.expect(element.handler3Detail).to.be.equal('detail3');
                chai.expect(handler4Detail).to.be.equal('detail4');
                chai.expect(handler5Detail).to.be.equal('detail5');
                eventDispatcher.disconnect();
                element.dispatchEvent(new CustomEvent('event3', { detail: 'detail3' }));
                element.dispatchEvent(new CustomEvent('event4', { detail: 'detail4' }));
                element.dispatchEvent(new CustomEvent('event5', { detail: 'detail5' }));
                chai.expect(element.handler3Count).to.be.equal(1);
                chai.expect(handler4Count).to.be.equal(1);
                chai.expect(handler5Count).to.be.equal(1);
            });
            it('Should dispose correctly', () => {
                const node = new IoNode2$1();
                const eventDispatcher = new EventDispatcher$1(node);
                eventDispatcher.dispose();
                chai.expect(eventDispatcher.__node).to.be.equal(undefined);
                chai.expect(eventDispatcher.__protoListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.__propListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.__addedListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.__connected).to.be.equal(false);
            });
        });
    }
}

/**
 * Binding object. It manages data binding between source and targets using `[property]-changed` events.
 */
class Binding {
    __node;
    __property = '';
    __targets = [];
    __targetProperties = new WeakMap();
    /**
     * Creates a binding object for specified `node` and `property`.
     * @param {IoNode} node - Property owner node.
     * @param {string} property - Name of the property.
     */
    constructor(node, property) {
        this.__node = node;
        this.__property = property;
        this._onTargetChanged = this._onTargetChanged.bind(this);
        this._onSourceChanged = this._onSourceChanged.bind(this);
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__property', { enumerable: false, writable: false });
        Object.defineProperty(this, '__targets', { enumerable: false, writable: false });
        Object.defineProperty(this, '__targetProperties', { enumerable: false, writable: false });
        Object.defineProperty(this, '_onTargetChanged', { enumerable: false, writable: false });
        Object.defineProperty(this, '_onSourceChanged', { enumerable: false, writable: false });
        this.__node.addEventListener(`${this.__property}-changed`, this._onSourceChanged);
    }
    set value(value) {
        this.__node[this.__property] = value;
    }
    get value() {
        return this.__node[this.__property];
    }
    /**
     * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
     * @param {IoNode} node - Target node.
     * @param {string} property - Target property.
     * @param {Array.<string>} __nodeProperties - List of target property names.
     */
    addTarget(node, property, __nodeProperties) {
        // TODO: unhack passing __properties from constructor;
        const nodeProperties = node.__properties || __nodeProperties;
        nodeProperties[property].binding = this;
        nodeProperties.set(property, this.__node[this.__property]);
        const targetIoNode = node;
        if (this.__targets.indexOf(targetIoNode) === -1)
            this.__targets.push(targetIoNode);
        const targetProperties = this._getTargetProperties(targetIoNode);
        if (targetProperties.indexOf(property) === -1) {
            targetProperties.push(property);
            targetIoNode.addEventListener(`${property}-changed`, this._onTargetChanged);
        }
    }
    /**
     * Removes target `node` and `property` and corresponding `[property]-changed` listener.
     * If `property` is not specified, it removes all target properties.
     * @param {IoNode} node - Target node.
     * @param {string} property - Target property.
     */
    removeTarget(node, property) {
        const targetIoNode = node;
        const targetProperties = this._getTargetProperties(targetIoNode);
        if (property) {
            const i = targetProperties.indexOf(property);
            if (i !== -1)
                targetProperties.splice(i, 1);
            targetIoNode.removeEventListener(`${property}-changed`, this._onTargetChanged);
        }
        else {
            for (let i = targetProperties.length; i--;) {
                targetIoNode.removeEventListener(`${targetProperties[i]}-changed`, this._onTargetChanged);
            }
            targetProperties.length = 0;
        }
        if (targetProperties.length === 0)
            this.__targets.splice(this.__targets.indexOf(targetIoNode), 1);
    }
    /**
     * Retrieves a list of target properties for specified target node.
     * @param {IoNode} node - Target node.
     * @return {Array.<string>} list of target property names.
     */
    _getTargetProperties(node) {
        let targetProperties = this.__targetProperties.get(node);
        if (targetProperties) {
            return targetProperties;
        }
        else {
            targetProperties = [];
            this.__targetProperties.set(node, targetProperties);
            return targetProperties;
        }
    }
    /**
     * Event handler that updates source property when one of the targets emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    _onTargetChanged(event) {
        const oldValue = this.__node[this.__property];
        const value = event.detail.value;
        if (oldValue !== value) {
            // JavaScript is weird NaN != NaN
            if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue)))
                return;
            this.__node[this.__property] = value;
        }
    }
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    _onSourceChanged(event) {
        const value = event.detail.value;
        for (let i = this.__targets.length; i--;) {
            const target = this.__targets[i];
            const targetProperties = this._getTargetProperties(target);
            for (let j = targetProperties.length; j--;) {
                const propName = targetProperties[j];
                const oldValue = target[propName];
                if (oldValue !== value) {
                    // JavaScript is weird NaN != NaN
                    if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue)))
                        continue;
                    target[propName] = value;
                }
            }
        }
    }
    /**
     * Dispose of the binding by removing all targets and listeners.
     * Use this when node is no longer needed.
     */
    dispose() {
        this.__node.removeEventListener(`${this.__property}-changed`, this._onSourceChanged);
        for (let i = this.__targets.length; i--;) {
            this.removeTarget(this.__targets[i]);
        }
        this.__targets.length = 0;
        delete this.__node;
        delete this.__property;
        delete this.__targets;
        delete this.__targetProperties;
        delete this._onTargetChanged;
        delete this._onSourceChanged;
    }
}
/**
 * Manager for property bindings. It holds all bindings for a particular IoNode.
 */
class PropertyBinder$1 {
    __node;
    __bindings = {};
    /**
     * Creates binding manager for the specified node.
     * @param {IoNode} node - Owner node.
     */
    constructor(node) {
        this.__node = node;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__bindings', { enumerable: false, writable: false });
    }
    /**
     * Returns a binding to the specified property name or creates one if it does not exist.
     * @param {string} property - Property to bind.
     * @return {Binding} Property binding object.
     */
    bind(property) {
        this.__bindings[property] = this.__bindings[property] || new Binding(this.__node, property);
        return this.__bindings[property];
    }
    /**
     * Removes a binding for the specified property name.
     * @param {string} property - Property to unbind.
     */
    unbind(property) {
        if (this.__bindings[property])
            this.__bindings[property].dispose();
        delete this.__bindings[property];
    }
    /**
     * Disposes all bindings. Use this when node is no longer needed.
     */
    dispose() {
        for (const property in this.__bindings) {
            this.__bindings[property].dispose();
            delete this.__bindings[property];
        }
        delete this.__node;
        delete this.__bindings;
    }
}

class ProtoProperty {
    value = undefined;
    type = undefined;
    reflect = 0;
    notify = true;
    observe = false;
    readonly = false;
    strict = false;
    enumerable = true;
    binding = undefined;
    constructor(prop) {
        return this.assign(prop);
    }
    assign(prop) {
        if (prop === undefined || prop === null) {
            this.value = prop;
        }
        else if (typeof prop === 'function') {
            this.type = prop;
        }
        else if (prop instanceof Binding) {
            this.binding = prop;
        }
        else if (prop && prop.constructor === Object) {
            prop = prop;
            if (prop.value !== undefined)
                this.value = prop.value;
            if (prop.type !== undefined)
                this.type = prop.type;
            if (this.type === undefined && this.value !== undefined && this.value !== null) {
                this.type = this.value.constructor;
            }
            if (prop.reflect !== undefined)
                this.reflect = prop.reflect;
            if (prop.notify !== undefined)
                this.notify = prop.notify;
            if (prop.observe !== undefined)
                this.observe = prop.observe;
            if (prop.readonly !== undefined)
                this.readonly = prop.readonly;
            if (prop.strict !== undefined)
                this.strict = prop.strict;
            if (prop.enumerable !== undefined)
                this.enumerable = prop.enumerable;
            if (prop.binding instanceof Binding)
                this.binding = prop.binding;
        }
        else if (!(prop && prop.constructor === Object)) {
            this.value = prop;
            this.type = prop.constructor;
        }
        return this;
    }
}
/**
 * Array of all properties defined as `static get Properties()` return objects in prototype chain.
 */
class ProtoProperties {
    constructor(protochain) {
        for (let i = protochain.constructors.length; i--;) {
            const props = protochain.constructors[i].Properties;
            for (const p in props) {
                if (!this[p])
                    this[p] = new ProtoProperty(props[p]);
                else
                    this[p].assign(props[p]);
                // TODO: Document or reconsider.
                if (p.charAt(0) === '_') {
                    this[p].notify = false;
                    this[p].enumerable = false;
                }
            }
        }
    }
}
/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `ProtoProperty`.
 */
class Property {
    //Property value.
    value;
    //Constructor of the property value.
    type;
    //Reflects to HTML attribute [-1, 0, 1 or 2]
    reflect;
    //Enables change handlers and events.
    notify;
    //Observe object mutations for this property.
    observe;
    //Makes the property readonly. // TODO: document and test
    readonly;
    //Enforce stric typing. // TODO?: document and test
    strict;
    //Makes property enumerable.
    enumerable;
    //Binding object.
    binding;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param {ProtoProperty} protoProp ProtoProperty object
     */
    constructor(protoProp) {
        this.value = protoProp.value;
        this.type = protoProp.type;
        this.reflect = protoProp.reflect;
        this.notify = protoProp.notify;
        this.observe = protoProp.observe;
        this.readonly = protoProp.readonly;
        this.strict = protoProp.strict;
        this.enumerable = protoProp.enumerable;
        this.binding = protoProp.binding;
        if (this.binding instanceof Binding)
            this.value = this.binding.value;
        else if (this.value === undefined) {
            if (typeof this.type === 'function') {
                if (this.type === Boolean)
                    this.value = false;
                else if (this.type === String)
                    this.value = '';
                else if (this.type === Number)
                    this.value = 0;
                else if (this.type === Array)
                    this.value = [];
                else if (this.type === Object)
                    this.value = {};
                else
                    this.value = new this.type();
            }
        }
        else {
            if (this.type === Array && this.value instanceof Array) {
                this.value = [...this.value];
            }
            else if (this.type === Object && this.value instanceof Object) {
                this.value = Object.assign({}, this.value);
            }
        }
    }
}
/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
class Properties$1 {
    __node;
    __keys = [];
    __connected = false;
    /**
     * Creates the properties for specified `IoNode`.
     * @param {any} node Owner IoNode instance.
     * @param {ProtoProperties} protoProps ProtoProperties object.
     */
    constructor(node, protoProps) {
        Object.defineProperty(this, '__node', { enumerable: false, configurable: true, value: node });
        Object.defineProperty(this, '__connected', { enumerable: false });
        for (const prop in protoProps) {
            const protoProp = protoProps;
            Object.defineProperty(this, prop, {
                value: new Property(protoProp[prop]),
                enumerable: protoProp[prop].enumerable,
                configurable: true
            });
            const property = this[prop];
            const value = property.value;
            if (value !== undefined && value !== null) {
                // TODO: document special handling of object and node values
                if (typeof value === 'object') {
                    node.queue(prop, value, undefined);
                    if (value.__isIoNode && node.__connected)
                        value.connect(node);
                }
                else if (property.reflect !== undefined && property.reflect >= 1 && node.__isIoElement) {
                    // TODO: figure out how to resolve bi-directionsl reflection when attributes are set in html (role, etc...)
                    node.setAttribute(prop, value);
                }
            }
            const binding = property.binding;
            // TODO: unhack passing __properties from constructor;
            if (binding)
                binding.addTarget(node, prop, this);
        }
        Object.defineProperty(this, '__keys', { enumerable: false, configurable: true, value: Object.keys(this) });
    }
    /**
     * Returns the property value.
     * @param {string} key property name to get value of.
     * @return {any} Peroperty value.
     */
    get(key) {
        return this[key].value;
    }
    /**
     * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
     * @param {string} key Property name to set value of.
     * @param {any} value Peroperty value.
     * @param {boolean} [skipDispatch] flag to skip event dispatch.
     */
    set(key, value, skipDispatch) {
        const prop = this[key];
        const oldValue = prop.value;
        if (value !== oldValue) {
            const node = this.__node;
            const binding = (value instanceof Binding) ? value : undefined;
            if (binding) {
                const oldBinding = prop.binding;
                if (oldBinding && binding !== oldBinding) {
                    oldBinding.removeTarget(node, key);
                }
                binding.addTarget(node, key);
                value = binding.value;
            }
            else {
                if (prop.strict && prop.type && !(value instanceof prop.type)) {
                    value = new prop.type(value);
                }
            }
            prop.value = value;
            if (value && value.__isIoNode && !value.__isIoElement)
                value.connect(node);
            if (oldValue && oldValue.__isIoNode && oldValue.__connected && !oldValue.__isIoElement)
                oldValue.disconnect(node);
            if (prop.notify && oldValue !== value) {
                node.queue(key, value, oldValue);
                if (node.__connected && !skipDispatch) {
                    node.queueDispatch();
                }
            }
            if (prop.reflect !== undefined && prop.reflect >= 1 && node.__isIoElement)
                node.setAttribute(key, value);
        }
    }
    /**
     * Connects all property bindings and `IoNode` properties.
     */
    connect() {
        for (let i = this.__keys.length; i--;) {
            const p = this.__keys[i];
            const property = this[p];
            if (property.binding) {
                property.binding.addTarget(this.__node, p);
            }
            // TODO: investigate and test element property connections - possible clash with element's native `disconenctedCallback()`
            if (property.value && property.value.__isIoNode && !property.value.__connected && !property.value.__isIoElement) {
                property.value.connect(this.__node);
            }
        }
        this.__connected = true;
    }
    /**
     * Disconnects all property bindings and `IoNode` properties.
     */
    disconnect() {
        for (let i = this.__keys.length; i--;) {
            const p = this.__keys[i];
            const property = this[p];
            if (property.binding) {
                property.binding.removeTarget(this.__node, p);
            }
            // TODO: investigate and test element property connections
            // possible clash with element's native `disconenctedCallback()`
            // TODO: fix BUG - diconnecting already disconencted.
            if (property.value && property.value.__isIoNode && !property.value.__isIoElement) {
                // TODO: remove this workaround once the bug is fixed properly.
                if (property.value.__connections.indexOf(this.__node) !== -1) {
                    property.value.disconnect(this.__node);
                }
            }
        }
        this.__connected = false;
    }
    /**
     * Disconnects all property bindings and `IoNode` properties.
     * Use this when properties are no loner needed.
     */
    dispose() {
        this.disconnect();
        delete this.__node;
        delete this.__keys;
    }
}

/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
function IoNodeMixin(superclass) {
    const classConstructor = class extends superclass {
        static get Properties() {
            return {
                lazy: Boolean,
                // TODO: implement import as property.
                // import: {
                //   type: String,
                //   reflect: -1,
                // },
            };
        }
        /**
         * `compose` object lets you reactively assign property values to other object's properties.
         * For example, you can assign `this.value` property to the `this.objectProp.result` property.
         *
         * ```
         * get compose () {
         *   return {
         *     objectProp: {result: this.value}
         *   };
         *  }
         * ```
         *
         * Node class does not use `compose` by itself but this feature is available to its sublasses.
         */
        get compose() {
            return null;
        }
        /**
        * Creates a class instance and initializes the internals.
        * @param {Object} properties - Initial property values.
        */
        constructor(properties = {}, ...args) {
            super(...args);
            this.__protochain.bindFunctions(this);
            Object.defineProperty(this, '__propertyBinder', { enumerable: false, value: new PropertyBinder$1(this) });
            Object.defineProperty(this, '__changeQueue', { enumerable: false, value: new ChangeQueue$1(this) });
            Object.defineProperty(this, '__eventDispatcher', { enumerable: false, value: new EventDispatcher$1(this, this.__protoListeners) });
            Object.defineProperty(this, '__properties', { enumerable: false, value: new Properties$1(this, this.__protoProperties) });
            Object.defineProperty(this, 'objectMutated', { enumerable: false, value: this.objectMutated.bind(this) });
            Object.defineProperty(this, 'objectMutatedThrottled', { enumerable: false, value: this.objectMutatedThrottled.bind(this) });
            Object.defineProperty(this, 'queueDispatch', { enumerable: false, value: this.queueDispatch.bind(this) });
            Object.defineProperty(this, 'queueDispatchLazy', { enumerable: false, value: this.queueDispatchLazy.bind(this) });
            Object.defineProperty(this, '__connected', { enumerable: false, writable: true, value: false });
            if (!this.__proto__.__isIoElement) {
                Object.defineProperty(this, '__connections', { enumerable: false, value: [] });
            }
            this.setProperties(properties);
        }
        /**
         * Connects the instance to another node or element.
         * @param {IoNode} node - Node to connect to.
         * @return {this} this
         */
        connect(node = window) {
            this.__connections.push(node);
            if (!this.__connected)
                this.connectedCallback();
            return this;
        }
        /**
         * Disconnects the instance from an another node or element.
         * @param {IoNode} node - Node to disconnect from.
         * @return {this} this
         * */
        disconnect(node = window) {
            this.__connections.splice(this.__connections.indexOf(node), 1);
            if (this.__connections.length === 0 && this.__connected) {
                this.disconnectedCallback();
            }
            return this;
        }
        /**
         * Connected callback.
         */
        connectedCallback() {
            this.__connected = true;
            this.__eventDispatcher.connect();
            this.__properties.connect();
            if (this.__observedObjects.length) {
                window.addEventListener('object-mutated', this.objectMutated);
            }
            this.queueDispatch();
        }
        /**
         * Disconnected callback.
         */
        disconnectedCallback() {
            this.__connected = false;
            this.__eventDispatcher.disconnect();
            this.__properties.disconnect();
            if (this.__observedObjects.length) {
                window.removeEventListener('object-mutated', this.objectMutated);
            }
        }
        /**
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose() {
            this.__connected = false;
            this.__connections.length = 0;
            this.__changeQueue.dispose();
            this.__propertyBinder.dispose();
            this.__properties.dispose();
            this.__eventDispatcher.dispose();
            if (this.__observedObjects.length) {
                window.removeEventListener('object-mutated', this.objectMutated);
            }
        }
        /**
         * default change handler.
         * Invoked when one of the properties change.
         */
        changed() { }
        /**
         * sets composed properties and invokes `changed()` function on change.
         */
        applyCompose() {
            // TODO: test compose
            const compose = this.compose;
            if (this.compose) {
                for (const prop in compose) {
                    const object = this.__properties[prop].value;
                    if (object.__isIoNode) {
                        // TODO: make sure composed and declarative listeners are working together
                        object.setProperties(compose[prop]);
                    }
                    else {
                        for (const p in compose[prop]) {
                            object[p] = compose[prop][p];
                        }
                    }
                }
            }
        }
        /**
         * Adds property change to the queue.
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {*} oldValue - Old property value.
         */
        queue(prop, value, oldValue) {
            this.__changeQueue.queue(prop, value, oldValue);
        }
        /**
         * Dispatches the queue.
         */
        queueDispatch() {
            if (this.lazy) {
                preThrottleQueue.push(this.queueDispatchLazy);
                this.throttle(this.queueDispatchLazy);
            }
            else {
                this.__changeQueue.dispatch();
            }
        }
        /**
         * Dispatches the queue in the next rAF cycle.
         */
        queueDispatchLazy() {
            this.__changeQueue.dispatch();
        }
        /**
         * Event handler for 'object-mutated' event emitted from the `window`.
         * Node should be listening for this event if it has an object property
         * with `observe: "sync" || "async"` configuration.
         * @param {Object} event - Event payload.
         * @param {Object} event.detail.object - Mutated object.
         */
        objectMutated(event) {
            for (let i = 0; i < this.__observedObjects.length; i++) {
                const prop = this.__observedObjects[i];
                const value = this.__properties[prop].value;
                if (value === event.detail.object) {
                    this.throttle(this.objectMutatedThrottled, prop, false);
                    return;
                }
                // else if (event.detail.objects && event.detail.objects.indexOf(value) !== -1) {
                //   this.throttle(this.objectMutatedThrottled, prop, false);
                //   return;
                // }
            }
        }
        /**
         * This function is called after `objectMutated()` determines that one of
         * the object properties has mutated.
         * @param {string} prop - Mutated object property name.
         */
        objectMutatedThrottled(prop) {
            if (this[prop + 'Mutated'])
                this[prop + 'Mutated']();
            this.applyCompose();
            this.changed();
        }
        /**
         * Returns a binding to a specified property`.
         * @param {string} prop - Property to bind to.
         * @return {Binding} Binding object.
         */
        bind(prop) {
            return this.__propertyBinder.bind(prop);
        }
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} prop - Property to unbind.
         */
        unbind(prop) {
            this.__propertyBinder.unbind(prop);
            const binding = this.__properties[prop].binding;
            if (binding)
                binding.removeTarget(this, prop);
        }
        /**
         * Sets a property and emits `[property]-set` event.
         * Use this when property is set by user action (e.g. mouse click).
         * @param {string} prop - Property name.
         * @param {*} value - Property value.
         * @param {boolean} force - Force value set.
         */
        set(prop, value, force) {
            if (this[prop] !== value || force) {
                const oldValue = this[prop];
                this[prop] = value;
                this.dispatchEvent('value-set', { property: prop, value: value, oldValue: oldValue }, false);
            }
        }
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        setProperties(props) {
            for (const p in props) {
                if (this.__properties[p] === undefined) {
                    continue;
                }
                this.__properties.set(p, props[p], true);
            }
            this.__eventDispatcher.setPropListeners(props, this);
            if (this.__connected)
                this.queueDispatch();
        }
        /**
         * Wrapper for addEventListener.
         * @param {string} type - listener name.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        addEventListener(type, listener, options) {
            this.__eventDispatcher.addEventListener(type, listener, options);
        }
        /**
         * Wrapper for removeEventListener.
         * @param {string} type - event name to listen to.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        removeEventListener(type, listener, options) {
            this.__eventDispatcher.removeEventListener(type, listener, options);
        }
        /**
         * Wrapper for dispatchEvent.
         * @param {string} type - event name to dispatch.
         * @param {Object} detail - event detail.
         * @param {boolean} bubbles - event bubbles.
         * @param {HTMLElement|Node} src source node/element to dispatch event from.
         */
        dispatchEvent(type, detail = {}, bubbles = false, src) {
            this.__eventDispatcher.dispatchEvent(type, detail, bubbles, src);
        }
        /**
         * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         * @param {boolean} asynchronous - execute with timeout.
         */
        throttle(func, arg, asynchronous) {
            // TODO: move to extenal throttle function, document and test.
            if (preThrottleQueue.indexOf(func) === -1) {
                preThrottleQueue.push(func);
                if (!asynchronous) {
                    func(arg);
                    return;
                }
            }
            if (throttleQueue.indexOf(func) === -1) {
                throttleQueue.push(func);
            }
            // TODO: improve argument handling. Consider edge-cases.
            if (argQueue.has(func) && typeof arg !== 'object') {
                const queue = argQueue.get(func);
                if (queue.indexOf(arg) === -1)
                    queue.push(arg);
            }
            else {
                argQueue.set(func, [arg]);
            }
        }
        // TODO: implement fAF debounce
        requestAnimationFrameOnce(func) {
            requestAnimationFrameOnce(func);
        }
        filterObject(object, predicate, _depth = 5, _chain = [], _i = 0) {
            if (_chain.indexOf(object) !== -1)
                return;
            _chain.push(object);
            if (_i > _depth)
                return;
            _i++;
            if (predicate(object))
                return object;
            for (const key in object) {
                const value = object[key] instanceof Binding ? object[key].value : object[key];
                if (predicate(value))
                    return value;
                if (typeof value === 'object') {
                    const subvalue = this.filterObject(value, predicate, _depth, _chain, _i);
                    if (subvalue)
                        return subvalue;
                }
            }
        }
        filterObjects(object, predicate, _depth = 5, _chain = [], _i = 0) {
            const result = [];
            if (_chain.indexOf(object) !== -1)
                return result;
            _chain.push(object);
            if (_i > _depth)
                return result;
            _i++;
            if (predicate(object) && result.indexOf(object) === -1)
                result.push(object);
            for (const key in object) {
                const value = object[key] instanceof Binding ? object[key].value : object[key];
                if (predicate(value) && result.indexOf(value) === -1)
                    result.push(value);
                if (typeof value === 'object') {
                    const results = this.filterObjects(value, predicate, _depth, _chain, _i);
                    for (let i = 0; i < results.length; i++) {
                        if (result.indexOf(results[i]) === -1)
                            result.push(results[i]);
                    }
                }
            }
            return result;
        }
        import(path) {
            const importPath = new URL(path, String(window.location)).href;
            return new Promise(resolve => {
                if (!path || IMPORTED_PATHS[importPath]) {
                    resolve(importPath);
                }
                else {
                    void import(importPath)
                        .then(() => {
                        IMPORTED_PATHS[importPath] = true;
                        resolve(importPath);
                    });
                }
            });
        }
        /**
         * Handler function with `event.preventDefault()`.
         * @param {Object} event - Event object.
         */
        preventDefault(event) {
            event.preventDefault();
        }
        /**
         * Handler function with `event.stopPropagation()`.
         * @param {Object} event - Event object.
         */
        stopPropagation(event) {
            event.stopPropagation();
        }
    };
    return classConstructor;
}
/**
 * Register function to be called once per class.
 * @param {IoNode} node - Node class to register.
 */
const RegisterIoNode = function (node) {
    const proto = node.prototype;
    Object.defineProperty(proto, '__isIoNode', { value: true });
    Object.defineProperty(proto.constructor, '__registeredAs', { value: proto.constructor.name });
    Object.defineProperty(proto, '__protochain', { value: new ProtoChain$1(node) });
    Object.defineProperty(proto, '__protoProperties', { value: new ProtoProperties(proto.__protochain) });
    Object.defineProperty(proto, '__protoListeners', { value: new ProtoListeners(proto.__protochain) });
    Object.defineProperty(proto, '__observedObjects', { value: [] });
    for (const p in proto.__protoProperties) {
        if (proto.__protoProperties[p].observe)
            proto.__observedObjects.push(p);
    }
    for (const p in proto.__protoProperties) {
        Object.defineProperty(proto, p, {
            get: function () {
                return this.__properties.get(p);
            },
            set: function (value) {
                this.__properties.set(p, value);
            },
            enumerable: !!proto.__protoProperties[p].enumerable,
            configurable: true,
        });
    }
};
/**
 * IoNodeMixin applied to `Object` class.
 */
class IoNode extends IoNodeMixin(Object) {
}
RegisterIoNode(IoNode);
const IMPORTED_PATHS = {};
// TODO: document and test
const preThrottleQueue = [];
const throttleQueue = [];
const argQueue = new WeakMap();
//
const funcQueue = [];
const animate = function () {
    requestAnimationFrame(animate);
    for (let i = preThrottleQueue.length; i--;) {
        preThrottleQueue.splice(preThrottleQueue.indexOf(preThrottleQueue[i]), 1);
    }
    for (let i = throttleQueue.length; i--;) {
        const queue = argQueue.get(throttleQueue[i]);
        for (let p = queue.length; p--;) {
            throttleQueue[i](queue[p]);
            queue.splice(queue.indexOf(p), 1);
        }
        throttleQueue.splice(throttleQueue.indexOf(throttleQueue[i]), 1);
    }
    //
    for (let i = funcQueue.length; i--;) {
        const func = funcQueue[i];
        funcQueue.splice(funcQueue.indexOf(func), 1);
        func();
    }
};
requestAnimationFrame(animate);
function requestAnimationFrameOnce(func) {
    if (funcQueue.indexOf(func) === -1)
        funcQueue.push(func);
}

/**
 * Core `IoElement` class.
 */
class IoElement extends IoNodeMixin(HTMLElement) {
    static get Style() {
        return /* css */ `
    :host[hidden] {
      display: none;
    }
    :host[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
    `;
    }
    static get Properties() {
        return {
            $: {
                type: Object,
                notify: false,
            },
            tabindex: {
                type: String,
                reflect: 1,
            },
            contenteditable: {
                type: Boolean,
                reflect: 1,
            },
            class: {
                type: String,
                reflect: 1,
            },
            role: {
                type: String,
                reflect: 1,
            },
            label: {
                type: String,
                reflect: 1,
            },
            name: {
                type: String,
                reflect: 1,
            },
            title: {
                type: String,
                reflect: 1,
            },
            id: {
                type: String,
                reflect: -1,
            },
            hidden: {
                type: Boolean,
                reflect: 1,
            },
            disabled: {
                type: Boolean,
                reflect: 1,
            },
        };
    }
    static get Listeners() {
        return {
            'focus-to': '_onFocusTo',
        };
    }
    static get observedAttributes() {
        const observed = [];
        for (const prop in this.prototype.__protoProperties) {
            const r = this.prototype.__protoProperties[prop].reflect;
            if (r === -1 || r === 2) {
                observed.push(prop);
            }
        }
        return observed;
    }
    attributeChangedCallback(prop, oldValue, newValue) {
        const type = this.__properties[prop].type;
        if (type === Boolean) {
            if (newValue === null)
                this[prop] = false;
            else if (newValue === '')
                this[prop] = true;
        }
        else if (type === Number || type === String) {
            this[prop] = type(newValue);
        }
        else if (type === Object || type === Array) {
            this[prop] = JSON.parse(newValue);
        }
        else if (typeof type === 'function') {
            this[prop] = new type(JSON.parse(newValue));
        }
        else {
            this[prop] = isNaN(Number(newValue)) ? newValue : Number(newValue);
        }
    }
    /**
     * Add resize listener if `onResized()` is defined in subclass.
     */
    connectedCallback() {
        super.connectedCallback();
        if (typeof this.onResized === 'function') {
            ro.observe(this);
        }
    }
    /**
     * Removes resize listener if `onResized()` is defined in subclass.
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (typeof this.onResized === 'function') {
            ro.unobserve(this);
        }
    }
    /**
      * Renders DOM from virtual DOM arrays.
      * @param {Array} vDOM - Array of vDOM children.
      * @param {HTMLElement} [host] - Optional template target.
      */
    template(vDOM, host) {
        const vChildren = buildTree()(['root', vDOM]).children;
        host = (host || this);
        if (host === this)
            this.__properties.$.value = {};
        this.traverse(vChildren, host);
    }
    /**
     * Recurively traverses vDOM.
     * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
     * @param {HTMLElement} [host] - Optional template target.
      */
    traverse(vChildren, host) {
        const children = host.children;
        // focusBacktrack = new WeakMap();
        // remove trailing elements
        while (children.length > vChildren.length) {
            const child = children[children.length - 1];
            host.removeChild(child);
            // TODO: enable and test!
            // const nodes = Array.from(child.querySelectorAll('*'));
            // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
            // if (child.dispose) child.dispose();
        }
        // create new elements after existing
        if (children.length < vChildren.length) {
            const frag = document.createDocumentFragment();
            for (let i = children.length; i < vChildren.length; i++) {
                const element = constructElement(vChildren[i]);
                frag.appendChild(element);
            }
            host.appendChild(frag);
        }
        // replace existing elements
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.localName !== vChildren[i].name) {
                const oldElement = child;
                const element = constructElement(vChildren[i]);
                host.insertBefore(element, oldElement);
                host.removeChild(oldElement);
                // TODO: enable and test!
                // const nodes = Array.from(oldElement.querySelectorAll('*'));
                // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
                // if (oldElement.dispose) oldElement.dispose();
                // update existing elements
            }
            else {
                child.removeAttribute('className');
                if (child.__isIoElement) {
                    // Set IoElement element properties
                    // TODO: Test property and listeners reset. Consider optimizing.
                    child.setProperties(vChildren[i].props);
                }
                else {
                    // Set native HTML element properties
                    setNativeElementProps(child, vChildren[i].props);
                }
            }
        }
        for (let i = 0; i < vChildren.length; i++) {
            // Update this.$ map of ids.
            const child = children[i];
            if (vChildren[i].props.id)
                this.$[vChildren[i].props.id] = child;
            if (vChildren[i].children !== undefined) {
                if (typeof vChildren[i].children === 'string') {
                    // Set textNode value.
                    this.flattenTextNode(child);
                    child.__textNode.nodeValue = String(vChildren[i].children);
                }
                else if (typeof vChildren[i].children === 'object') {
                    // Traverse deeper.
                    this.traverse(vChildren[i].children, child);
                }
            }
        }
    }
    /**
     * Helper function to flatten textContent into a single TextNode.
     * Update textContent via TextNode is better for layout performance.
     * @param {HTMLElement} element - Element to flatten.
     */
    flattenTextNode(element) {
        if (element.childNodes.length === 0) {
            element.appendChild(document.createTextNode(''));
        }
        if (element.childNodes[0].nodeName !== '#text') {
            element.innerHTML = '';
            element.appendChild(document.createTextNode(''));
        }
        element.__textNode = element.childNodes[0];
        if (element.childNodes.length > 1) {
            const textContent = element.textContent;
            for (let i = element.childNodes.length; i--;) {
                if (i !== 0)
                    element.removeChild(element.childNodes[i]);
            }
            element.__textNode.nodeValue = textContent;
        }
    }
    get textNode() {
        this.flattenTextNode(this);
        return this.__textNode.nodeValue;
    }
    set textNode(value) {
        this.flattenTextNode(this);
        this.__textNode.nodeValue = String(value);
    }
    setProperties(props) {
        super.setProperties(props);
        if (props['style']) {
            for (const s in props['style']) {
                this.style[s] = props['style'][s];
            }
        }
    }
    /**
     * Alias for HTMLElement setAttribute where falsey values remove the attribute.
     * @param {string} attr - Attribute name.
     * @param {*} value - Attribute value.
     */
    setAttribute(attr, value) {
        if (value === true) {
            HTMLElement.prototype.setAttribute.call(this, attr, '');
        }
        else if (value === false || value === '') {
            this.removeAttribute(attr);
        }
        else if (typeof value === 'string' || typeof value === 'number') {
            if (this.getAttribute(attr) !== String(value))
                HTMLElement.prototype.setAttribute.call(this, attr, String(value));
        }
    }
    applyCompose() {
        super.applyCompose();
        this.applyAria();
    }
    /**
     * Sets aria attributes.
     */
    applyAria() {
        if (this.label) {
            this.setAttribute('aria-label', this.label);
        }
        else {
            this.removeAttribute('aria-label');
        }
        if (this.disabled) {
            this.setAttribute('aria-disabled', true);
        }
        else {
            this.removeAttribute('aria-disabled');
        }
    }
    _onFocusTo(event) {
        const src = event.composedPath()[0];
        const dir = event.detail.dir;
        const rect = event.detail.rect;
        rect.center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        if (src !== this) {
            let closest = src;
            let closestX = Infinity;
            let closestY = Infinity;
            // TODO: improve backtracking
            // const backtrack = focusBacktrack.get(src);
            // if (backtrack && backtrack[dir]) {
            //   backtrack[dir].focus();
            //   setBacktrack(backtrack[dir], dir, src);
            //   return;
            // }
            const siblings = this.querySelectorAll('[tabindex="0"]:not([disabled])');
            for (let i = siblings.length; i--;) {
                if (!siblings[i].offsetParent) {
                    continue;
                }
                // TODO: unhack
                const sStyle = window.getComputedStyle(siblings[i]);
                if (sStyle.visibility !== 'visible') {
                    continue;
                }
                const sRect = siblings[i].getBoundingClientRect();
                sRect.center = { x: sRect.x + sRect.width / 2, y: sRect.y + sRect.height / 2 };
                // TODO: improve automatic direction routing.
                switch (dir) {
                    case 'right': {
                        if (sRect.left >= (rect.right - 1)) {
                            const distX = Math.abs(sRect.left - rect.right);
                            const distY = Math.abs(sRect.center.y - rect.center.y);
                            if (distX < closestX || distY < closestY / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distX === closestX && distY < closestY) {
                                closest = siblings[i];
                                closestY = distY;
                            }
                        }
                        break;
                    }
                    case 'left': {
                        if (sRect.right <= (rect.left + 1)) {
                            const distX = Math.abs(sRect.right - rect.left);
                            const distY = Math.abs(sRect.center.y - rect.center.y);
                            if (distX < closestX || distY < closestY / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distX === closestX && distY < closestY) {
                                closest = siblings[i];
                                closestY = distY;
                            }
                        }
                        break;
                    }
                    case 'down': {
                        if (sRect.top >= (rect.bottom - 1)) {
                            const distX = Math.abs(sRect.center.x - rect.center.x);
                            const distY = Math.abs(sRect.top - rect.bottom);
                            if (distY < closestY || distX < closestX / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distY === closestY && distX < closestX) {
                                closest = siblings[i];
                                closestX = distX;
                            }
                        }
                        break;
                    }
                    case 'up': {
                        if (sRect.bottom <= (rect.top + 1)) {
                            const distX = Math.abs(sRect.center.x - rect.center.x);
                            const distY = Math.abs(sRect.bottom - rect.top);
                            if (distY < closestY || distX < closestX / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distY === closestY && distX < closestX) {
                                closest = siblings[i];
                                closestX = distX;
                            }
                        }
                        break;
                    }
                }
            }
            if (closest !== src) {
                closest.focus();
                // setBacktrack(closest, dir, src);
                event.stopPropagation();
            }
        }
    }
    focusTo(dir) {
        const rect = this.getBoundingClientRect();
        this.dispatchEvent('focus-to', { dir: dir, rect: rect }, true);
    }
}
// let focusBacktrack = new WeakMap();
// const backtrackDir = {'left': 'right', 'right': 'left', 'down': 'up', 'up': 'down'};
// function setBacktrack(element, dir, target) {
//   const backtrack = focusBacktrack.get(element) || {};
//   backtrack[backtrackDir[dir]] = target;
//   focusBacktrack.set(element, backtrack);
// }
const warning = document.createElement('div');
warning.innerHTML = `
No support for custom elements detected! <br />
Sorry, modern browser is required to view this page.<br />
Please try <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>,
<a href="https://www.google.com/chrome/">Chrome</a> or
<a href="https://www.apple.com/lae/safari/">Safari</a>`;
/**
 * Register function for `IoElement`. Registers custom element.
 * @param {IoElement} element - Element class to register.
 */
const RegisterIoElement = function (element) {
    RegisterIoNode(element);
    const localName = element.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    Object.defineProperty(element, 'localName', { value: localName });
    Object.defineProperty(element.prototype, 'localName', { value: localName });
    Object.defineProperty(element, '__isIoElement', { enumerable: false, value: true });
    Object.defineProperty(element.prototype, '__isIoElement', { enumerable: false, value: true });
    if (window.customElements !== undefined) {
        window.customElements.define(localName, element);
    }
    else {
        document.body.insertBefore(warning, document.body.children[0]);
        return;
    }
    _initProtoStyle(element.prototype.__protochain);
};
const ro = new ResizeObserver((entries) => {
    for (const entry of entries)
        entry.target.onResized();
});
/**
 * Creates an element from a virtual dom object.
 * @param {Object} vDOMNode - Virtual dom object.
 * @param {string} vDOMNode.name - Element tag.
 * @param {Object} vDOMNode.props - Element properties.
 * @return {HTMLElement} - Created element.
 */
// TODO: vDOMNode type
const constructElement = function (vDOMNode) {
    // IoElement classes constructed with constructor.
    const ConstructorClass = window.customElements ? window.customElements.get(vDOMNode.name) : null;
    if (ConstructorClass && ConstructorClass.__isIoElement)
        return new ConstructorClass(vDOMNode.props);
    // Other element classes constructed with document.createElement.
    const element = document.createElement(vDOMNode.name);
    setNativeElementProps(element, vDOMNode.props);
    return element;
};
const superCreateElement = document.createElement;
// TODO: args type
document.createElement = function (...args) {
    const tag = args[0];
    if (tag.startsWith('io-')) {
        const constructor = customElements.get(tag);
        if (constructor) {
            return new constructor();
        }
        else {
            return superCreateElement.apply(this, args);
        }
    }
    else {
        return superCreateElement.apply(this, args);
    }
};
/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
const setNativeElementProps = function (element, props) {
    for (const p in props) {
        const prop = props[p];
        if (p.startsWith('@')) {
            element.setAttribute(p.substr(1), prop);
        }
        else if (p === 'style')
            for (const s in prop)
                element.style.setProperty(s, prop[s]);
        else if (p === 'class')
            element['className'] = prop;
        else if (p !== 'id')
            element[p] = prop;
        if (p === 'name')
            element.setAttribute('name', prop); // TODO: Reconsider
    }
    if (!element.__eventDispatcher) {
        // TODO: test
        Object.defineProperty(element, '__eventDispatcher', { value: new EventDispatcher$1(element, {}) });
        // TODO: disconnect on disposal?
        element.__eventDispatcher.connect();
    }
    element.__eventDispatcher.setPropListeners(props, element);
};
const mixinDB = {};
const commentsRegex = new RegExp('(\\/\\*[\\s\\S]*?\\*\\/)', 'gi');
const keyframeRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mediaQueryRegex = new RegExp('((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mixinRegex = new RegExp('((--[\\s\\S]*?): {([\\s\\S]*?)})', 'gi');
const applyRegex = new RegExp('(@apply\\s.*?;)', 'gi');
const cssRegex = new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi');
// Creates a `<style>` element for all `static get Style()` return strings.
function _initProtoStyle(prototypes) {
    const localName = prototypes.constructors[0].name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const styleID = 'io-style-' + localName.replace('io-', '');
    let finalStyleString = '';
    // Convert mixins to classes
    const styleString = prototypes.constructors[0].Style;
    if (styleString) {
        const mixins = styleString.match(mixinRegex);
        if (mixins) {
            for (let i = 0; i < mixins.length; i++) {
                const m = mixins[i].split(': {');
                const name = m[0];
                const value = m[1].replace(/}/g, '').trim().replace(/^ +/gm, '');
                mixinDB[name] = value;
                finalStyleString += mixins[i].replace('--', '.').replace(': {', ' {');
            }
        }
        for (let i = prototypes.constructors.length; i--;) {
            let styleString = prototypes.constructors[i].Style;
            if (styleString) {
                // Remove mixins
                styleString = styleString.replace(mixinRegex, '');
                // Apply mixins
                const apply = styleString.match(applyRegex);
                if (apply) {
                    for (let i = 0; i < apply.length; i++) {
                        const name = apply[i].split('@apply ')[1].replace(';', '');
                        if (mixinDB[name]) {
                            styleString = styleString.replace(apply[i], mixinDB[name]);
                        }
                    }
                }
                // Check selector validity (:host prefix)
                {
                    let styleStringStripped = styleString;
                    // Remove comments
                    styleStringStripped = styleStringStripped.replace(commentsRegex, '');
                    // Remove keyframes
                    styleStringStripped = styleStringStripped.replace(keyframeRegex, '');
                    // Remove media queries
                    styleStringStripped = styleStringStripped.replace(mediaQueryRegex, '');
                    const match = styleStringStripped.match(cssRegex);
                    if (match) {
                        match.map((selector) => {
                            selector = selector.trim();
                            if (!selector.startsWith(':host')) ;
                        });
                    }
                }
                // Replace `:host` with element tag.
                finalStyleString += styleString.replace(new RegExp(':host', 'g'), localName);
            }
        }
    }
    if (finalStyleString) {
        const element = document.createElement('style');
        element.innerHTML = finalStyleString;
        element.setAttribute('id', styleID);
        document.head.appendChild(element);
    }
}
RegisterIoElement(IoElement);
/** @license
 * MIT License
 *
 * Copyright (c) 2019 Luke Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const isString = (x) => typeof x === 'string';
const isArray = Array.isArray;
const isObject = (x) => typeof x === 'object' && !isArray(x);
const clense = (a, b) => !b ? a : isString(b[0]) ? [...a, b] : [...a, ...b];
const buildTree = () => (node) => !!node && isObject(node[1]) ? {
    ['name']: node[0],
    ['props']: node[1],
    ['children']: isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2]
} : buildTree()([node[0], {}, node[1]]);

const string = (object) => {
    return JSON.stringify(object);
};
class Object1$1 {
    prop = true;
}
class TestIoNode$1 extends IoNode {
    static get Properties() {
        return {
            label: ''
        };
    }
}
RegisterIoNode(TestIoNode$1);
class Properties {
    run() {
        describe('Properties', () => {
            describe('Property', () => {
                it('Should initialize properly', () => {
                    let protoProp, prop;
                    protoProp = new ProtoProperty();
                    prop = new Property(protoProp);
                    chai.expect(JSON.stringify(protoProp)).to.be.equal(JSON.stringify(prop)).to.be.equal('{"reflect":0,"notify":true,"observe":false,"readonly":false,"strict":false,"enumerable":true}');
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(undefined);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(undefined);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with null argument
                    protoProp = new ProtoProperty(null);
                    prop = new Property(protoProp);
                    chai.expect(JSON.stringify(protoProp)).to.be.equal(JSON.stringify(prop)).to.be.equal('{"value":null,"reflect":0,"notify":true,"observe":false,"readonly":false,"strict":false,"enumerable":true}');
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(null);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(undefined);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an empty object argument
                    protoProp = new ProtoProperty({});
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(undefined);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(undefined);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Number argument
                    protoProp = new ProtoProperty(Number);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal(0);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Number);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with String argument
                    protoProp = new ProtoProperty(String);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal('');
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(String);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Boolean argument
                    protoProp = new ProtoProperty(Boolean);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal(false);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Boolean);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Object argument
                    protoProp = new ProtoProperty(Object);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal({});
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Array argument
                    protoProp = new ProtoProperty(Array);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal([]);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Array);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with custom Object1 argument
                    protoProp = new ProtoProperty(Object1$1);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal(new Object1$1());
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object1$1);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with number argument
                    protoProp = new ProtoProperty(1);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(1);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Number);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with string argument
                    protoProp = new ProtoProperty('test');
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal('test');
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(String);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with boolean argument
                    protoProp = new ProtoProperty(true);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(true);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Boolean);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with object value property
                    const object = { prop: true };
                    protoProp = new ProtoProperty({ value: object });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(object);
                    chai.expect(prop.value).to.be.deep.equal(object);
                    chai.expect(prop.value).not.to.be.equal(object);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with object value property
                    const array = [1, 2, 3];
                    protoProp = new ProtoProperty({ value: array });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(array);
                    chai.expect(prop.value).to.be.deep.equal(array);
                    chai.expect(prop.value).not.to.be.equal(array);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Array);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with custom object1 value property
                    const object1 = new Object1$1();
                    protoProp = new ProtoProperty({ value: object1 });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(object1);
                    chai.expect(prop.value).to.be.equal(object1);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object1$1);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with an object argument with custom Object1 type property
                    protoProp = new ProtoProperty({ type: Object1$1 });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.deep.equal(new Object1$1());
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Object1$1);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                });
                it('Should initialize binding properly', () => {
                    let protoProp, prop;
                    let binding = new Binding(new TestIoNode$1({ label: 'lorem' }), 'label');
                    protoProp = new ProtoProperty(binding);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
                    chai.expect(protoProp.value).to.be.equal(undefined);
                    chai.expect(prop.value).to.be.equal('lorem');
                    const node = new TestIoNode$1({ label: 'lorem' });
                    binding = new Binding(node, 'label');
                    protoProp = new ProtoProperty({ binding: binding, value: 'ipsum' });
                    prop = new Property(protoProp);
                    chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
                    chai.expect(protoProp.value).to.be.equal('ipsum');
                    chai.expect(prop.value).to.be.equal('lorem');
                });
            });
            describe('Properties', () => {
                it('Should correctly initialize properties from protochain', () => {
                    class Object1 extends IoNode {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 0
                                },
                                _prop: null
                            };
                        }
                    }
                    RegisterIoNode(Object1);
                    class Object2 extends Object1 {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 2,
                                    notify: false,
                                    observe: true,
                                    strict: false,
                                    enumerable: false,
                                },
                                _prop: {
                                    notify: true,
                                    enumerable: true,
                                },
                                prop3: ''
                            };
                        }
                    }
                    RegisterIoNode(Object2);
                    const node1 = new Object1();
                    const node2 = new Object2();
                    const protoProps1 = node1.__protoProperties;
                    const protoProps2 = node2.__protoProperties;
                    const props1 = node1.__properties;
                    const props2 = node2.__properties;
                    chai.expect(string(Object.keys(props1))).to.be.equal(string(['lazy', 'prop1']));
                    chai.expect(string(Object.keys(props2))).to.be.equal(string(['lazy', 'prop3']));
                    chai.expect(props1.__node).to.be.equal(node1);
                    chai.expect(props2.__node).to.be.equal(node2);
                    chai.expect(protoProps1.prop1.value).to.be.equal(0);
                    chai.expect(props1.prop1.value).to.be.equal(0);
                    chai.expect(props1.prop1.type).to.be.equal(Number);
                    chai.expect(props1.prop1.notify).to.be.equal(true);
                    chai.expect(props1.prop1.reflect).to.be.equal(0);
                    chai.expect(props1.prop1.observe).to.be.equal(false);
                    chai.expect(props1.prop1.strict).to.be.equal(false);
                    chai.expect(props1.prop1.enumerable).to.be.equal(true);
                    chai.expect(protoProps2.prop1.value).to.be.equal(2);
                    chai.expect(props2.prop1.value).to.be.equal(2);
                    chai.expect(props2.prop1.type).to.be.equal(Number);
                    chai.expect(props2.prop1.notify).to.be.equal(false);
                    chai.expect(props2.prop1.reflect).to.be.equal(0);
                    chai.expect(props2.prop1.observe).to.be.equal(true);
                    chai.expect(props2.prop1.strict).to.be.equal(false);
                    chai.expect(props2.prop1.enumerable).to.be.equal(false);
                    chai.expect(props1._prop.value).to.be.equal(null);
                    chai.expect(props1._prop.notify).to.be.equal(false);
                    chai.expect(props1._prop.enumerable).to.be.equal(false);
                    chai.expect(props2._prop.value).to.be.equal(null);
                    chai.expect(props2._prop.notify).to.be.equal(false);
                    chai.expect(props2._prop.enumerable).to.be.equal(false);
                });
                it('Should not override explicit property options with implicit', () => {
                    class Object1 {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 2,
                                    notify: false,
                                    reflect: 2,
                                    observe: true,
                                    strict: false,
                                    enumerable: false,
                                },
                            };
                        }
                    }
                    class Object2 extends Object1 {
                        static get Properties() {
                            return {
                                prop1: 'hello',
                            };
                        }
                    }
                    const protochain = new ProtoChain$1(Object2);
                    const props = new ProtoProperties(protochain);
                    chai.expect(props.prop1.type).to.be.equal(String);
                    chai.expect(props.prop1.notify).to.be.equal(false);
                    chai.expect(props.prop1.reflect).to.be.equal(2);
                    chai.expect(props.prop1.observe).to.be.equal(true);
                    chai.expect(props.prop1.enumerable).to.be.equal(false);
                });
                it('Should correctly initialize bound properties', () => {
                    const binding1 = new Binding(new TestIoNode$1({ label: 'binding1' }), 'label');
                    const binding2 = new Binding(new TestIoNode$1({ label: 'binding2' }), 'label');
                    const binding3 = new Binding(new TestIoNode$1({ label: 'binding3' }), 'label');
                    class Object1 extends IoNode {
                        static get Properties() {
                            return {
                                prop1: binding1,
                            };
                        }
                    }
                    RegisterIoNode(Object1);
                    class Object2 extends Object1 {
                        static get Properties() {
                            return {
                                prop1: {
                                    binding: binding2
                                },
                                _prop3: binding3
                            };
                        }
                    }
                    RegisterIoNode(Object2);
                    const node1 = new Object1();
                    const node2 = new Object2();
                    const props1 = node1.__properties;
                    const props2 = node2.__properties;
                    chai.expect(props1.prop1.binding).to.be.equal(binding1);
                    chai.expect(props2.prop1.binding).to.be.equal(binding2);
                    chai.expect(props2._prop3.binding).to.be.equal(binding3);
                    chai.expect(binding1.__targets[0]).to.be.equal(node1);
                    chai.expect(binding2.__targets[0]).to.be.equal(node2);
                    chai.expect(binding3.__targets[0]).to.be.equal(node2);
                    chai.expect(props1.prop1.value).to.be.equal('binding1');
                    chai.expect(props2.prop1.value).to.be.equal('binding2');
                    chai.expect(props2._prop3.value).to.be.equal('binding3');
                });
                it('Should correctly get/set properties', () => {
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                prop1: {
                                    value: 1
                                },
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const node = new TestIoNode();
                    const properties = node.__properties;
                    chai.expect(properties.get('prop1')).to.be.equal(1);
                    chai.expect(node.prop1).to.be.equal(1);
                    properties.set('prop1', 0);
                    chai.expect(properties.get('prop1')).to.be.equal(0);
                    chai.expect(node.prop1).to.be.equal(0);
                });
                it('Should correctly get/set bound properties', () => {
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                label: '',
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const binding1 = new Binding(new TestIoNode({ label: 'binding1' }), 'label');
                    const binding2 = new Binding(new TestIoNode({ label: 'binding2' }), 'label');
                    class TestIoNode2 extends IoNode {
                        static get Properties() {
                            return {
                                prop1: binding1
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode2);
                    const node = new TestIoNode2().connect();
                    const properties = node.__properties;
                    chai.expect(properties.get('prop1')).to.be.equal('binding1');
                    chai.expect(node.prop1).to.be.equal('binding1');
                    chai.expect(properties.prop1.binding).to.be.equal(binding1);
                    chai.expect(binding1.__targets[0]).to.be.equal(node);
                    properties.set('prop1', binding2);
                    chai.expect(properties.get('prop1')).to.be.equal('binding2');
                    chai.expect(node.prop1).to.be.equal('binding2');
                    chai.expect(binding1.__targets[0]).to.be.equal(undefined);
                    chai.expect(binding2.__targets[0]).to.be.equal(node);
                });
                it('Should execute attribute reflection on IoElement', () => {
                    class TestElementReflection extends IoElement {
                        static get Properties() {
                            return {
                                label: {
                                    value: 'label1',
                                    reflect: 1
                                }
                            };
                        }
                    }
                    RegisterIoElement(TestElementReflection);
                    const element = new TestElementReflection();
                    chai.expect(element.getAttribute('label')).to.be.equal('label1');
                    element.label = 'label2';
                    chai.expect(element.getAttribute('label')).to.be.equal('label2');
                    element.__properties.set('label', 'label3');
                    chai.expect(element.getAttribute('label')).to.be.equal('label3');
                });
                it('Should dipatch queue on object value initialization and value set', () => {
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                prop: Object,
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const node = new TestIoNode();
                    node.addEventListener('prop-changed', ((event) => {
                        const value = event.detail.value;
                        const oldValue = event.detail.oldValue;
                        chai.expect(string(value)).to.be.equal(string({}));
                        chai.expect(oldValue).to.be.equal(undefined);
                    }));
                    node.connect();
                    node.removeEventListener('prop-changed');
                    node.addEventListener('prop-changed', ((event) => {
                        const value = event.detail.value;
                        const oldValue = event.detail.oldValue;
                        chai.expect(string(value)).to.be.equal(string({}));
                        chai.expect(string(oldValue)).to.be.equal(string({}));
                    }));
                    node.prop = {};
                    node.removeEventListener('prop-changed');
                    node.addEventListener('prop-changed', () => {
                        chai.expect('This should never happen!').to.be.equal(true);
                    });
                    node.__properties.set('prop', {}, true);
                    node.disconnect();
                    node.prop = {};
                    node.removeEventListener('prop-changed');
                    node.addEventListener('prop-changed', ((event) => {
                        const value = event.detail.value;
                        const oldValue = event.detail.oldValue;
                        chai.expect(string(value)).to.be.equal(string({}));
                        chai.expect(string(oldValue)).to.be.equal(string({}));
                    }));
                    node.connect();
                    node.prop = {};
                });
                it('Should connect/disconnect node value on initialization and value set', () => {
                    class TestIoNodeValue extends IoNode {
                        static get Properties() {
                            return {
                                prop: Object,
                                propChangeCounter: 0,
                            };
                        }
                        propChanged() {
                            this.propChangeCounter++;
                        }
                    }
                    RegisterIoNode(TestIoNodeValue);
                    class TestIoNode extends IoNode {
                        static get Properties() {
                            return {
                                prop: TestIoNodeValue
                            };
                        }
                    }
                    RegisterIoNode(TestIoNode);
                    const node = new TestIoNode();
                    const subIoNode1 = node.prop;
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(0);
                    node.connect();
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(1);
                    subIoNode1.prop = {};
                    subIoNode1.prop = {};
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(3);
                    node.disconnect();
                    subIoNode1.prop = {};
                    subIoNode1.prop = {};
                    subIoNode1.prop = {};
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(3);
                    node.connect();
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(4);
                    node.prop = new TestIoNodeValue();
                    const subIoNode2 = node.prop;
                    subIoNode1.prop = {};
                    chai.expect(subIoNode1.propChangeCounter).to.be.equal(4);
                    chai.expect(subIoNode2.propChangeCounter).to.be.equal(1);
                });
            });
        });
    }
}

class TestIoNode extends IoNode {
    static get Properties() {
        return {
            prop1: 0,
            prop2: 0,
        };
    }
}
RegisterIoNode(TestIoNode);
class PropertyBinder {
    run() {
        describe('PropertyBinder', () => {
            it('Should initialize with correct default values', () => {
                const node = new TestIoNode();
                const binding = new Binding(node, 'prop1');
                chai.expect(binding.__node).to.be.equal(node);
                chai.expect(binding.__property).to.be.equal('prop1');
                chai.expect(binding.__targets instanceof Array).to.be.equal(true);
                chai.expect(binding.__targets.length).to.be.equal(0);
                chai.expect(binding.__targetProperties instanceof WeakMap).to.be.equal(true);
                const propertyBinder = new PropertyBinder$1(node);
                chai.expect(propertyBinder.__node).to.be.equal(node);
                chai.expect(JSON.stringify(propertyBinder.__bindings)).to.be.equal('{}');
            });
            it('Should get and set property value on source node with `value` getter/setter', () => {
                const node = new TestIoNode();
                const binding = new Binding(node, 'prop1');
                node.prop1 = 1;
                chai.expect(binding.value).to.be.equal(1);
                node.prop1 = 2;
                chai.expect(binding.value).to.be.equal(2);
                binding.value = 3;
                chai.expect(node.prop1).to.be.equal(3);
                const propertyBinder = new PropertyBinder$1(node);
                const binding2 = propertyBinder.bind('prop1');
                node.prop1 = 1;
                chai.expect(binding2.value).to.be.equal(1);
                node.prop1 = 2;
                chai.expect(binding2.value).to.be.equal(2);
                binding2.value = 3;
                chai.expect(node.prop1).to.be.equal(3);
            });
            it('Should add/remove target nodes and properties with `.addTarget()` and `removeTarget()`', () => {
                const srcIoNode = new TestIoNode().connect();
                const binding0 = new Binding(srcIoNode, 'prop1');
                const binding1 = new Binding(srcIoNode, 'prop2');
                const dstIoNode0 = new TestIoNode().connect();
                const dstIoNode1 = new TestIoNode().connect();
                binding0.addTarget(dstIoNode0, 'prop1');
                binding1.addTarget(dstIoNode0, 'prop2');
                binding1.addTarget(dstIoNode1, 'prop1');
                binding1.addTarget(dstIoNode1, 'prop2');
                chai.expect(binding0.__targets[0]).to.be.equal(dstIoNode0);
                chai.expect(binding0.__targets[1]).to.be.equal(undefined);
                chai.expect(binding1.__targets[0]).to.be.equal(dstIoNode0);
                chai.expect(binding1.__targets[1]).to.be.equal(dstIoNode1);
                chai.expect(binding1.__targets[2]).to.be.equal(undefined);
                const binding0target0Props = binding0._getTargetProperties(dstIoNode0);
                const binding0target1Props = binding0._getTargetProperties(dstIoNode1);
                chai.expect(binding0target0Props[0]).to.be.equal('prop1');
                chai.expect(binding0target0Props.length).to.be.equal(1);
                chai.expect(binding0target1Props.length).to.be.equal(0);
                const binding1target0Props = binding1._getTargetProperties(dstIoNode0);
                const binding1target1Props = binding1._getTargetProperties(dstIoNode1);
                chai.expect(binding1target0Props[0]).to.be.equal('prop2');
                chai.expect(binding1target0Props.length).to.be.equal(1);
                chai.expect(binding1target1Props[0]).to.be.equal('prop1');
                chai.expect(binding1target1Props[1]).to.be.equal('prop2');
                chai.expect(binding1target1Props.length).to.be.equal(2);
                binding1.removeTarget(dstIoNode1, 'prop1');
                chai.expect(binding1target1Props[0]).to.be.equal('prop2');
                chai.expect(binding1target1Props.length).to.be.equal(1);
                binding1.addTarget(dstIoNode1, 'prop1');
                binding1.removeTarget(dstIoNode1);
                chai.expect(binding1target1Props.length).to.be.equal(0);
            });
            it('Should dispose correctly', () => {
                const node = new TestIoNode().connect();
                const binding = new Binding(node, 'prop1');
                binding.dispose();
                chai.expect(binding.__node).to.be.equal(undefined);
                chai.expect(binding.__property).to.be.equal(undefined);
                chai.expect(binding.__targets).to.be.equal(undefined);
                chai.expect(binding.__targetProperties).to.be.equal(undefined);
                const propertyBinder = new PropertyBinder$1(node);
                const binding2 = propertyBinder.bind('prop1');
                propertyBinder.dispose();
                chai.expect(propertyBinder.__node).to.be.equal(undefined);
                chai.expect(propertyBinder.__bindings).to.be.equal(undefined);
                chai.expect(binding2.__node).to.be.equal(undefined);
                chai.expect(binding2.__property).to.be.equal(undefined);
                chai.expect(binding2.__targets).to.be.equal(undefined);
                chai.expect(binding2.__targetProperties).to.be.equal(undefined);
            });
        });
    }
}

class Array1 extends Array {
}
class Array2 extends Array1 {
}
class Array3 extends Array2 {
}
class Object1 {
}
class Object2 extends Object1 {
}
class Object3 extends Object2 {
}
class HTMLElement1 extends HTMLElement {
}
class HTMLElement2 extends HTMLElement1 {
}
class HTMLElement3 extends HTMLElement2 {
}
class IoNode1 extends IoNode {
}
class IoElement1 extends IoElement {
}
class IoNode2 extends IoNodeMixin(Object3) {
}
class FakeSuperIoNode {
    function1() { }
    onFunction1() { }
    _function1() { }
}
class FakeIoNode extends FakeSuperIoNode {
    function2() { }
    onFunction2() { }
    _function2() { }
}
class ProtoChain {
    run() {
        describe('ProtoChain', () => {
            it('Should include all inherited constructors', () => {
                let protochain = new ProtoChain$1(Array3);
                chai.expect(protochain.constructors[0]).to.be.equal(Array3);
                chai.expect(protochain.constructors[1]).to.be.equal(Array2);
                chai.expect(protochain.constructors[2]).to.be.equal(Array1);
                protochain = new ProtoChain$1(Object3);
                chai.expect(protochain.constructors[0]).to.be.equal(Object3);
                chai.expect(protochain.constructors[1]).to.be.equal(Object2);
                chai.expect(protochain.constructors[2]).to.be.equal(Object1);
                protochain = new ProtoChain$1(HTMLElement3);
                chai.expect(protochain.constructors[0]).to.be.equal(HTMLElement3);
                chai.expect(protochain.constructors[1]).to.be.equal(HTMLElement2);
                chai.expect(protochain.constructors[2]).to.be.equal(HTMLElement1);
                protochain = new ProtoChain$1(IoNode1);
                chai.expect(protochain.constructors[0]).to.be.equal(IoNode1);
                chai.expect(protochain.constructors[1]).to.be.equal(IoNode);
                protochain = new ProtoChain$1(IoElement1);
                chai.expect(protochain.constructors[0]).to.be.equal(IoElement1);
                chai.expect(protochain.constructors[1]).to.be.equal(IoElement);
                protochain = new ProtoChain$1(IoNode2);
                chai.expect(protochain.constructors[0]).to.be.equal(IoNode2);
            });
            it('Should terminate at `IoNode` and `IoElement` or before `HTMLElement`, `Object` or `Array`', () => {
                let protochain = new ProtoChain$1(Array3);
                chai.expect(protochain.constructors[3]).to.be.equal(undefined);
                protochain = new ProtoChain$1(Object3);
                chai.expect(protochain.constructors[3]).to.be.equal(undefined);
                protochain = new ProtoChain$1(HTMLElement3);
                chai.expect(protochain.constructors[3]).to.be.equal(undefined);
                protochain = new ProtoChain$1(IoNode1);
                chai.expect(protochain.constructors[2]).to.be.equal(undefined);
                protochain = new ProtoChain$1(IoElement1);
                chai.expect(protochain.constructors[4]).to.be.equal(undefined);
                protochain = new ProtoChain$1(IoNode2);
                chai.expect(protochain.constructors[1]).to.be.equal(undefined);
            });
            it('Should include all functions starting with "on" or "_"', () => {
                const protoChain = new ProtoChain$1(FakeIoNode);
                chai.expect(JSON.stringify(protoChain.functions)).to.be.equal(JSON.stringify(['onFunction1', '_function1', 'onFunction2', '_function2']));
            });
            // it('Should bind the functions to specified instance with `.bind(node)` function', () => {
            //   const protoChain = new ProtoChain(FakeIoNode);
            //   const node = new FakeIoNode();
            //   protoChain.bindFunctions(node as any);
            //   chai.expect(node.function1.name).to.be.equal('function1');
            //   chai.expect(node.onFunction1.name).to.be.equal('bound onFunction1');
            //   chai.expect(node._function1.name).to.be.equal('bound _function1');
            //   chai.expect(node.function2.name).to.be.equal('function2');
            //   chai.expect(node.onFunction2.name).to.be.equal('bound onFunction2');
            //   chai.expect(node._function2.name).to.be.equal('bound _function2');
            // });
        });
    }
}

async function waitTick() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        });
    });
}
class Node {
    run() {
        describe('Node', () => {
            it('should have core API defined', () => {
                const node = new IoNode();
                // Lifecycle functions
                node.connect(window);
                chai.expect(node.connect).to.be.a('function');
                chai.expect(node.disconnect).to.be.a('function');
                chai.expect(node.connectedCallback).to.be.a('function');
                chai.expect(node.disconnectedCallback).to.be.a('function');
                chai.expect(node.dispose).to.be.a('function');
                // Change handler functions
                chai.expect(node.changed).to.be.a('function');
                chai.expect(node.applyCompose).to.be.a('function');
                chai.expect(node.queue).to.be.a('function');
                chai.expect(node.queueDispatch).to.be.a('function');
                chai.expect(node.queueDispatchLazy).to.be.a('function');
                // Data-binding functions
                chai.expect(node.bind).to.be.a('function');
                chai.expect(node.unbind).to.be.a('function');
                // Property setters
                chai.expect(node.set).to.be.a('function');
                chai.expect(node.setProperties).to.be.a('function');
                chai.expect(node.objectMutated).to.be.a('function');
                chai.expect(node.objectMutatedThrottled).to.be.a('function');
                // Event-related functions
                chai.expect(node.addEventListener).to.be.a('function');
                chai.expect(node.removeEventListener).to.be.a('function');
                chai.expect(node.dispatchEvent).to.be.a('function');
                // TODO: fully test core API
                chai.expect(node.throttle).to.be.a('function');
                chai.expect(node.requestAnimationFrameOnce).to.be.a('function');
                // Utility functions
                chai.expect(node.filterObject).to.be.a('function');
                chai.expect(node.filterObjects).to.be.a('function');
                chai.expect(node.import).to.be.a('function');
                chai.expect(node.preventDefault).to.be.a('function');
                chai.expect(node.stopPropagation).to.be.a('function');
                node.dispose();
            });
            it('should account connections correctly', () => {
                const node = new IoNode();
                node.connect(window);
                chai.expect(node.__connected).to.be.equal(true);
                node.connect(document);
                chai.expect(node.__eventDispatcher.__connected).to.be.equal(true);
                chai.expect(node.__properties.__connected).to.be.equal(true);
                chai.expect(node.__connected).to.be.equal(true);
                chai.expect(node.__connections).to.be.deep.equal([window, document]);
                node.disconnect(window);
                chai.expect(node.__eventDispatcher.__connected).to.be.equal(true);
                chai.expect(node.__properties.__connected).to.be.equal(true);
                chai.expect(node.__connected).to.be.equal(true);
                chai.expect(node.__connections).to.be.deep.equal([document]);
                node.disconnect(document);
                chai.expect(node.__connected).to.be.equal(false);
                chai.expect(node.__eventDispatcher.__connected).to.be.equal(false);
                chai.expect(node.__properties.__connected).to.be.equal(false);
                chai.expect(node.__connections).to.be.deep.equal([]);
                node.connect(window);
                chai.expect(node.__eventDispatcher.__connected).to.be.equal(true);
                chai.expect(node.__properties.__connected).to.be.equal(true);
                chai.expect(node.__connected).to.be.equal(true);
                chai.expect(node.__connections).to.be.deep.equal([window]);
                node.dispose();
                chai.expect(node.__connected).to.be.equal(false);
                chai.expect(node.__eventDispatcher.__connected).to.be.equal(false);
                chai.expect(node.__properties.__connected).to.be.equal(false);
                chai.expect(node.__connections).to.be.deep.equal([]);
            });
            it('should invoke change handler functions on change', () => {
                class TestNode extends IoNode {
                    static get Properties() {
                        return {
                            prop1: String,
                            prop2: String,
                            _changedCounter: 0,
                            _prop1ChangedCounter: 0,
                            _prop1Change: null,
                            _prop2ChangedCounter: 0,
                            _prop2Change: null,
                        };
                    }
                    changed() {
                        this._changedCounter++;
                    }
                    prop1Changed(change) {
                        this._prop1ChangedCounter++;
                        this._prop1Change = change;
                    }
                    prop2Changed(change) {
                        this._prop2ChangedCounter++;
                        this._prop2Change = change;
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                node.prop1 = 'one';
                chai.expect(node._changedCounter).to.equal(1);
                chai.expect(node._prop1ChangedCounter).to.equal(1);
                chai.expect(node._prop2ChangedCounter).to.equal(0);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('');
                chai.expect(node._prop1Change.value).to.equal('one');
                node.prop1 = 'two';
                node.prop2 = 'test';
                chai.expect(node._changedCounter).to.equal(3);
                chai.expect(node._prop1ChangedCounter).to.equal(2);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('one');
                chai.expect(node._prop1Change.value).to.equal('two');
                chai.expect(node._prop2ChangedCounter).to.equal(1);
                chai.expect(node._prop2Change.property).to.equal('prop2');
                chai.expect(node._prop2Change.oldValue).to.equal('');
                chai.expect(node._prop2Change.value).to.equal('test');
                node.setProperties({
                    'prop1': 'three',
                    'prop2': '',
                });
                chai.expect(node._changedCounter).to.equal(4);
                chai.expect(node._prop1ChangedCounter).to.equal(3);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('two');
                chai.expect(node._prop1Change.value).to.equal('three');
                chai.expect(node._prop2ChangedCounter).to.equal(2);
                chai.expect(node._prop2Change.property).to.equal('prop2');
                chai.expect(node._prop2Change.oldValue).to.equal('test');
                chai.expect(node._prop2Change.value).to.equal('');
                node.disconnect(window);
                node.setProperties({
                    'prop1': 'four',
                    'prop2': 'test',
                });
                chai.expect(node._changedCounter).to.equal(4);
                chai.expect(node._prop1ChangedCounter).to.equal(3);
                chai.expect(node._prop1Change.property).to.equal('prop1');
                chai.expect(node._prop1Change.oldValue).to.equal('two');
                chai.expect(node._prop1Change.value).to.equal('three');
                chai.expect(node._prop2ChangedCounter).to.equal(2);
                chai.expect(node._prop2Change.property).to.equal('prop2');
                chai.expect(node._prop2Change.oldValue).to.equal('test');
                chai.expect(node._prop2Change.value).to.equal('');
                node.dispose();
            });
            it('should invoke property mutation handler functions on mutation event', async () => {
                class TestNode extends IoNode {
                    static get Properties() {
                        return {
                            obj1: {
                                type: Object,
                                observe: true,
                            },
                            obj2: {
                                type: Object,
                                observe: true,
                            },
                            _changedCounter: 0,
                            _obj1MutatedCounter: 0,
                            _obj2MutatedCounter: 0,
                        };
                    }
                    changed() {
                        this._changedCounter++;
                    }
                    obj1Mutated() {
                        this._obj1MutatedCounter++;
                    }
                    obj2Mutated() {
                        this._obj2MutatedCounter++;
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                chai.expect(node._changedCounter).to.equal(1);
                chai.expect(node._obj1MutatedCounter).to.equal(0);
                node.dispatchEvent('object-mutated', { object: node.obj1 }, false, window);
                // await waitTick();
                chai.expect(node._changedCounter).to.equal(2);
                chai.expect(node._obj1MutatedCounter).to.equal(1);
                chai.expect(node._obj2MutatedCounter).to.equal(0);
                node.dispatchEvent('object-mutated', { object: node.obj2 }, false, window);
                await waitTick();
                // TODO: investigate why this fails on auto-reload sometimes. Possible race condition?
                chai.expect(node._changedCounter).to.equal(3);
                chai.expect(node._obj1MutatedCounter).to.equal(1);
                chai.expect(node._obj2MutatedCounter).to.equal(1);
                // chai.expect(node._prop2ChangedCounter).to.equal(0);
                // chai.expect(node._prop1Change.detail.property).to.equal('prop1');
                // chai.expect(node._prop1Change.detail.oldValue).to.equal('');
                // chai.expect(node._prop1Change.detail.value).to.equal('one');
                node.dispose();
            });
            it('should invoke listener handler functions on events', () => {
                class TestNode extends IoNode {
                    static get Properties() {
                        return {
                            prop1: String,
                            _onProp1ChangedCounter: 0,
                            _onProp1Change: null,
                            _onCustomEventCounter: 0,
                            _onCustomEven: null,
                        };
                    }
                    static get Listeners() {
                        return {
                            'prop1-changed': 'onProp1Changed',
                            'custom-event': 'onCustomEvent',
                        };
                    }
                    onProp1Changed(event) {
                        this._onProp1ChangedCounter++;
                        this._onProp1Change = event;
                    }
                    onCustomEvent(event) {
                        this._onCustomEventCounter++;
                        this._onCustomEven = event;
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                node.prop1 = 'one';
                chai.expect(node._onProp1ChangedCounter).to.equal(1);
                chai.expect(node._onProp1Change.detail.property).to.equal('prop1');
                chai.expect(node._onProp1Change.detail.oldValue).to.equal('');
                chai.expect(node._onProp1Change.detail.value).to.equal('one');
                node.dispatchEvent('custom-event', { value: 'hello' });
                chai.expect(node._onCustomEventCounter).to.equal(1);
                chai.expect(node._onCustomEven.path[0]).to.equal(node);
                chai.expect(node._onCustomEven.detail.value).to.equal('hello');
                node.disconnect(window);
                node.prop1 = 'two';
                chai.expect(node._onProp1ChangedCounter).to.equal(1);
                chai.expect(node._onProp1Change.detail.property).to.equal('prop1');
                chai.expect(node._onProp1Change.detail.oldValue).to.equal('');
                chai.expect(node._onProp1Change.detail.value).to.equal('one');
                node.dispatchEvent('custom-event', { value: 'goodbye' });
                chai.expect(node._onCustomEventCounter).to.equal(1);
                chai.expect(node._onCustomEven.path[0]).to.equal(node);
                chai.expect(node._onCustomEven.detail.value).to.equal('hello');
                node.dispose();
            });
            it('should have correct property defaults', () => {
                class TestNode extends IoNode {
                    static get Properties() {
                        return {
                            prop0: { type: String },
                            prop1: { value: false },
                            prop2: -1,
                            prop3: Number,
                            prop4: Object,
                            prop5: [0, 1, 2],
                        };
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                chai.expect(node.prop0).to.be.equal('');
                chai.expect(node.prop1).to.be.equal(false);
                chai.expect(node.prop2).to.be.equal(-1);
                chai.expect(node.prop3).to.be.equal(0);
                chai.expect(node.prop4).to.be.deep.equal({});
                chai.expect(node.prop5).to.be.deep.equal([0, 1, 2]);
                node.dispose();
            });
            it('should correctly bind properties', () => {
                class TestNode extends IoNode {
                    static get Properties() {
                        return {
                            prop1: String,
                            prop2: String,
                        };
                    }
                }
                RegisterIoNode(TestNode);
                const node = new TestNode();
                node.connect(window);
                const binding = node.bind('prop1');
                chai.expect(binding).to.be.instanceof(Binding);
                chai.expect(binding.__node).to.be.equal(node);
                chai.expect(binding.__property).to.be.equal('prop1');
                const boundNode1 = new TestNode({ prop1: binding }).connect();
                const boundNode2 = new TestNode({ prop1: binding }).connect();
                boundNode2.prop2 = binding;
                chai.expect(binding.__targets[0]).to.be.equal(boundNode1);
                chai.expect(binding.__targets[1]).to.be.equal(boundNode2);
                chai.expect(binding.__targetProperties.get(boundNode1)[0]).to.be.equal('prop1');
                chai.expect(binding.__targetProperties.get(boundNode1)[1]).to.be.equal(undefined);
                chai.expect(binding.__targetProperties.get(boundNode2)[0]).to.be.equal('prop1');
                chai.expect(binding.__targetProperties.get(boundNode2)[1]).to.be.equal('prop2');
                node.prop1 = 'one';
                chai.expect(boundNode1.prop1).to.be.equal('one');
                chai.expect(boundNode1.prop2).to.be.equal('');
                chai.expect(boundNode2.prop1).to.be.equal('one');
                chai.expect(boundNode2.prop2).to.be.equal('one');
                boundNode1.prop1 = 'two';
                chai.expect(node.prop1).to.be.equal('two');
                chai.expect(boundNode2.prop1).to.be.equal('two');
                chai.expect(binding.__targets.length).to.be.equal(2);
                boundNode1.dispose();
                chai.expect(binding.__targets.length).to.be.equal(1);
                boundNode2.dispose();
                chai.expect(binding.__targets.length).to.be.equal(0);
                node.dispose();
            });
            // it('Should add/remove targets and __targetProperties when assigned to values', () => {
            //   const srcNode = new TestNode();
            //   const binding0 = new Binding(srcNode, 'prop1') as any;
            //   const binding1 = new Binding(srcNode, 'prop2') as any;
            //   const dstNode0 = new TestNode().connect();
            //   dstNode0.prop1 = binding0;
            //   dstNode0.prop2 = binding1;
            //   const dstNode1 = new TestNode({prop1: binding0}).connect();
            //   const dstNode3 = new TestNode({prop1: binding0, prop2: binding0}).connect();
            //   chai.expect(binding0.__targets[0]).to.be.equal(dstNode0);
            //   chai.expect(binding0.__targets[1]).to.be.equal(dstNode1);
            //   chai.expect(binding0.__targets[2]).to.be.equal(dstNode3);
            //   chai.expect(string(binding0.__targetProperties.get(dstNode0))).to.be.equal(string(['prop1']));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode1))).to.be.equal(string(['prop1']));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode3))).to.be.equal(string(['prop1', 'prop2']));
            //   dstNode0.dispose();
            //   dstNode1.disconnect();
            //   dstNode3.unbind('prop1');
            //   chai.expect(string(binding0.__targetProperties.get(dstNode0))).to.be.equal(string([]));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode1))).to.be.equal(string([]));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode3))).to.be.equal(string(['prop2']));
            //   dstNode1.prop2 = binding0;
            //   dstNode1.connect();
            //   dstNode3.prop1 = binding0;
            //   chai.expect(string(binding0.__targetProperties.get(dstNode1))).to.be.equal(string(['prop2', 'prop1']));
            //   chai.expect(string(binding0.__targetProperties.get(dstNode3))).to.be.equal(string(['prop2', 'prop1']));
            // });
            // it('Should return existing binding or create a new on "bind()"', () => {
            //   const node = new TestNode();
            //   const binding0 = node.bind('prop1');
            //   chai.expect(binding0).to.be.equal(node.__propertyBinder.__bindings.prop1);
            //   chai.expect(binding0).to.be.equal(node.bind('prop1'));
            // });
            // it('Should dispose bindings correctly', () => {
            //   const node1 = new TestNode();
            //   const binding0 = node1.bind('prop1') as any;
            //   node1.unbind('prop1');
            //   chai.expect(node1.__propertyBinder.__bindings.prop1).to.be.equal(undefined);
            //   chai.expect(binding0.prop1).to.be.equal(undefined);
            //   const node2 = new TestNode();
            //   const binding1 = node2.bind('prop1') as any;
            //   node2.__propertyBinder.dispose();
            //   chai.expect(node2.__propertyBinder.__bindings).to.be.equal(undefined);
            //   chai.expect(binding1.prop1).to.be.equal(undefined);
            // });
        });
    }
}

class TestNode extends IoNode {
    static get Properties() {
        return {
            prop0: String,
            prop2: Infinity,
        };
    }
}
RegisterIoNode(TestNode);
class TestElement extends IoElement {
    static get Properties() {
        return {
            prop0: -1,
            prop1: {
                value: 'default',
            },
            // Internal counters
            _changedCounter: 0,
            _prop1ChangedCounter: 0,
            _prop1AltCounter: 0,
            _prop1ChangeEvent: null,
            debug: true,
        };
    }
    static get Listeners() {
        return {
            'prop0-changed': 'onProp1Change',
            'custom-event': 'onCustomEvent',
        };
    }
    reset() {
        this.prop0 = -1;
        this.prop1 = 'default';
        this._changedCounter = 0;
        this._prop1ChangedCounter = 0;
        this._prop1AltCounter = 0;
        this._prop1Counter = 0;
        this._customHandlerCounter = 0;
        this._prop1AltChangeEvent = null;
        this._prop1ChangeEvent = null;
        this._customHandlerChangeEvent = null;
    }
    constructor(initProps) {
        super(initProps);
        this.template([['test-subelement', { id: 'subelement', prop0: this.bind('prop0') }]]);
        this.subnode = new TestNode({ prop2: this.bind('prop0') });
        this.subnode.connect(window);
    }
    // TODO: test arguments
    changed() {
        this._changedCounter++;
    }
    prop1Changed(change) {
        this._prop1ChangedCounter++;
        this._prop1ChangedChange = change;
    }
    onProp1ChangeAlt(event) {
        this._prop1AltCounter++;
        this._prop1AltChangeEvent = event;
    }
    onProp1Change(event) {
        this._prop1Counter++;
        this._prop1ChangeEvent = event;
    }
    onCustomEvent(event) {
        this._customHandlerCounter++;
        this._customHandlerChangeEvent = event;
    }
}
RegisterIoElement(TestElement);
class TestSubelement extends IoElement {
    static get Properties() {
        return {
            prop0: 0,
        };
    }
}
RegisterIoElement(TestSubelement);
class Element {
    _changedCounter;
    element;
    constructor() {
        this._changedCounter = 0;
        this.element = new TestElement({ 'on-prop0-changed': this.changed.bind(this), 'on-prop1-changed': 'onProp1ChangeAlt', debug: true });
        document.body.appendChild(this.element);
    }
    changed(event) {
        if (event.target === this.element) {
            this._changedCounter++;
        }
    }
    reset() {
        this.element.reset();
        this._changedCounter = 0;
    }
    run() {
        describe('IoElement', () => {
            describe('Initialized element', () => {
                it('Should have correct property defaults', () => {
                    chai.expect(this.element.prop0).to.equal(-1);
                    chai.expect(this.element.prop1).to.equal('default');
                });
                it('Should have core API functions defined', () => {
                    // Default properties
                    chai.expect(this.element.id).to.be.equal('');
                    chai.expect(this.element.tabindex).to.be.equal('');
                    chai.expect(this.element.contenteditable).to.be.equal(false);
                    chai.expect(this.element.title).to.be.equal('');
                    chai.expect(this.element.$).to.be.a('object');
                    // Template functions
                    chai.expect(this.element.template).to.be.a('function');
                    chai.expect(this.element.traverse).to.be.a('function');
                    // TODO: fully test core API
                });
            });
            describe('Observed properties', () => {
                it('Should corectly invoke handler functions on change', () => {
                    this.reset();
                    this.element.prop0 = 1;
                    this.element.prop1 = 'test';
                    chai.expect(this.element._prop1AltCounter).to.equal(1);
                    chai.expect(this.element._changedCounter).to.equal(2);
                    chai.expect(this._changedCounter).to.equal(1);
                });
                it('Should not invoke handler functions when disconnected', () => {
                    this.reset();
                    document.body.removeChild(this.element);
                    this.element.prop0 = 2;
                    this.element.prop1 = 'test2';
                    chai.expect(this.element._prop1AltCounter).to.equal(0);
                    chai.expect(this.element._changedCounter).to.equal(0);
                    chai.expect(this._changedCounter).to.equal(0);
                    document.body.appendChild(this.element);
                });
                it('Should dispatch correct event payloads to handlers', () => {
                    this.reset();
                    this.element.prop0 = 1;
                    this.element.prop0 = 0;
                    chai.expect(this.element._prop1ChangeEvent.srcElement).to.equal(this.element);
                    chai.expect(this.element._prop1ChangeEvent.detail.value).to.equal(0);
                    this.element.$.subelement.prop0 = 2;
                    chai.expect(this.element._prop1ChangeEvent.detail.oldValue).to.equal(0);
                    chai.expect(this.element._prop1ChangeEvent.detail.value).to.equal(2);
                    this.element.dispatchEvent('custom-event', { data: 'io' });
                    chai.expect(this.element._customHandlerChangeEvent.detail.data).to.equal('io');
                });
            });
            // TODO: Cleanup and improve
            describe('Binding', () => {
                it('Should update bound values correctly', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.$.subelement.prop0).to.equal(Infinity);
                    this.element.$.subelement.prop0 = 0;
                    chai.expect(this.element.prop0).to.equal(0);
                });
                it('Should disconnect binding when element is disconnected', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.$.subelement.prop0).to.equal(Infinity);
                    this.element.removeChild(this.element.$.subelement);
                    this.element.$.subelement.prop0 = 0;
                    chai.expect(this.element.prop0).to.equal(Infinity);
                    this.element.appendChild(this.element.$.subelement);
                    this.element.$.subelement.prop0 = 2;
                    chai.expect(this.element.prop0).to.equal(2);
                });
                it('Should bind to Node node', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.subnode.prop2).to.equal(Infinity);
                    this.element.subnode.prop2 = 0;
                    chai.expect(this.element.prop0).to.equal(0);
                });
                it('Should disconnect binding when Node node is disconnected', () => {
                    this.element.prop0 = Infinity;
                    chai.expect(this.element.subnode.prop2).to.equal(Infinity);
                    this.element.subnode.disconnect(window);
                    this.element.prop0 = 0;
                    chai.expect(this.element.subnode.prop2).to.equal(Infinity);
                    this.element.subnode.connect(window);
                    this.element.subnode.prop2 = 2;
                    chai.expect(this.element.prop0).to.equal(2);
                });
            });
            // TODO: test IoElement-specific API
        });
    }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Extends [`IoElement`](/#doc=core-element).
 *
 * This is the simplest element with a `value`, a building block for more complex elements.
 *
 * It simply displays `value` or `label` property if set.
 *
 * It changes its apparence if `selected` of `disabled` properties are `true`.
 *
 * Arow keys up, down, left, right and tab change focus to the nearest focusable element in the chosen direction.
 *
 * <io-element-demo element="io-item" properties='{"label": "Item", "value": "null", "selected": false, "disabled": false}'></io-element-demo>
 **/
class IoItem extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-item;
    }
    :host[selected] {
      color: var(--io-color-link);
      background-color: var(--io-background-color-highlight);
    }
    :host:focus {
      z-index: 200;
      position: relative;
      text-overflow: inherit;
      border-color: var(--io-color-focus);
      outline-color: var(--io-color-focus);
    }
    `;
    }
    static get Properties() {
        return {
            value: undefined,
            selected: {
                type: Boolean,
                reflect: 1,
            },
            tabindex: 0,
        };
    }
    static get Listeners() {
        return {
            'focus': '_onFocus',
            'pointerdown': '_onPointerdown',
            'click': '_onClick',
        };
    }
    constructor(properties = {}) {
        super(properties);
        Object.defineProperty(this, '__textNode', { enumerable: false, writable: true, value: document.createTextNode('') });
        this.appendChild(this.__textNode);
    }
    _onFocus(event) {
        this.addEventListener('blur', this._onBlur);
        this.addEventListener('keydown', this._onKeydown);
        this.addEventListener('keyup', this._onKeyup);
    }
    _onBlur(event) {
        this.removeEventListener('blur', this._onBlur);
        this.removeEventListener('keydown', this._onKeydown);
        this.removeEventListener('keyup', this._onKeyup);
    }
    _onPointerdown(event) {
        event.preventDefault();
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerleave', this._onPointerleave);
        this.addEventListener('pointerup', this._onPointerup);
    }
    _onPointermove(event) { }
    _onPointerleave(event) {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerleave', this._onPointerleave);
        this.removeEventListener('pointerup', this._onPointerup);
    }
    _onPointerup(event) {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerleave', this._onPointerleave);
        this.removeEventListener('pointerup', this._onPointerup);
        this.focus();
    }
    _onClick() {
        this.dispatchEvent('item-clicked', { value: this.value, label: this.label }, true);
    }
    _onKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this._onClick();
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.focusTo('left');
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.focusTo('up');
        }
        else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.focusTo('right');
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.focusTo('down');
        }
    }
    _onKeyup(event) { }
    getCaretPosition() {
        let position = 0;
        const selection = window.getSelection();
        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const selected = range.toString().length;
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(this);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length - selected;
        }
        return position;
    }
    setCaretPosition(position) {
        if (!position)
            return;
        const selection = window.getSelection();
        if (selection) {
            const range = document.createRange();
            range.setStart(this.firstChild, position);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    changed() {
        let label;
        if (this.label) {
            label = this.label;
            this.title = this.label;
        }
        else {
            let valueText;
            if (this.value && typeof this.value === 'object') {
                valueText = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
            }
            else {
                valueText = String(this.value);
            }
            this.title = valueText;
            label = valueText;
        }
        this.textNode = label;
    }
}
RegisterIoElement(IoItem);

class Item {
    element = new IoItem();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoItem', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(undefined);
                    chai.expect(this.element.disabled).to.equal(false);
                    chai.expect(this.element.label).to.equal('');
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    chai.expect(this.element.innerText).to.equal('undefined');
                    this.element.value = false;
                    chai.expect(this.element.innerText).to.equal('false');
                    this.element.value = {};
                    chai.expect(this.element.innerText).to.equal('Object');
                    this.element.value = [0, 1, 2, 3];
                    chai.expect(this.element.innerText).to.equal('Array(4)');
                    this.element.label = 'label';
                    chai.expect(this.element.innerText).to.equal('label');
                    this.element.value = undefined;
                    this.element.label = '';
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('aria-label')).to.equal(null);
                    this.element.label = 'label';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('label');
                    this.element.label = '';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal(null);
                    this.element.disabled = true;
                    chai.expect(this.element.getAttribute('aria-disabled')).to.equal('');
                    this.element.disabled = false;
                });
                it('has title attribute', () => {
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('title')).to.equal('click here');
                    this.element.label = '';
                });
            });
        });
    }
}

// TODO: test and documentation
/*

 **/
class IoContent extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-content;
    }
    :host:not([expanded]) {
      display: none;
    }
    `;
    }
    static get Properties() {
        return {
            elements: {
                type: Array,
                observe: true,
            },
            expanded: {
                type: Boolean,
                reflect: 1,
            },
            cache: Boolean,
        };
    }
    changed() {
        // TODO: cache outside DOM and disconnect!
        if (this.expanded) {
            this.template([this.elements]);
        }
        else if (!this.cache) {
            this.template([null]);
        }
    }
}
RegisterIoElement(IoContent);

class Content {
    element = new IoContent();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoContent', () => {
            it('TODO', () => {
                // chai.expect('TODO').to.not.equal('TODO');
            });
        });
    }
}

// TODO: test different value types
class EmulatedLocalStorage {
    store = {};
    warned = false;
    get permited() {
        try {
            return !!self.localStorage.getItem('io-storage-user-permitted');
        }
        catch (error) {
        }
        return false;
    }
    set permited(value) {
        try {
            self.localStorage.setItem('io-storage-user-permitted', String(value));
            const permited = self.localStorage.getItem('io-storage-user-permitted');
            if (permited === 'true') {
                for (const i in this.store) {
                    self.localStorage.setItem(i, String(this.store[i]));
                    delete this.store[i];
                }
            }
        }
        catch (error) {
        }
    }
    constructor() {
        Object.defineProperty(this, 'store', { value: {}, writable: true });
        Object.defineProperty(this, 'warned', { value: false, writable: true });
    }
    setItem(key, value) {
        const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (this.permited) {
            self.localStorage.setItem(key, strValue);
        }
        else {
            this.store[key] = strValue;
            if (!this.warned) {
                if (!this.permited) ;
                this.warned = true;
            }
            if (key === 'io-storage-user-permitted') {
                this.permited = !!this.store[key];
            }
        }
    }
    getItem(key) {
        if (this.permited) {
            return self.localStorage.getItem(key);
        }
        else {
            return this.store[key];
        }
    }
    removeItem(key) {
        if (this.permited) {
            return self.localStorage.removeItem(key);
        }
        else {
            delete this.store[key];
        }
    }
    clear() {
        if (this.permited) {
            return self.localStorage.clear();
        }
        else {
            this.store = {};
        }
    }
}
const localStorage = new EmulatedLocalStorage();
const nodes = {};
let hashes = {};
// TODO: unhack and test
const parseHashes = function () {
    return self.location.hash.substr(1).split('&').reduce(function (result, item) {
        const parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});
};
const getHashes = function () {
    hashes = parseHashes();
    for (const hash in hashes) {
        // TODO: clean up types
        const n = hash;
        const h = hash;
        if (nodes[n]) {
            if (hashes[h] !== '') {
                const hashValue = hashes[h].replace(/%20/g, ' ');
                if (!isNaN(hashValue)) {
                    nodes[n].value = JSON.parse(hashValue);
                }
                else if (hashValue === 'true' || hashValue === 'false') {
                    nodes[n].value = JSON.parse(hashValue);
                }
                else {
                    nodes[n].value = hashValue;
                }
            }
        }
    }
    for (const node in nodes) {
        if (nodes[node].storage === 'hash' && !hashes[node]) {
            nodes[node].value = nodes[node].default;
        }
    }
};
const setHashes = function (force) {
    let hashString = '';
    for (const node in nodes) {
        if ((nodes[node].storage === 'hash' || force) && nodes[node].value !== undefined && nodes[node].value !== '' && nodes[node].value !== nodes[node].default) {
            if (typeof nodes[node].value === 'string') {
                hashString += node + '=' + nodes[node].value + '&';
            }
            else {
                hashString += node + '=' + JSON.stringify(nodes[node].value) + '&';
            }
        }
    }
    for (const hash in hashes) {
        if (hash && !nodes[hash]) {
            hashString += hash + '=' + hashes[hash] + '&';
        }
    }
    hashString = hashString.slice(0, -1);
    self.location.hash = hashString;
    if (!self.location.hash)
        history.replaceState({}, document.title, self.location.pathname + self.location.search);
};
self.addEventListener('hashchange', getHashes, false);
getHashes();
class IoStorage extends IoNode {
    static get Properties() {
        return {
            key: String,
            value: undefined,
            default: undefined,
            storage: undefined,
        };
    }
    constructor(props) {
        super(Object.assign({ default: props.value }, props));
        if (props.key)
            nodes[props.key] = nodes[props.key] || this;
        this.binding = this.bind('value');
        this.getStorageValue();
        this.connect(window);
    }
    getStorageValue() {
        const key = this.key;
        switch (this.storage) {
            case 'hash': {
                if (hashes[key] !== undefined) {
                    const hashValue = hashes[key].replace(/%20/g, ' ');
                    try {
                        this.value = JSON.parse(hashValue);
                    }
                    catch (e) {
                        this.value = hashValue;
                    }
                }
                else {
                    this.value = this.default;
                }
                break;
            }
            case 'local': {
                const key = self.location.pathname !== '/' ? self.location.pathname + this.key : this.key;
                const localValue = localStorage.getItem(key);
                if (localValue !== null && localValue !== undefined) {
                    this.value = JSON.parse(localValue);
                }
                else {
                    this.value = this.default;
                }
                break;
            }
            default: {
                this.value = this.default;
            }
        }
    }
    valueChanged() {
        switch (this.storage) {
            case 'hash': {
                setHashes();
                break;
            }
            case 'local': {
                const key = self.location.pathname !== '/' ? self.location.pathname + this.key : this.key;
                if (this.value === null || this.value === undefined) {
                    localStorage.removeItem(key);
                }
                else {
                    localStorage.setItem(key, JSON.stringify(this.value));
                }
                break;
            }
        }
    }
}
RegisterIoNode(IoStorage);
const IoStorageFactory = function (props) {
    if (props && typeof props === 'string') {
        props = { key: props };
    }
    if (props && props.key && nodes[props.key]) {
        if (props.storage)
            nodes[props.key].storage = props.storage;
        if (props.value !== undefined)
            nodes[props.key].default = props.value;
        return nodes[props.key].binding;
    }
    return new IoStorage(props).binding;
};
Object.defineProperty(IoStorageFactory, 'permitted', {
    get: () => {
        return localStorage.permited;
    },
    set: (value) => {
        localStorage.permited = value;
    }
});

const themePropDefaults = {
    cssSpacing: 2,
    cssBorderRadius: 3,
    cssBorderWidth: 1,
    cssStrokeWidth: 1,
    cssLineHeight: 22,
    cssItemHeight: 0,
    cssFontSize: 14,
};
const themeDBDefaults = {
    light: Object.assign({
        cssBackgroundColor: [0.95, 0.95, 0.95, 1],
        cssBackgroundColorLight: [1, 1, 1, 1],
        cssBackgroundColorDark: [0.84, 0.84, 0.84, 1],
        cssBackgroundColorField: [0.92, 0.92, 0.92, 1],
        cssColor: [0.16, 0.16, 0.16, 1],
        cssColorError: [0.91, 0.5, 0.5, 1],
        cssColorLink: [0.2, 0.75, 0.2, 1],
        cssColorFocus: [0.3, 0.6, 1, 1],
        cssColorField: [0, 0, 0, 1],
        cssColorNumber: [0.12, 0.64, 1, 1],
        cssColorString: [0.95, 0.25, 0.1, 1],
        cssColorBoolean: [0.82, 0.35, 0.75, 1],
        cssColorBorder: [0.7, 0.7, 0.7, 1],
        cssColorBorderLight: [1, 1, 1, 1],
        cssColorBorderDark: [0.6, 0.6, 0.6, 1],
        cssColorGradientStart: [0.9, 0.9, 0.9, 1],
        cssColorGradientEnd: [0.75, 0.75, 0.75, 1],
        cssColorShadow: [0, 0, 0, 0.2],
    }, themePropDefaults),
    dark: Object.assign({
        cssBackgroundColor: [0.164, 0.164, 0.164, 1],
        cssBackgroundColorLight: [0.22, 0.22, 0.22, 1],
        cssBackgroundColorDark: [0.25, 0.25, 0.25, 1],
        cssBackgroundColorField: [0.137, 0.137, 0.137, 1],
        cssColor: [0.823, 0.823, 0.823, 1],
        cssColorError: [1, 0.376, 0.062, 1],
        cssColorLink: [0.75, 0.9, 0.59, 1],
        cssColorFocus: [0.3, 0.82, 1.4, 1],
        cssColorField: [0.75, 0.75, 0.75, 1],
        cssColorNumber: [0.125, 0.64, 1, 1],
        cssColorString: [0.94, 0.25, 0.086, 1],
        cssColorBoolean: [0.82, 0.35, 0.75, 1],
        cssColorBorder: [0.3, 0.3, 0.3, 1],
        cssColorBorderLight: [0.4, 0.4, 0.4, 1],
        cssColorBorderDark: [0, 0, 0, 1],
        cssColorGradientStart: [1, 1, 1, 0.1],
        cssColorGradientEnd: [0, 0, 0, 0.2],
        cssColorShadow: [0, 0, 0, 0.2],
    }, themePropDefaults),
};
const themeDB = IoStorageFactory({ value: JSON.parse(JSON.stringify(themeDBDefaults)), storage: 'local', key: 'themeDB' });
class IoTheme extends IoElement {
    static get Style() {
        return /* css */ `
    --io-item: {
      align-self: flex-start;
      display: inline-block;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      white-space: nowrap;
      box-sizing: border-box;
      line-height: var(--io-line-height);
      height: var(--io-item-height);
      font-size: var(--io-font-size);
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: transparent;
      color: var(--io-color);
      background-color: transparent;
      background-image: none;
      padding: var(--io-spacing);
      transition: background-color 0.25s;
    }
    --io-panel: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      border-radius: calc(var(--io-border-radius) + var(--io-spacing));
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-dark);
      padding: var(--io-spacing);
    }
    --io-content: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-tap-highlight-color: transparent;
    }
    --io-row: {
      display: flex;
      flex: 1 1;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
    }
    --io-column: {
      display: flex;
      flex: 1 1;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    --io-table2: {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table3: {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table4: {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table5: {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: var(--io-spacing);
    }
    `;
    }
    static get Properties() {
        const isDarkMode = !!window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = IoStorageFactory({ value: isDarkMode ? 'dark' : 'light', storage: 'local', key: 'theme' });
        const vars = themeDB.value[theme.value];
        return {
            theme: theme,
            //
            cssSpacing: vars.cssSpacing,
            cssBorderRadius: vars.cssBorderRadius,
            cssBorderWidth: vars.cssBorderWidth,
            cssStrokeWidth: vars.cssStrokeWidth,
            cssLineHeight: vars.cssLineHeight,
            cssItemHeight: vars.cssItemHeight,
            cssFontSize: vars.cssFontSize,
            cssBackgroundColor: { value: vars.cssBackgroundColor, observe: true },
            cssBackgroundColorLight: { value: vars.cssBackgroundColorLight, observe: true },
            cssBackgroundColorDark: { value: vars.cssBackgroundColorDark, observe: true },
            cssBackgroundColorField: { value: vars.cssBackgroundColorField, observe: true },
            cssColor: { value: vars.cssColor, observe: true },
            cssColorError: { value: vars.cssColorError, observe: true },
            cssColorLink: { value: vars.cssColorLink, observe: true },
            cssColorFocus: { value: vars.cssColorFocus, observe: true },
            cssColorField: { value: vars.cssColorField, observe: true },
            cssColorNumber: { value: vars.cssColorNumber, observe: true },
            cssColorString: { value: vars.cssColorString, observe: true },
            cssColorBoolean: { value: vars.cssColorBoolean, observe: true },
            cssColorBorder: { value: vars.cssColorBorder, observe: true },
            cssColorBorderLight: { value: vars.cssColorBorderLight, observe: true },
            cssColorBorderDark: { value: vars.cssColorBorderDark, observe: true },
            cssColorGradientStart: { value: vars.cssColorGradientStart, observe: true },
            cssColorGradientEnd: { value: vars.cssColorGradientEnd, observe: true },
            cssColorShadow: { value: vars.cssColorShadow, observe: true },
            //
            lazy: true,
        };
    }
    constructor(props) {
        super(props);
        this.variablesElement = document.createElement('style');
        this.variablesElement.setAttribute('id', 'io-theme-variables');
        document.head.appendChild(this.variablesElement);
    }
    _toCss(rgba) {
        const r = Math.floor(rgba[0] * 255);
        const g = Math.floor(rgba[1] * 255);
        const b = Math.floor(rgba[2] * 255);
        if (rgba[3] !== undefined) {
            return `rgba(${r}, ${g}, ${b}, ${rgba[3]})`;
        }
        else {
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    reset() {
        themeDB.value = Object.assign({}, JSON.parse(JSON.stringify(themeDBDefaults)));
        this.themeChanged();
    }
    themeChanged() {
        const vars = themeDB.value[this.theme];
        this.setProperties({
            cssSpacing: vars.cssSpacing,
            cssBorderRadius: vars.cssBorderRadius,
            cssBorderWidth: vars.cssBorderWidth,
            cssStrokeWidth: vars.cssStrokeWidth,
            cssLineHeight: vars.cssLineHeight,
            cssItemHeight: vars.cssItemHeight,
            cssFontSize: vars.cssFontSize,
            cssBackgroundColor: vars.cssBackgroundColor,
            cssBackgroundColorLight: vars.cssBackgroundColorLight,
            cssBackgroundColorDark: vars.cssBackgroundColorDark,
            cssBackgroundColorField: vars.cssBackgroundColorField,
            cssColor: vars.cssColor,
            cssColorError: vars.cssColorError,
            cssColorLink: vars.cssColorLink,
            cssColorFocus: vars.cssColorFocus,
            cssColorField: vars.cssColorField,
            cssColorNumber: vars.cssColorNumber,
            cssColorString: vars.cssColorString,
            cssColorBoolean: vars.cssColorBoolean,
            cssColorBorder: vars.cssColorBorder,
            cssColorBorderLight: vars.cssColorBorderLight,
            cssColorBorderDark: vars.cssColorBorderDark,
            cssColorGradientStart: vars.cssColorGradientStart,
            cssColorGradientEnd: vars.cssColorGradientEnd,
            cssColorShadow: vars.cssColorShadow,
        });
    }
    changed() {
        this.__properties.cssItemHeight.value = this.cssLineHeight + 2 * (this.cssSpacing + this.cssBorderWidth);
        this.variablesElement.innerHTML = /* css */ `
      body {
        --io-spacing: ${this.cssSpacing}px;
        --io-border-radius: ${this.cssBorderRadius}px;
        --io-border-width: ${this.cssBorderWidth}px;
        --io-stroke-width: ${this.cssStrokeWidth}px;
        --io-line-height: ${this.cssLineHeight}px;
        --io-item-height: ${this.cssItemHeight}px;
        --io-font-size: ${this.cssFontSize}px;

        --io-background-color: ${this._toCss(this.cssBackgroundColor)};
        --io-background-color-highlight: ${this._toCss(this.cssBackgroundColorLight)};
        --io-background-color-dark: ${this._toCss(this.cssBackgroundColorDark)};
        --io-background-color-field: ${this._toCss(this.cssBackgroundColorField)};

        --io-color: ${this._toCss(this.cssColor)};
        --io-color-error: ${this._toCss(this.cssColorError)};
        --io-color-link: ${this._toCss(this.cssColorLink)};
        --io-color-focus: ${this._toCss(this.cssColorFocus)};
        --io-color-field: ${this._toCss(this.cssColorField)};
        --io-color-number: ${this._toCss(this.cssColorNumber)};
        --io-color-string: ${this._toCss(this.cssColorString)};
        --io-color-boolean: ${this._toCss(this.cssColorBoolean)};
        --io-color-border: ${this._toCss(this.cssColorBorder)};
        --io-color-border-light: ${this._toCss(this.cssColorBorderLight)};
        --io-color-border-dark: ${this._toCss(this.cssColorBorderDark)};
        --io-color-gradient-start: ${this._toCss(this.cssColorGradientStart)};
        --io-color-gradient-end: ${this._toCss(this.cssColorGradientEnd)};
        --io-color-shadow: ${this._toCss(this.cssColorShadow)};


        --io-border: var(--io-border-width) solid var(--io-color-border);
        --io-border-error: var(--io-border-width) solid var(--io-color-error);
        --io-color-border-inset: var(--io-color-border-dark) var(--io-color-border-light) var(--io-color-border-light) var(--io-color-border-dark);
        --io-color-border-outset: var(--io-color-border-light) var(--io-color-border-dark) var(--io-color-border-dark) var(--io-color-border-light);

        --io-gradient-button: linear-gradient(180deg, var(--io-color-gradient-start), var(--io-color-gradient-end) 100%);
        --io-gradient-error: repeating-linear-gradient(135deg, transparent, var(--io-color-error) 1px, var(--io-color-error) 4px, transparent 6px);

        --io-shadow: 2px 2px 6px var(--io-color-shadow),
                     1px 1px 1px var(--io-color-shadow);
        --io-shadow-inset: 1px 1px 2px inset var(--io-color-shadow);
        --io-shadow-outset: -1px -1px 2px inset var(--io-color-shadow);
      }
    `;
        const vars = themeDB.value[this.theme];
        for (const prop in this.__properties) {
            if (prop.startsWith('css')) {
                vars[prop] = this.__properties[prop].value;
            }
        }
        themeDB.value = Object.assign({}, themeDB.value);
        // TODO: consider removing (required for gl updates in theme demo)
        this.dispatchEvent('object-mutated', { object: this }, false, window);
    }
}
RegisterIoElement(IoTheme);
/*
 * Extends `IoElement`.
 *
 * `IoThemeSingleton` holds top-level CSS variables for Io design system. Variables are grouped in different themes and can be collectively switched by changing `theme` property.
 *
 * ```javascript
 * IoThemeSingleton.theme = 'dark';
 * ```
 *
 * <io-element-demo element="io-option-menu" properties='{"value": "light", "options": ["light", "dark"]}'></io-element-demo>
 *
 * Moreover, some of the key theme variables such as `'--io-color'` and `'--io-background-color'` are mapped to numeric properties `cssColor` and `cssBackgroundColor` source code for more advanced example.
 **/
const IoThemeSingleton = new IoTheme();
document.head.appendChild(IoThemeSingleton);

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true });
// TODO: disable filtering (image-rendering: pixelated)?
gl.getExtension('OES_standard_derivatives');
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.disable(gl.DEPTH_TEST);
const positionBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0.0, -1, -1, 0.0, 1, -1, 0.0, 1, 1, 0.0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
const uvBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
const indexBuff = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([3, 2, 1, 3, 1, 0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
const shadersCache = new WeakMap();
let currentProgram;
/*
 * `IoGL` is a base class for WebGL-based custom elements. The appearance of such elements is defined in fragment shader programs that execute on the GPU. All numeric properties are automatically bound to shader uniforms, including `IoThemeSingleton` CSS properties. You can define your custom shaders inside `static get Frag()` return string.
 *
 * <io-element-demo element="io-gl" width="255px" height="255px" properties='{"color": [0, 0, 0, 1]}' config='{"background": ["io-color-vector"], "color": ["io-color-vector"]}'></io-element-demo>
 *
 * An example of the most basic fragment shader program:
 *
 * ```javascript
 * class MyElement extends IoGl {
 *   static get Frag() {
 *     return `
 *     void main(void) {
 *       gl_FragColor = cssBackgroundColor;
 *     }`;
 *   }
 * }
 * ```
 *
 * See `IoSliderKnob` and `IoHsvaSv` for more advanced examples.
 **/
class IoGl extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      position: relative;
      overflow: hidden !important;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      box-sizing: border-box;
    }
    :host > .io-gl-canvas {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: calc(var(--io-border-radius) - var(--io-border-width));
      pointer-events: none;
      /* image-rendering: pixelated; */
    }
    `;
    }
    static get Properties() {
        return {
            size: [0, 0],
            color: {
                value: [1, 1, 1, 1],
                observe: true,
            },
            pxRatio: 1,
            css: {
                type: Object,
                observe: true,
            },
        };
    }
    static get Vert() {
        return /* glsl */ `
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main(void) {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }\n\n`;
    }
    static get GlUtils() {
        return /* glsl */ `
    #ifndef saturate
      #define saturate(v) clamp(v, 0., 1.)
    #endif

    vec2 translate(vec2 samplePosition, vec2 xy){
      return samplePosition - vec2(xy.x, xy.y);
    }
    vec2 translate(vec2 samplePosition, float x, float y){
      return samplePosition - vec2(x, y);
    }
    float circle(vec2 samplePosition, float radius){
      return saturate((length(samplePosition) - radius) * uPxRatio);
    }
    float rectangle(vec2 samplePosition, vec2 halfSize){
      vec2 edgeDistance = abs(samplePosition) - halfSize;
      float outside = length(max(edgeDistance, 0.));
      float inside = min(max(edgeDistance.x, edgeDistance.y), 0.);
      return saturate((outside + inside) * uPxRatio); // TODO: check
    }
    float grid(vec2 samplePosition, float gridWidth, float gridHeight, float lineWidth) {
      vec2 sp = samplePosition / vec2(gridWidth, gridHeight);
      float linex = abs(fract(sp.x - 0.5) - 0.5) * 2.0 / abs(max(dFdx(sp.x), dFdy(sp.x))) - lineWidth;
      float liney = abs(fract(sp.y - 0.5) - 0.5) * 2.0 / abs(max(dFdy(sp.y), dFdx(sp.y))) - lineWidth;
      return saturate(min(linex, liney));
    }
    float checker(vec2 samplePosition, float size) {
      vec2 checkerPos = floor(samplePosition / size);
      float checkerMask = mod(checkerPos.x + mod(checkerPos.y, 2.0), 2.0);
      return checkerMask;
    }\n\n`;
    }
    static get Frag() {
        return /* glsl */ `
      varying vec2 vUv;
      void main(void) {
        vec2 position = uSize * vUv;
        float gridWidth = 8. * uPxRatio;
        float lineWidth = 1. * uPxRatio;
        float gridShape = grid(position, gridWidth, gridWidth, lineWidth);
        gl_FragColor = mix(vec4(vUv, 0.0, 1.0), uColor, gridShape);
      }\n\n`;
    }
    initPropertyUniform(name, property) {
        if (property.notify) {
            switch (property.type) {
                case Boolean:
                    return 'uniform int ' + name + ';\n';
                case Number:
                    return 'uniform float ' + name + ';\n';
                case Array:
                    this._vecLengths[name] = property.value.length;
                    return 'uniform vec' + property.value.length + ' ' + name + ';\n';
            }
            // TODO: implement matrices.
        }
        return '';
    }
    initShader() {
        let frag = `
    #extension GL_OES_standard_derivatives : enable
    precision highp float;\n`;
        for (const name in this.css.__properties) {
            const property = this.css.__protoProperties[name];
            frag += this.initPropertyUniform(name, property);
        }
        frag += '\n';
        for (const prop in this.__properties) {
            const name = 'u' + prop.charAt(0).toUpperCase() + prop.slice(1);
            const property = this.__protoProperties[prop];
            frag += this.initPropertyUniform(name, property);
        }
        for (let i = this.__protochain.constructors.length; i--;) {
            const constructor = this.__protochain.constructors[i];
            const glUtilsProp = Object.getOwnPropertyDescriptor(constructor, 'GlUtils');
            if (glUtilsProp && glUtilsProp.get) {
                frag += constructor.GlUtils;
            }
        }
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, this.constructor.Vert);
        gl.compileShader(vertShader);
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            gl.getShaderInfoLog(vertShader);
        }
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, frag + this.constructor.Frag);
        gl.compileShader(fragShader);
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            gl.getShaderInfoLog(fragShader);
        }
        const program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        return program;
    }
    constructor(properties = {}) {
        super(properties);
        this.css = IoThemeSingleton;
        // TODO: improve code clarity
        this._vecLengths = {};
        for (const name in this.css.__properties) {
            const property = this.css.__protoProperties[name];
            if (property.notify && property.type === Array) {
                this._vecLengths[name] = property.value.length;
            }
        }
        for (const prop in this.__properties) {
            const name = 'u' + prop.charAt(0).toUpperCase() + prop.slice(1);
            const property = this.__protoProperties[prop];
            if (property.notify && property.type === Array) {
                this._vecLengths[name] = property.value.length;
            }
        }
        if (shadersCache.has(this.constructor)) {
            this._shader = shadersCache.get(this.constructor);
        }
        else {
            this._shader = this.initShader();
            shadersCache.set(this.constructor, this._shader);
        }
        gl.linkProgram(this._shader);
        const position = gl.getAttribLocation(this._shader, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(position);
        const uv = gl.getAttribLocation(this._shader, 'uv');
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
        gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(uv);
        this.render = this.render.bind(this);
        // this.template([['img', {id: 'canvas'}]]);
        // this.$.canvas.onload = () => { this.$.canvas.loading = false; };
        this.template([['canvas', { id: 'canvas', class: 'io-gl-canvas' }]]);
        this.$.canvas.ctx = this.$.canvas.getContext('2d');
        this.updateCssUniforms();
    }
    onResized() {
        // TODO: consider optimizing
        const pxRatio = window.devicePixelRatio;
        const rect = this.getBoundingClientRect();
        const style = window.getComputedStyle(this);
        const bw = parseInt(style.borderRightWidth) + parseInt(style.borderLeftWidth);
        const bh = parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
        // TODO: confirm and test
        const width = Math.max(0, Math.floor(rect.width - bw));
        const height = Math.max(0, Math.floor(rect.height - bh));
        const hasResized = (width !== this.size[0] || height !== this.size[1] || pxRatio !== this.pxRatio);
        if (hasResized) {
            this.$.canvas.style.width = Math.floor(width) + 'px';
            this.$.canvas.style.height = Math.floor(height) + 'px';
            this.$.canvas.width = Math.floor(width * pxRatio);
            this.$.canvas.height = Math.floor(height * pxRatio);
            this.setProperties({
                size: [width, height],
                pxRatio: pxRatio,
            });
        }
    }
    cssMutated() {
        this.updateCssUniforms();
        this.requestAnimationFrameOnce(this.render);
    }
    changed() {
        // TODO: unhack when ResizeObserver is available in Safari
        if (!window.ResizeObserver) {
            setTimeout(() => {
                this.onResized();
                this.requestAnimationFrameOnce(this.render);
            });
        }
        else {
            this.requestAnimationFrameOnce(this.render);
        }
    }
    render() {
        const width = this.size[0] * this.pxRatio;
        const height = this.size[1] * this.pxRatio;
        if (!width || !height)
            return;
        this.setShaderProgram();
        // TODO: dont brute-force uniform update.
        for (const p in this.__properties) {
            const name = 'u' + p.charAt(0).toUpperCase() + p.slice(1);
            this.updatePropertyUniform(name, this.__properties[p]);
        }
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        // gl.clearColor(0, 0, 0, 1);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        // this.$.canvas.src = canvas.toDataURL('image/png', 0.9);
        // this.$.canvas.loading = true;
        // this.$.canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.$.canvas.ctx.drawImage(canvas, 0, 0);
    }
    setShaderProgram() {
        if (currentProgram !== this._shader) {
            currentProgram = this._shader;
            gl.useProgram(this._shader);
        }
    }
    updatePropertyUniform(name, property) {
        this.setShaderProgram();
        if (property.notify) {
            this.setUniform(name, property.type, property.value);
        }
    }
    updateCssUniforms() {
        for (const name in this.css.__properties) {
            this.updatePropertyUniform(name, this.css.__properties[name]);
        }
    }
    setUniform(name, type, value) {
        const uniform = gl.getUniformLocation(this._shader, name);
        let _c;
        switch (type) {
            case Boolean:
                gl.uniform1i(uniform, value ? 1 : 0);
                break;
            case Number:
                gl.uniform1f(uniform, value !== undefined ? value : 1);
                break;
            case Array:
                _c = [0, 1, 2, 3];
                if (!(value instanceof Array) && typeof value === 'object') {
                    if (value.x !== undefined)
                        _c = ['x', 'y', 'z', 'w'];
                    else if (value.r !== undefined)
                        _c = ['r', 'g', 'b', 'a'];
                    else if (value.h !== undefined)
                        _c = ['h', 's', 'v', 'a'];
                    else if (value.c !== undefined)
                        _c = ['c', 'm', 'y', 'k'];
                }
                switch (this._vecLengths[name]) {
                    case 2:
                        if (value === undefined) {
                            gl.uniform2f(uniform, 0, 0);
                            break;
                        }
                        gl.uniform2f(uniform, value[_c[0]] !== undefined ? value[_c[0]] : 1, value[_c[1]] !== undefined ? value[_c[1]] : 1);
                        break;
                    case 3:
                        if (value === undefined) {
                            gl.uniform3f(uniform, 0, 0, 0);
                            break;
                        }
                        gl.uniform3f(uniform, value[_c[0]] !== undefined ? value[_c[0]] : 1, value[_c[1]] !== undefined ? value[_c[1]] : 1, value[_c[2]] !== undefined ? value[_c[2]] : 1);
                        break;
                    case 4:
                        if (value === undefined) {
                            gl.uniform4f(uniform, 0, 0, 0, 0);
                            break;
                        }
                        gl.uniform4f(uniform, value[_c[0]] !== undefined ? value[_c[0]] : 1, value[_c[1]] !== undefined ? value[_c[1]] : 1, value[_c[2]] !== undefined ? value[_c[2]] : 1, value[_c[3]] !== undefined ? value[_c[3]] : 1);
                        break;
                }
                break;
        }
    }
}
RegisterIoElement(IoGl);

class Gl {
    element;
    constructor() {
        this.element = new IoGl();
        this.element.style.visibility = 'hidden';
        this.element.style.position = 'fixed';
        document.body.appendChild(this.element);
    }
    reset() {
        this.element.size = [0, 0];
        this.element.color = [0, 0, 0, 0];
        this.element.pxRatio = 1;
    }
    run() {
        describe('IoGl', () => {
            describe('canvas', () => {
                it('has canvas', () => {
                    chai.expect(this.element.children[0].localName).to.equal('canvas');
                    chai.expect(this.element.$.canvas.localName).to.equal('canvas');
                });
            });
            describe('theme', () => {
                it('has theme singleton variables', () => {
                    chai.expect(this.element.css).to.equal(IoThemeSingleton);
                });
            });
            describe('size', () => {
                it('has correct size and pxRatio', () => {
                    this.element.style.border = 'none';
                    this.element.style.width = '32px';
                    this.element.style.height = '32px';
                    this.element.onResized();
                    chai.expect(this.element.size[0]).to.equal(32);
                    chai.expect(this.element.size[1]).to.equal(32);
                    chai.expect(this.element.pxRatio).to.equal(window.devicePixelRatio);
                });
            });
            // TODO: test color values, uniforms, rAF throttling.
        });
    }
}

/*
 * Extends `IoItem`.
 *
 * Button element. When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 *
 * <io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>
 **/
class IoButton extends IoItem {
    static get Style() {
        return /* css */ `
    :host {
      text-align: center;
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
    }
    :host[pressed] {
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
    }
    `;
    }
    static get Properties() {
        return {
            action: null,
            value: undefined,
            pressed: {
                type: Boolean,
                reflect: 1,
            },
            label: 'Button',
            icon: '',
            role: 'button',
        };
    }
    _onPointerdown(event) {
        super._onPointerdown(event);
        this.pressed = true;
    }
    _onPointerleave(event) {
        super._onPointerleave(event);
        this.pressed = false;
    }
    _onPointerup(event) {
        super._onPointerup(event);
        this.pressed = false;
    }
    _onKeydown(event) {
        super._onKeydown(event);
        if (event.key === 'Enter' || event.key === ' ') {
            this.pressed = true;
        }
    }
    _onKeyup(event) {
        super._onKeyup(event);
        this.pressed = false;
    }
    _onClick() {
        super._onClick();
        if (typeof this.action === 'function')
            this.action(this.value);
    }
}
RegisterIoElement(IoButton);

class Button {
    element = new IoButton();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoButton', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(undefined);
                    chai.expect(this.element.label).to.equal('Button');
                    chai.expect(this.element.action).to.equal(null);
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.element.value = false;
                    chai.expect(this.element.innerText).to.equal('Button');
                    this.element.label = 'click me';
                    chai.expect(this.element.innerText).to.equal('click me');
                    this.element.value = undefined;
                    this.element.label = 'Button';
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('button');
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Button');
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('click here');
                    this.element.label = 'Button';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Button');
                });
                it('has title attribute', () => {
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('title')).to.equal('click here');
                    this.element.label = 'Button';
                });
            });
        });
    }
}

/*
 * Extends `IoButton`.
 *
 * Input element for `Boolean` data type displayed as text. It can be configured to display custom `true` or `false` string depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/
class IoBoolean extends IoItem {
    static get Style() {
        return /* css */ `
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `;
    }
    static get Properties() {
        return {
            label: 'Boolean',
            value: {
                type: Boolean,
                reflect: 1,
            },
            true: 'true',
            false: 'false',
            role: 'switch',
        };
    }
    _onClick() {
        this.toggle();
    }
    toggle() {
        this.set('value', !this.value);
    }
    valueChanged() {
        this.setAttribute('value', Boolean(this.value));
    }
    changed() {
        this.title = this.label;
        this.textNode = this.value ? this.true : this.false;
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-checked', String(!!this.value));
        this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    }
}
RegisterIoElement(IoBoolean);

class Boolean$1 {
    element = new IoBoolean();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoBoolean', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(false);
                    chai.expect(this.element.true).to.equal('true');
                    chai.expect(this.element.false).to.equal('false');
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.element.value = false;
                    chai.expect(this.element.innerText).to.equal(this.element.false);
                    this.element.toggle();
                    chai.expect(this.element.innerText).to.equal(this.element.true);
                    this.element.true = 'yes';
                    this.element.false = 'no';
                    chai.expect(this.element.textContent).to.equal('yes');
                    this.element.toggle();
                    chai.expect(this.element.textContent).to.equal('no');
                    this.element.value = false;
                    this.element.true = 'true';
                    this.element.false = 'false';
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('switch');
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('click here');
                    this.element.label = 'Boolean';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                });
                it('has value attribute when value is true', () => {
                    this.element.value = false;
                    chai.expect(this.element.hasAttribute('value')).to.equal(false);
                    chai.expect(this.element.getAttribute('value')).to.equal(null);
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('false');
                    this.element.value = true;
                    chai.expect(this.element.hasAttribute('value')).to.equal(true);
                    chai.expect(this.element.getAttribute('value')).to.equal('');
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('true');
                });
                it('has title attribute', () => {
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('title')).to.equal('click here');
                    this.element.label = 'Button';
                });
            });
        });
    }
}

const IoIconsetDB = {};
/*
 * Extends `IoNode`.
 *
 * Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace` and `id` attribute.
 *
 * ```javascript
 * import {IoIconsetSingleton} from "./path_to/iogui.js";
 * const svgString = `<svg><g id="myicon"><path d="..."/></g></svg>`;
 *
 * // register icons under "custom" namespace
 * IoIconsetSingleton.registerIcons('custom', svgString);
 * // retrieve specific icon
 * const icon = IoIconsetSingleton.getIcon('custom:myicon');
 * ```
 **/
class IoIconset extends IoNode {
    registerIcons(name, svg) {
        const stagingElement = document.createElement('div');
        stagingElement.innerHTML = svg;
        stagingElement.querySelectorAll('[id]').forEach(icon => {
            IoIconsetDB[name] = IoIconsetDB[name] || {};
            IoIconsetDB[name][icon.id] = icon.outerHTML;
        });
    }
    getIcon(icon) {
        const iconset = IoIconsetDB[icon.split(':')[0]];
        if (iconset) {
            const id = icon.split(':')[1];
            if (iconset[id]) {
                const group = iconset[id].replace(' id="', ' class="icon-id-');
                return `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">${group}</svg>`;
            }
        }
        return '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"></svg>';
    }
}
RegisterIoNode(IoIconset);
const IoIconsetSingleton = new IoIconset();
const icons = /* html */ `
<svg><g id="io"><ellipse fill="#83A61E" cx="5.4" cy="12.1" rx="3.4" ry="3.4"/><path fill="#646464" d="M16.3,17.7c-3.1,0-5.6-2.6-5.6-5.6s2.6-5.6,5.6-5.6s5.6,2.6,5.6,5.6S19.3,17.7,16.3,17.7z M16.3,8.8c-1.8,0-3.3,1.5-3.3,3.2s1.5,3.2,3.3,3.2s3.3-1.5,3.3-3.2S18.1,8.8,16.3,8.8z"/></g><g id="io_logo"><path fill="#646464" d="M19.5,12.7c0.3-0.3,0.3-0.9,0-1.2l-0.7-0.7l-2.6-2.6c-0.3-0.3-0.3-0.9,0-1.2c0.3-0.3,0.9-0.3,1.2,0l3.8,3.8c0.7,0.7,0.7,1.8,0,2.6l-3.8,3.8c-0.3,0.3-0.9,0.3-1.2,0c-0.3-0.3-0.3-0.9,0-1.2"/><path fill="#646464" d="M4.3,12.7c-0.3-0.3-0.3-0.9,0-1.2L5,10.8l2.6-2.6c0.3-0.3,0.3-0.9,0-1.2C7.3,6.7,6.7,6.7,6.4,7l-3.8,3.8c-0.7,0.7-0.7,1.8,0,2.6l3.8,3.8c0.3,0.3,0.9,0.3,1.2,0s0.3-0.9,0-1.2"/><ellipse fill="#83A61E" cx="8.4" cy="12.1" rx="1.7" ry="1.7"/><path fill="#646464" d="M13.9,14.9c-1.6,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S15.4,14.9,13.9,14.9z M13.9,10.4c-0.9,0-1.7,0.7-1.7,1.7c0,0.9,0.7,1.7,1.7,1.7c0.9,0,1.7-0.7,1.7-1.7C15.5,11.2,14.8,10.4,13.9,10.4z"/></g><g <g id="unlink"><path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M17,7h-4.1v1.9H17c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/></g><g id="link"><path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M8,13h8.1v-2H8V13z M17,7h-4.1v1.9H17c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/></g><g id="gear"><path d="M21.3,14.6L19.2,13c0-0.3,0.1-0.6,0.1-1c0-0.3,0-0.6-0.1-1l2.1-1.7c0.2-0.2,0.2-0.4,0.1-0.6l-1.9-3.4c-0.1-0.2-0.3-0.2-0.6-0.2l-2.4,1c-0.5-0.3-1.1-0.7-1.7-1l-0.3-2.7c0-0.2-0.2-0.4-0.4-0.4h-4C9.8,2.3,9.5,2.4,9.5,2.7L9.1,5.3C8.5,5.5,8,5.8,7.5,6.3l-2.4-1c-0.2-0.1-0.5,0-0.7,0.2L2.5,8.8C2.4,9.1,2.4,9.3,2.6,9.5l2.1,1.7c0,0.3-0.1,0.6-0.1,1s0,0.6,0.1,1l-2.1,1.7c-0.2,0.2-0.2,0.4-0.1,0.6l1.9,3.4C4.5,19,4.7,19,5,19l2.4-1c0.5,0.4,1.1,0.7,1.7,1l0.4,2.7c0,0.2,0.3,0.4,0.6,0.4H14c0.2,0,0.4-0.2,0.5-0.4l0.3-2.7c0.6-0.2,1.2-0.5,1.7-1l2.4,1c0.2,0.1,0.4,0,0.6-0.2l1.9-3.4C21.6,15.1,21.5,14.8,21.3,14.6z M11.9,15.6c-2,0-3.7-1.7-3.7-3.7s1.7-3.6,3.7-3.6s3.7,1.7,3.7,3.7S13.9,15.6,11.9,15.6z"/></g><g id="less"><path d="M6.6,20.3L8.3,22l3.7-4l3.7,4l1.7-1.7l-5.3-5.7L6.6,20.3z M17.3,3.8l-1.7-1.7l-3.7,4l-3.7-4L6.6,3.8l5.3,5.7L17.3,3.8z"/></g><g id="more"><path d="M11.9,5.3l3.7,3.5l1.7-1.6L12,2.1L6.6,7.2l1.7,1.6L11.9,5.3z M11.9,18.9l-3.7-3.5L6.6,17l5.3,5.1l5.3-5.1l-1.7-1.6L11.9,18.9z"/></g><g id="code"><path d="M9.4,16.6L4.8,12l4.6-4.6L8,6.1l-6,6l6,6L9.4,16.6z M14.5,16.6l4.6-4.6l-4.6-4.6L15.9,6l6,6l-6,6L14.5,16.6z"/></g><g id="tune"><path d="M2,17.6v2.2h6.6v-2.2H2z M2,4.3v2.2h11V4.3H2z M13,22v-2.2h8.9v-2.2H13v-2.2h-2.2V22H13z M6.4,8.7V11H2v2.2h4.4v2.2h2.2V8.7H6.4z M21.9,13.1v-2.2h-11v2.2H21.9z M15.3,8.7h2.2V6.5h4.4V4.3h-4.4V2.1h-2.2V8.7z"/></g><g id="unlock"><path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8H9c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M17.6,20.1H6.4v-9.5h11.2V20.1z"/></g><g id="lock"><path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M9,6.8c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H9V6.8z M17.6,20.1H6.4v-9.5h11.2V20.1z"/></g><g id="more_horizontal"><path d="M4.5,9.6C3.1,9.6,2,10.7,2,12.1s1.1,2.5,2.5,2.5S7,13.5,7,12.1S5.9,9.6,4.5,9.6z M19.4,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S20.8,9.6,19.4,9.6z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.6,11.9,9.6z"/></g><g id="more_vertical"><path d="M11.9,7.1c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5S9.5,3.2,9.5,4.6S10.5,7.1,11.9,7.1z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.6,11.9,9.6z M11.9,17.1c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,17.1,11.9,17.1z"/></g><g id="chevron_left"><path d="M18.1,4.4l-2.3-2.3l-10,10l10,10l2.3-2.3l-7.6-7.6L18.1,4.4z"/></g><g id="chevron_up"><path d="M11.9,5.9l-10,10l2.3,2.3l7.6-7.6l7.6,7.6l2.3-2.3L11.9,5.9z"/></g><g id="chevron_down"><path d="M4.3,5.9l7.6,7.6l7.6-7.6l2.3,2.3l-10,10L2,8.2L4.3,5.9z"/></g><g id="chevron_right"><path d="M5.8,19.7l7.6-7.6L5.8,4.4l2.3-2.3l10,10l-10,10L5.8,19.7z"/></g><g id="arrow_left"><path d="M21.9,10.8H6.7l7-7L12,2.1l-10,10l10,10l1.7-1.7l-7-7h15.2V10.8z"/></g><g id="arrow_down"><path d="M21.9,12.1l-1.7-1.7l-7,7V2.1h-2.5v15.2l-7-7L2,12.1l10,10L21.9,12.1z"/></g><g id="arrow_up"><path d="M2,12.1l1.7,1.7l7-7V22h2.5V6.8l7,7l1.7-1.7l-10-10L2,12.1z"/></g><g id="arrow_right"><path d="M2,13.3h15.2l-7,7l1.7,1.7l10-10l-10-10l-1.7,1.7l7,7H2V13.3z"/></g><g id="arrow_end"><polygon points="7.6,3.8 14.6,10.8 2,10.8 2,13.3 14.6,13.3 7.6,20.3 9.4,22 19.3,12.1 9.4,2.1 "/><rect x="19.4" y="2.1" width="2.5" height="19.9"/></g><g id="arrow_home"><polygon points="16.3,20.3 9.3,13.3 21.9,13.3 21.9,10.8 9.3,10.8 16.3,3.8 14.5,2.1 4.6,12.1 14.5,22 "/><rect x="2" y="2.1" width="2.5" height="19.9"/></g><g id="chevron_end"><path d="M2,4.4L9.6,12L2,19.7L4.3,22l10-10L4.3,2L2,4.4z M18.6,2.1h3.3V22h-3.3V2.1z"/></g><g id="chevron_home"><path d="M21.9,19.7l-7.6-7.6l7.6-7.6l-2.3-2.3l-10,10l10,10L21.9,19.7z M5.3,22H2V2.1h3.3V22z"/></g><g id="check"><path d="M8.3,16.5l-4.7-4.7L2,13.3l6.3,6.3L21.9,6.1l-1.6-1.6L8.3,16.5z"/></g><g id="close"><path d="M21.9,4.1l-2-2l-8,8l-8-8l-2,2l8,8l-8,8l2,2l8-8l8,8l2-2l-8-8L21.9,4.1z"/></g><g id="circle"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_minus"><path d="M7,11.1v2h10v-2C16.9,11.1,7,11.1,7,11.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_plus"><path d="M12.9,7.1h-2v4H7v2h4v4h2v-4h4v-2h-4v-4H12.9z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_close"><path d="M14.5,8.1l-2.6,2.6L9.4,8.1L8,9.5l2.6,2.6L8,14.6L9.4,16l2.6-2.6l2.6,2.6l1.4-1.4L13.4,12L16,9.4L14.5,8.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_triangle_right"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/><polygon points="10,16.6 15.9,12.1 10,7.6 "/></g><g id="circle_triangle_down"><path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M4,12.1c0-4.4,3.6-8,8-8s8,3.6,8,8s-3.6,8-8,8S4,16.5,4,12.1z"/><polygon points="7.5,10.1 11.9,16.1 16.4,10.1 "/></g><g id="circle_triangle_left"><path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M11.9,4.1c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S7.5,4.1,11.9,4.1z"/><polygon points="13.9,7.6 8,12.1 13.9,16.6 "/></g><g id="circle_triangle_up"><path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M19.9,12.1c0,4.4-3.6,8-8,8s-8-3.6-8-8s3.6-8,8-8S19.9,7.7,19.9,12.1z"/><polygon points="16.4,14.1 11.9,8.1 7.5,14.1 "/></g><g id="triangle_right"><polygon points="9.1,16.5 14.9,12 9.1,7.5 "/></g><g id="triangle_down"><polygon points="7.6,9 11.9,15 16.5,9 "/></g><g id="triangle_left"><polygon points="14.9,7.5 9.1,12 14.9,16.5 "/></g><g id="triangle_up"><polygon points="16.5,15 11.9,9 7.6,15 "/></g><g id="circle_pause"><path d="M9,16.1h2v-8H9V16.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M12.9,16.1h2v-8h-2V16.1z"/></g><g id="circle_info"><path d="M11,17.1h2v-6h-2V17.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11,9.1h2v-2h-2C11,7.1,11,9.1,11,9.1z"/></g><g id="circle_warning"><path d="M11,15.1h2v2h-2V15.1z M11,7.1h2v6h-2V7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_help"><path d="M11,18h2v-2h-2C11,16.1,11,18,11,18z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11.9,6.1c-2.2,0-4,1.8-4,4h2c0-1.1,0.9-2,2-2s2,0.9,2,2c0,2-3,1.8-3,5h2c0-2.3,3-2.5,3-5C15.9,7.9,14.1,6.1,11.9,6.1z"/></g><g id="circle_checked"><path d="M11.9,7.1c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S14.8,7.1,11.9,7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/></g><g id="circle_location"><path d="M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3S15.5,18.4,11.9,18.4z"/></g><g id="circle_location_checked"><path d="M11.9,8.4c-2,0-3.7,1.7-3.7,3.7s1.7,3.7,3.7,3.7s3.7-1.7,3.7-3.7S13.9,8.4,11.9,8.4z M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3S15.5,18.4,11.9,18.4z"/></g><g id="circle_fill"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z"/></g><g id="circle_fill_checked"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,17.1l-5-5l1.4-1.4l3.6,3.6l7.6-7.6L19,8.1L10,17.1z"/></g><g id="circle_fill_minus"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1H7v-2h10v2H16.9z"/></g><g id="circle_fill_plus"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1h-4v4h-2v-4H7v-2h4v-4h2v4h4v2H16.9z"/></g><g id="circle_fill_arrow_down"><path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M7.5,10.1h9l-4.5,6L7.5,10.1z"/></g><g id="circle_fill_arrow_left"><path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M13.9,7.6v9l-6-4.5L13.9,7.6z"/></g><g id="circle_fill_arrow_up"><path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M16.4,14.1h-9l4.5-6L16.4,14.1z"/></g><g id="circle_fill_arrow_right"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,16.6v-9l6,4.5L10,16.6z"/></g><g id="circle_fill_pause"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11,16.1H9v-8h2V16.1z M14.9,16.1h-2v-8h2V16.1z"/></g><g id="circle_fill_info"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-6h2V17.1z M12.9,9.1h-2v-2h2C12.9,7.1,12.9,9.1,12.9,9.1z"/></g><g id="circle_fill_warning"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-2h2V17.1z M12.9,13.1h-2v-6h2C12.9,7.1,12.9,13.1,12.9,13.1z"/></g><g id="circle_fill_help"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,19h-2v-2h2C12.9,17.1,12.9,19,12.9,19z M15,11.4l-0.9,0.9c-0.8,0.7-1.2,1.3-1.2,2.8h-2v-0.6c0-1.1,0.4-2.1,1.2-2.8l1.2-1.3c0.4-0.3,0.6-0.8,0.6-1.4C14,8,13.1,7.1,12,7.1s-2,0.9-2,2H8c0-2.2,1.8-4,4-4s4,1.8,4,4C15.9,10,15.5,10.7,15,11.4z"/></g><g id="circle_fill_group"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M8,17.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S9.4,17.5,8,17.5z M9.5,8.1c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5S9.5,9.5,9.5,8.1z M15.9,17.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S17.3,17.5,15.9,17.5z"/></g><g id="box"><path d="M19.7,4.3v15.5H4.2V4.3H19.7 M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z"/></g><g id="box_fill"><path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z"/></g><g id="box_fill_checked"><path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M9.8,17.6l-5.5-5.5l1.6-1.6l4,4l8.3-8.4l1.6,1.5L9.8,17.6z"/></g><g id="box_fill_minus"><path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.5,13.1H6.4v-2.2h11L17.5,13.1L17.5,13.1z"/></g><path id="box_fill_plus" d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.5,13.1h-4.4v4.4h-2.2v-4.4H6.4v-2.2h4.4V6.5H13v4.4h4.4L17.5,13.1L17.5,13.1z"/><g id="box_fill_gear"><path d="M11.9,9.8c-1.2,0-2.2,1-2.2,2.2s1,2.2,2.2,2.2s2.2-1,2.2-2.2S13.2,9.8,11.9,9.8z M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.8,12.1c0,0.2,0,0.5-0.1,0.7l1.7,1.2c0.2,0.1,0.2,0.3,0.1,0.5l-1.6,2.7c-0.1,0.2-0.3,0.2-0.5,0.2l-1.9-0.7c-0.4,0.3-0.8,0.6-1.3,0.7L14,19.5c0,0.2-0.2,0.3-0.4,0.3h-3.1c-0.2,0-0.3-0.2-0.4-0.3l-0.2-2.1C9.4,17.2,9,17,8.6,16.7l-1.9,0.7c-0.2,0.1-0.4,0-0.5-0.2l-1.5-2.7c-0.1-0.2-0.1-0.4,0.1-0.5l1.7-1.2c-0.1-0.2-0.1-0.5-0.1-0.7s0-0.5,0.1-0.7l-1.7-1.2C4.4,9.9,4.4,9.7,4.5,9.6l1.6-2.7c0.1-0.2,0.2-0.3,0.4-0.2l1.9,0.7c0.4-0.3,0.8-0.6,1.3-0.7L10,4.6c0-0.2,0.2-0.3,0.4-0.3h3.1c0.2,0,0.3,0.2,0.4,0.3l0.2,2.1c0.5,0.2,0.9,0.4,1.3,0.7l1.9-0.7c0.2-0.1,0.4,0,0.5,0.2l1.6,2.7c0.1,0.2,0.1,0.4-0.1,0.5l-1.7,1.2C17.8,11.6,17.8,11.8,17.8,12.1z"/></g><g id="box_focus"><path d="M4.2,15.4H2v4.4C2,21,3,22,4.2,22h4.4v-2.2H4.2V15.4z M4.2,4.3h4.4V2.1H4.2C3,2.1,2,3.1,2,4.3v4.4h2.2V4.3z M19.7,2.1h-4.4v2.2h4.4v4.4h2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M19.7,19.8h-4.4V22h4.4c1.2,0,2.2-1,2.2-2.2v-4.4h-2.2V19.8z M11.9,7.7c-2.4,0-4.4,2-4.4,4.4s2,4.4,4.4,4.4s4.4-2,4.4-4.4S14.4,7.7,11.9,7.7z M11.9,14.3c-1.2,0-2.2-1-2.2-2.2s1-2.2,2.2-2.2s2.2,1,2.2,2.2S13.2,14.3,11.9,14.3z"/></g><g id="rows"><path d="M20.8,13.1H3.1c-0.6,0-1.1,0.5-1.1,1.1v6.6C2,21.5,2.5,22,3.1,22H21c0.6,0,1.1-0.5,1.1-1.1v-6.6C21.9,13.6,21.4,13.1,20.8,13.1z M20.8,2.1H3.1C2.5,2.1,2,2.6,2,3.2v6.6c0,0.6,0.5,1.1,1.1,1.1H21c0.6,0,1.1-0.5,1.1-1.1V3.2C21.9,2.6,21.4,2.1,20.8,2.1z"/></g><g id="columns"><path d="M6.2,2.1H3.1C2.5,2.1,2,2.8,2,3.5v17.1C2,21.4,2.5,22,3.1,22h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C7.2,2.8,6.7,2.1,6.2,2.1z M20.8,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C21.9,2.8,21.4,2.1,20.8,2.1z M13.5,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C14.6,2.8,14.1,2.1,13.5,2.1z"/></g><g id="dashboard"><path d="M2,13.1h8.9v-11H2V13.1z M2,22h8.9v-6.6H2V22z M13,22h8.9V11H13V22z M13,2.1v6.6h8.9V2.1H13z"/></g><g id="layer_add"><path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12C21.9,3,21,2.1,19.9,2.1z M18.9,11.1h-4v4h-2v-4H9v-2h4v-4h2v4h4C18.9,9.1,18.9,11.1,18.9,11.1z"/></g><g id="layer_remove"><path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z"/><path d="M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12C21.9,3,21,2.1,19.9,2.1z M18.9,11.1H9v-2h10v2H18.9z"/></g><g id="layer_to_back"><path d="M8.6,6.5H6.4v2.2h2.2V6.5L8.6,6.5z M8.6,11H6.4v2.2h2.2V11C8.5,11,8.6,11,8.6,11z M8.6,2.1c-1.2,0-2.2,1-2.2,2.2h2.2V2.1L8.6,2.1z M13,15.4h-2.2v2.2H13C13,17.5,13,15.4,13,15.4z M19.8,2.1v2.2H22C21.9,3.1,20.9,2.1,19.8,2.1z M13,2.1h-2.2v2.2H13V2.1z M8.6,17.6v-2.2H6.4C6.4,16.6,7.4,17.6,8.6,17.6z M19.8,13.1H22V11h-2.2V13.1z M19.8,8.7H22V6.5h-2.2V8.7z M19.8,17.6c1.2,0,2.2-1,2.2-2.2h-2.2V17.6z M4.1,6.5H2v13.3C2,21,3,22,4.1,22h13.3v-2.2H4.1C4.1,19.9,4.1,6.5,4.1,6.5z M15.3,4.3h2.2V2.1h-2.2V4.3z M15.3,17.6h2.2v-2.2h-2.2V17.6z"/></g><g id="layer_to_front"><path d="M2,13.1h2.2V11H2V13.1z M2,17.6h2.2v-2.2H2V17.6z M4.1,22v-2.2H2C2,21,3,22,4.1,22z M2,8.7h2.2V6.5H2V8.7z M15.3,22h2.2v-2.2h-2.2V22z M19.8,2.1H8.6c-1.2,0-2.2,1-2.2,2.2v11.1c0,1.2,1,2.2,2.2,2.2h11c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.8,2.1z M19.8,15.4H8.6V4.3h11L19.8,15.4L19.8,15.4z M10.9,22H13v-2.2h-2.2C10.9,19.9,10.9,22,10.9,22z M6.4,22h2.2v-2.2H6.4V22z"/></g><g id="layer_image"><path d="M21.9,16.1v-12c0-1.1-0.9-2-2-2H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12C21,18,21.9,17.1,21.9,16.1z M11,12.1l2,2.7l3-3.7l4,5H8L11,12.1z M2,6.1v14c0,1.1,0.9,2,2,2h14v-2H4v-14C4,6.1,2,6.1,2,6.1z"/></g><g id="image"><path d="M21.9,19.8V4.3c0-1.2-1-2.2-2.2-2.2H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5C20.9,22,21.9,21,21.9,19.8z M8,13.7l2.7,3.3l3.9-5l5,6.6H4.2L8,13.7z"/></g><g id="label_fill"><path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.8,2,5.7,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.4L17.3,5.6z"/></g><g id="label"><path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.7,2,5.6,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.3L17.3,5.6z M15.6,17.3H4.1V6.8h11.5l3.7,5.2L15.6,17.3z"/></g><g id="backspace"><path d="M20.3,4.8H7.8c-0.6,0-1,0.2-1.3,0.7L2,12.1l4.5,6.6c0.3,0.4,0.7,0.7,1.3,0.7h12.5c0.9,0,1.7-0.7,1.7-1.7V6.3C21.9,5.4,21.2,4.8,20.3,4.8z M17.8,15l-1.2,1.2l-3-2.9l-3,2.9L9.5,15l3-2.9l-3-2.9L10.6,8l3,2.9l3-2.9l1.2,1.2l-3,2.9L17.8,15z"/></g><g id="redo"><path d="M18.3,11.2c-1.8-1.6-4.2-2.6-6.7-2.6c-4.6,0-8.3,3-9.7,7.1l2.2,0.7c1-3.1,4-5.3,7.4-5.3c1.9,0,3.7,0.7,5,1.8l-3.6,3.6h9V7.7L18.3,11.2z"/></g><g id="undo"><path d="M12.2,8.6c-2.6,0-4.9,1-6.7,2.6L2,7.7v8.8h8.8L7.2,13c1.3-1.2,3.1-1.8,5-1.8c3.4,0,6.3,2.2,7.4,5.3l2.2-0.8C20.6,11.6,16.8,8.6,12.2,8.6z"/></g><g id="reload"><path d="M19,5c-1.8-1.7-4.3-2.9-7.1-2.9c-5.5,0-10,4.5-10,10s4.5,10,10,10c4.7,0,8.6-3.2,9.6-7.5H19c-1,2.9-3.8,5-7.1,5c-4.2,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5c2.1,0,3.9,0.8,5.2,2.2l-4,4h8.7V2.1L19,5z"/></g><g id="grid_fill"><path d="M4,8.1h4v-4H4V8.1z M10,20h4v-4h-4V20z M4,20h4v-4H4V20z M4,14.1h4v-4H4V14.1z M10,14.1h4v-4h-4V14.1z M15.9,4.1v4h4v-4C19.9,4.1,15.9,4.1,15.9,4.1z M10,8.1h4v-4h-4V8.1z M15.9,14.1h4v-4h-4V14.1z M15.9,20h4v-4h-4V20z"/></g><g id="grid"><path d="M19.9,2.1H4c-1.1,0-2,0.9-2,2V20c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2V4.1C21.9,3,21,2.1,19.9,2.1z M8,20H4v-4h4C8,16.1,8,20,8,20z M8,14.1H4v-4h4V14.1z M8,8.1H4v-4h4C8,4.1,8,8.1,8,8.1z M13.9,20h-4v-4h4C13.9,16.1,13.9,20,13.9,20z M13.9,14.1h-4v-4h4V14.1z M13.9,8.1h-4v-4h4C13.9,4.1,13.9,8.1,13.9,8.1z M19.9,20h-4v-4h4C19.9,16.1,19.9,20,19.9,20z M19.9,14.1h-4v-4h4V14.1z M19.9,8.1h-4v-4h4C19.9,4.1,19.9,8.1,19.9,8.1z"/></g><g id="search"><path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-2.9,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1S12.2,14.6,9.5,14.6z"/></g><g id="zoom_in"><path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1S12.2,14.6,9.5,14.6z M12.2,10.1H10v2.2H8.9v-2.2H6.6V9h2.2V6.8H10V9h2.2V10.1L12.2,10.1z"/></g><g id="zoom_out"><path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1S12.2,14.6,9.5,14.6z M6.6,9h5.6v1.2H6.6V9z"/></g><g id="fullscreen"><path d="M4.8,14.9H2V22h7.1v-2.8H4.8V14.9z M2,9.2h2.8V4.9H9V2.1H2V9.2z M19.1,19.2h-4.2V22H22v-7.1h-2.8v4.3H19.1z M14.8,2.1v2.8H19v4.2h2.9v-7H14.8z"/></g><g id="fullscreen_off"><path d="M2,17.8h4.2V22H9v-7.1H2V17.8z M6.2,6.3H2v2.8h7.1v-7H6.2V6.3z M14.8,22h2.8v-4.2h4.3V15h-7.1C14.8,15,14.8,22,14.8,22z M17.7,6.3V2.1h-2.8v7.1H22V6.3H17.7z"/></g><g id="color_palette"><path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10c0.9,0,1.7-0.7,1.7-1.7c0-0.4-0.2-0.8-0.4-1.1c-0.2-0.3-0.4-0.7-0.4-1.1c0-0.9,0.7-1.7,1.7-1.7h2c3.1,0,5.6-2.5,5.6-5.6C21.9,6.1,17.4,2.1,11.9,2.1z M5.9,12.1c-0.9,0-1.7-0.7-1.7-1.7S5,8.7,5.9,8.7s1.7,0.7,1.7,1.7S6.8,12.1,5.9,12.1z M9.2,7.7C8.3,7.7,7.5,6.9,7.5,6s0.7-1.7,1.7-1.7S10.9,5,10.9,6S10.1,7.7,9.2,7.7z M14.7,7.7C13.8,7.7,13,6.9,13,6s0.7-1.7,1.7-1.7c0.9,0,1.7,0.7,1.7,1.7S15.6,7.7,14.7,7.7z M18,12.1c-0.9,0-1.7-0.7-1.7-1.7S17,8.7,18,8.7s1.7,0.7,1.7,1.7S18.9,12.1,18,12.1z"/></g><g id="color_picker"><path d="M21.6,5L19,2.4c-0.4-0.4-1.2-0.4-1.6,0l-3.5,3.5l-2.1-2.2l-1.6,1.6l1.6,1.6L2,16.8V22h5.2l9.9-9.9l1.6,1.6l1.6-1.6L18.1,10l3.5-3.5C22,6.2,22,5.4,21.6,5z M6.3,19.8l-2.2-2.2l9-8.9l2.2,2.2L6.3,19.8z"/></g><g id="trash"><path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M19.7,3.2h-3.9l-1.1-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2L19.7,3.2z"/></g><g id="trash_empty"><path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M8,11.9l1.6-1.5l2.3,2.3l2.3-2.3l1.6,1.6l-2.3,2.3l2.3,2.3l-1.6,1.6l-2.3-2.4l-2.3,2.3L8,16.6l2.3-2.3L8,11.9z M15.9,3.2l-1.2-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2H15.9z"/></g><g id="developer"><path d="M21.9,9V6.9h-2v-2c0-1.2-0.9-2.1-2-2.1H4c-1.1,0-2,0.9-2,2.1v14.4c0,1.2,0.9,2.1,2,2.1h13.9c1.1,0,2-0.9,2-2.1v-2.1H22v-2.1h-2V13h2v-2h-2V9H21.9z M17.9,19.2H4V4.9h13.9V19.2L17.9,19.2z M6,13.1h5v4.1H6V13.1z M11.9,6.9h4V10h-4V6.9z M6,6.9h5V12H6V6.9z M11.9,11.1h4v6.1h-4V11.1z"/></g><g id="hub"><path d="M17.5,16.5L13,12.1V8.6c1.3-0.5,2.2-1.7,2.2-3.2c0-1.8-1.5-3.3-3.3-3.3S8.6,3.6,8.6,5.4c0,1.4,0.9,2.7,2.2,3.2v3.5l-4.4,4.4H2V22h5.6v-3.4l4.4-4.7l4.4,4.7V22H22v-5.6h-4.5V16.5z"/></g><g id="camera"><path d="M9.4,10.6l4.7-8.2c-0.7-0.2-1.4-0.2-2.2-0.2C9.5,2.2,7.3,3,5.6,4.4L9.4,10.6L9.4,10.6z M21.4,9.1c-0.9-2.9-3.2-5.2-6-6.3l-3.7,6.3H21.4z M21.8,10.1h-7.5l0.2,0.5l4.7,8.2c1.7-1.7,2.7-4.2,2.7-6.7C21.9,11.4,21.8,10.7,21.8,10.1z M8.5,12.1L4.6,5.3C3,7.1,2,9.5,2,12.1c0,0.7,0.1,1.3,0.2,2h7.5L8.5,12.1z M2.5,15.1c0.9,2.9,3.2,5.2,6,6.3l3.7-6.3C12.2,15.1,2.5,15.1,2.5,15.1z M13.7,15.1l-3.9,6.7C10.5,22,11.2,22,12,22c2.4,0,4.6-0.8,6.3-2.2l-3.7-6.3C14.6,13.5,13.7,15.1,13.7,15.1z"/></g><g id="camera_alt"><circle cx="11.9" cy="13.1" r="3.2"/><path d="M9,3.1l-1.8,2H4c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2v-12c0-1.1-0.9-2-2-2h-3.2l-1.8-2C14.9,3.1,9,3.1,9,3.1z M11.9,18c-2.7,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.7,18,11.9,18z"/></g><g id="film"><path d="M13.9,5.9c0-1.1-0.9-1.9-2-1.9H11V3c0-0.5-0.4-0.9-0.9-0.9H6.2C5.7,2.1,5.3,2.5,5.3,3v0.9H4.4c-1.1,0-1.9,0.8-1.9,1.9V20c0,1.1,0.8,1.9,1.9,1.9H12c1.1,0,1.9-0.8,1.9-1.9h7.6V5.9H13.9z M11.9,18.2H10v-1.9h1.9V18.2z M11.9,9.7H10V7.8h1.9V9.7z M15.8,18.2h-1.9v-1.9h1.9V18.2z M15.8,9.7h-1.9V7.8h1.9V9.7z M19.5,18.2h-1.9v-1.9h1.9V18.2z M19.5,9.7h-1.9V7.8h1.9V9.7z"/></g><g id="visibility"><path d="M12,5.3c-4.5,0-8.3,2.8-9.9,6.7c1.5,3.9,5.4,6.7,9.9,6.7s8.3-2.8,9.9-6.7C20.3,8,16.5,5.3,12,5.3z M12,16.5c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S14.5,16.5,12,16.5z M12,9.2c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7S13.5,9.2,12,9.2z"/></g><g id="visibility_off"><path d="M12,7.4c2.5,0,4.5,2,4.5,4.5c0,0.6-0.1,1.2-0.3,1.7l2.7,2.7c1.3-1.2,2.4-2.6,3.1-4.2c-1.6-4.1-5.4-6.8-9.9-6.8c-1.2,0-2.5,0.2-3.6,0.7l1.9,1.9C10.9,7.5,11.5,7.4,12,7.4z M3.1,4.9l2,2.1l0.4,0.4C4,8.6,2.8,10.2,2.1,11.9c1.6,4,5.4,6.7,9.9,6.7c1.4,0,2.7-0.2,3.9-0.7l0.4,0.4L19,21l1.2-1.2L4.1,3.8L3.1,4.9z M8,9.9l1.4,1.4c-0.1,0.2-0.1,0.4-0.1,0.6c0,1.5,1.2,2.7,2.7,2.7c0.2,0,0.4,0,0.6-0.1L14,16c-0.6,0.3-1.2,0.5-2,0.5c-2.5,0-4.5-2-4.5-4.5C7.5,11.2,7.7,10.5,8,9.9z M11.9,9.2l2.8,2.8v-0.2C14.7,10.4,13.4,9.2,11.9,9.2L11.9,9.2z"/></g><g id="layers"><path d="M11.9,19.5l-7.3-5.7L3,15l8.9,7l9-7l-1.6-1.2L11.9,19.5z M11.9,17l7.3-5.7l1.7-1.2l-9-6.9l-9,7l1.6,1.2L11.9,17z"/></g><g id="layers_off"><path d="M19.7,16l1.2-0.9l-1.4-1.4l-1.2,0.9L19.7,16z M19.3,11.3l1.7-1.2l-9-7L9,5.3l7.8,7.8C16.9,13.1,19.3,11.3,19.3,11.3z M3.3,2.1L2,3.3l4.2,4.2L2.9,10l1.6,1.2l7.3,5.7l2.1-1.6l1.4,1.4L12,19.4l-7.3-5.7l-1.6,1.2l8.9,7l4.9-3.8l3.7,3.7l1.2-1.2L3.3,2.1z"/></g><g id="hamburger"><path d="M20.9,9.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V14c0,0.4,0.5,0.8,1.1,0.8h17.9c0.6,0,1.1-0.3,1.1-0.7V9.9C22,9.4,21.5,9.1,20.9,9.1z M20.9,2.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V7c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7V2.8C22,2.4,21.5,2.1,20.9,2.1z M20.9,16.5H3.2c-0.6,0-1.1,0.3-1.1,0.7v4.2c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7v-4.2C22,16.8,21.5,16.5,20.9,16.5z"/></g></svg>`;
IoIconsetSingleton.registerIcons('icons', icons);

/*
 * Extends `IoBoolean`. Implements `IoIcon`.
 *
 * Input element for `Boolean` data type displayed as icon. It can be configured to display custom `true` or `false` icon depending on its `value`.
 *
 * <io-element-demo element="io-boolicon" properties='{"value": true, "true": "icons:check", "false": "icons:close", "stroke": false}'></io-element-demo>
 **/
class IoBoolicon extends IoBoolean {
    static get Style() {
        return /* css */ `
    :host {
      width: var(--io-item-height);
      height: var(--io-item-height);
      fill: var(--io-color, currentcolor);
      padding: 0;
    }
    :host[stroke] {
      stroke: var(--io-background-color, currentcolor);
      stroke-width: var(--io-stroke-width);
    }
    :host > svg {
      pointer-events: none;
      width: 100%;
      height: 100%;
    }
    :host > svg > g {
      transform-origin: 0px 0px;
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `;
    }
    static get Properties() {
        return {
            true: 'icons:box_fill_checked',
            false: 'icons:box',
            stroke: {
                value: false,
                reflect: 1,
            },
        };
    }
    changed() {
        this.title = this.label;
        this.innerHTML = IoIconsetSingleton.getIcon(this.value ? this.true : this.false);
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-checked', String(!!this.value));
        this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    }
}
RegisterIoElement(IoBoolicon);

class Boolicon {
    element = new IoBoolicon();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoBoolicon', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(false);
                    chai.expect(this.element.true).to.equal('icons:box_fill_checked');
                    chai.expect(this.element.false).to.equal('icons:box');
                });
            });
            describe('innerText', () => {
                it('matches value', () => {
                    chai.expect(this.element.innerHTML).to.equal(IoIconsetSingleton.getIcon(this.element.false));
                    this.element.value = true;
                    chai.expect(this.element.innerHTML).to.equal(IoIconsetSingleton.getIcon(this.element.true));
                    this.element.value = false;
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('switch');
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('click here');
                    this.element.label = 'Boolean';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                });
                it('has value attribute when value is true', () => {
                    this.element.value = false;
                    chai.expect(this.element.hasAttribute('value')).to.equal(false);
                    chai.expect(this.element.getAttribute('value')).to.equal(null);
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('false');
                    this.element.value = true;
                    chai.expect(this.element.hasAttribute('value')).to.equal(true);
                    chai.expect(this.element.getAttribute('value')).to.equal('');
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('true');
                });
                it('has title attribute', () => {
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('title')).to.equal('click here');
                    this.element.label = 'Button';
                });
            });
        });
    }
}

/*
 * Extends `IoBoolean`.
 *
 * Input element for `Boolean` data type displayed as switch.
 *
 * <io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>
 **/
class IoSwitch extends IoBoolean {
    static get Style() {
        return /* css */ `
    :host {
      position: relative;
      width: calc(1.5 * var(--io-item-height));
    }
    :host:before {
      display: inline-block;
      box-sizing: border-box;
      position: absolute;
      content: '';
      top: var(--io-spacing);
      left: 0;
      width: calc(100% - calc(2 * var(--io-border-width)));
      height: var(--io-line-height);
      border-radius: var(--io-line-height);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      background-color: var(--io-background-color-dark);
      box-shadow: var(--io-shadow-inset);
      transition: background-color 0.4s;
    }
    :host:after {
      display: inline-block;
      box-sizing: border-box;
      position: absolute;
      content: '';
      top: calc(var(--io-border-width) + var(--io-spacing));
      left: var(--io-border-width);
      height: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
      width: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      border-radius: var(--io-line-height);
      transition-timing-function: ease-in-out;
      transition: left 0.25s;
    }
    :host[value]:after {
      background-color: rgba(80, 210, 355, 0.75);
      left: calc(calc(100% - var(--io-line-height)) - var(--io-border-width));
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    :host:hover:before,
    :host[display="switch"][value]:not([aria-invalid]):before {
      background-color: var(--io-background-color);
    }
    :host:focus:before,
    :host:focus:after {
      border-color: var(--io-color-focus);
    }
    :host:focus {
      outline-color: var(--io-color-focus);
    }
    `;
    }
    changed() {
        this.title = this.label;
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-checked', String(!!this.value));
        this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
        this.setAttribute('aria-label', this.label);
    }
}
RegisterIoElement(IoSwitch);

class Switch {
    element = new IoSwitch();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoSwitch', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(false);
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('switch');
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('click here');
                    this.element.label = 'Boolean';
                    chai.expect(this.element.getAttribute('aria-label')).to.equal('Boolean');
                });
                it('has value attribute when value is true', () => {
                    this.element.value = false;
                    chai.expect(this.element.hasAttribute('value')).to.equal(false);
                    chai.expect(this.element.getAttribute('value')).to.equal(null);
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('false');
                    this.element.value = true;
                    chai.expect(this.element.hasAttribute('value')).to.equal(true);
                    chai.expect(this.element.getAttribute('value')).to.equal('');
                    chai.expect(this.element.getAttribute('aria-checked')).to.equal('true');
                });
                it('has title attribute', () => {
                    this.element.label = 'click here';
                    chai.expect(this.element.getAttribute('title')).to.equal('click here');
                    this.element.label = 'Button';
                });
            });
        });
    }
}

/*
 * Extends `IoItem`.
 *
 * Input element for `String` data type.
 *
 * <io-element-demo element="io-string" properties='{"value": "hello world"}'></io-element-demo>
 **/
class IoString extends IoItem {
    static get Style() {
        return /* css */ `
    :host {
      cursor: text;
      user-select: text;
      -webkit-user-select: text;
      -webkit-touch-callout: default;
      min-width: var(--io-item-height);
      border-color: var(--io-color-border-inset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      box-shadow: var(--io-shadow-inset);
    }
    :host:before,
    :host:after {
      content: ' ';
      white-space: pre;
      visibility: hidden;
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `;
    }
    static get Properties() {
        return {
            live: Boolean,
            value: String,
            contenteditable: true,
            role: 'textbox',
        };
    }
    _setFromTextNode() {
        const textNode = this.textNode;
        if (typeof this.value === 'string' && textNode !== String(this.value)) {
            this.set('value', textNode);
        }
    }
    _tryParseFromTextNode() {
        const textNode = this.textNode;
        try {
            const value = JSON.parse(textNode.replace(/[\t\n\r ]+/g, ' '));
            this.set('value', value);
        }
        catch (error) {
            this._setFromTextNode();
        }
    }
    _onBlur(event) {
        super._onBlur(event);
        this._setFromTextNode();
        this.scrollTop = 0;
        this.scrollLeft = 0;
    }
    _onPointerdown() {
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
    }
    _onPointermove() { }
    _onPointerup() {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        if (document.activeElement !== this) {
            this.focus();
            this.setCaretPosition(this.textNode.length);
        }
    }
    _onKeyup(event) {
        super._onKeyup(event);
        if (this.live) {
            const carretPosition = this.getCaretPosition();
            this._setFromTextNode();
            this.setCaretPosition(carretPosition);
        }
    }
    _onKeydown(event) {
        const rng = window.getSelection().getRangeAt(0);
        const start = rng.startOffset;
        const end = rng.endOffset;
        const length = this.childNodes[0] ? this.childNodes[0].length : 0;
        const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);
        if (event.key === 'Enter') {
            event.preventDefault();
            if (event.shiftKey) {
                this._tryParseFromTextNode();
            }
            else {
                this._setFromTextNode();
            }
        }
        else if (event.key === 'ArrowLeft') {
            if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('left');
            }
        }
        else if (event.key === 'ArrowUp') {
            if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('up');
            }
        }
        else if (event.key === 'ArrowRight') {
            if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('right');
            }
        }
        else if (event.key === 'ArrowDown') {
            if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('down');
            }
        }
    }
    changed() {
        this.title = this.label;
        this.textNode = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-invalid', (typeof this.value !== 'string') ? 'true' : false);
    }
}
RegisterIoElement(IoString);

class Sting {
    element = new IoString();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoString', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal('');
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.element.value = 'hello';
                    chai.expect(this.element.textContent).to.equal('hello');
                    this.element.value = false;
                    chai.expect(this.element.textContent).to.equal('false');
                    this.element.value = null;
                    chai.expect(this.element.textContent).to.equal('null');
                    this.element.value = undefined;
                    chai.expect(this.element.textContent).to.equal('undefined');
                    this.element.value = NaN;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = 123;
                    chai.expect(this.element.textContent).to.equal('123');
                    this.element.value = '';
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attribute', () => {
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('textbox');
                    this.element.value = 0;
                    chai.expect(this.element.getAttribute('aria-invalid')).to.equal('true');
                    this.element.value = '';
                    chai.expect(this.element.getAttribute('aria-invalid')).to.equal(null);
                });
                it('has title attribute', () => {
                    this.element.label = 'Enter text';
                    chai.expect(this.element.getAttribute('title')).to.equal('Enter text');
                    this.element.label = '';
                });
            });
        });
    }
}

let lastFocus$1 = null;
{
    window.addEventListener('focusin', () => {
        lastFocus$1 = document.activeElement;
    }, { capture: false });
    window.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement === document.body) {
                lastFocus$1 = null;
            }
        });
    }, { capture: true });
}
/*
 * Extends `IoElement`.
 *
 * Full-window click-blocking layer for elements designed to be displayed on top all other interface. When clicked, it collapses all child elements by setting their `expanded` property to `false`. Child elements should emmit bubbling `"expanded"` event when expanded/collapsed.
 **/
class IoLayer extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: block;
      visibility: hidden;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100000;
      user-select: none;
      overflow: hidden;
      pointer-events: none;
      touch-action: none;
      opacity: 0;
      transition: opacity 0.25s;
      background: transparent;
    }
    :host[expanded] {
      pointer-events: all;
      visibility: visible;
      opacity: 1;
      /* background: rgba(0,0,0,0.2); */
    }
    :host > * {
      position: absolute;
      touch-action: none;
    }
    `;
    }
    static get Properties() {
        return {
            expanded: {
                value: false,
                reflect: 1,
            },
            skipCollapse: Boolean,
        };
    }
    static get Listeners() {
        return {
            'pointerup': '_onPointerup',
            'contextmenu': '_onContextmenu',
            'focusin': '_onFocusIn',
            'scroll': '_onScroll',
            'wheel': '_onScroll',
            'mousedown': 'stopPropagation',
            'mouseup': 'stopPropagation',
            'mousemove': 'stopPropagation',
            'touchstart': 'stopPropagation',
            'touchmove': 'stopPropagation',
            'touchend': 'stopPropagation',
            'keydown': 'stopPropagation',
            'keyup': 'stopPropagation',
        };
    }
    constructor(properties = {}) {
        super(properties);
        Object.defineProperty(this, 'x', { value: 0, writable: true });
        Object.defineProperty(this, 'y', { value: 0, writable: true });
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
    _onPointerup(event) {
        if (event.composedPath()[0] === this) {
            if (!this.skipCollapse) {
                this.requestAnimationFrameOnce(this._collapse);
            }
            this.skipCollapse = false;
        }
    }
    _collapse() {
        this.expanded = false;
    }
    _onContextmenu(event) {
        event.preventDefault();
    }
    _onFocusIn(event) {
        event.stopPropagation();
    }
    _onScroll(event) {
        if (event.composedPath()[0] === this) {
            this.requestAnimationFrameOnce(this._collapse);
        }
    }
    nudgeDown(element, x, y, elemRect, force) {
        x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
        if (y + elemRect.height < window.innerHeight || force) {
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            return true;
        }
        return false;
    }
    nudgeUp(element, x, y, elemRect, force) {
        x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
        if (y - elemRect.height > 0 || force) {
            element.style.left = x + 'px';
            element.style.top = y - elemRect.height + 'px';
            return true;
        }
        return false;
    }
    nudgeRight(element, x, y, elemRect, force) {
        if (x + elemRect.width < window.innerWidth || force) {
            element.style.left = x + 'px';
            element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
            return true;
        }
        return false;
    }
    nudgeLeft(element, x, y, elemRect, force) {
        if (x - elemRect.width > 0 || force) {
            element.style.left = x - elemRect.width + 'px';
            element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
            return true;
        }
        return false;
    }
    nudgePointer(element, x, y, elemRect) {
        element.style.left = Math.max(0, Math.min(x, window.innerWidth - elemRect.width)) + 'px';
        element.style.top = Math.max(0, Math.min(y, window.innerHeight - elemRect.height)) + 'px';
        return true;
    }
    setElementPosition(element, direction, srcRect) {
        const elemRect = element.getBoundingClientRect();
        const left = srcRect.left;
        const top = srcRect.top;
        const right = srcRect.right;
        const bottom = srcRect.bottom;
        const bottomToHeight = window.innerHeight - bottom;
        const rightToWidth = window.innerWidth - right;
        switch (direction) {
            case 'pointer':
                this.nudgePointer(element, this.x + 5, this.y + 5, elemRect);
                break;
            case 'top':
                this.nudgeUp(element, left, top, elemRect) ||
                    this.nudgeDown(element, left, bottom, elemRect) ||
                    this.nudgeUp(element, left, top, elemRect, top > bottomToHeight) ||
                    this.nudgeDown(element, left, bottom, elemRect, top <= bottomToHeight);
                break;
            case 'left':
                this.nudgeLeft(element, left, top, elemRect) ||
                    this.nudgeRight(element, right, top, elemRect) ||
                    this.nudgeLeft(element, left, top, elemRect, left > rightToWidth) ||
                    this.nudgeRight(element, right, top, elemRect, left <= rightToWidth);
                break;
            case 'bottom':
                this.nudgeDown(element, left, bottom, elemRect) ||
                    this.nudgeUp(element, left, top, elemRect) ||
                    this.nudgeDown(element, left, bottom, elemRect, bottomToHeight > top) ||
                    this.nudgeUp(element, left, top, elemRect, bottomToHeight <= top);
                break;
            case 'right':
            default:
                this.nudgeRight(element, right, top, elemRect) ||
                    this.nudgeLeft(element, left, top, elemRect) ||
                    this.nudgeRight(element, right, top, elemRect, rightToWidth > left) ||
                    this.nudgeLeft(element, left, top, elemRect, rightToWidth <= left);
                break;
        }
    }
    appendChild(child) {
        super.appendChild(child);
        child.addEventListener('expanded-changed', this.onChildExpanded);
        this.onChildExpanded();
    }
    removeChild(child) {
        super.removeChild(child);
        child.removeEventListener('expanded-changed', this.onChildExpanded);
        this.onChildExpanded();
    }
    onChildExpanded() {
        this.requestAnimationFrameOnce(this.onChildExpandedDelayed);
    }
    onChildExpandedDelayed() {
        for (let i = this.children.length; i--;) {
            if (this.children[i].expanded) {
                this.expanded = true;
                return;
            }
        }
        this.requestAnimationFrameOnce(this._collapse);
    }
    expandedChanged() {
        if (!this.expanded) {
            for (let i = this.children.length; i--;) {
                this.children[i].expanded = false;
            }
            if (lastFocus$1)
                lastFocus$1.focus();
        }
    }
}
RegisterIoElement(IoLayer);
const IoLayerSingleton = new IoLayer();
document.body.appendChild(IoLayerSingleton);

let lastFocus = null;
{
    window.addEventListener('focusin', () => {
        lastFocus = document.activeElement;
    }, { capture: false });
    window.addEventListener('blur', () => {
        setTimeout(() => {
            if (document.activeElement === document.body) {
                lastFocus = null;
            }
        });
    }, { capture: true });
}
/*
 * Extends `IoElement`. Implements `IoLadderStep` and `IoItem`.
 *
 * Interactive number ladder. When dragged horizontally, it changes the value in step increments. Dragging speed affects the rate of change exponentially. Up/down arrow keys change the step focus while left/right change the value in step increments. Escape key collapses the ladder and restores the focus to previously focused element. If shift key is pressed, value is rounded to the nearest step incement.
 *
 * <io-element-demo element="io-ladder" expanded properties='{"value": 0, "step": 0.0001, "conversion": 1, "min": -10000, "max": 10000, "expanded": true}'></io-element-demo>
 **/
class IoLadderStep extends IoItem {
    static get Style() {
        return /* css */ `
    :host {
      pointer-events: all;
      display: inline-block;
      cursor: ew-resize;
      text-align: center;
      background-color: var(--io-background-color-highlight);
      color: var(--io-color);
      align-self: stretch;
      touch-action: none;
      width: 6em;
    }
    :host:before {
      float: left;
      content: '<';
      opacity: 0.25;
    }
    :host:after {
      float: right;
      content: '>';
      opacity: 0.25;
    }
    `;
    }
    static get Properties() {
        return {
            role: 'spinbutton',
            type: {
                value: 'number',
                reflect: 1,
            },
        };
    }
    _onKeydown(event) {
        let stepMove = 0;
        if (event.key === 'Escape' || event.key === ' ') {
            this.dispatchEvent('ladder-step-collapse', {}, true);
        }
        else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
            event.preventDefault();
            stepMove = this.value * -1;
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.focusTo('up');
        }
        else if (event.key === 'ArrowRight' || event.key === 'Enter') {
            event.preventDefault();
            stepMove = this.value * 1;
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.focusTo('down');
        }
        if (stepMove !== 0) {
            this.dispatchEvent('ladder-step-change', { step: Number(stepMove.toFixed(5)), round: event.shiftKey }, true);
            this.setAttribute('aria-valuenow', this.parentElement.value);
        }
    }
    _onPointerdown(event) {
        this.setPointerCapture(event.pointerId);
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
        this._startX = event.clientX;
    }
    _onPointermove(event) {
        const deltaX = event.clientX - this._startX;
        if (Math.abs(deltaX) > 5) {
            const expMove = Math.pow(deltaX / 5, 2) * deltaX < 0 ? -1 : 1;
            const roundMove = deltaX > 0 ? Math.floor(expMove) : Math.ceil(expMove);
            const stepMove = this.value * roundMove;
            this._startX = event.clientX;
            this.dispatchEvent('ladder-step-change', { step: Number(stepMove.toFixed(5)), round: event.shiftKey }, true);
        }
    }
    _onPointerup(event) {
        this.releasePointerCapture(event.pointerId);
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        this.dispatchEvent('ladder-step-collapse', {}, true);
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-valuemax', this.parentElement.max);
        this.setAttribute('aria-valuemin', this.parentElement.min);
        this.setAttribute('aria-valuenow', this.parentElement.value);
    }
}
RegisterIoElement(IoLadderStep);
class IoLadder extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      position: relative;
      pointer-events: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      display: flex;
      flex-direction: column;
    }
    :host:not([expanded]) {
      visibility: hidden;
    }
    :host:not([expanded]) > io-ladder-step {
      opacity: 0.5;
    }
    :host > io-ladder-step:nth-child(-n+5) {
      box-shadow: 0 -1px 4px rgba(0,0,0,0.2);
    }
    :host > io-ladder-step:nth-child(n+6) {
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    :host > .io-up1,
    :host > .io-down1{
      z-index: 4;
      transition: opacity 0.1s, transform 0.1s;
    }
    :host > .io-up2,
    :host > .io-down2 {
      z-index: 3;
      opacity: 0.8;
      transition: opacity 0.2s, transform 0.2s;
    }
    :host:not([expanded]) > .io-up4 {
      transform: translateY(calc(3 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-up3 {
      transform: translateY(calc(2 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-up2 {
      transform: translateY(calc(1 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down2 {
      transform: translateY(calc(-1 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down3 {
      transform: translateY(calc(-2 * var(--io-item-height)));
    }
    :host:not([expanded]) > .io-down4 {
      transform: translateY(calc(-3 * var(--io-item-height)));
    }
    :host > .io-up3,
    :host > .io-down3 {
      z-index: 2;
      opacity: 0.6;
      transition: opacity 0.4s, transform 0.4s;
    }
    :host > .io-up4,
    :host > .io-down4 {
      z-index: 1;
      opacity: 0.4;
      transition: opacity 0.8s, transform 0.8s;
    }
    :host > io-ladder-step:hover,
    :host > io-ladder-step:focus {
      background-color: var(--io-background-color-highlight);
      border-color: var(--io-color-focus);
      transition: opacity 0.2s;
      opacity: 1;
    }
    :host > .io-ladder-empty {
      height: var(--io-item-height);
    }
    :host > .io-ladder-center {
      height: calc(1.5 * var(--io-item-height));
    }
    `;
    }
    static get Properties() {
        return {
            src: null,
            conversion: 1,
            expanded: {
                type: Boolean,
                reflect: 1,
            },
            min: -Infinity,
            max: Infinity,
            step: 0.0001,
            role: 'list',
        };
    }
    static get Listeners() {
        return {
            'ladder-step-change': '_onLadderStepChange',
            'ladder-step-collapse': '_onLadderStepCollapse',
            'focusin': '_onFocusIn',
        };
    }
    get value() {
        return this.src ? this.src.value : 0;
    }
    _onFocusIn(event) {
        event.stopPropagation();
    }
    _onFocusTo(event) {
        event.stopPropagation();
        const srcStep = event.composedPath()[0];
        const src = this.src;
        const dir = event.detail.dir;
        if (src) {
            if ((srcStep === this.querySelector('.io-up1') && dir === 'down') ||
                (srcStep === this.querySelector('.io-down1') && dir === 'up')) {
                src.focus();
                src.selectionStart = src.selectionEnd = src.textNode.length;
                return;
            }
        }
        super._onFocusTo(event);
    }
    _onLadderStepChange(event) {
        const src = this.src;
        if (this.src) {
            const step = event.detail.step;
            const value = event.detail.round ? (Math.round(this.value / step) * step) : this.value;
            let newValue = Math.min(this.max, Math.max(this.min, value + step));
            newValue = Number(newValue.toFixed(5));
            src.set('value', newValue);
        }
    }
    _onLadderStepCollapse() {
        this.set('expanded', false);
    }
    srcChanged() {
        const src = this.src;
        if (src)
            this.setProperties({
                min: src.min,
                max: src.max,
                step: src.step,
                conversion: src.conversion,
            });
    }
    expandedChanged() {
        const src = this.src;
        if (this.expanded) {
            if (src) {
                const rect = src.getBoundingClientRect();
                // NOTE: layerRect fix for Safari zoom.
                const layerRect = IoLayerSingleton.getBoundingClientRect();
                this.style.top = rect.bottom - layerRect.top + 'px';
                this.style.left = rect.left - layerRect.left + 'px';
                this.style.position = 'absolute';
                this.style.marginTop = 'calc(-5.25 * var(--io-item-height))';
            }
            else {
                this.removeAttribute('style');
            }
        }
        else {
            if (src && src._pointerType !== 'touch') {
                src.focus();
            }
            else if (lastFocus) {
                lastFocus.focus();
            }
        }
        this.dispatchEvent('expanded', { value: this.expanded }, true);
    }
    changed() {
        const range = this.max - this.min;
        const hiddenItem = ['span', { class: 'io-ladder-empty' }];
        // TODO: unhack
        let step = this.step / 10000;
        while (step < .1)
            step = step * 10;
        const upStep4 = 10000 * step;
        const upStep3 = 1000 * step;
        const upStep2 = 100 * step;
        const upStep1 = 10 * step;
        const downStep1 = 1 * step;
        const downStep2 = .1 * step;
        const downStep3 = .01 * step;
        const downStep4 = .001 * step;
        const upLabel4 = Number((upStep4 * this.conversion).toFixed(6));
        const upLabel3 = Number((upStep3 * this.conversion).toFixed(6));
        const upLabel2 = Number((upStep2 * this.conversion).toFixed(6));
        const upLabel1 = Number((upStep1 * this.conversion).toFixed(6));
        const downLabel1 = Number((downStep1 * this.conversion).toFixed(6));
        const downLabel2 = Number((downStep2 * this.conversion).toFixed(6));
        const downLabel3 = Number((downStep3 * this.conversion).toFixed(6));
        const downLabel4 = Number((downStep4 * this.conversion).toFixed(6));
        this.template([
            (range >= upStep4) ? ['io-ladder-step', { class: 'io-up4', value: upStep4, label: String(upLabel4) }] : hiddenItem,
            (range >= upStep3) ? ['io-ladder-step', { class: 'io-up3', value: upStep3, label: String(upLabel3) }] : hiddenItem,
            (range >= upStep2) ? ['io-ladder-step', { class: 'io-up2', value: upStep2, label: String(upLabel2) }] : hiddenItem,
            (range >= upStep1) ? ['io-ladder-step', { class: 'io-up1', value: upStep1, label: String(upLabel1) }] : hiddenItem,
            ['span', { class: 'io-ladder-center' }],
            (this.step <= downStep1) ? ['io-ladder-step', { class: 'io-down1', value: downStep1, label: String(downLabel1) }] : hiddenItem,
            (this.step <= downStep2) ? ['io-ladder-step', { class: 'io-down2', value: downStep2, label: String(downLabel2) }] : hiddenItem,
            (this.step <= downStep3) ? ['io-ladder-step', { class: 'io-down3', value: downStep3, label: String(downLabel3) }] : hiddenItem,
            (this.step <= downStep4) ? ['io-ladder-step', { class: 'io-down4', value: downStep4, label: String(downLabel4) }] : hiddenItem,
        ]);
        const steps = this.querySelectorAll('io-ladder-step');
        for (let i = steps.length; i--;)
            steps[i].applyAria();
    }
}
RegisterIoElement(IoLadder);
const IoLadderSingleton = new IoLadder();
IoLayerSingleton.appendChild(IoLadderSingleton);

/*
 * Extends `IoItem`.
 *
 * Input element for `Number` data type. It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment. If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped. Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 *
 * <io-element-demo element="io-number" width="5em" properties='{"value": 1337, "conversion": 1, "step": 0.1, "min": 0, "max": 10000, "ladder": true}'></io-element-demo>
 *
 * <io-element-demo element="io-number" width="5em" properties='{"value": 1337, "conversion": 1, "step": 0.0002, "min": 0, "max": 10000, "ladder": true}'></io-element-demo>
 *
 * Value can be displayed using `conversion` factor. For example, conversion factor of `180/Ï€` would display radians as degrees.
 *
 * <io-element-demo element="io-number" width="5em" properties='{"value": 0, "step": 0.2617993877991494, "conversion": 57.29577951308232, "min": -6.283185307179586, "max": 6.283185307179586, "ladder": true}'></io-element-demo>
 **/
class IoNumber extends IoItem {
    static get Style() {
        return /* css */ `
    :host {
      cursor: text;
      user-select: text;
      -webkit-user-select: text;
      -webkit-touch-callout: default;
      min-width: var(--io-item-height);
      border-color: var(--io-color-border-inset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      box-shadow: var(--io-shadow-inset);
    }
    :host:before,
    :host:after {
      content: ' ';
      white-space: pre;
      visibility: hidden;
    }
    :host:before {
      content: '-';
    }
    :host:not([positive]):before {
      content: ' ';
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `;
    }
    static get Properties() {
        return {
            value: Number,
            conversion: 1,
            step: 0.001,
            min: -Infinity,
            max: Infinity,
            ladder: false,
            contenteditable: true,
            role: 'textbox',
            type: {
                value: 'number',
                reflect: 1,
            },
            pattern: {
                value: 'pattern="[0-9]*"',
                reflect: 1,
            },
            inputmode: {
                value: 'numeric',
                reflect: 1,
            },
            spellcheck: {
                value: 'false',
                reflect: 1,
            },
        };
    }
    constructor(properties = {}) {
        super(properties);
        Object.defineProperty(this, '_pointer', { enumerable: false, writable: true, value: 'touch' });
    }
    _onPointerdown(event) {
        if (this._pointer === 'touch')
            event.preventDefault();
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
        if (document.activeElement === this && event.button === 0)
            return;
        this._pointer = event.pointerType;
    }
    _onPointerup(event) {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        if (this.ladder || event.button === 1) {
            if (this._pointer === 'touch') {
                event.preventDefault();
                document.activeElement.blur();
            }
            else {
                if (document.activeElement !== this) {
                    this.focus();
                    this.setCaretPosition(this.textNode.length);
                }
            }
            this._expandLadder();
        }
        else {
            if (document.activeElement !== this) {
                this.focus();
                this.setCaretPosition(this.textNode.length);
            }
        }
    }
    _onFocus(event) {
        super._onFocus(event);
        if (this._pointer === 'touch') {
            IoLadderSingleton.expanded = false;
        }
    }
    _onBlur(event) {
        super._onBlur(event);
        this._setFromTextNode();
        this.scrollTop = 0;
        this.scrollLeft = 0;
        // TODO: unhack race condition
        setTimeout(() => {
            if (!(document.activeElement.parentElement === IoLadderSingleton)) {
                IoLadderSingleton.expanded = false;
            }
        });
    }
    _expandLadder() {
        IoLadderSingleton.src = this;
        IoLadderSingleton.expanded = true;
    }
    _onKeydown(event) {
        const rng = window.getSelection().getRangeAt(0);
        const start = rng.startOffset;
        const end = rng.endOffset;
        const length = this.childNodes[0] ? this.childNodes[0].length : 0;
        const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);
        if (event.which === 27 || event.which === 13 || event.which === 32) { //  esc || enter || space
            event.preventDefault();
            this._setFromTextNode();
        }
        else if (event.which === 36) { // home
            this.textNode = this.min;
            this._setFromTextNode();
        }
        else if (event.which === 35) { // end
            this.textNode = this.max;
            this._setFromTextNode();
        }
        else if (event.which === 33) { // pgup
            const valueNumber = Number(this.textNode);
            if (typeof valueNumber === 'number' && !isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
                this.textNode = Number(this.textNode) + this.step;
            }
            else {
                this.textNode = this.step;
            }
            this._setFromTextNode();
        }
        else if (event.which === 34) { // pgdown
            const valueNumber = Number(this.textNode);
            if (typeof valueNumber === 'number' && !isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
                this.textNode = Number(this.textNode) - this.step;
            }
            else {
                this.textNode = -this.step;
            }
            this._setFromTextNode();
        }
        else if (event.which === 37) { // left
            if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('left');
            }
        }
        else if (event.which === 38) { // up
            if (IoLadderSingleton.expanded) {
                const upStep = IoLadderSingleton.querySelector('.io-up1');
                if (upStep)
                    upStep.focus();
            }
            else if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('up');
            }
        }
        else if (event.which === 39) { // right
            if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('right');
            }
        }
        else if (event.which === 40) { // down
            if (IoLadderSingleton.expanded) {
                const downStep = IoLadderSingleton.querySelector('.io-down1');
                if (downStep)
                    downStep.focus();
            }
            else if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('down');
            }
        }
    }
    _onKeyup(event) {
        if (event.which === 17) { // ctrl
            this._expandLadder();
        }
        else if (event.which === 27 || event.which === 13 || event.which === 32) { // esc || enter || space
            IoLayerSingleton.expanded = false;
        }
    }
    _setFromTextNode() {
        const valueText = this.textNode;
        let valueNumber = Number(valueText) / this.conversion;
        valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
        valueNumber = Math.round(valueNumber / this.step) * this.step;
        const d = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
        valueNumber = Number(valueNumber.toFixed(d));
        if (!isNaN(valueNumber))
            this.set('value', valueNumber);
        else
            this.textNode = 'NaN';
    }
    changed() {
        this.title = this.label;
        let value = this.value;
        let valueText;
        if (typeof value === 'number' && !isNaN(value)) {
            value *= this.conversion;
            let d = -Math.floor(Math.log(this.step * this.conversion) / Math.LN10);
            d = Math.max(0, Math.min(100, d));
            value = value.toFixed(d);
            valueText = Number(String(value));
        }
        else {
            valueText = 'NaN';
        }
        this.textNode = valueText;
        this.setAttribute('positive', this.value >= 0);
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-invalid', (typeof this.value !== 'number' || isNaN(this.value)) ? 'true' : false);
    }
}
RegisterIoElement(IoNumber);

class Number$1 {
    element = new IoNumber();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    reset() {
        this.element.value = 0;
        this.element.conversion = 1;
        this.element.step = 0.001;
        this.element.min = -Infinity;
        this.element.max = Infinity;
    }
    run() {
        describe('IoNumber', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(0);
                    chai.expect(this.element.conversion).to.equal(1);
                    chai.expect(this.element.step).to.equal(0.001);
                    chai.expect(this.element.min).to.equal(-Infinity);
                    chai.expect(this.element.max).to.equal(Infinity);
                    chai.expect(this.element.ladder).to.equal(false);
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.element.value = 0;
                    this.element.step = 1;
                    chai.expect(this.element.textContent).to.equal('0');
                    this.element.step = 0.1;
                    chai.expect(this.element.textContent).to.equal('0');
                    this.element.value = 'hello';
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = false;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = null;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = undefined;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = NaN;
                    chai.expect(this.element.textContent).to.equal('NaN');
                    this.element.value = 123;
                    chai.expect(this.element.textContent).to.equal('123');
                    this.reset();
                });
                it('matches value with custom step settings', () => {
                    this.element.step = 0.000000001;
                    this.element.value = 0.012345678;
                    chai.expect(this.element.textContent).to.equal('0.012345678');
                    this.element.step = 0.000001;
                    chai.expect(this.element.textContent).to.equal('0.012346');
                    this.element.step = 0.01;
                    chai.expect(this.element.textContent).to.equal('0.01');
                    this.reset();
                });
                it('matches value with custom min/max settings', () => {
                    this.element.step = 1;
                    this.element.min = 2;
                    this.element.max = 5;
                    this.element.textNode = 10;
                    this.element._setFromTextNode();
                    chai.expect(this.element.value).to.equal(5);
                    this.element.textNode = 0;
                    this.element._setFromTextNode();
                    chai.expect(this.element.value).to.equal(2);
                    this.reset();
                });
                it('matches value with conversion factor', () => {
                    this.element.conversion = 0.1;
                    this.element.value = 1;
                    chai.expect(this.element.textContent).to.equal('0.1');
                    this.element.conversion = 0.01;
                    chai.expect(this.element.textContent).to.equal('0.01');
                    this.element.textNode = 10;
                    this.element._setFromTextNode();
                    chai.expect(this.element.value).to.equal(1000);
                    this.reset();
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attributes', () => {
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
                    chai.expect(this.element.getAttribute('type')).to.equal('number');
                    chai.expect(this.element.getAttribute('pattern')).to.equal('pattern="[0-9]*"');
                    chai.expect(this.element.getAttribute('inputmode')).to.equal('numeric');
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal('');
                    chai.expect(this.element.getAttribute('spellcheck')).to.equal('false');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('textbox');
                    this.element.value = '';
                    chai.expect(this.element.getAttribute('aria-invalid')).to.equal('true');
                    this.element.value = 0;
                    chai.expect(this.element.getAttribute('aria-invalid')).to.equal(null);
                    this.reset();
                });
                it('has title attribute', () => {
                    this.element.label = 'Enter text';
                    chai.expect(this.element.getAttribute('title')).to.equal('Enter text');
                    this.element.label = '';
                });
            });
        });
    }
}

/*
 * Extends `IoGl`.
 *
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider" properties='{"value": 0, "step": 0.01, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
class IoSlider extends IoGl {
    static get Style() {
        return /* css */ `
    :host {
      cursor: ns-resize;
      box-sizing: border-box;
      border: var(--io-border);
      border-radius: var(--io-border-radius);
      border-color: var(--io-color-border-inset);
      min-width: var(--io-item-height);
      min-height: var(--io-item-height);
      align-self: stretch;
      justify-self: stretch;
    }
    :host[horizontal] {
      cursor: ew-resize;
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    :host[aria-invalid] > .io-gl-canvas {
      opacity: 0.5;
    }
    :host:focus {
      border-color: var(--io-color-focus);
      outline-color: var(--io-color-focus);
    }
    `;
    }
    static get Properties() {
        return {
            value: 0,
            step: 0.01,
            min: 0,
            max: 1,
            exponent: 1,
            horizontal: {
                value: true,
                reflect: 1,
            },
            noscroll: false,
            role: 'slider',
            tabindex: 0,
            lazy: true,
        };
    }
    static get Listeners() {
        return {
            'focus': '_onFocus',
            'contextmenu': '_onContextmenu',
            'pointerdown': '_onPointerdown',
            'touchstart': '_onTouchstart',
        };
    }
    _onFocus() {
        this.addEventListener('blur', this._onBlur);
        this.addEventListener('keydown', this._onKeydown);
    }
    _onBlur() {
        this.removeEventListener('blur', this._onBlur);
        this.removeEventListener('keydown', this._onKeydown);
    }
    _onContextmenu(event) {
        event.preventDefault();
    }
    _onTouchstart(event) {
        this.addEventListener('touchmove', this._onTouchmove);
        this.addEventListener('touchend', this._onTouchend);
        this._x = event.changedTouches[0].clientX;
        this._y = event.changedTouches[0].clientY;
        this._active = this.noscroll ? 1 : -1;
    }
    _onTouchmove(event) {
        const dx = Math.abs(this._x - event.changedTouches[0].clientX);
        const dy = Math.abs(this._y - event.changedTouches[0].clientY);
        if (this._active === -1) {
            if (this.horizontal) {
                if (dx > 3 && dx > dy) {
                    this._active = (dx > dy && dy < 10) ? 1 : 0;
                }
            }
            else {
                if (dy > 3 && dy > dx) {
                    this._active = (dy > dx && dx < 10) ? 1 : 0;
                }
            }
        }
        if (this._active !== 1)
            return;
        event.preventDefault();
    }
    _onTouchend() {
        this.removeEventListener('touchmove', this._onTouchmove);
        this.removeEventListener('touchend', this._onTouchend);
    }
    _onPointerdown(event) {
        this.setPointerCapture(event.pointerId);
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
    }
    _onPointermove(event) {
        if (event.pointerType !== 'touch')
            this._active = 1;
        this.throttle(this._onPointermoveThrottled, event, true);
    }
    _onPointerup(event) {
        this.releasePointerCapture(event.pointerId);
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
    }
    _getPointerCoord(event) {
        const rect = this.getBoundingClientRect();
        const x = Math.pow(Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width)), this.exponent);
        const y = Math.pow(Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height)), this.exponent);
        return [x, y];
    }
    _getValueFromCoord(coord) {
        let value = this.min * (1 - coord) + this.max * coord;
        value = Math.min(this.max, Math.max(this.min, value));
        return Math.round(value / this.step) * this.step;
    }
    _getCoordFromValue(value) {
        return (value - this.min) / (this.max - this.min);
    }
    _onPointermoveThrottled(event) {
        if (this._active === 1) {
            if (document.activeElement !== this)
                this.focus();
            const p = this._getPointerCoord(event);
            const _x = this._getValueFromCoord(p[0]);
            const _y = this._getValueFromCoord(p[1]);
            this._setValue(this.horizontal ? _x : _y);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _setValue(x, y) {
        this.set('value', Number(x.toFixed(5)));
    }
    _onKeydown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('left');
                else
                    this._setDecrease();
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('up');
                else
                    this._setIncrease();
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('right');
                else
                    this._setIncrease();
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('down');
                else
                    this._setDecrease();
                break;
            case 'PageUp':
            case '+':
                event.preventDefault();
                this._setIncrease();
                break;
            case 'PageDown':
            case '-':
                event.preventDefault();
                this._setDecrease();
                break;
            case 'Home':
                event.preventDefault();
                this._setMin();
                break;
        }
    }
    // TODO: round to step
    _setIncrease() {
        let value = this.value + this.step;
        value = Math.min(this.max, Math.max(this.min, value));
        this._setValue(value);
    }
    _setDecrease() {
        let value = this.value - this.step;
        value = Math.min(this.max, Math.max(this.min, value));
        this._setValue(value);
    }
    _setMin() {
        let value = this.min;
        value = Math.min(this.max, Math.max(this.min, value));
        this._setValue(value);
    }
    _setMax() {
        let value = this.max;
        value = Math.min(this.max, Math.max(this.min, value));
        this._setValue(value);
    }
    // TODO: consider moving or standardizing.
    changed() {
        super.changed();
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-invalid', isNaN(this.value) ? 'true' : false);
        this.setAttribute('aria-valuenow', isNaN(this.value) ? 0 : this.value);
        this.setAttribute('aria-valuemin', this.min);
        this.setAttribute('aria-valuemax', this.max);
        // this.setAttribute('aria-valuestep', this.step);
    }
    static get GlUtils() {
        return /* glsl */ `
    vec4 paintSlider(vec2 position, vec2 sliderStart, vec2 sliderEnd, float knobRadius, float slotWidth, vec3 color) {
      vec4 slotColor = mix(cssColor, cssBackgroundColorField, 0.125);
      vec4 sliderColor = vec4(0.0);
      float stroke = cssStrokeWidth;

      vec2 startPos = translate(position, sliderStart);
      vec2 endPos = translate(position, sliderEnd);
      vec2 slotCenter = (startPos + endPos) / 2.;
      float slotSpan = abs(startPos.x - endPos.x) / 2.0;

      float strokeShape = min(min(
        circle(startPos, knobRadius + stroke + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke + stroke))),
        circle(endPos, knobRadius + stroke + stroke)
      );
      sliderColor = mix(vec4(slotColor.rgb, 1.0), sliderColor, strokeShape);

      float fillShape = min(min(
        circle(startPos, knobRadius + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke))),
        circle(endPos, knobRadius + stroke)
      );
      sliderColor = mix(vec4(cssBackgroundColor.rgb, 1.0), sliderColor, fillShape);

      float colorShape = min(min(
        circle(startPos, knobRadius),
        rectangle(slotCenter, vec2(slotSpan, slotWidth))),
        circle(endPos, knobRadius)
      );
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);

      return sliderColor;
    }
    \n\n`;
    }
    static get Frag() {
        return /* glsl */ `
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = cssBackgroundColorField.rgb;

      vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
      vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
      vec2 position = size * uv;


      float stepInPx = size.x / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(cssColor, cssBackgroundColorField, 0.75);

      float lineWidth = cssStrokeWidth;
      if (stepInPx > lineWidth * 2.0) {
        // TODO: grid with exponent
        float gridWidth = size.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      vec4 slotGradient = mix(cssColorFocus, cssColorLink, uv.x);
      float knobRadius = cssItemHeight * 0.125;
      float slotWidth = cssItemHeight * 0.125;

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      float sign = valueInRange < 0.0 ? -1.0 : 1.0;
      valueInRange = abs(pow(valueInRange, 1./uExponent)) * sign;

      vec2 sliderStart = vec2(0.0, size.y * 0.5);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), size.y * 0.5);

      vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
    }
}
RegisterIoElement(IoSlider);

class Slider {
    element = new IoSlider();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
        this.element.lazy = false;
    }
    reset() {
        this.element.value = 0;
        this.element.step = 0.01;
        this.element.min = 0;
        this.element.max = 1;
    }
    run() {
        describe('IoSlider', () => {
            describe('default values', () => {
                it('has default values', () => {
                    this.reset();
                    chai.expect(this.element.value).to.equal(0);
                    chai.expect(this.element.step).to.equal(0.01);
                    chai.expect(this.element.min).to.equal(0);
                    chai.expect(this.element.max).to.equal(1);
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attribute on number field', () => {
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
                });
                it('has a11y attributes', () => {
                    this.reset();
                    chai.expect(this.element.getAttribute('role')).to.equal('slider');
                    this.element.value = 0.1;
                    chai.expect(this.element.getAttribute('aria-valuenow')).to.equal('0.1');
                    this.element.min = 0;
                    chai.expect(this.element.getAttribute('aria-valuemin')).to.equal('0');
                    this.element.max = 1;
                    chai.expect(this.element.getAttribute('aria-valuemax')).to.equal('1');
                    this.reset();
                });
            });
        });
    }
}

/*
 * Extends `IoSlider`.
 *
 * Input element for `Array(2)` data type displayed as slider.
 * It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider-range" properties='{"value": [0, 1], "step": 0.1, "min": -1, "max": 2, "exponent": 1}'></io-element-demo>
 **/
class IoSliderRange extends IoSlider {
    static get Properties() {
        return {
            value: {
                type: Array,
                value: [0, 0],
                observe: true,
            },
        };
    }
    _onPointerdown(event) {
        super._onPointerdown(event);
        const p = this._getPointerCoord(event);
        const c0 = this._getCoordFromValue(Math.min(this.max, Math.max(this.min, this.value[0])));
        const c1 = this._getCoordFromValue(Math.min(this.max, Math.max(this.min, this.value[1])));
        if (this.horizontal) {
            this._index = Math.abs(c0 - p[0]) < Math.abs(c1 - p[0]) ? 0 : 1;
        }
        else {
            this._index = Math.abs(c0 - p[1]) < Math.abs(c1 - p[1]) ? 0 : 1;
        }
    }
    _onPointermoveThrottled(event) {
        if (this._active === 1) {
            if (document.activeElement !== this)
                this.focus();
            const p = this._getPointerCoord(event);
            const v0 = this._getValueFromCoord(p[0]);
            const v1 = this._getValueFromCoord(p[1]);
            if (this._index === 0) {
                this._setValue(this.horizontal ? v0 : v1, this.value[1]);
            }
            else if (this._index === 1) {
                this._setValue(this.value[0], this.horizontal ? v0 : v1);
            }
        }
    }
    _setValue(x, y) {
        this.set('value', [Number(x.toFixed(5)), Number(y.toFixed(5))]);
    }
    _onKeydown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('left');
                else
                    this._setDecrease();
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('up');
                else
                    this._setIncrease();
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('right');
                else
                    this._setIncrease();
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (!event.shiftKey)
                    this.focusTo('down');
                else
                    this._setDecrease();
                break;
            case 'PageUp':
            case '+':
                event.preventDefault();
                this._setIncrease();
                break;
            case 'PageDown':
            case '-':
                event.preventDefault();
                this._setDecrease();
                break;
            case 'Home':
                event.preventDefault();
                this._setMin();
                break;
        }
    }
    // TODO: round to step
    _setIncrease() {
        let x = this.value[0] + this.step;
        let y = this.value[1] + this.step;
        x = Math.min(this.max, Math.max(this.min, x));
        y = Math.min(this.max, Math.max(this.min, y));
        this._setValue(x, y);
    }
    _setDecrease() {
        let x = this.value[0] - this.step;
        let y = this.value[1] - this.step;
        x = Math.min(this.max, Math.max(this.min, x));
        y = Math.min(this.max, Math.max(this.min, y));
        this._setValue(x, y);
    }
    _setMin() {
        let x = this.min;
        let y = this.min;
        x = Math.min(this.max, Math.max(this.min, x));
        y = Math.min(this.max, Math.max(this.min, y));
        this._setValue(x, y);
    }
    _setMax() {
        let x = this.max;
        let y = this.max;
        x = Math.min(this.max, Math.max(this.min, x));
        y = Math.min(this.max, Math.max(this.min, y));
        this._setValue(x, y);
    }
    applyAria() {
        super.applyAria();
        this.setAttribute('aria-invalid', (this.value instanceof Array && this.value.length === 2) ? false : 'true');
        this.setAttribute('aria-valuemin', this.min);
        this.setAttribute('aria-valuemax', this.max);
        this.setAttribute('aria-valuestep', this.step);
    }
    static get Frag() {
        return /* glsl */ `
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = cssBackgroundColorField.rgb;

      vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
      vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
      vec2 position = size * uv;


      float stepInPx = size.x / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(cssColor, cssBackgroundColorField, 0.75);

      float lineWidth = cssStrokeWidth;
      if (stepInPx > lineWidth * 2.0) {
        // TODO: grid with exponent
        float gridWidth = size.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      float knobRadius = cssItemHeight * 0.25;
      float slotWidth = cssItemHeight * 0.125;

      float valueInRangeStart = (uValue[0] - uMin) / (uMax - uMin);
      float signStart = valueInRangeStart < 0.0 ? -1.0 : 1.0;
      valueInRangeStart = abs(pow(valueInRangeStart, 1./uExponent)) * signStart;

      float valueInRangeEnd = (uValue[1] - uMin) / (uMax - uMin);
      float signEnd = valueInRangeEnd < 0.0 ? -1.0 : 1.0;
      valueInRangeEnd = abs(pow(valueInRangeEnd, 1./uExponent)) * signEnd;

      float grad = 0.5;
      if (valueInRangeEnd > valueInRangeStart) {
        grad = (uv.x - valueInRangeStart) / max(valueInRangeEnd - valueInRangeStart, 0.01);
      } else if (valueInRangeEnd < valueInRangeStart) {
        grad = 1.0 - (uv.x - valueInRangeEnd) / max(valueInRangeStart - valueInRangeEnd, 0.01);
      }
      vec4 slotGradient = mix(cssColorFocus, cssColorLink, saturate(grad));

      vec2 sliderStart = vec2(size.x * min(2.0, max(-1.0, (valueInRangeStart))), size.y * 0.5);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRangeEnd))), size.y * 0.5);

      vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
    }
}
RegisterIoElement(IoSliderRange);

class SliderRange {
    element = new IoSliderRange();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
        this.element.lazy = false;
    }
    reset() {
        this.element.value = [0, 1];
        this.element.step = 0.01;
        this.element.min = 0;
        this.element.max = 1;
    }
    run() {
        describe('IoSliderRange', () => {
            describe('default values', () => {
                it('has default values', () => {
                    this.reset();
                    chai.expect(this.element.value[0]).to.equal(0);
                    chai.expect(this.element.value[1]).to.equal(1);
                    chai.expect(this.element.step).to.equal(0.01);
                    chai.expect(this.element.min).to.equal(0);
                    chai.expect(this.element.max).to.equal(1);
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attribute on number field', () => {
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
                });
                it('has a11y attributes', () => {
                    this.reset();
                    chai.expect(this.element.getAttribute('role')).to.equal('slider');
                    this.element.min = 0;
                    chai.expect(this.element.getAttribute('aria-valuemin')).to.equal('0');
                    this.element.max = 1;
                    chai.expect(this.element.getAttribute('aria-valuemax')).to.equal('1');
                });
            });
        });
    }
}

/*
 * Extends `IoElement`. Implements `IoNumber` and `IoSlider`.
 *
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 *
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.01, "conversion": 1, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.2617993877991494, "conversion": 57.29577951308232, "min": -6.283185307179586, "max": 6.283185307179586, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.1, "conversion": 0.2, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
class IoNumberSlider extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      flex: 0 0 calc(2 * var(--io-item-height));
      margin-right: var(--io-spacing);
    }
    :host > io-slider {
      flex: 1 1 calc(2 * var(--io-item-height));
      min-width: calc(2 * var(--io-item-height));
    }
    `;
    }
    static get Properties() {
        return {
            value: 0,
            step: 0.01,
            conversion: 1,
            min: 0,
            max: 1,
            exponent: 1,
        };
    }
    _onNumberSet(event) {
        this.value = event.detail.value;
        this.dispatchEvent('value-set', event.detail, false);
    }
    _onSliderSet(event) {
        event.detail.value = event.detail.value / this.conversion;
        this.value = event.detail.value;
        this.dispatchEvent('value-set', event.detail, false);
    }
    changed() {
        this.template([
            ['io-number', {
                    id: 'number',
                    value: this.value,
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    'on-value-set': this._onNumberSet,
                }],
            ['io-slider', {
                    id: 'slider',
                    value: this.value * this.conversion,
                    step: this.step * this.conversion,
                    min: this.min * this.conversion,
                    max: this.max * this.conversion,
                    exponent: this.exponent,
                    label: this.label,
                    'on-value-set': this._onSliderSet,
                }]
        ]);
    }
}
RegisterIoElement(IoNumberSlider);

class NumberSlider {
    element = new IoNumberSlider();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
        this.element.$.slider.lazy = false;
    }
    reset() {
        this.element.value = 0;
        this.element.step = 0.001;
        this.element.min = 0;
        this.element.max = 1;
    }
    run() {
        describe('IoNumberSlider', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.value).to.equal(0);
                    chai.expect(this.element.step).to.equal(0.01);
                    chai.expect(this.element.min).to.equal(0);
                    chai.expect(this.element.max).to.equal(1);
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.element.value = 0;
                    chai.expect(this.element.$.number.innerText).to.equal('0');
                    this.element.value = 1;
                    chai.expect(this.element.$.number.innerText).to.equal('1');
                    this.element.value = 0.1;
                    chai.expect(this.element.$.number.innerText).to.equal('0.1');
                    this.element.value = 0.01;
                    chai.expect(this.element.$.number.innerText).to.equal('0.01');
                    this.element.value = 0.001;
                    chai.expect(this.element.$.number.innerText).to.equal('0');
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    chai.expect(this.element.$.number.getAttribute('tabindex')).to.equal('0');
                    chai.expect(this.element.$.slider.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attribute on number field', () => {
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
                    chai.expect(this.element.$.number.getAttribute('contenteditable')).to.equal('');
                    chai.expect(this.element.$.slider.getAttribute('contenteditable')).to.equal(null);
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.$.slider.getAttribute('role')).to.equal('slider');
                    this.element.value = 0.1;
                    chai.expect(this.element.$.slider.getAttribute('aria-valuenow')).to.equal('0.1');
                    this.element.min = 0;
                    chai.expect(this.element.$.slider.getAttribute('aria-valuemin')).to.equal('0');
                    this.element.max = 1;
                    chai.expect(this.element.$.slider.getAttribute('aria-valuemax')).to.equal('1');
                    this.reset();
                });
            });
        });
    }
}

/*
 * Extends `IoNumberSlider`. Implements `IoNumber` and `IoSliderRange`.
 *
 * Input element for `Array(2)` data type combining `IoNumber` and `IoSliderRange`
 *
 * <io-element-demo element="io-number-slider-range" properties='{"value": [0, 2], "step": 0.05, "min": -1, "max": 2}'></io-element-demo>
 **/
class IoNumberSliderRange extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      flex: 0 0 calc(2 * var(--io-item-height));
    }
    :host > io-slider-range {
      margin-left: var(--io-spacing);
      margin-right: var(--io-spacing);
      flex: 1 1 calc(2 * var(--io-item-height));
      min-width: calc(2 * var(--io-item-height));
    }
    `;
    }
    static get Properties() {
        return {
            value: {
                type: Array,
                value: [0, 0],
                observe: true,
            },
            step: 0.01,
            conversion: 1,
            min: 0,
            max: 1,
            exponent: 1,
        };
    }
    _onNumberSet(event) {
        const item = event.composedPath()[0];
        if (item === this.$.number0)
            this.value[0] = event.detail.value;
        if (item === this.$.number1)
            this.value[1] = event.detail.value;
        event.detail.value = this.value;
        this.dispatchEvent('value-set', event.detail, false);
    }
    _onSliderSet(event) {
        this.value = event.detail.value;
        this.dispatchEvent('value-set', event.detail, false);
    }
    changed() {
        this.template([
            ['io-number', {
                    id: 'number0',
                    value: this.value[0],
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    'on-value-set': this._onNumberSet,
                }],
            ['io-slider-range', {
                    id: 'slider',
                    // TODO: conversion
                    value: this.value,
                    step: this.step,
                    min: this.min,
                    max: this.max,
                    exponent: this.exponent,
                    label: this.label,
                    'on-value-set': this._onSliderSet,
                }],
            ['io-number', {
                    id: 'number1',
                    value: this.value[1],
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    'on-value-set': this._onNumberSet,
                }],
        ]);
    }
}
RegisterIoElement(IoNumberSliderRange);

class NumberSliderRange {
    element = new IoNumberSliderRange();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    reset() {
        this.element.value = [0, 1];
        this.element.step = 0.01;
        this.element.min = 0;
        this.element.max = 1;
    }
    run() {
        describe('IoNumberSliderRange', () => {
            describe('default values', () => {
                it('has default values', () => {
                    this.reset();
                    chai.expect(this.element.value[0]).to.equal(0);
                    chai.expect(this.element.value[1]).to.equal(1);
                    chai.expect(this.element.step).to.equal(0.01);
                    chai.expect(this.element.min).to.equal(0);
                    chai.expect(this.element.max).to.equal(1);
                });
            });
            describe('innerText', () => {
                it('matches values', () => {
                    this.reset();
                    this.element.value = [0, 1];
                    chai.expect(this.element.$.number0.innerText).to.equal('0');
                    this.element.value = [1, 1];
                    chai.expect(this.element.$.number0.innerText).to.equal('1');
                    chai.expect(this.element.$.number1.innerText).to.equal('1');
                    this.element.value = [0, 0.1];
                    chai.expect(this.element.$.number1.innerText).to.equal('0.1');
                    this.element.value = [0, 0.001];
                    chai.expect(this.element.$.number1.innerText).to.equal('0');
                });
            });
            describe('attributes', () => {
                it('has tabindex attribute', () => {
                    this.reset();
                    chai.expect(this.element.$.number0.getAttribute('tabindex')).to.equal('0');
                    chai.expect(this.element.$.slider.getAttribute('tabindex')).to.equal('0');
                });
                it('has contenteditable attribute on number field', () => {
                    this.reset();
                    chai.expect(this.element.getAttribute('contenteditable')).to.equal(null);
                    chai.expect(this.element.$.number0.getAttribute('contenteditable')).to.equal('');
                    chai.expect(this.element.$.number1.getAttribute('contenteditable')).to.equal('');
                    chai.expect(this.element.$.slider.getAttribute('contenteditable')).to.equal(null);
                });
                it('has a11y attributes', () => {
                    this.reset();
                    chai.expect(this.element.$.slider.getAttribute('role')).to.equal('slider');
                    this.element.min = 0;
                    chai.expect(this.element.$.slider.getAttribute('aria-valuemin')).to.equal('0');
                    this.element.max = 1;
                    chai.expect(this.element.$.slider.getAttribute('aria-valuemax')).to.equal('1');
                    this.reset();
                });
            });
        });
    }
}

/*
 * Extends `IoElement`.
 *
 * SVG icon element. Displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.
 *
 * <io-element-demo element="io-icon" properties='{"icon": "icons:link", "stroke": false}' config='{"icon": ["io-option-menu", {"options": ["icons:link", "icons:unlink", "icons:check", "icons:uncheck"]}]}'></io-element-demo>
 **/
class IoIcon extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-item;
    }
    :host {
      width: var(--io-item-height);
      height: var(--io-item-height);
      border: 0;
      padding: 0;
      fill: var(--io-color, currentcolor);
    }
    :host[stroke] {
      stroke: var(--io-background-color, currentcolor);
      stroke-width: var(--io-stroke-width);
    }
    :host > svg {
      width: 100%;
      height: 100%;
    }
    :host > svg > g {
      pointer-events: none;
      transform-origin: 0px 0px;
    }
    `;
    }
    static get Properties() {
        return {
            icon: {
                value: '',
                reflect: -1,
            },
            label: {
                value: '',
                reflect: 1,
            },
            stroke: {
                value: false,
                reflect: 1,
            },
        };
    }
    iconChanged() {
        this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
    }
}
RegisterIoElement(IoIcon);

class Icon {
    element = new IoIcon();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    run() {
        describe('IoIcon', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.icon).to.equal('');
                    chai.expect(this.element.label).to.equal('');
                });
            });
            describe('innerSvg', () => {
                it('matches icon', () => {
                    this.element.icon = 'icon:check';
                    chai.expect(this.element.innerHTML).to.equal(IoIconsetSingleton.getIcon('icon:check'));
                    this.element.icon = '';
                });
            });
        });
    }
}

class IconSet {
    element;
    constructor() {
        this.element = IoIconsetSingleton;
    }
    run() {
        describe('IoIconsetSingleton', () => {
            it('registers icons', () => {
                const testicons = '<svg><g id="test"><path></path></g></svg>';
                IoIconsetSingleton.registerIcons('test', testicons);
                chai.expect(IoIconsetSingleton.getIcon('test:test')).to.equal('<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-test"><path></path></g></svg>');
            });
        });
    }
}

class Layer {
    element;
    constructor() {
        this.element = IoLayerSingleton;
    }
    run() {
        describe('IoLayerSingleton', () => {
            it('TODO', () => {
            });
        });
    }
}

// TODO: test with src element.
class Ladder {
    element = new IoLadder();
    constructor() {
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }
    reset() {
        this.element.conversion = 1;
        this.element.step = 0.0001;
        this.element.min = -Infinity;
        this.element.max = Infinity;
    }
    run() {
        describe('IoLadder', () => {
            describe('default values', () => {
                it('has default values', () => {
                    chai.expect(this.element.label).to.equal('');
                    chai.expect(this.element.conversion).to.equal(1);
                    chai.expect(this.element.expanded).to.equal(false);
                    chai.expect(this.element.min).to.equal(-Infinity);
                    chai.expect(this.element.max).to.equal(Infinity);
                    chai.expect(this.element.step).to.equal(0.0001);
                });
            });
            describe('steps innerText', () => {
                const $ = (selector) => { return this.element.querySelector(selector); };
                it('matches values', () => {
                    chai.expect($('.io-up1').value).to.equal(1);
                    chai.expect($('.io-up1').textContent).to.equal('1');
                    chai.expect($('.io-up2').textContent).to.equal('10');
                    chai.expect($('.io-up3').textContent).to.equal('100');
                    chai.expect($('.io-up4').textContent).to.equal('1000');
                    chai.expect($('.io-down1').value).to.equal(0.1);
                    chai.expect($('.io-down1').textContent).to.equal('0.1');
                    chai.expect($('.io-down2').textContent).to.equal('0.01');
                    chai.expect($('.io-down3').textContent).to.equal('0.001');
                    chai.expect($('.io-down4').textContent).to.equal('0.0001');
                });
                it('matches value with custom step settings', () => {
                    this.element.step = 0.2;
                    chai.expect($('.io-up1').value).to.equal(2);
                    chai.expect($('.io-up1').textContent).to.equal('2');
                    chai.expect($('.io-up2').textContent).to.equal('20');
                    chai.expect($('.io-up3').textContent).to.equal('200');
                    chai.expect($('.io-up4').textContent).to.equal('2000');
                    chai.expect($('.io-down1').value).to.equal(0.2);
                    chai.expect($('.io-down1').textContent).to.equal('0.2');
                    chai.expect($('.io-down2')).to.equal(null);
                    chai.expect($('.io-down3')).to.equal(null);
                    chai.expect($('.io-down4')).to.equal(null);
                    this.element.step = 0.02;
                    chai.expect($('.io-down1').textContent).to.equal('0.2');
                    chai.expect($('.io-down2').textContent).to.equal('0.02');
                    chai.expect($('.io-down3')).to.equal(null);
                    this.reset();
                });
                it('matches value with custom min/max settings', () => {
                    this.element.min = 0;
                    this.element.max = 100;
                    chai.expect($('.io-up1').value).to.equal(1);
                    chai.expect($('.io-up1').textContent).to.equal('1');
                    chai.expect($('.io-up2').textContent).to.equal('10');
                    chai.expect($('.io-up3').textContent).to.equal('100');
                    chai.expect($('.io-up4')).to.equal(null);
                    this.element.max = 1000;
                    chai.expect($('.io-up4').textContent).to.equal('1000');
                    this.reset();
                });
                it('matches value with conversion factor', () => {
                    this.element.conversion = 20;
                    chai.expect($('.io-up2').value).to.equal(10);
                    chai.expect($('.io-up2').textContent).to.equal('200');
                    this.element.step = 0.2;
                    chai.expect($('.io-up2').value).to.equal(20);
                    chai.expect($('.io-up2').textContent).to.equal('400');
                    this.reset();
                });
            });
            describe('attributes', () => {
                const $ = (selector) => { return this.element.querySelector(selector); };
                it('steps have tabindex attribute', () => {
                    chai.expect($('.io-up1').getAttribute('tabindex')).to.equal('0');
                    chai.expect($('.io-down1').getAttribute('tabindex')).to.equal('0');
                });
                it('has a11y attributes', () => {
                    chai.expect(this.element.getAttribute('role')).to.equal('list');
                });
                it('steps have a11y attributes', () => {
                    chai.expect($('.io-up1').getAttribute('role')).to.equal('spinbutton');
                    chai.expect($('.io-up1').getAttribute('type')).to.equal('number');
                    chai.expect($('.io-up1').getAttribute('aria-label')).to.equal('1');
                    chai.expect($('.io-up1').getAttribute('aria-valuemax')).to.equal('Infinity');
                    chai.expect($('.io-up1').getAttribute('aria-valuemin')).to.equal('-Infinity');
                    // TODO: test with src element
                    // chai.expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('0');
                    // this.element.value = 3;
                    // chai.expect($('.io-up1').getAttribute('aria-valuenow')).to.equal('3');
                    this.element.step = 0.5;
                    chai.expect($('.io-up1').getAttribute('aria-label')).to.equal('5');
                });
            });
        });
    }
}

class Theme {
    element;
    constructor() {
        this.element = IoThemeSingleton;
    }
    run() {
        describe('IoThemeSingleton', () => {
            it('TODO', () => {
            });
        });
    }
}

// import Collapsable from "./elements/layout/collapsable.test.js";
// import Properties from "./elements/object/properties.test.js";
// import Object from "./elements/object/object.test.js";
// import Inspector from "./elements/object/inspector.test.js";
// import OptionMenu from "./elements/menus/option-menu.test.js";
mocha.setup('bdd');
const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.appendChild(mochaDiv);
mochaDiv.style.display = 'none';
let testCompleted = false;
function runTests() {
    if (!testCompleted) {
        new ChangeQueue().run();
        new EventDispatcher().run();
        new Properties().run();
        new PropertyBinder().run();
        new ProtoChain().run();
        new Node().run();
        new Element().run();
        new Item().run();
        new Content().run();
        new Gl().run();
        new Button().run();
        new Boolean$1().run();
        new Boolean$1().run();
        new Boolicon().run();
        new Switch().run();
        new Sting().run();
        new Number$1().run();
        new Slider().run();
        new SliderRange().run();
        new NumberSlider().run();
        new NumberSliderRange().run();
        new Icon().run();
        new IconSet().run();
        new Layer().run();
        new Ladder().run();
        new Theme().run();
        // TODO
        // new OptionMenu().run();
        // new Collapsable().run();
        // new Properties().run();
        // new Object().run();
        // new Inspector().run();
        mocha.checkLeaks();
        mocha.run();
        testCompleted = true;
    }
}
class IoTest extends IoElement$1 {
    static get Style() {
        return /* css */ `
      :host #mocha {
        margin: 0;
        position: relative;
      }
      :host #mocha-report {
        margin: 2em 1em;
      }
      :host #mocha-stats {
        position: absolute;
        top: -2em;
        right: 2em;
        font-size: 12px;
        margin: 0;
      }
      :host #mocha-stats em {
        color: var(--io-color);
      }
      :host #mocha-stats li {
        padding: 0;
      }
      :host #mocha-stats .progress {
        display: none;
      }
      :host #mocha-stats .passes {
        color: #0c0;
      }
      :host #mocha-stats .failures {
        color: #f00;
        font-weight: bold;
      }
      :host h2 {
        padding-right: 2em;
      }
      :host .replay {
        display: none !important;
      }
    `;
    }
    connectedCallback() {
        super.connectedCallback();
        runTests();
        this.appendChild(mochaDiv);
        mochaDiv.style.display = 'block';
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.appendChild(mochaDiv);
        mochaDiv.style.display = 'none';
    }
}
RegisterIoElement$1(IoTest);

export { IoTest };
