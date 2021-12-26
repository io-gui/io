import { RegisterIoElement as RegisterIoElement$1, IoElement as IoElement$1 } from './iogui.js';

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

const hardenPropertyDefinition = (propDef) => {
    const def = {
        value: undefined,
        type: undefined,
        binding: undefined,
        reflect: 0,
        notify: true,
        observe: false,
        readonly: false,
        strict: false,
        enumerable: true
    };
    if (propDef === undefined || propDef === null) {
        def.value = propDef;
        return def;
    }
    if (typeof propDef === 'function') {
        def.type = propDef;
        return def;
    }
    if (propDef instanceof Binding) {
        def.value = propDef.value;
        def.type = (propDef.value !== undefined && propDef.value !== null) ? propDef.value.constructor : undefined;
        def.binding = propDef;
        return def;
    }
    if (propDef && propDef.constructor === Object) {
        const detail = propDef;
        detail.value = detail.value !== undefined ? detail.value : undefined;
        detail.type = detail.type !== undefined ? detail.type : (detail.value !== undefined && detail.value !== null) ? detail.value.constructor : undefined;
        detail.binding = detail.binding instanceof Binding ? detail.binding : undefined;
        detail.reflect = detail.reflect !== undefined ? detail.reflect : 0;
        detail.notify = detail.notify !== undefined ? detail.notify : true;
        detail.observe = detail.observe !== undefined ? detail.observe : false;
        detail.readonly = detail.readonly !== undefined ? detail.readonly : false;
        detail.strict = detail.strict !== undefined ? detail.strict : false;
        detail.enumerable = detail.enumerable !== undefined ? detail.enumerable : true;
        return detail;
    }
    if (!(propDef && propDef.constructor === Object)) {
        def.value = propDef;
        def.type = propDef.constructor;
        return def;
    }
    return def;
};
const assignPropertyDefinition = (propDef, newPropDef) => {
    if (newPropDef.value !== undefined)
        propDef.value = newPropDef.value;
    if (newPropDef.type !== undefined)
        propDef.type = newPropDef.type;
    if (newPropDef.reflect !== 0)
        propDef.reflect = newPropDef.reflect;
    if (newPropDef.notify !== true)
        propDef.notify = newPropDef.notify;
    if (newPropDef.observe !== false)
        propDef.observe = newPropDef.observe;
    if (newPropDef.readonly !== false)
        propDef.readonly = newPropDef.readonly;
    if (newPropDef.strict !== false)
        propDef.strict = newPropDef.strict;
    if (newPropDef.enumerable !== true)
        propDef.enumerable = newPropDef.enumerable;
    if (newPropDef.binding !== undefined)
        propDef.binding = newPropDef.binding;
};
/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `PropertyDefinition`.
 */
