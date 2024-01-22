var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ProtoChain } from './internals/protoChain.js';
import { Binding } from './internals/binding.js';
import { ChangeQueue } from './internals/changeQueue.js';
import { PropertyInstance } from './internals/property.js';
import { EventDispatcher } from './internals/eventDispatcher.js';
/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export function IoNodeMixin(superclass) {
    const IoNodeMixinConstructor = class extends superclass {
        static get Properties() {
            return {
                lazy: {
                    value: false,
                    reactive: false,
                    reflect: true
                }
            };
        }
        constructor(properties = {}, ...args) {
            super(...args);
            debug: {
                const constructor = Object.getPrototypeOf(this).constructor;
                if (this._protochain.constructors[0] !== constructor) {
                    console.error(`${constructor.name} not registered! Call "Register([ClassName])" of @Register decorator before using ${constructor.name} class!`);
                }
            }
            this._protochain.autobindFunctions(this);
            Object.defineProperty(this, '_changeQueue', { enumerable: false, configurable: true, value: new ChangeQueue(this) });
            Object.defineProperty(this, '_properties', { enumerable: false, configurable: true, value: new Map() });
            Object.defineProperty(this, '_bindings', { enumerable: false, configurable: true, value: new Map() });
            Object.defineProperty(this, '_eventDispatcher', { enumerable: false, configurable: true, value: new EventDispatcher(this) });
            for (const p in this._protochain.properties) {
                Object.defineProperty(this, p, {
                    get: function () {
                        return this._properties.get(p).value;
                    },
                    set: function (value) {
                        this.setProperty(p, value);
                    },
                    configurable: true,
                });
            }
            for (const name in this._protochain.properties) {
                const property = new PropertyInstance(this, this._protochain.properties[name]);
                this._properties.set(name, property);
                const value = property.value;
                if (value !== undefined && value !== null) {
                    if (property.reflect && this._isIoElement) {
                        this.setAttribute(name, value);
                    }
                }
                if (property.binding)
                    property.binding.addTarget(this, name);
            }
            this.applyProperties(properties);
            if (this._protochain.observedObjectProperties.length) {
                window.addEventListener('object-mutated', this.onObjectMutated);
            }
            this.init();
        }
        /**
         * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
         * @param {string} name Property name to set value of.
         * @param {any} value Peroperty value.
         * @param {boolean} [skipDispatch] flag to skip event dispatch.
         */
        setProperty(name, value, skipDispatch) {
            const prop = this._properties.get(name);
            const oldValue = prop.value;
            if (value !== oldValue) {
                const binding = (value instanceof Binding) ? value : null;
                if (binding) {
                    const oldBinding = prop.binding;
                    if (binding !== oldBinding) {
                        if (oldBinding) {
                            oldBinding.removeTarget(this, name);
                        }
                        // TODO: check for regressions.
                        // binding.addTarget will invoke setProperty again, so maybe we can skip the rest of the logic.
                        binding.addTarget(this, name);
                        return;
                    }
                    else {
                        // NOTE: Whenusing change() > template() > setProperties() to batch-set multiple properties with bindings, it causes
                        // all but one of those properties to be reset to original value once parents's change event happens.
                        // This fixed the bug by setting binding value from target when binding already exists.
                        // TODO: make more tests to make sure this does not cause regressions and unexpected behaviors.
                        binding.value = value = prop.value;
                    }
                    debug: {
                        if (!prop.reactive) {
                            console.warn(`IoNode: property "${name}" is bound but has reactive flag set to false!`);
                        }
                    }
                }
                prop.value = value;
                if (value instanceof Binding)
                    console.log(value instanceof Binding);
                debug: {
                    if (prop.type === String) {
                        if (typeof value !== 'string') {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
                        }
                    }
                    else if (prop.type === Number) {
                        if (typeof value !== 'number') {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
                        }
                    }
                    else if (prop.type === Boolean) {
                        if (typeof value !== 'boolean') {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
                        }
                    }
                    else if (prop.type === Array) {
                        if (!(value instanceof Array)) {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
                        }
                    }
                    else if (prop.type === Object) {
                        if (value instanceof Array) {
                            console.warn(`Wrong type of property "${name}". Value: "${JSON.stringify(value)}". Expected type: ${prop.type.name}`, this);
                        }
                    }
                    else if (typeof prop.type === 'function') {
                        if (!(value instanceof prop.type)) {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
                        }
                    }
                }
                if (prop.reactive && oldValue !== value) {
                    this.queue(name, value, oldValue);
                    if (!skipDispatch) {
                        this.dispatchQueue();
                    }
                }
                if ((prop.reflect) && this._isIoElement)
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
                if (!this._properties.has(p)) {
                    debug: {
                        // TODO: consider converting style and config to properties
                        // TODO: document!
                        if (!p.startsWith('@') && p !== 'style' && p !== 'config' && p !== '$') {
                            console.warn(`Property "${p}" is not defined`, this);
                        }
                    }
                    continue;
                }
                this.setProperty(p, props[p], true);
            }
            this._eventDispatcher.applyPropListeners(props);
            this.dispatchQueue();
        }
        /**
         * Sets multiple properties in batch.
         * [property]-changed` events will be broadcast in the end.
         * @param {Object} props - Map of property names and values.
         */
        setProperties(props) {
            for (const p in props) {
                if (!this._properties.has(p)) {
                    debug: {
                        console.warn(`Property "${p}" is not defined`, this);
                    }
                    continue;
                }
                this.setProperty(p, props[p], true);
            }
            this.dispatchQueue();
        }
        /**
         * Sets value property and emits `value-input` event.
         * Use this when value property is set by user action (e.g. mouse click).
         * @param {*} value - Property value.
         */
        inputValue(value) {
            if (this.value !== value || typeof this.value === 'object') {
                const oldValue = this.value;
                this.setProperty('value', value);
                this.dispatchEvent('value-input', { value: value, oldValue: oldValue }, false);
            }
        }
        /**
         * default change handler.
         * Invoked when one of the properties change.
         */
        changed() { }
        init() { }
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
         * Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.
         */
        dispatchQueue() {
            if (this.lazy) {
                this.throttle(this.dispatchQueueSync);
            }
            else {
                this.dispatchQueueSync();
            }
        }
        /**
         * Dispatches the queue immediately.
         */
        dispatchQueueSync = () => {
            this._changeQueue.dispatch();
        };
        /**
         * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
         * @param {function} func - Function to throttle.
         * @param {*} arg - argument for throttled function.
         * @param {number} timeout - minimum delay in ms before executing the function.
         */
        throttle(func, arg = undefined, timeout = 1) {
            throttle(this, func, arg, timeout);
        }
        /**
         * Event handler for 'object-mutated' event emitted from the `window`.
         * Node should be listening for this event if it has an observed object property
         * @param {Object} event - Event payload.
         * @param {Object} event.detail.object - Mutated object.
         */
        onObjectMutated = (event) => {
            for (let i = 0; i < this._protochain.observedObjectProperties.length; i++) {
                const prop = this._protochain.observedObjectProperties[i];
                const value = this._properties.get(prop).value;
                if (value === event.detail.object) {
                    this.throttle(this.objectMutated, prop, 0);
                    return;
                }
                debug: {
                    if (event.detail.objects) {
                        console.error('Deprecation warning! `objects` property no longer supported. Use `object` property instead.');
                        return;
                    }
                }
            }
        };
        /**
         * This function is called after `onObjectMutated()` determines that one of
         * the object properties has mutated.
         * @param {string} prop - Mutated object property name.
         */
        objectMutated = (prop) => {
            if (this[prop + 'Mutated'])
                this[prop + 'Mutated']();
            this.changed();
            this.dispatchEvent('changed');
            this.dispatchMutationEvent(this);
        };
        /**
         * Returns a binding to a specified property`.
         * @param {string} prop - Property to bind to.
         * @return {Binding} Binding object.
         */
        bind(prop) {
            debug: {
                if (!this._properties.has(prop)) {
                    console.warn(`IoGUI Node: cannot bind to ${prop} property. Does not exist!`);
                }
                else if (this._properties.get(prop).reactive === false) {
                    console.warn(`IoGUI Node: cannot bind to ${prop} property. It has reactive flag set to false!`);
                }
            }
            if (!this._bindings.has(prop)) {
                this._bindings.set(prop, new Binding(this, prop));
            }
            return this._bindings.get(prop);
        }
        /**
         * Unbinds a binding to a specified property`.
         * @param {string} prop - Property to unbind.
         */
        unbind(prop) {
            const binding = this._bindings.get(prop);
            if (binding) {
                binding.dispose();
                this._bindings.delete(prop);
            }
            const property = this._properties.get(prop);
            property?.binding?.removeTarget(this, prop);
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
         * Shorthand for dispatching `'object-mutated'` event on window.
         * @param {any} object - object which mutated.
         */
        dispatchMutationEvent(object) {
            this.dispatchEvent('object-mutated', { object: object }, true, window);
        }
        /**
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose() {
            debug: {
                if (this._disposed) {
                    // TODO: figure out how to prevent redundant disposals from nested io-selectors with cache:false
                    // console.warn('IoNode.dispose(): Already disposed!', this.constructor.name);
                }
            }
            if (this._disposed)
                return;
            // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
            this._bindings.forEach((binding, key) => {
                binding.dispose();
                this._bindings.delete(key);
            });
            delete this._bindings;
            if (this._protochain.observedObjectProperties.length) {
                window.removeEventListener('object-mutated', this.onObjectMutated);
            }
            delete this._protochain;
            this._changeQueue.dispose();
            delete this._changeQueue;
            this._properties.forEach((property, key) => {
                property.binding?.removeTarget(this, key);
            });
            this._eventDispatcher.dispose();
            delete this._eventDispatcher;
            delete this._properties;
            Object.defineProperty(this, '_disposed', { value: true });
        }
        Register(ioNodeConstructor) {
            Object.defineProperty(ioNodeConstructor.prototype, '_protochain', { value: new ProtoChain(ioNodeConstructor) });
        }
    };
    return IoNodeMixinConstructor;
}
/**
 * Register function to be called once per class.
 * @param {IoNode} ioNodeConstructor - Node class to register.
 */
export function Register(ioNodeConstructor) {
    ioNodeConstructor.prototype.Register(ioNodeConstructor);
}
/**
 * IoNodeMixin applied to `Object` class.
 */
let IoNode = class IoNode extends IoNodeMixin(Object) {
};
IoNode = __decorate([
    Register
], IoNode);
export { IoNode };
// TODO: Document and test. Improve argument and node disposal handling. Consider edge-cases.
const throttleQueueSync = [];
const throttleQueue = [];
const throttleQueueOptions = new WeakMap();
function throttle(node, func, arg = undefined, timeout = 1) {
    if (timeout === 0 && throttleQueueSync.indexOf(func) === -1) {
        throttleQueueSync.push(func);
        try {
            func(arg);
        }
        catch (e) {
            console.error(e);
        }
        return;
    }
    if (throttleQueue.indexOf(func) === -1) {
        throttleQueue.push(func);
    }
    if (!throttleQueueOptions.has(func)) {
        throttleQueueOptions.set(func, {
            node: node,
            arg: arg,
            timeout: Date.now() + timeout,
        });
    }
    else {
        const options = throttleQueueOptions.get(func);
        options.arg = arg;
    }
}
function animate() {
    requestAnimationFrame(animate);
    throttleQueueSync.length = 0;
    for (let i = throttleQueue.length; i--;) {
        const func = throttleQueue[i];
        const options = throttleQueueOptions.get(func);
        if (options.timeout > Date.now()) {
            continue;
        }
        // TODO: make test to veryfy you can add throttled function to throttle queue from itself.
        // If we execute the function before clearing it from the queue it wont be queued again.
        throttleQueue.splice(throttleQueue.indexOf(func), 1);
        throttleQueueOptions.delete(func);
        try {
            if (!options.node._disposed) {
                if (options.arg !== undefined)
                    func(options.arg);
                else
                    func();
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
requestAnimationFrame(animate);
//# sourceMappingURL=node.js.map