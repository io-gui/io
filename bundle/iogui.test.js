import { RegisterIoElement as RegisterIoElement$1, IoElement as IoElement$1 } from './iogui.js';

/**
 * An array of all contructors from the prototype chain.
 */
class ProtoChain$1 extends Array {
    /**
     * Creates an array of inherited contructors by traversing down the prototype chain of the specified contructor and adds each contructor to itself.
     * It terminates when prototype chain before it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
     * @param {Constructor} constructor - Prototype object.
     */
    constructor(constructor) {
        super();
        let prototype = constructor.prototype;
        while (prototype
            && prototype.constructor.name !== 'classConstructor'
            && prototype.constructor !== HTMLElement
            && prototype.constructor !== Object
            && prototype.constructor !== Array) {
            this.push(prototype.constructor);
            prototype = prototype.__proto__;
        }
    }
}

/**
 * An array of all inherited function names from a prototype chain that start with "on" or "_".
 * It provides a utility function `.bind(node)` that binds the functions to the specified instance of `IoNode`.
 */
class FunctionBinder extends Array {
    /**
     * Initializes the array of all inherited function names from a prototype chain that start with "on" or "_".
     * @param {ProtoChain} protochain - Array of protochain constructors.
     */
    constructor(protochain) {
        super();
        for (let i = protochain.length; i--;) {
            const constructor = protochain[i].prototype;
            const names = Object.getOwnPropertyNames(constructor);
            for (let j = 0; j < names.length; j++) {
                const fname = names[j];
                if (fname === 'constructor')
                    continue;
                const p = Object.getOwnPropertyDescriptor(constructor, fname);
                if (p === undefined || p.get || p.set)
                    continue;
                if (typeof constructor[fname] === 'function') {
                    if (this.indexOf(fname) === -1 && (fname.startsWith('_') || fname.startsWith('on'))) {
                        this.push(fname);
                    }
                }
            }
        }
    }
    /**
     * Binds all functions to specified instance of `IoNode`.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bind(node) {
        for (let i = this.length; i--;)
            Object.defineProperty(node, this[i], { value: node[this[i]].bind(node) });
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
class PropertyBinder {
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

/**
 * Property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
class ChangeQueue {
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
        for (let i = protochain.length; i--;) {
            const props = protochain[i].Properties;
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
class Properties {
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
 * Array of all listeners defined as `static get Listeners()` return objects in prototype chain.
 */
class ProtoListeners {
    constructor(protochain) {
        for (let i = protochain.length; i--;) {
            const listeners = protochain[i].Listeners;
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
class EventDispatcher {
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
            this.__functionBinder.bind(this);
            Object.defineProperty(this, '__propertyBinder', { enumerable: false, value: new PropertyBinder(this) });
            Object.defineProperty(this, '__changeQueue', { enumerable: false, value: new ChangeQueue(this) });
            Object.defineProperty(this, '__eventDispatcher', { enumerable: false, value: new EventDispatcher(this, this.__protoListeners) });
            Object.defineProperty(this, '__properties', { enumerable: false, value: new Properties(this, this.__protoProperties) });
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
    const protochain = new ProtoChain$1(node);
    const proto = node.prototype;
    Object.defineProperty(proto, '__isIoNode', { value: true });
    Object.defineProperty(proto.constructor, '__registeredAs', { value: proto.constructor.name });
    Object.defineProperty(proto, '__protochain', { value: protochain });
    Object.defineProperty(proto, '__functionBinder', { value: new FunctionBinder(protochain) });
    Object.defineProperty(proto, '__protoProperties', { value: new ProtoProperties(protochain) });
    Object.defineProperty(proto, '__protoListeners', { value: new ProtoListeners(protochain) });
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
        Object.defineProperty(element, '__eventDispatcher', { value: new EventDispatcher(element, {}) });
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
    const localName = prototypes[0].name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const styleID = 'io-style-' + localName.replace('io-', '');
    let finalStyleString = '';
    // Convert mixins to classes
    const styleString = prototypes[0].Style;
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
        for (let i = prototypes.length; i--;) {
            let styleString = prototypes[i].Style;
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
class ProtoChain {
    run() {
        describe('ProtoChain', () => {
            it('Should include all inherited constructors', () => {
                let protochain = new ProtoChain$1(Array3);
                chai.expect(protochain[0]).to.be.equal(Array3);
                chai.expect(protochain[1]).to.be.equal(Array2);
                chai.expect(protochain[2]).to.be.equal(Array1);
                protochain = new ProtoChain$1(Object3);
                chai.expect(protochain[0]).to.be.equal(Object3);
                chai.expect(protochain[1]).to.be.equal(Object2);
                chai.expect(protochain[2]).to.be.equal(Object1);
                protochain = new ProtoChain$1(HTMLElement3);
                chai.expect(protochain[0]).to.be.equal(HTMLElement3);
                chai.expect(protochain[1]).to.be.equal(HTMLElement2);
                chai.expect(protochain[2]).to.be.equal(HTMLElement1);
                protochain = new ProtoChain$1(IoNode1);
                chai.expect(protochain[0]).to.be.equal(IoNode1);
                chai.expect(protochain[1]).to.be.equal(IoNode);
                protochain = new ProtoChain$1(IoElement1);
                chai.expect(protochain[0]).to.be.equal(IoElement1);
                chai.expect(protochain[1]).to.be.equal(IoElement);
                protochain = new ProtoChain$1(IoNode2);
                chai.expect(protochain[0]).to.be.equal(IoNode2);
            });
            it('Should terminate at `IoNode` and `IoElement` or before `HTMLElement`, `Object` or `Array`', () => {
                let protochain = new ProtoChain$1(Array3);
                chai.expect(protochain[3]).to.be.equal(undefined);
                protochain = new ProtoChain$1(Object3);
                chai.expect(protochain[3]).to.be.equal(undefined);
                protochain = new ProtoChain$1(HTMLElement3);
                chai.expect(protochain[3]).to.be.equal(undefined);
                protochain = new ProtoChain$1(IoNode1);
                chai.expect(protochain[2]).to.be.equal(undefined);
                protochain = new ProtoChain$1(IoElement1);
                chai.expect(protochain[4]).to.be.equal(undefined);
                protochain = new ProtoChain$1(IoNode2);
                chai.expect(protochain[1]).to.be.equal(undefined);
            });
        });
    }
}

// import Node from './core/io-node.test.js';
// import Element from './core/io-element.test.js';
// import Item from './elements/core/item.test.js';
// import Content from './elements/core/content.test.js'; // TODO
// import Gl from './elements/core/gl.test.js';
// import Button from './elements/core/button.test.js';
// import Boolean from './elements/core/boolean.test.js';
// import Boolicon from './elements/core/boolicon.test.js';
// import Switch from './elements/core/switch.test.js';
// import Sting from './elements/core/string.test.js';
// import Number from './elements/core/number.test.js';
// import Slider from './elements/core/slider.test.js';
// import SliderRange from './elements/core/slider-range.test.js'; // TODO
// import NumberSlider from './elements/core/number-slider.test.js';
// import NumberSliderRange from './elements/core/number-slider-range.test.js'; // TODO
// import Icon from './elements/core/icon.test.js';
// import IconSet from './elements/core/iconset.test.js';
// import Layer from './elements/core/layer.test.js';
// import Ladder from './elements/core/ladder.test.js';
// import Theme from './elements/core/theme.test.js';
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
        // new ChangeQueue().run();
        // new EventDispatcher().run();
        // new FunctionBinder().run();
        // new Properties().run();
        // new PropertyBinder().run();
        new ProtoChain().run();
        // new Node().run();
        // new Element().run();
        // new Item().run();
        // new Content().run();
        // new Gl().run();
        // new Button().run();
        // new Boolean().run();
        // new Boolean().run();
        // new Boolicon().run();
        // new Switch().run();
        // new Sting().run();
        // new Number().run();
        // new Slider().run();
        // new SliderRange().run();
        // new NumberSlider().run();
        // new NumberSliderRange().run();
        // new Icon().run();
        // new IconSet().run();
        // new Layer().run();
        // new Ladder().run();
        // new Theme().run();
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
