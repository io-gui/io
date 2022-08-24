import { ProtoChain } from './internals/protoChain.js';
import { Binding } from './internals/binding.js';
import { ChangeQueue } from './internals/changeQueue.js';
import { Property } from './internals/property.js';
import { EventDispatcher } from './internals/eventDispatcher.js';
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export function IoNodeMixin(superclass) {
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
        _properties = {};
        _bindings = {};
        _changeQueue;
        _eventDispatcher;
        /**
        * Creates a class instance and initializes the internals.
        * @param {Object} properties - Initial property values.
        */
        constructor(properties = {}, ...args) {
            super(...args);
            debug: {
                const constructor = this.__proto__.constructor;
                if (constructor._registeredAs !== constructor.name) {
                    console.error(`${constructor.name} not registered! Call "RegisterIoNode()" before using ${constructor.name} class!`);
                }
            }
            this._protochain.bindFunctions(this);
            this._changeQueue = new ChangeQueue(this);
            Object.defineProperty(this, '_changeQueue', { enumerable: false });
            this._eventDispatcher = new EventDispatcher(this);
            Object.defineProperty(this, '_eventDispatcher', { enumerable: false });
            for (const name in this._protochain.properties) {
                const property = new Property(this._protochain.properties[name]);
                this._properties[name] = property;
                const value = property.value;
                if (value !== undefined && value !== null) {
                    // TODO: document special handling of object and node values
                    if (typeof value === 'object') {
                        this.queue(name, value, undefined);
                    }
                    else if (property.reflect !== undefined && property.reflect >= 1 && this._isIoElement) {
                        // TODO: Resolve bi-directional reflection when attributes are set in html (role, etc...)
                        this.setAttribute(name, value);
                    }
                }
                if (property.binding)
                    property.binding.addTarget(this, name);
            }
            Object.defineProperty(this, '_properties', { enumerable: false });
            Object.defineProperty(this, '_bindings', { enumerable: false });
            Object.defineProperty(this, 'objectMutated', { enumerable: false, value: this.objectMutated.bind(this) });
            Object.defineProperty(this, 'objectMutatedThrottled', { enumerable: false, value: this.objectMutatedThrottled.bind(this) });
            Object.defineProperty(this, 'queueDispatch', { enumerable: false, value: this.queueDispatch.bind(this) });
            Object.defineProperty(this, 'queueDispatchLazy', { enumerable: false, value: this.queueDispatchLazy.bind(this) });
            if (this._protochain.observedObjects.length) {
                window.addEventListener('object-mutated', this.objectMutated);
            }
            this.applyProperties(properties);
        }
        /**
         * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
         * @param {string} name Property name to set value of.
         * @param {any} value Peroperty value.
         * @param {boolean} [skipDispatch] flag to skip event dispatch.
         */
        setProperty(name, value, skipDispatch) {
            const prop = this._properties[name];
            const oldValue = prop.value;
            if (value !== oldValue) {
                const binding = (value instanceof Binding) ? value : undefined;
                if (binding) {
                    const oldBinding = prop.binding;
                    if (oldBinding && binding !== oldBinding) {
                        oldBinding.removeTarget(this, name);
                    }
                    binding.addTarget(this, name);
                    value = binding.value;
                }
                else {
                    // TODO: Verify and test this edge-case fix. Look for regressions.
                    // If user uses setProperties() to batch-set multiple properties that are bound to parent element it causes
                    // all but one of those properties to be reset to original value once parents's change event happens.
                    // This fixes the bug by setting parent's property value with skipDispatch. This can possibly introduce
                    // bug when parent has properties bound to other elements. Create and extensive test for this but fix.
                    // TODO: finish this fix - it caused regression in io-option-menu
                    // if (prop.binding && skipDispatch) {
                    //   prop.binding.node.setProperty(prop.binding.property, value, skipDispatch);
                    // }
                }
                prop.value = value;
                debug: {
                    if (prop.type === String) {
                        if (typeof value !== 'string') {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this._node);
                        }
                    }
                    else if (prop.type === Number) {
                        if (typeof value !== 'number') {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this._node);
                        }
                    }
                    else if (prop.type === Boolean) {
                        if (typeof value !== 'boolean') {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this._node);
                        }
                    }
                    else if (prop.type) {
                        if (!(value instanceof prop.type)) {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this._node);
                        }
                    }
                }
                if (prop.notify && oldValue !== value) {
                    // TODO: consider skiping queue
                    this.queue(name, value, oldValue);
                    if (!skipDispatch) {
                        this.queueDispatch();
                    }
                }
                if (prop.reflect !== undefined && prop.reflect >= 1 && this._isIoElement)
                    this.setAttribute(name, value);
            }
        }
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        applyProperties(props) {
            for (const p in props) {
                if (this._properties[p] === undefined) {
                    debug: {
                        if (!p.startsWith('on-') && p !== 'import' && p !== 'style' && p !== 'config') {
                            // TODO: consider converting import and style to properties
                            console.warn(`Property "${p}" is not defined`, this);
                        }
                    }
                    continue;
                }
                this.setProperty(p, props[p], true);
            }
            this._eventDispatcher.applyPropListeners(props);
            this.queueDispatch();
        }
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        setProperties(props) {
            for (const p in props) {
                if (this._properties[p] === undefined) {
                    debug: {
                        console.warn(`Property "${p}" is not defined`, this);
                    }
                    continue;
                }
                this.setProperty(p, props[p], true);
            }
            this.queueDispatch();
        }
        // TODO: consider moving into a different class
        /**
         * Sets value property and emits `value-set` event.
         * Use this when value property is set by user action (e.g. mouse click).
         * @param {*} value - Property value.
         */
        setValue(value) {
            if (this.value !== value) {
                const oldValue = this.value;
                this.setProperty('value', value);
                this.dispatchEvent('value-set', { value: value, oldValue: oldValue }, false);
            }
        }
        /**
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose() {
            this._changeQueue.dispose();
            this._propertyBinder.dispose();
            this._eventDispatcher.dispose();
            for (const name in this._properties) {
                if (this._properties[name].binding) {
                    // TODO: test this specifically
                    this._properties[name].binding?.removeTarget(this._node, name);
                }
            }
            for (const name in this._bindings) {
                this._bindings[name].dispose();
                delete this._bindings[name];
            }
            if (this._protochain.observedObjects.length) {
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
                    debug: {
                        if (!this._properties[prop] || typeof this._properties[prop].value !== 'object') {
                            console.error(`Composed property ${prop} is not a Node or an object.`);
                            continue;
                        }
                    }
                    const object = this._properties[prop].value;
                    if (object._isIoNode) {
                        // TODO: make sure composed and declarative listeners are working together
                        object.applyProperties(compose[prop]);
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
            this._changeQueue.queue(prop, value, oldValue);
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
                this._changeQueue.dispatch();
            }
        }
        /**
         * Dispatches the queue in the next rAF cycle.
         */
        queueDispatchLazy() {
            this._changeQueue.dispatch();
        }
        /**
         * Event handler for 'object-mutated' event emitted from the `window`.
         * Node should be listening for this event if it has an object property
         * with `observe: "sync" || "async"` configuration.
         * @param {Object} event - Event payload.
         * @param {Object} event.detail.object - Mutated object.
         */
        objectMutated(event) {
            for (let i = 0; i < this._protochain.observedObjects.length; i++) {
                const prop = this._protochain.observedObjects[i];
                const value = this._properties[prop].value;
                if (value === event.detail.object) {
                    this.throttle(this.objectMutatedThrottled, prop, false);
                    return;
                }
                // else if (event.detail.objects && event.detail.objects.indexOf(value) !== -1) {
                //   this.throttle(this.objectMutatedThrottled, prop, false);
                //   return;
                // }
                debug: {
                    if (event.detail.objects) {
                        console.error('Deprecation warning! `objects` property no longer supported. Use `object` property instead.');
                        return;
                    }
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
            debug: {
                if (!this._properties[prop]) {
                    console.warn(`IoGUI Node: cannot bind to ${prop} property. Does not exist!`);
                }
            }
            this._bindings[prop] = this._bindings[prop] || new Binding(this, prop);
            return this._bindings[prop];
        }
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} prop - Property to unbind.
         */
        unbind(prop) {
            if (this._bindings[prop])
                this._bindings[prop].dispose();
            delete this._bindings[prop];
            if (this._properties[prop].binding) {
                this._properties[prop].binding?.removeTarget(this, prop);
            }
        }
        /**
         * Wrapper for addEventListener.
         * @param {string} type - listener name.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        addEventListener(type, listener, options) {
            debug: {
                if (typeof listener !== 'function') {
                    console.warn(`${this.constructor.name}incorrect listener type.`, this);
                    return;
                }
            }
            this._eventDispatcher.addEventListener(type, listener, options);
        }
        /**
         * Wrapper for removeEventListener.
         * @param {string} type - event name to listen to.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        removeEventListener(type, listener, options) {
            this._eventDispatcher.removeEventListener(type, listener, options);
        }
        /**
         * Wrapper for dispatchEvent.
         * @param {string} type - event name to dispatch.
         * @param {Object} detail - event detail.
         * @param {boolean} bubbles - event bubbles.
         * @param {HTMLElement|Node} src source node/element to dispatch event from.
         */
        dispatchEvent(type, detail = {}, bubbles = false, src) {
            this._eventDispatcher.dispatchEvent(type, detail, bubbles, src);
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
    Object.defineProperty(classConstructor, 'name', { value: 'IoNodeMixinConstructor' });
    return classConstructor;
}
/**
 * Register function to be called once per class.
 * @param {IoNode} nodeConstructor - Node class to register.
 */
export const RegisterIoNode = function (nodeConstructor) {
    const proto = nodeConstructor.prototype;
    Object.defineProperty(proto, '_isIoNode', { value: true });
    Object.defineProperty(nodeConstructor, '_registeredAs', { value: nodeConstructor.name });
    Object.defineProperty(proto, '_protochain', { value: new ProtoChain(nodeConstructor) });
    for (const p in proto._protochain.properties) {
        Object.defineProperty(proto, p, {
            get: function () {
                return this._properties[p].value;
            },
            set: function (value) {
                this.setProperty(p, value);
            },
            configurable: true,
        });
    }
};
/**
 * IoNodeMixin applied to `Object` class.
 */
export class IoNode extends IoNodeMixin(Object) {
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
//# sourceMappingURL=io-node.js.map