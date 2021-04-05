import { ProtoChain } from './protochain.js';
import { ProtoFunctions } from './functions.js';
import { Bindings, Binding } from './binding.js';
import { Queue } from './queue.js';
import { ProtoProperties, Properties } from './properties.js';
import { ProtoListeners, Listeners } from './listeners.js';
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `NodeMixin` applied to it.
 */
function NodeMixin(superclass) {
    const classConstructor = class extends superclass {
        static get Properties() {
            return {
                lazy: Boolean,
            };
        }
        static get Listeners() {
            return {};
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
        * @param {Object} initProps - Initial property values.
        */
        constructor(initProps = {}, ...args) {
            super(...args);
            const constructor = this.__proto__.constructor;
            if (constructor.__registeredAs !== constructor.name) {
                console.error(`${constructor.name} not registered! Call "Register()" before using ${constructor.name} class!`);
            }
            this.__protoFunctions.bind(this);
            Object.defineProperty(this, '__bindings', { enumerable: false, value: new Bindings(this) });
            Object.defineProperty(this, '__queue', { enumerable: false, value: new Queue(this) });
            Object.defineProperty(this, '__listeners', { enumerable: false, value: new Listeners(this, this.__protoListeners) });
            Object.defineProperty(this, '__properties', { enumerable: false, value: new Properties(this, this.__protoProperties) });
            Object.defineProperty(this, 'objectMutated', { enumerable: false, value: this.objectMutated.bind(this) });
            Object.defineProperty(this, 'objectMutatedThrottled', { enumerable: false, value: this.objectMutatedThrottled.bind(this) });
            Object.defineProperty(this, 'queueDispatch', { enumerable: false, value: this.queueDispatch.bind(this) });
            Object.defineProperty(this, 'queueDispatchLazy', { enumerable: false, value: this.queueDispatchLazy.bind(this) });
            Object.defineProperty(this, '__connected', { enumerable: false, writable: true, value: false });
            if (!this.__proto__.__isIoElement) {
                Object.defineProperty(this, '__connections', { enumerable: false, value: [] });
            }
            this.setProperties(initProps);
        }
        /**
         * Connects the instance to another node or element.
         * @param {Node} node - Node to connect to.
         */
        connect(node = window) {
            debug: if (this.__isIoElement) {
                console.error('"connect()" function is not intended for DOM Elements!');
                return;
            }
            debug: if (this.__connections.indexOf(node) !== -1) {
                console.warn('Node already connected to node');
                return;
            }
            this.__connections.push(node);
            if (!this.__connected)
                this.connectedCallback();
        }
        /**
         * Disconnects the instance from an another node or element.
         * @param {Node} node - Node to disconnect from.
         */
        disconnect(node = window) {
            debug: if (this.__isIoElement) {
                console.error('"disconnect()" function is not intended for DOM Elements!');
                return;
            }
            debug: if (this.__connections.indexOf(node) === -1) {
                console.error('Node not connected to:', node);
                return;
            }
            this.__connections.splice(this.__connections.indexOf(node), 1);
            if (this.__connections.length === 0 && this.__connected) {
                this.disconnectedCallback();
            }
        }
        /**
         * Connected callback.
         */
        connectedCallback() {
            this.__connected = true;
            this.__listeners.connect();
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
            this.__listeners.disconnect();
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
            this.__queue.dispose();
            this.__bindings.dispose();
            this.__listeners.dispose();
            this.__properties.dispose();
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
         * Applies composed values to properties.
         */
        applyCompose() {
            // TODO: test compose
            const self = this;
            if (this.compose) {
                for (let prop in self.compose) {
                    debug: if (!this.__properties[prop] || typeof this.__properties[prop].value !== 'object') {
                        console.error(`Composed property ${prop} is not a Node or an object.`);
                        continue;
                    }
                    const object = this.__properties[prop].value;
                    if (object.__isNode) {
                        object.setProperties(self.compose[prop]);
                    }
                    else {
                        for (let p in self.compose[prop]) {
                            object[p] = self.compose[prop][p];
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
            this.__queue.queue(prop, value, oldValue);
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
                this.__queue.dispatch();
            }
        }
        /**
         * Dispatches the queue in the next rAF cycle.
         */
        queueDispatchLazy() {
            this.__queue.dispatch();
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
                debug: if (event.detail.objects) {
                    console.error('Deprecation warning! `objects` property no longer supported. Use `object` property instead.');
                    return;
                }
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
            debug: if (!this.__properties[prop]) {
                console.warn(`IoGUI Node: cannot bind to ${prop} property. Does not exist!`);
                return;
            }
            return this.__bindings.bind(prop);
        }
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} prop - Property to unbind.
         */
        unbind(prop) {
            this.__bindings.unbind(prop);
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
            for (let p in props) {
                if (this.__properties[p] === undefined) {
                    debug: if (!p.startsWith('on-') && p !== 'import' && p !== 'style' && p !== 'config') {
                        // TODO: consider converting import and style to properties
                        console.warn(`Property "${p}" is not defined`, this);
                    }
                    continue;
                }
                this.__properties.set(p, props[p], true);
            }
            this.__listeners.setPropListeners(props, this);
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
            debug: if (typeof listener !== 'function') {
                console.warn(`${this.constructor.name}.${type}() is not a function`, this);
                return;
            }
            this.__listeners.addEventListener(type, listener, options);
        }
        /**
         * Wrapper for removeEventListener.
         * @param {string} type - event name to listen to.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        removeEventListener(type, listener, options) {
            this.__listeners.removeEventListener(type, listener, options);
        }
        /**
         * Wrapper for dispatchEvent.
         * @param {string} type - event name to dispatch.
         * @param {Object} detail - event detail.
         * @param {boolean} bubbles - event bubbles.
         * @param {HTMLElement|Node} src source node/element to dispatch event from.
         */
        dispatchEvent(type, detail, bubbles, src) {
            this.__listeners.dispatchEvent(type, detail, bubbles, src);
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
            for (let key in object) {
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
            for (let key in object) {
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
                    import(importPath)
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
    classConstructor.Register = function () {
        RegisterIoNode(this);
    };
    return classConstructor;
}
/**
 * Register function to be called once per class.
 */
const RegisterIoNode = function (node) {
    const protochain = new ProtoChain(node.prototype);
    let proto = node.prototype;
    Object.defineProperty(proto, '__isNode', { value: true });
    Object.defineProperty(proto.constructor, '__registeredAs', { value: proto.constructor.name });
    Object.defineProperty(proto, '__protochain', { value: protochain });
    Object.defineProperty(proto, '__protoFunctions', { value: new ProtoFunctions(protochain) });
    Object.defineProperty(proto, '__protoProperties', { value: new ProtoProperties(protochain) });
    Object.defineProperty(proto, '__protoListeners', { value: new ProtoListeners(protochain) });
    Object.defineProperty(proto, '__observedObjects', { value: [] });
    for (let p in proto.__protoProperties) {
        if (proto.__protoProperties[p].observe)
            proto.__observedObjects.push(p);
    }
    for (let p in proto.__protoProperties) {
        Object.defineProperty(proto, p, {
            get: function () {
                return this.__properties.get(p);
            },
            set: function (value) {
                debug: {
                    if (proto.__protoProperties[p].readonly)
                        console.error(`IoGUI error. Cannot set value "${value}" to read only property "${p}"`);
                }
                this.__properties.set(p, value);
            },
            enumerable: !!proto.__protoProperties[p].enumerable,
            configurable: true,
        });
    }
};
/**
 * NodeMixin applied to `Object` class.
 */
class Node extends NodeMixin(Object) {
}
const IMPORTED_PATHS = {};
// TODO: document and test
const preThrottleQueue = new Array();
const throttleQueue = new Array();
const argQueue = new WeakMap();
//
const funcQueue = new Array();
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
export { Node, NodeMixin, RegisterIoNode };
//# sourceMappingURL=node.js.map