class Property {
    //Property value.
    value = undefined;
    //Constructor of the property value.
    type = undefined;
    //Reflects to HTML attribute [-1, 0, 1 or 2]
    reflect = 0;
    //Enables change handlers and events.
    notify = true;
    //Observe object mutations for this property.
    observe = false;
    //Makes the property readonly. // TODO: document and test
    readonly = false;
    //Enforce stric typing. // TODO: document and test
    strict = false;
    //Makes property enumerable.
    enumerable = true;
    //Binding object.
    binding = undefined;
    /**
     * Creates the property configuration object and copies values from `PropertyDefinition`.
     * @param {PropertyDefinition} propDef PropertyDefinition object
     */
    constructor(propDef) {
        this.value = propDef.value;
        if (propDef.type !== undefined)
            this.type = propDef.type;
        if (propDef.reflect !== undefined)
            this.reflect = propDef.reflect;
        if (propDef.notify !== undefined)
            this.notify = propDef.notify;
        if (propDef.observe !== undefined)
            this.observe = propDef.observe;
        if (propDef.readonly !== undefined)
            this.readonly = propDef.readonly;
        if (propDef.strict !== undefined)
            this.strict = propDef.strict;
        if (propDef.enumerable !== undefined)
            this.enumerable = propDef.enumerable;
        if (propDef.binding !== undefined)
            this.binding = propDef.binding;
        // TODO: move to PropertyDefinition
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
        // TODO: move to PropertyDefinition
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
     */
    constructor(node) {
        Object.defineProperty(this, '__node', { enumerable: false, configurable: true, value: node });
        Object.defineProperty(this, '__connected', { enumerable: false });
        for (const prop in node.__protochain.properties) {
            this.__keys.push(prop);
            const protoProp = node.__protochain.properties;
            const property = new Property(protoProp[prop]);
            Object.defineProperty(this, prop, {
                value: property,
                enumerable: protoProp[prop].enumerable,
                configurable: true
            });
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
        Object.defineProperty(this, '__keys', { enumerable: false, configurable: true });
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

const hardenListenerDefinition = (listenerDefinition) => {
    return listenerDefinition instanceof Array ? listenerDefinition : [listenerDefinition];
};
const assignListenerDefinition = (definitions, listenerDefinition) => {
    const i = definitions.findIndex((listener) => listener[0] === listenerDefinition[0]);
    if (i !== -1) {
        if (definitions[i][1])
            definitions[i][1] = Object.assign(definitions[i][1], listenerDefinition[1]);
        else if (listenerDefinition[1])
            definitions[i][1] = listenerDefinition[1];
    }
    else {
        definitions.push(listenerDefinition);
    }
};
const listenerFromDefinition = (node, listenerDefinition) => {
    const listenerHandler = typeof listenerDefinition[0] === 'string' ? node[listenerDefinition[0]] : listenerDefinition[0];
    const listenerOptions = listenerDefinition[1];
    const listener = [listenerHandler];
    if (listenerOptions)
        listener.push(listenerOptions);
    return listener;
};
/**
 * `EventDispatcher` responsible for handling listeners and dispatching events.
 * It maintains three independent lists of listeners:
 *   1. `protoListeners` specified as `get Listeners()` class declarations.
 *   2. `propListeners` specified as inline properties prefixed with "on-"
 *   3. `addedListeners` explicitly added using `addEventListener()`.
 */
class EventDispatcher {
    node;
    isEventTarget;
    protoListeners = {};
    propListeners = {};
    addedListeners = {};
    connected = false;
    /**
     * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
     * It initializes `protoListeners` from `ProtoChain`.
     * @param {IoNode} node owner IoNode.
     */
    constructor(node) {
        this.node = node;
        this.isEventTarget = node instanceof EventTarget;
        Object.defineProperty(this, 'node', { enumerable: false, writable: false });
        Object.defineProperty(this, 'isEventTarget', { enumerable: false, writable: false });
        Object.defineProperty(this, 'protoListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, 'propListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, 'addedListeners', { enumerable: false, writable: false });
        Object.defineProperty(this, 'connected', { enumerable: false });
        for (const type in node.__protochain?.listeners) {
            this.protoListeners[type] = [];
            for (let i = 0; i < node.__protochain.listeners[type].length; i++) {
                this.protoListeners[type].push(listenerFromDefinition(node, node.__protochain.listeners[type][i]));
            }
        }
    }
    /**
     * Sets `propListeners` specified as inline properties prefixed with "on-".
     * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
     * @param {Record<string, any>} properties - Inline properties.
     */
    setPropListeners(properties) {
        const newPropListeners = {};
        for (const prop in properties) {
            if (prop.startsWith('on-')) {
                const type = prop.slice(3, prop.length);
                const definition = hardenListenerDefinition(properties[prop]);
                const listener = listenerFromDefinition(this.node, definition);
                newPropListeners[type] = [listener];
            }
        }
        const propListeners = this.propListeners;
        for (const type in propListeners) {
            if (!newPropListeners[type]) {
                if (this.connected && this.isEventTarget) {
                    const definition = hardenListenerDefinition(propListeners[type][0]);
                    const listener = listenerFromDefinition(this.node, definition);
                    EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
                }
                delete propListeners[type];
            }
        }
        for (const type in newPropListeners) {
            if (this.connected && this.isEventTarget) {
                const newDefinition = hardenListenerDefinition(newPropListeners[type][0]);
                const newListener = listenerFromDefinition(this.node, newDefinition);
                if (!propListeners[type]) {
                    EventTarget.prototype.addEventListener.call(this.node, type, newListener[0], newListener[1]);
                }
                else {
                    const definition = hardenListenerDefinition(propListeners[type][0]);
                    const listener = listenerFromDefinition(this.node, definition);
                    if ((listener !== newListener || listener[1] !== newListener[1])) {
                        EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
                        EventTarget.prototype.addEventListener.call(this.node, type, newListener[0], newListener[1]);
                    }
                }
            }
            propListeners[type] = newPropListeners[type];
        }
    }
    /**
     * Removes all `protoListeners`.
     */
    removeProtoListeners() {
        for (const type in this.protoListeners) {
            for (let i = this.protoListeners[type].length; i--;) {
                if (this.isEventTarget) {
                    const listener = this.protoListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
                }
            }
            this.protoListeners[type].length = 0;
            delete this.protoListeners[type];
        }
    }
    /**
     * Removes all `propListeners`.
     */
    removePropListeners() {
        for (const type in this.propListeners) {
            if (this.isEventTarget) {
                const listener = this.propListeners[type][0];
                EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
            }
            this.propListeners[type].length = 0;
            delete this.propListeners[type];
        }
    }
    /**
     * Removes all `addedListeners`.
     */
    removeAddedListeners() {
        for (const type in this.addedListeners) {
            for (let i = this.addedListeners[type].length; i--;) {
                if (this.isEventTarget) {
                    const listener = this.addedListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
                }
            }
            this.addedListeners[type].length = 0;
            delete this.addedListeners[type];
        }
    }
    /**
     * Connects all event listeners.
     * @return {this} this
     */
    connect() {
        if (this.isEventTarget) {
            for (const type in this.protoListeners) {
                for (let i = 0; i < this.protoListeners[type].length; i++) {
                    const listener = this.protoListeners[type][i];
                    EventTarget.prototype.addEventListener.call(this.node, type, listener[0], listener[1]);
                }
            }
            for (const type in this.propListeners) {
                const listener = this.propListeners[type][0];
                EventTarget.prototype.addEventListener.call(this.node, type, listener[0], listener[1]);
            }
            for (const type in this.addedListeners) {
                for (let i = this.addedListeners[type].length; i--;) {
                    const listener = this.addedListeners[type][i];
                    EventTarget.prototype.addEventListener.call(this.node, type, listener[0], listener[1]);
                }
            }
        }
        this.connected = true;
        return this;
    }
    /**
     * Disconnects all event listeners.
     * @return {this} this
     */
    disconnect() {
        // this.removeProtoListeners();
        // this.removePropListeners();
        // this.removeAddedListeners();
        if (this.isEventTarget) {
            for (const type in this.protoListeners) {
                for (let i = 0; i < this.protoListeners[type].length; i++) {
                    const listener = this.protoListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
                }
            }
            for (const type in this.propListeners) {
                const listener = this.propListeners[type][0];
                EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
            }
            for (const type in this.addedListeners) {
                for (let i = this.addedListeners[type].length; i--;) {
                    const listener = this.addedListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
                }
            }
        }
        this.connected = false;
        return this;
    }
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener to `addedListeners`.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(type, listener, options) {
        this.addedListeners[type] = this.addedListeners[type] || [];
        this.addedListeners[type].push(options ? [listener, options] : [listener]);
        if (this.connected && this.isEventTarget) {
            EventTarget.prototype.addEventListener.call(this.node, type, listener, options);
        }
    }
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from `addedListeners`.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} type Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(type, listener, options) {
        if (!listener) {
            for (let i = 0; i < this.addedListeners[type].length; i++) {
                if (this.connected && this.isEventTarget) {
                    const listener = this.addedListeners[type][i];
                    EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
                }
            }
            this.addedListeners[type].length = 0;
            delete this.addedListeners[type];
        }
        else {
            const l = this.addedListeners[type].findIndex(item => item[0] = listener);
            this.addedListeners[type].splice(l, 1);
            if (this.connected && this.isEventTarget) {
                EventTarget.prototype.removeEventListener.call(this.node, type, listener, options);
            }
        }
    }
    /**
     * Shorthand for custom event dispatch.
     * @param {string} type Name of the event
     * @param {Record<string, any>} detail Event detail data
     * @param {boolean} [bubbles] Makes event bubble
     * @param {EventTarget} [node] Event target override to dispatch the event from
     */
    dispatchEvent(type, detail = {}, bubbles = true, node = this.node) {
        if (!this.connected) {
            return;
        }
        if ((node instanceof EventTarget)) {
            EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(type, { detail: detail, bubbles: bubbles, composed: true, cancelable: true }));
        }
        else {
            if (this.protoListeners[type]) {
                for (let i = 0; i < this.protoListeners[type].length; i++) {
                    this.protoListeners[type][i][0].call(node, { detail: detail, target: node, path: [node] });
                }
            }
            if (this.propListeners[type]) {
                this.propListeners[type][0][0].call(node, { detail: detail, target: node, path: [node] });
            }
            if (this.addedListeners[type]) {
                for (let i = 0; i < this.addedListeners[type].length; i++) {
                    this.addedListeners[type][i][0].call(node, { detail: detail, target: node, path: [node] });
                }
            }
        }
    }
    /**
     * Disconnects all event listeners and removes all references.
     * Use this when node is no longer needed.
     */
    dispose() {
        if (this.connected)
            this.disconnect();
        delete this.node;
        delete this.protoListeners;
        delete this.propListeners;
        delete this.addedListeners;
    }
}

/**
 * Internal utility class that contains usefull information about inherited constructors, function names, properties, listeners,
 * as well as some utility functions. Inherited information is gathered automatically by prototype chain traversal
 * that terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
 */
class ProtoChain$1 {
    /*
     * Automatically generated array of all constructors inherited from the prototype chain.
     */
    constructors = [];
    /*
     * Automatically generated array of all function names that start with "on" or "_" inherited from the prototype chain.
     */
    functions = [];
    /*
     * Automatically generated array of all properties defined as `static get Properties()` return objects in inherited classes.
     */
    properties = {};
    /*
     * Automatically generated array of all listeners defined as `static get Listeners()` return objects in inherited classes.
     */
    listeners = {};
    /**
     * Creates an instance of `ProtoChain` and initializes the arrays of inherited contructors, function names, properties and listeners.
     * @param {Constructor} nodeConstructor - Prototype object.
     */
    constructor(nodeConstructor) {
        let proto = nodeConstructor.prototype;
        while (proto
            && nodeConstructor.name !== 'classConstructor'
            && (nodeConstructor) !== HTMLElement
            && (nodeConstructor) !== Object
            && (nodeConstructor) !== Array) {
            // Add constructor
            this.constructors.push(nodeConstructor);
            // Add function names
            const fnames = Object.getOwnPropertyNames(proto);
            for (let j = 0; j < fnames.length; j++) {
                const fname = fnames[j];
                if (fname === 'constructor')
                    continue;
                const prop = Object.getOwnPropertyDescriptor(proto, fname);
                if (prop === undefined || prop.get || prop.set)
                    continue;
                if (typeof proto[fname] === 'function') {
                    if (this.functions.indexOf(fname) === -1 && (fname.startsWith('_') || fname.startsWith('on'))) {
                        this.functions.push(fname);
                    }
                }
            }
            // Continue prototype traversal
            proto = proto.__proto__;
            nodeConstructor = proto.constructor;
        }
        // Properties and listeners are assigned in reverse
        for (let i = this.constructors.length; i--;) {
            // Add properties
            const props = this.constructors[i].Properties;
            for (const p in props) {
                if (!this.properties[p])
                    this.properties[p] = hardenPropertyDefinition(props[p]);
                else
                    assignPropertyDefinition(this.properties[p], hardenPropertyDefinition(props[p]));
                // TODO: Document or reconsider.
                if (p.charAt(0) === '_') {
                    this.properties[p].notify = false;
                    this.properties[p].enumerable = false;
                }
            }
            // Add listeners
            const listeners = this.constructors[i].Listeners;
            for (const l in listeners) {
                if (listeners[l]) {
                    this.listeners[l] = this.listeners[l] || [];
                    assignListenerDefinition(this.listeners[l], hardenListenerDefinition(listeners[l]));
                }
            }
        }
    }
    /**
     * Binds all functions from the `.functions` list to specified instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bindFunctions(node) {
        for (let i = this.functions.length; i--;) {
            Object.defineProperty(node, this.functions[i], { value: node[this.functions[i]].bind(node) });
        }
    }
    dispose() {
    }
}

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
            Object.defineProperty(this, '__eventDispatcher', { enumerable: false, value: new EventDispatcher(this) });
            Object.defineProperty(this, '__properties', { enumerable: false, value: new Properties$1(this) });
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
 * @param {IoNode} nodeConstructor - Node class to register.
 */
const RegisterIoNode = function (nodeConstructor) {
    const proto = nodeConstructor.prototype;
    Object.defineProperty(proto, '__isIoNode', { value: true });
    Object.defineProperty(nodeConstructor, '__registeredAs', { value: nodeConstructor.name });
    Object.defineProperty(proto, '__protochain', { value: new ProtoChain$1(nodeConstructor) });
    Object.defineProperty(proto, '__observedObjects', { value: [] });
    const protoProps = proto.__protochain.properties;
    for (const p in protoProps)
        if (protoProps[p].observe)
            proto.__observedObjects.push(p);
    for (const p in protoProps) {
        Object.defineProperty(proto, p, {
            get: function () {
                return this.__properties.get(p);
            },
            set: function (value) {
                this.__properties.set(p, value);
            },
            enumerable: !!protoProps[p].enumerable,
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

class IoNode1$1 extends IoNode {
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
RegisterIoNode(IoNode1$1);
class IoNode2$1 extends IoNode1$1 {
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
RegisterIoNode(IoNode2$1);
class TestDivEventDispatchElement extends HTMLElement {
    handler3Count = 0;
    handler3Detail;
    handler3(event) {
        this.handler3Count++;
        this.handler3Detail = event.detail;
    }
}
window.customElements.define('test-div-event-dispatch', TestDivEventDispatchElement);
class Listeners {
    run() {
        describe('Listeners', () => {
            it('Should initialize with correct default values', () => {
                const node = new IoNode2$1();
                const eventDispatcher = new EventDispatcher(node);
                chai.expect(eventDispatcher.node).to.be.equal(node);
                chai.expect(typeof eventDispatcher.protoListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.propListeners).to.be.equal('object');
                chai.expect(typeof eventDispatcher.addedListeners).to.be.equal('object');
                chai.expect(eventDispatcher.connected).to.be.equal(false);
            });
            it('Should include all listeners from protochain', () => {
                const node = new IoNode2$1();
                const eventDispatcher = new EventDispatcher(node);
                chai.expect(JSON.stringify(eventDispatcher.protoListeners)).to.be.equal('{"event1":[[null]],"event2":[[null,{"capture":true}]]}');
                chai.expect(eventDispatcher.protoListeners.event1[0][0]).to.be.equal(node.handler1);
                chai.expect(eventDispatcher.protoListeners.event2[0][0]).to.be.equal(node.handler2);
            });
            it('Should set property listeners correctly', () => {
                const node = new IoNode2$1();
                const eventDispatcher = new EventDispatcher(node);
                const handler4 = () => { };
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                chai.expect(JSON.stringify(eventDispatcher.propListeners)).to.be.equal('{"event3":[[null]],"event4":[[null]]}');
                chai.expect(eventDispatcher.propListeners.event3[0][0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.propListeners.event4[0][0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event5': ['handler3'], 'on-event6': [handler4] });
                chai.expect(JSON.stringify(eventDispatcher.propListeners)).to.be.equal('{"event5":[[null]],"event6":[[null]]}');
                chai.expect(eventDispatcher.propListeners.event5[0][0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.propListeners.event6[0][0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({ 'on-event7': ['handler3', { capture: true }], 'on-event8': [handler4, { capture: true }] });
                chai.expect(JSON.stringify(eventDispatcher.propListeners)).to.be.equal('{"event7":[[null,{"capture":true}]],"event8":[[null,{"capture":true}]]}');
                chai.expect(eventDispatcher.propListeners.event7[0][0]).to.be.equal(node.handler3);
                chai.expect(eventDispatcher.propListeners.event8[0][0]).to.be.equal(handler4);
                eventDispatcher.setPropListeners({});
                chai.expect(JSON.stringify(eventDispatcher.propListeners)).to.be.equal('{}');
            });
            it('Should add/remove listeners correctly', () => {
                const node = new IoNode2$1();
                const eventDispatcher = new EventDispatcher(node);
                const listener1 = () => { };
                const listener2 = () => { };
                eventDispatcher.addEventListener('event1', listener1);
                eventDispatcher.addEventListener('event1', listener2, { capture: true });
                chai.expect(JSON.stringify(eventDispatcher.addedListeners)).to.be.equal('{"event1":[[null],[null,{"capture":true}]]}');
                chai.expect(eventDispatcher.addedListeners.event1[0][0]).to.be.equal(listener1);
                chai.expect(eventDispatcher.addedListeners.event1[1][0]).to.be.equal(listener2);
                eventDispatcher.removeEventListener('event1', listener1);
                chai.expect(JSON.stringify(eventDispatcher.addedListeners)).to.be.equal('{"event1":[[null,{"capture":true}]]}');
                chai.expect(eventDispatcher.addedListeners.event1[0][0]).to.be.equal(listener2);
                eventDispatcher.removeEventListener('event1');
                chai.expect(JSON.stringify(eventDispatcher.addedListeners)).to.be.equal('{}');
            });
            it('Should dispatch events only when connected', () => {
                const node = new IoNode2$1();
                const eventDispatcher = new EventDispatcher(node);
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
                const eventDispatcher = new EventDispatcher(node).connect();
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
                const eventDispatcher = new EventDispatcher(element);
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
                const eventDispatcher = new EventDispatcher(node);
                eventDispatcher.dispose();
                chai.expect(eventDispatcher.node).to.be.equal(undefined);
                chai.expect(eventDispatcher.protoListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.propListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.addedListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.connected).to.be.equal(false);
            });
        });
    }
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
        for (const prop in this.prototype.__protochain.properties) {
            const r = this.prototype.__protochain.properties[prop].reflect;
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
        Object.defineProperty(element, '__eventDispatcher', { value: new EventDispatcher(element) });
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
                    protoProp = hardenPropertyDefinition({});
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
                    protoProp = hardenPropertyDefinition(null);
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
                    protoProp = hardenPropertyDefinition({});
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(undefined);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(undefined);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with Number argument
                    protoProp = hardenPropertyDefinition(Number);
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
                    protoProp = hardenPropertyDefinition(String);
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
                    protoProp = hardenPropertyDefinition(Boolean);
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
                    protoProp = hardenPropertyDefinition(Object);
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
                    protoProp = hardenPropertyDefinition(Array);
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
                    protoProp = hardenPropertyDefinition(Object1$1);
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
                    protoProp = hardenPropertyDefinition(1);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal(1);
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(Number);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with string argument
                    protoProp = hardenPropertyDefinition('test');
                    prop = new Property(protoProp);
                    chai.expect(protoProp.value).to.be.equal(prop.value).to.be.equal('test');
                    chai.expect(protoProp.type).to.be.equal(prop.type).to.be.equal(String);
                    chai.expect(protoProp.notify).to.be.equal(prop.notify).to.be.equal(true);
                    chai.expect(protoProp.reflect).to.be.equal(prop.reflect).to.be.equal(0);
                    chai.expect(protoProp.observe).to.be.equal(prop.observe).to.be.equal(false);
                    chai.expect(protoProp.strict).to.be.equal(prop.strict).to.be.equal(false);
                    chai.expect(protoProp.enumerable).to.be.equal(prop.enumerable).to.be.equal(true);
                    // initialize with boolean argument
                    protoProp = hardenPropertyDefinition(true);
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
                    protoProp = hardenPropertyDefinition({ value: object });
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
                    protoProp = hardenPropertyDefinition({ value: array });
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
                    protoProp = hardenPropertyDefinition({ value: object1 });
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
                    protoProp = hardenPropertyDefinition({ type: Object1$1 });
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
                    protoProp = hardenPropertyDefinition(binding);
                    prop = new Property(protoProp);
                    chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
                    chai.expect(protoProp.value).to.be.equal('lorem');
                    chai.expect(prop.value).to.be.equal('lorem');
                    const node = new TestIoNode$1({ label: 'lorem' });
                    binding = new Binding(node, 'label');
                    protoProp = hardenPropertyDefinition({ binding: binding, value: 'ipsum' });
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
                    const protoProps1 = node1.__protochain.properties;
                    const protoProps2 = node2.__protochain.properties;
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
                    const props = protochain.properties;
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
class FakeIoNode1 {
    static get Properties() {
        return {
            prop1: {}
        };
    }
    static get Listeners() {
        return {
            listener1: 'function1',
            listener2: '',
            listener3: ['_function1', { capture: true }],
            listener4: () => { }
        };
    }
    function1() { }
    onFunction1() { }
    _function1() { }
}
class FakeIoNode2 extends FakeIoNode1 {
    function2() { }
    onFunction2() { }
    _function2() { }
    static get Properties() {
        return {
            prop2: {}
        };
    }
    static get Listeners() {
        return {
            listener1: '_function2',
            listener2: ['function2', { capture: true, passive: true }],
            listener3: ['_function1', { passive: true }]
        };
    }
}
class ProtoChain {
    run() {
        describe('ProtoChain', () => {
            it('Should include all inherited constructors', () => {
                let constructors = new ProtoChain$1(Array3).constructors;
                chai.expect(constructors[0]).to.be.equal(Array3);
                chai.expect(constructors[1]).to.be.equal(Array2);
                chai.expect(constructors[2]).to.be.equal(Array1);
                constructors = new ProtoChain$1(Object3).constructors;
                chai.expect(constructors[0]).to.be.equal(Object3);
                chai.expect(constructors[1]).to.be.equal(Object2);
                chai.expect(constructors[2]).to.be.equal(Object1);
                constructors = new ProtoChain$1(HTMLElement3).constructors;
                chai.expect(constructors[0]).to.be.equal(HTMLElement3);
                chai.expect(constructors[1]).to.be.equal(HTMLElement2);
                chai.expect(constructors[2]).to.be.equal(HTMLElement1);
                constructors = new ProtoChain$1(IoNode1).constructors;
                chai.expect(constructors[0]).to.be.equal(IoNode1);
                chai.expect(constructors[1]).to.be.equal(IoNode);
                constructors = new ProtoChain$1(IoElement1).constructors;
                chai.expect(constructors[0]).to.be.equal(IoElement1);
                chai.expect(constructors[1]).to.be.equal(IoElement);
                constructors = new ProtoChain$1(IoNode2).constructors;
                chai.expect(constructors[0]).to.be.equal(IoNode2);
            });
            it('Should terminate at `IoNode` and `IoElement` or before `HTMLElement`, `Object` or `Array`', () => {
                let constructors = new ProtoChain$1(Array3).constructors;
                chai.expect(constructors[3]).to.be.equal(undefined);
                constructors = new ProtoChain$1(Object3).constructors;
                chai.expect(constructors[3]).to.be.equal(undefined);
                constructors = new ProtoChain$1(HTMLElement3).constructors;
                chai.expect(constructors[3]).to.be.equal(undefined);
                constructors = new ProtoChain$1(IoNode1).constructors;
                chai.expect(constructors[2]).to.be.equal(undefined);
                constructors = new ProtoChain$1(IoElement1).constructors;
                chai.expect(constructors[4]).to.be.equal(undefined);
                constructors = new ProtoChain$1(IoNode2).constructors;
                chai.expect(constructors[1]).to.be.equal(undefined);
            });
            it('Should include all functions starting with "on" or "_"', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                chai.expect(JSON.stringify(protoChain.functions)).to.be.equal(JSON.stringify(['onFunction2', '_function2', 'onFunction1', '_function1']));
            });
            it('Should bind the functions to specified instance with `.bind(node)` function', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                const node = new FakeIoNode2();
                protoChain.bindFunctions(node);
                chai.expect(node.function1.name).to.be.equal('function1');
                chai.expect(node.onFunction1.name).to.be.equal('bound onFunction1');
                chai.expect(node._function1.name).to.be.equal('bound _function1');
                chai.expect(node.function2.name).to.be.equal('function2');
                chai.expect(node.onFunction2.name).to.be.equal('bound onFunction2');
                chai.expect(node._function2.name).to.be.equal('bound _function2');
            });
            it('Should include a list of all declared properties', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                chai.expect(JSON.stringify(Object.keys(protoChain.properties))).to.be.equal(JSON.stringify(['prop1', 'prop2']));
            });
            it('Should include a list of all declared listeners', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                chai.expect(JSON.stringify(Object.keys(protoChain.listeners))).to.be.equal(JSON.stringify(['listener1', 'listener3', 'listener4', 'listener2']));
                chai.expect(JSON.stringify(protoChain.listeners['listener1'])).to.be.equal(JSON.stringify([['function1'], ['_function2']]));
                chai.expect(JSON.stringify(protoChain.listeners['listener2'])).to.be.equal(JSON.stringify([['function2', { capture: true, passive: true }]]));
                chai.expect(JSON.stringify(protoChain.listeners['listener3'])).to.be.equal(JSON.stringify([['_function1', { capture: true, passive: true }]]));
            });
        });
    }
}

class FakeIoNode {
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
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue$1(node);
                chai.expect(changeQueue.__node).to.be.equal(node);
                chai.expect(JSON.stringify(changeQueue.__changes)).to.be.equal('[]');
                chai.expect(changeQueue.__changes.length).to.be.equal(0);
                chai.expect(changeQueue.__dispatching).to.be.equal(false);
            });
            it('Should dispatch change events with correct payloads', () => {
                const node = new FakeIoNode();
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
                const node = new FakeIoNode();
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
                const node = new FakeIoNode();
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
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.queue('prop1', 0, 0);
                changeQueue.dispatch();
                chai.expect(node.prop1ChangeCounter).to.be.equal(0);
            });
            it('Should abort dispatch if owner node is disconnected', () => {
                const node = new FakeIoNode();
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
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.dispose();
                chai.expect(changeQueue.__node).to.be.equal(undefined);
                chai.expect(changeQueue.__changes).to.be.equal(undefined);
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
                chai.expect(node.__eventDispatcher.connected).to.be.equal(true);
                chai.expect(node.__properties.__connected).to.be.equal(true);
                chai.expect(node.__connected).to.be.equal(true);
                chai.expect(node.__connections).to.be.deep.equal([window, document]);
                node.disconnect(window);
                chai.expect(node.__eventDispatcher.connected).to.be.equal(true);
                chai.expect(node.__properties.__connected).to.be.equal(true);
                chai.expect(node.__connected).to.be.equal(true);
                chai.expect(node.__connections).to.be.deep.equal([document]);
                node.disconnect(document);
                chai.expect(node.__connected).to.be.equal(false);
                chai.expect(node.__eventDispatcher.connected).to.be.equal(false);
                chai.expect(node.__properties.__connected).to.be.equal(false);
                chai.expect(node.__connections).to.be.deep.equal([]);
                node.connect(window);
                chai.expect(node.__eventDispatcher.connected).to.be.equal(true);
                chai.expect(node.__properties.__connected).to.be.equal(true);
                chai.expect(node.__connected).to.be.equal(true);
                chai.expect(node.__connections).to.be.deep.equal([window]);
                node.dispose();
                chai.expect(node.__connected).to.be.equal(false);
                chai.expect(node.__eventDispatcher.connected).to.be.equal(false);
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
        new Listeners().run();
        new Properties().run();
        new ProtoChain().run();
        new ChangeQueue().run();
        new PropertyBinder().run();
        new Node().run();
        new Element().run();
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
