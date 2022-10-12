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
                    notify: false,
                    reflect: 'attr'
                }
            };
        }
        /**
        * Creates a class instance and initializes the internals.
        * @param {Object} properties - Initial property values.
        */
        constructor(properties = {}, ...args) {
            super(...args);
            debug: {
                const constructor = Object.getPrototypeOf(this).constructor;
                if (this._protochain.constructors[0] !== constructor) {
                    console.error(`${constructor.name} not registered! Call "RegisterIoNode([ClassName])" of @RegisterIoNode decorator before using ${constructor.name} class!`);
                }
            }
            this._protochain.autobindFunctions(this);
            Object.defineProperty(this, '_properties', { enumerable: false, configurable: true, value: {} });
            Object.defineProperty(this, '_bindings', { enumerable: false, configurable: true, value: {} });
            Object.defineProperty(this, '_changeQueue', { enumerable: false, configurable: true, value: new ChangeQueue(this) });
            Object.defineProperty(this, '_eventDispatcher', { enumerable: false, configurable: true, value: new EventDispatcher(this) });
            if (this._protochain.observedObjectProperties.length) {
                window.addEventListener('object-mutated', this.onObjectMutated);
            }
            for (const name in this._protochain.properties) {
                const property = new PropertyInstance(this._protochain.properties[name]);
                this._properties[name] = property;
                const value = property.value;
                if (value !== undefined && value !== null) {
                    if ((property.reflect === 'prop' || property.reflect === 'both') && this._isIoElement) {
                        // TODO: Resolve bi-directional reflection when attributes are set in html (role, etc...)
                        this.setAttribute(name, value);
                    }
                }
                if (property.binding)
                    property.binding.addTarget(this, name);
            }
            for (const p in this._protochain.properties) {
                Object.defineProperty(this, p, {
                    get: function () {
                        return this._properties[p].value;
                    },
                    set: function (value) {
                        this.setProperty(p, value);
                    },
                    configurable: true,
                });
            }
            this.applyProperties(properties);
            this.init();
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
                const binding = (value instanceof Binding) ? value : null;
                if (binding) {
                    const oldBinding = prop.binding;
                    if (binding !== oldBinding) {
                        if (oldBinding) {
                            oldBinding.removeTarget(this, name);
                        }
                        binding.addTarget(this, name);
                        value = binding.value;
                    }
                    else {
                        // NOTE: Whenusing change() > template() > setProperties() to batch-set multiple properties with bindings, it causes
                        // all but one of those properties to be reset to original value once parents's change event happens.
                        // This fixed the bug by setting binding value from target when binding already exists.
                        // TODO: make more tests to make sure this does not cause regressions and unexpected behaviors.
                        binding.value = value = prop.value;
                    }
                }
                prop.value = value;
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
                    else if (prop.type) {
                        if (!(value instanceof prop.type)) {
                            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
                        }
                    }
                }
                if (prop.notify && oldValue !== value) {
                    this.queue(name, value, oldValue);
                    if (!skipDispatch) {
                        this.dispatchQueue();
                    }
                }
                if ((prop.reflect === 'prop' || prop.reflect === 'both') && this._isIoElement)
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
                        // TODO: consider converting style and config to properties
                        if (!p.startsWith('on-') && p !== 'style' && p !== 'config') {
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
                if (this._properties[p] === undefined) {
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
            if (this.value !== value) {
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
         * @param {boolean} sync - execute immediately without rAF timeout.
         */
        throttle(func, arg = undefined, sync = false) {
            throttle(func, arg, sync);
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
                const value = this._properties[prop].value;
                if (value === event.detail.object) {
                    this.throttle(this.objectMutated, prop, true);
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
        };
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
         * Disposes all internals.
         * Use this when instance is no longer needed.
         */
        dispose() {
            for (const name in this._properties) {
                if (this._properties[name].binding) {
                    this._properties[name].binding?.removeTarget(this, name);
                }
            }
            for (const name in this._bindings) {
                this._bindings[name].dispose();
                delete this._bindings[name];
            }
            if (this._protochain.observedObjectProperties.length) {
                window.removeEventListener('object-mutated', this.onObjectMutated);
            }
            this._changeQueue.dispose();
            // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
            this._eventDispatcher.dispose();
        }
    };
    return IoNodeMixinConstructor;
}
/**
 * Register function to be called once per class.
 * @param {IoNode} target - Node class to register.
 */
export function RegisterIoNode(target) {
    Object.defineProperty(target.prototype, '_protochain', { value: new ProtoChain(target) });
}
/**
 * IoNodeMixin applied to `Object` class.
 */
let IoNode = class IoNode extends IoNodeMixin(Object) {
};
IoNode = __decorate([
    RegisterIoNode
], IoNode);
export { IoNode };
// TODO: Document and test. Improve argument handling. Consider edge-cases.
const throttleQueueSync = [];
const throttleQueue = [];
const throttleQueueArgs = new WeakMap();
function throttle(func, arg = undefined, sync = false) {
    if (throttleQueueSync.indexOf(func) === -1) {
        throttleQueueSync.push(func);
        if (sync === true) {
            func(arg);
            return;
        }
    }
    if (throttleQueue.indexOf(func) === -1) {
        throttleQueue.push(func);
    }
    if (throttleQueueArgs.has(func)) {
        const args = throttleQueueArgs.get(func);
        if (args.indexOf(arg) === -1)
            args.push(arg);
    }
    else {
        throttleQueueArgs.set(func, [arg]);
    }
}
function animate() {
    requestAnimationFrame(animate);
    throttleQueueSync.length = 0;
    for (let i = throttleQueue.length; i--;) {
        const args = throttleQueueArgs.get(throttleQueue[i]);
        for (let p = args.length; p--;) {
            throttleQueue[i](args[p]);
            args.splice(args.indexOf(p), 1);
        }
        throttleQueue.splice(throttleQueue.indexOf(throttleQueue[i]), 1);
    }
}
requestAnimationFrame(animate);
//# sourceMappingURL=node.js.map