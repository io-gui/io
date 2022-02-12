import { RegisterIoElement as RegisterIoElement$1, IoElement as IoElement$1 } from './iogui.js';

/**
 * Property binding class.
 * It facilitates data binding between source node/property and target nodes/properties
 * using `[property]-changed` events.
 */
class Binding$1 {
    node;
    property = '';
    targets = [];
    targetProperties = new WeakMap();
    /**
     * Creates a binding object for specified `node` and `property`.
     * @param {IoNode} node - Property owner node
     * @param {string} property - Name of the property
     */
    constructor(node, property) {
        this.node = node;
        this.property = property;
        this.onTargetChanged = this.onTargetChanged.bind(this);
        this.onSourceChanged = this.onSourceChanged.bind(this);
        this.node.addEventListener(`${this.property}-changed`, this.onSourceChanged);
    }
    set value(value) {
        this.node[this.property] = value;
    }
    get value() {
        return this.node[this.property];
    }
    /**
     * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
     * @param {IoNode} node - Target node
     * @param {string} property - Target property
     */
    addTarget(node, property) {
        {
            if (node._properties[property].binding && node._properties[property].binding !== this) {
                console.warn('Binding target alredy has binding!');
            }
        }
        node._properties[property].binding = this;
        node.setPropertyValue(property, this.node[this.property]);
        const target = node;
        if (this.targets.indexOf(target) === -1)
            this.targets.push(target);
        const targetProperties = this.getTargetProperties(target);
        if (targetProperties.indexOf(property) === -1) {
            targetProperties.push(property);
            target.addEventListener(`${property}-changed`, this.onTargetChanged);
        }
    }
    /**
     * Removes target `node` and `property` and corresponding `[property]-changed` listener.
     * If `property` is not specified, it removes all target properties.
     * @param {IoNode} node - Target node
     * @param {string} property - Target property
     */
    removeTarget(node, property) {
        const targetIoNode = node;
        const targetProperties = this.getTargetProperties(targetIoNode);
        if (property) {
            const i = targetProperties.indexOf(property);
            if (i !== -1)
                targetProperties.splice(i, 1);
            targetIoNode.removeEventListener(`${property}-changed`, this.onTargetChanged);
        }
        else {
            for (let i = targetProperties.length; i--;) {
                targetIoNode.removeEventListener(`${targetProperties[i]}-changed`, this.onTargetChanged);
            }
            targetProperties.length = 0;
        }
        if (targetProperties.length === 0)
            this.targets.splice(this.targets.indexOf(targetIoNode), 1);
    }
    /**
     * Retrieves a list of target properties for specified target node.
     * @param {IoNode} node - Target node.
     * @return {Array.<string>} list of target property names.
     */
    getTargetProperties(node) {
        let targetProperties = this.targetProperties.get(node);
        if (targetProperties) {
            return targetProperties;
        }
        else {
            targetProperties = [];
            this.targetProperties.set(node, targetProperties);
            return targetProperties;
        }
    }
    /**
     * Event handler that updates source property when one of the targets emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onTargetChanged(event) {
        {
            if (this.targets.indexOf(event.target) === -1) {
                console.error(`onTargetChanged() should never fire when target is removed from binding.
          Please file an issue at https://github.com/arodic/iogui/issues.`);
                return;
            }
        }
        const oldValue = this.node[this.property];
        const value = event.detail.value;
        if (oldValue !== value) {
            // JavaScript is weird NaN != NaN
            if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue)))
                return;
            this.node[this.property] = value;
        }
    }
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onSourceChanged(event) {
        {
            if (event.target !== this.node) {
                console.error(`onSourceChanged() should always originate form source node.
          Please file an issue at https://github.com/arodic/iogui/issues.`);
                return;
            }
        }
        const value = event.detail.value;
        for (let i = this.targets.length; i--;) {
            const target = this.targets[i];
            const targetProperties = this.getTargetProperties(target);
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
        this.node.removeEventListener(`${this.property}-changed`, this.onSourceChanged);
        for (let i = this.targets.length; i--;) {
            this.removeTarget(this.targets[i]);
        }
        this.targets.length = 0;
        delete this.node;
        delete this.property;
        delete this.targets;
        delete this.targetProperties;
        delete this.onTargetChanged;
        delete this.onSourceChanged;
    }
}

/**
 * Property definition class
 */
class PropertyDefinition {
    value;
    type;
    binding;
    reflect = 0;
    notify = true;
    observe = false;
    readonly = false;
    strict = false;
    enumerable = true;
    /**
     * Takes a weakly typed property definition and returns a stronly typed property definition.
     * @param {PropertyDefinitionWeak} def Weakly typed property definition
     */
    constructor(def) {
        if (def === undefined || def === null) {
            this.value = def;
        }
        else if (typeof def === 'function') {
            this.type = def;
        }
        else if (def instanceof Binding$1) {
            this.value = def.value;
            this.type = (def.value !== undefined && def.value !== null) ? def.value.constructor : undefined;
            this.binding = def;
        }
        else if (def && def.constructor === Object) {
            const _def = def;
            this.value = _def.value !== undefined ? _def.value : undefined;
            this.type = _def.type !== undefined ? _def.type : (_def.value !== undefined && _def.value !== null) ? _def.value.constructor : undefined;
            this.binding = _def.binding instanceof Binding$1 ? _def.binding : undefined;
            this.reflect = _def.reflect !== undefined ? _def.reflect : 0;
            this.notify = _def.notify !== undefined ? _def.notify : true;
            this.observe = _def.observe !== undefined ? _def.observe : false;
            this.readonly = _def.readonly !== undefined ? _def.readonly : false;
            this.strict = _def.strict !== undefined ? _def.strict : false;
            this.enumerable = _def.enumerable !== undefined ? _def.enumerable : true;
        }
        else if (!(def && def.constructor === Object)) {
            this.value = def;
            this.type = def.constructor;
        }
        if (this.value === undefined) {
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
    }
}
/**
 * Assigns property definition values to another property definition, unless they are default values.
 * @param {PropertyDefinition} def Property definition
 * @param {PropertyDefinition} newDef Existing property definition
 */
const assignPropertyDefinition = (def, newDef) => {
    if (newDef.value !== undefined)
        def.value = newDef.value;
    if (newDef.type !== undefined)
        def.type = newDef.type;
    if (newDef.reflect !== 0)
        def.reflect = newDef.reflect;
    if (newDef.notify !== true)
        def.notify = newDef.notify;
    if (newDef.observe !== false)
        def.observe = newDef.observe;
    if (newDef.readonly !== false)
        def.readonly = newDef.readonly;
    if (newDef.strict !== false)
        def.strict = newDef.strict;
    if (newDef.enumerable !== true)
        def.enumerable = newDef.enumerable;
    if (newDef.binding !== undefined)
        def.binding = newDef.binding;
};
/**
 * Property configuration object.
 * It is initialized from corresponding `PropertyDefinition` in `ProtoChain`.
 */
class Property$1 {
    // Property value.
    value = undefined;
    // Constructor of the property value.
    type = undefined;
    // Binding object.
    binding = undefined;
    // Reflects to HTML attribute [-1, 0, 1 or 2]
    reflect = 0;
    // Enables change handlers and events.
    notify = true;
    // Observe object mutations for this property.
    observe = false;
    // Makes the property readonly. // TODO: document and test
    readonly = false;
    // Enforce stric typing. // TODO: document and test
    strict = false;
    // Makes property enumerable.
    enumerable = true;
    /**
     * Creates the property configuration object and copies values from `PropertyDefinition`.
     * @param {PropertyDefinition} propDef PropertyDefinition object
     */
    constructor(propDef) {
        {
            Object.keys(propDef).forEach(key => {
                if (['value', 'type', 'reflect', 'notify', 'observe', 'readonly', 'strict', 'enumerable', 'binding'].indexOf(key) === -1) {
                    console.warn(`PropertyDefinition: Invalid field ${key}`);
                }
            });
            if (propDef.type !== undefined && typeof propDef.type !== 'function')
                console.warn('Incorrect type for "type" field');
            if (propDef.binding !== undefined && propDef.binding.constructor !== Binding$1)
                console.warn('Incorrect type for "binding" field');
            if (propDef.reflect !== undefined && ([-1, 0, 1, 2]).indexOf(propDef.reflect) === -1) {
                console.error(`Invalid reflect field ${propDef.reflect}!`);
            }
            if (propDef.notify !== undefined && typeof propDef.notify !== 'boolean')
                console.warn('Incorrect type for "notify" field');
            if (propDef.observe !== undefined && typeof propDef.observe !== 'boolean')
                console.warn('Incorrect type for "observe" field');
            if (propDef.readonly !== undefined && typeof propDef.readonly !== 'boolean')
                console.warn('Incorrect type for "readonly" field');
            if (propDef.strict !== undefined && typeof propDef.strict !== 'boolean')
                console.warn('Incorrect type for "strict" field');
            if (propDef.enumerable !== undefined && typeof propDef.enumerable !== 'boolean')
                console.warn('Incorrect type for "enumerable" field');
        }
        this.value = propDef.value;
        this.type = propDef.type;
        this.binding = propDef.binding;
        this.reflect = propDef.reflect;
        this.notify = propDef.notify;
        this.observe = propDef.observe;
        this.readonly = propDef.readonly;
        this.strict = propDef.strict;
        this.enumerable = propDef.enumerable;
        // TODO: test
        if (this.binding instanceof Binding$1)
            this.value = this.binding.value;
        else if (this.value === undefined && typeof this.type === 'function') {
            {
                console.warn('Property value should always be initialized when type is defined!');
            }
        }
        else {
            if (this.type === Array && this.value instanceof Array) {
                this.value = [...this.value];
            }
            else if (typeof this.type === 'function' && this.value instanceof Object) {
                // console.log(this.type);
                this.value = Object.assign(new this.type(), this.value);
            }
        }
    }
}

/**
 * Takes weakly typed listener definition and returns stronly typed listener definition.
 * @param {ListenerDefinitionWeak} def Weakly typed listener definition
 * @return {ListenerDefinition} Stronly typed listener definition
 */
const hardenListenerDefinition = (def) => {
    return def instanceof Array ? def : [def];
};
/**
 * Assigns listener definition to an existing array of listener definitions.
 * @param {ListenerDefinition[]} defs Array of listener definitions
 * @param {ListenerDefinition} def Listener definition
 */
const assignListenerDefinition = (defs, def) => {
    const i = defs.findIndex(_def => _def[0] === def[0]);
    if (i !== -1) {
        if (defs[i][1])
            defs[i][1] = Object.assign(defs[i][1], def[1]);
        else if (def[1])
            defs[i][1] = def[1];
    }
    else {
        defs.push(def);
    }
};
// TODO: consider implementing "once" and "signal" options.
const LISTENER_OPTIONS = ['capture', 'passive'];
/**
 * Takes a node and a listener definition and returns a listener.
 * @param {IoNode} node `IoNode` instance
 * @param {ListenerDefinition} def Listener definition
 * @return {Listener} Listener
 */
const listenerFromDefinition = (node, def) => {
    {
        if (typeof def[0] !== 'string' && typeof def[0] !== 'function')
            console.warn('Invalid listener type');
        if (def[1]) {
            if (typeof def[1] !== 'object')
                console.warn('Invalid listener options type');
            else if (Object.keys(def[1]).some(k => !(LISTENER_OPTIONS.includes(k)))) {
                console.warn('Invalid listener options type');
            }
        }
    }
    const listener = [typeof def[0] === 'string' ? node[def[0]] : def[0]];
    if (def[1])
        listener.push(def[1]);
    return listener;
};
/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `IoNode` classes compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` class declarations
 *  - `propListeners` specified as inline properties prefixed with "on-"
 *  - `addedListeners` explicitly added using `addEventListener()`
 */
class EventDispatcher$1 {
    node;
    isEventTarget;
    protoListeners = {};
    propListeners = {};
    addedListeners = {};
    /**
     * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
     * It initializes `protoListeners` from `ProtoChain`.
     * @param {IoNode} node owner IoNode
     */
    constructor(node) {
        this.node = node;
        this.isEventTarget = node instanceof EventTarget;
        this.setProtoListeners(node);
        {
            Object.defineProperty(this, 'node', { enumerable: false, writable: false });
            Object.defineProperty(this, 'isEventTarget', { enumerable: false, writable: false });
            Object.defineProperty(this, 'protoListeners', { enumerable: false, writable: false });
            Object.defineProperty(this, 'propListeners', { enumerable: false, writable: false });
            Object.defineProperty(this, 'addedListeners', { enumerable: false, writable: false });
        }
    }
    /**
     * Sets `protoListeners` specified as `get Listeners()` class declarations.
     * @param {IoNode} node owner IoNode
     */
    setProtoListeners(node) {
        for (const name in node._protochain?.listeners) {
            this.protoListeners[name] = [];
            for (let i = 0; i < node._protochain.listeners[name].length; i++) {
                const listener = listenerFromDefinition(node, node._protochain.listeners[name][i]);
                this.protoListeners[name].push(listener);
                if (this.isEventTarget) {
                    EventTarget.prototype.addEventListener.call(this.node, name, listener[0], listener[1]);
                }
            }
        }
    }
    /**
     * Sets `propListeners` specified as inline properties prefixed with "on-".
     * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
     * @param {Record<string, any>} properties Inline properties
     */
    setPropListeners(properties) {
        const newPropListeners = {};
        for (const prop in properties) {
            if (prop.startsWith('on-')) {
                const name = prop.slice(3, prop.length);
                const definition = hardenListenerDefinition(properties[prop]);
                const listener = listenerFromDefinition(this.node, definition);
                newPropListeners[name] = [listener];
            }
        }
        const propListeners = this.propListeners;
        for (const name in propListeners) {
            if (!newPropListeners[name]) {
                if (this.isEventTarget) {
                    const definition = hardenListenerDefinition(propListeners[name][0]);
                    const listener = listenerFromDefinition(this.node, definition);
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
                delete propListeners[name];
            }
        }
        for (const name in newPropListeners) {
            if (this.isEventTarget) {
                const newDefinition = hardenListenerDefinition(newPropListeners[name][0]);
                const newListener = listenerFromDefinition(this.node, newDefinition);
                if (!propListeners[name]) {
                    EventTarget.prototype.addEventListener.call(this.node, name, newListener[0], newListener[1]);
                }
                else {
                    const definition = hardenListenerDefinition(propListeners[name][0]);
                    const listener = listenerFromDefinition(this.node, definition);
                    if ((listener !== newListener || newListener[1] && (JSON.stringify(listener[1]) !== JSON.stringify(newListener[1])))) {
                        EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                        EventTarget.prototype.addEventListener.call(this.node, name, newListener[0], newListener[1]);
                    }
                }
            }
            propListeners[name] = newPropListeners[name];
        }
    }
    /**
     * Proxy for `addEventListener` method.
     * Adds an event listener to `addedListeners`.
     * @param {string} name Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
     */
    addEventListener(name, listener, options) {
        this.addedListeners[name] = this.addedListeners[name] || [];
        {
            const l = this.addedListeners[name].findIndex(l => l[0] === listener);
            if (l !== -1)
                console.warn(`Listener ${name} already added!`);
            if (typeof listener !== 'function')
                console.warn('Invalid listener type!');
            if (options) {
                if (typeof options !== 'object')
                    console.warn('Invalid listener options type');
                else if (Object.keys(options).some(k => !(LISTENER_OPTIONS.includes(k))))
                    console.warn('Invalid listener options type');
            }
        }
        this.addedListeners[name].push(options ? [listener, options] : [listener]);
        if (this.isEventTarget) {
            EventTarget.prototype.addEventListener.call(this.node, name, listener, options);
        }
    }
    /**
     * Proxy for `removeEventListener` method.
     * Removes an event listener from `addedListeners`.
     * If `listener` is not specified it removes all listeners for specified `type`.
     * @param {string} name Name of the event
     * @param {EventListener} listener Event listener handler
     * @param {AddEventListenerOptions} [options] Event listener options
    */
    removeEventListener(name, listener, options) {
        {
            if (!this.addedListeners[name])
                console.warn(`Listener ${name} not found!`);
            if (listener && typeof listener !== 'function')
                console.warn('Invalid listener type!');
            if (options) {
                if (typeof options !== 'object')
                    console.warn('Invalid listener options type');
                else if (Object.keys(options).some(k => !(LISTENER_OPTIONS.includes(k)))) {
                    console.warn('Invalid listener options type');
                }
            }
        }
        if (!listener) {
            for (let i = 0; i < this.addedListeners[name].length; i++) {
                if (this.isEventTarget) {
                    const listener = this.addedListeners[name][i];
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
            }
            this.addedListeners[name].length = 0;
        }
        else {
            const l = this.addedListeners[name].findIndex(item => item[0] = listener);
            {
                if (l === -1)
                    console.warn(`Listener ${name} not found!`);
            }
            this.addedListeners[name].splice(l, 1);
            if (this.isEventTarget) {
                EventTarget.prototype.removeEventListener.call(this.node, name, listener, options);
            }
        }
        if (this.addedListeners[name].length === 0) {
            delete this.addedListeners[name];
        }
    }
    /**
     * Shorthand for custom event dispatch.
     * @param {string} name Name of the event
     * @param {Record<string, any>} detail Event detail data
     * @param {boolean} [bubbles] Makes event bubble
     * @param {EventTarget} [node] Event target override to dispatch the event from
     */
    dispatchEvent(name, detail = {}, bubbles = true, node = this.node) {
        if ((node instanceof EventTarget)) {
            EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(name, { detail: detail, bubbles: bubbles, composed: true, cancelable: true }));
        }
        else {
            if (this.protoListeners[name]) {
                for (let i = 0; i < this.protoListeners[name].length; i++) {
                    this.protoListeners[name][i][0].call(node, { detail: detail, target: node, path: [node] });
                }
            }
            if (this.propListeners[name]) {
                {
                    if (this.propListeners[name].length > 1)
                        console.warn(`PropListeners[${name}] array too long!`);
                }
                this.propListeners[name][0][0].call(node, { detail: detail, target: node, path: [node] });
            }
            if (this.addedListeners[name]) {
                for (let i = 0; i < this.addedListeners[name].length; i++) {
                    this.addedListeners[name][i][0].call(node, { detail: detail, target: node, path: [node] });
                }
            }
        }
    }
    /**
     * Disconnects all event listeners and removes all references for garbage collection.
     * Use this when node is discarded.
     */
    dispose() {
        for (const name in this.protoListeners) {
            if (this.isEventTarget) {
                for (let i = 0; i < this.protoListeners[name].length; i++) {
                    const listener = this.protoListeners[name][i];
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
            }
            this.protoListeners[name].length = 0;
            delete this.protoListeners[name];
        }
        for (const name in this.propListeners) {
            if (this.isEventTarget) {
                const listener = this.propListeners[name][0];
                EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
            }
            this.propListeners[name].length = 0;
            delete this.propListeners[name];
        }
        for (const name in this.addedListeners) {
            if (this.isEventTarget) {
                for (let i = this.addedListeners[name].length; i--;) {
                    const listener = this.addedListeners[name][i];
                    EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
                }
            }
            this.addedListeners[name].length = 0;
            delete this.addedListeners[name];
        }
        delete this.node;
        delete this.protoListeners;
        delete this.propListeners;
        delete this.addedListeners;
    }
}

/**
 * Internal utility class that contains usefull information about class inheritance such as:
 * - Array of inherited class constructors up until `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`
 * - Array of auto-binding function names that start with "on" or "_"
 * - Properties declared in `static get Properties()` return oject
 * - Listeners declared in `static get Listeners()` return oject
 * - CSS style string declared in `static get Style()` return string
 * - Array of property names with `observed: true`
 *
 * Inherited information is aggregated automatically by prototype chain traversal that
 * It collects information from inhertited classes specified in static getters in an additive manner,
 * respecting the order of inheritance.
 */
class ProtoChain$1 {
    /*
     * Array of inherited class constructors up until `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
     */
    constructors = [];
    /*
     * Array of auto-binding function names that start with "on" or "_".
     */
    functions = [];
    /*
     * Properties declared in `static get Properties()` return oject.
     */
    properties = {};
    /*
     * Listeners declared in `static get Listeners()` return oject.
     */
    listeners = {};
    /*
     * CSS style string declared in `static get Style()` return string.
     */
    style = '';
    /*
     * Array of property names with `observed: true`.
     */
    observedObjects = [];
    /**
     * Creates an instance of `ProtoChain`.
     * @param {IoNodeConstructor<any>} ioNodeClass - Owner `IoNode`-derived class.
     */
    constructor(ioNodeClass) {
        let proto = ioNodeClass.prototype;
        // Iterate through the prototype chain to aggregate inheritance information.
        // Terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
        while (proto
            && ioNodeClass.name !== 'classConstructor'
            && (ioNodeClass) !== HTMLElement
            && (ioNodeClass) !== Object
            && (ioNodeClass) !== Array) {
            // Add class constructor to array
            this.constructors.push(ioNodeClass);
            // Add auto-binding function names
            const names = Object.getOwnPropertyNames(proto);
            for (let j = 0; j < names.length; j++) {
                const fn = names[j];
                const propDesr = Object.getOwnPropertyDescriptor(proto, fn);
                if (propDesr === undefined || propDesr.get || propDesr.set)
                    continue;
                if (typeof proto[fn] === 'function') {
                    if (this.functions.indexOf(fn) === -1 && (fn.startsWith('_') || fn.startsWith('on'))) {
                        this.functions.push(fn);
                    }
                }
            }
            // Concatinate style strings
            if (ioNodeClass.Style && this.style.indexOf(ioNodeClass.Style) === -1) {
                this.style = ioNodeClass.Style + '\n' + this.style;
            }
            // Continue prototype traversal
            proto = proto.__proto__;
            ioNodeClass = proto.constructor;
        }
        // Iterate through the prototype chain once again in reverse to
        // aggregate inherited properties and listeners.
        for (let i = this.constructors.length; i--;) {
            // Add properties
            const props = this.constructors[i].Properties;
            for (const name in props) {
                const hardPropDef = new PropertyDefinition(props[name]);
                if (!this.properties[name])
                    this.properties[name] = hardPropDef;
                else
                    assignPropertyDefinition(this.properties[name], hardPropDef);
            }
            // Add listeners
            const listeners = this.constructors[i].Listeners;
            for (const lsnrName in listeners) {
                if (listeners[lsnrName]) {
                    this.listeners[lsnrName] = this.listeners[lsnrName] || [];
                    assignListenerDefinition(this.listeners[lsnrName], hardenListenerDefinition(listeners[lsnrName]));
                }
            }
        }
        // Create a list of observed objects
        for (const name in this.properties) {
            if (this.properties[name].observe) {
                {
                    const isNull = this.properties[name].value === null;
                    const isUndefined = this.properties[name].value === undefined;
                    const isObject = this.properties[name].value instanceof Object;
                    if ([String, Number, Boolean].indexOf(this.properties[name].type) !== -1 ||
                        (!isNull && !isUndefined && !isObject)) {
                        console.warn('Property `observe` is only intended for object properties!');
                    }
                }
                this.observedObjects.push(name);
            }
        }
        {
            Object.defineProperty(this, 'constructors', { enumerable: false, writable: false });
            Object.defineProperty(this, 'functions', { enumerable: false, writable: false });
            Object.defineProperty(this, 'properties', { enumerable: false, writable: false });
            Object.defineProperty(this, 'listeners', { enumerable: false, writable: false });
            Object.defineProperty(this, 'style', { enumerable: false, writable: false });
            Object.defineProperty(this, 'observedObjects', { enumerable: false, writable: false });
        }
    }
    /**
     * Binds all auto-binding functions from the `.functions` list to specified `IoNode` instance.
     * @param {IoNode} node - `IoNode` instance to bind functions to.
     */
    bindFunctions(node) {
        for (let i = this.functions.length; i--;) {
            Object.defineProperty(node, this.functions[i], { value: node[this.functions[i]].bind(node) });
        }
    }
}

/**
 * Property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
class ChangeQueue$1 {
    node;
    changes = [];
    dispatching = false;
    /**
     * Creates change queue for the specified owner instance of `IoNode`.
     * @param {IoNode} node - Owner node.
     */
    constructor(node) {
        this.node = node;
        Object.defineProperty(this, 'node', { enumerable: false, writable: false });
        Object.defineProperty(this, 'changes', { enumerable: false, writable: false });
        Object.defineProperty(this, 'dispatching', { enumerable: false });
    }
    /**
     * Adds property change payload to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated in-queue.
     * @param {string} property - Property name.
     * @param {any} value Property value.
     * @param {any} oldValue Old property value.
     */
    queue(property, value, oldValue) {
        {
            if (value === oldValue)
                console.warn('ChangeQueue: queuing change with same value and oldValue!');
        }
        const i = this.changes.findIndex(change => change.property === property);
        if (i === -1) {
            this.changes.push({ property, value, oldValue });
        }
        else {
            this.changes[i].value = value;
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
        if (this.dispatching === true)
            return;
        this.dispatching = true;
        let changed = false;
        while (this.changes.length) {
            // TODO: convert to FIFO
            const i = this.changes.length - 1;
            // const i = 0;
            const change = this.changes[i];
            this.changes.splice(i, 1);
            const property = change.property;
            if (change.value !== change.oldValue) {
                changed = true;
                if (this.node[property + 'Changed'])
                    this.node[property + 'Changed'](change);
                this.node.dispatchEvent(property + '-changed', change);
            }
        }
        if (changed) {
            this.node.applyCompose();
            this.node.changed();
        }
        this.dispatching = false;
    }
    /**
     * Clears the queue and removes the node reference.
     * Use this when node queue is no longer needed.
     */
    dispose() {
        this.changes.length = 0;
        delete this.node;
        delete this.changes;
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
            {
                const constructor = this.__proto__.constructor;
                if (constructor._registeredAs !== constructor.name) {
                    console.error(`${constructor.name} not registered! Call "RegisterIoNode()" before using ${constructor.name} class!`);
                }
            }
            this._protochain.bindFunctions(this);
            this._changeQueue = new ChangeQueue$1(this);
            Object.defineProperty(this, '_changeQueue', { enumerable: false });
            this._eventDispatcher = new EventDispatcher$1(this);
            Object.defineProperty(this, '_eventDispatcher', { enumerable: false });
            for (const name in this._protochain.properties) {
                const property = new Property$1(this._protochain.properties[name]);
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
            this.setProperties(properties);
        }
        /**
         * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
         * @param {string} name Property name to set value of.
         * @param {any} value Peroperty value.
         * @param {boolean} [skipDispatch] flag to skip event dispatch.
         */
        setPropertyValue(name, value, skipDispatch) {
            const prop = this._properties[name];
            const oldValue = prop.value;
            if (value !== oldValue) {
                const binding = (value instanceof Binding$1) ? value : undefined;
                if (binding) {
                    const oldBinding = prop.binding;
                    if (oldBinding && binding !== oldBinding) {
                        oldBinding.removeTarget(this, name);
                    }
                    binding.addTarget(this, name);
                    value = binding.value;
                }
                else {
                    if (prop.strict && prop.type && !(value instanceof prop.type)) {
                        {
                            console.warn(`IoGUI strict type mismatch for "${name}" property! Value automatically converted to "${prop.type.name}."`);
                        }
                        value = new prop.type(value);
                    }
                }
                prop.value = value;
                {
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
                    if (!this._properties[prop] || typeof this._properties[prop].value !== 'object') {
                        console.error(`Composed property ${prop} is not a Node or an object.`);
                        continue;
                    }
                    const object = this._properties[prop].value;
                    if (object._isIoNode) {
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
                if (event.detail.objects) {
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
            if (!this._properties[prop]) {
                console.warn(`IoGUI Node: cannot bind to ${prop} property. Does not exist!`);
            }
            this._bindings[prop] = this._bindings[prop] || new Binding$1(this, prop);
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
                if (this._properties[p] === undefined) {
                    if (!p.startsWith('on-') && p !== 'import' && p !== 'style' && p !== 'config') {
                        // TODO: consider converting import and style to properties
                        console.warn(`Property "${p}" is not defined`, this);
                    }
                    continue;
                }
                this.setPropertyValue(p, props[p], true);
            }
            this._eventDispatcher.setPropListeners(props);
            this.queueDispatch();
        }
        /**
         * Wrapper for addEventListener.
         * @param {string} type - listener name.
         * @param {function} listener - listener handler.
         * @param {Object} options - event listener options.
         */
        addEventListener(type, listener, options) {
            if (typeof listener !== 'function') {
                console.warn(`${this.constructor.name}incorrect listener type.`, this);
                return;
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
                const value = object[key] instanceof Binding$1 ? object[key].value : object[key];
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
                const value = object[key] instanceof Binding$1 ? object[key].value : object[key];
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
    Object.defineProperty(proto, '_isIoNode', { value: true });
    Object.defineProperty(nodeConstructor, '_registeredAs', { value: nodeConstructor.name });
    Object.defineProperty(proto, '_protochain', { value: new ProtoChain$1(nodeConstructor) });
    Object.defineProperty(window, nodeConstructor.name, { value: nodeConstructor });
    for (const p in proto._protochain.properties) {
        Object.defineProperty(proto, p, {
            get: function () {
                return this._properties[p].value;
            },
            set: function (value) {
                {
                    if (proto._protochain.properties[p].readonly)
                        console.error(`IoGUI error. Cannot set value "${value}" to read only property "${p}"`);
                }
                this.setPropertyValue(p, value);
            },
            enumerable: !!proto._protochain.properties[p].enumerable,
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
        for (const prop in this.prototype._protochain.properties) {
            const r = this.prototype._protochain.properties[prop].reflect;
            if (r === -1 || r === 2) {
                observed.push(prop);
            }
        }
        return observed;
    }
    attributeChangedCallback(prop, oldValue, newValue) {
        const type = this._properties[prop].type;
        if (type === Boolean) {
            if (newValue === null)
                this[prop] = false;
            else if (newValue === '')
                this[prop] = true;
        }
        else if (type === Number || type === String) {
            this[prop] = new type(newValue);
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
        // super.connectedCallback();
        if (typeof this.onResized === 'function') {
            ro.observe(this);
        }
    }
    /**
     * Removes resize listener if `onResized()` is defined in subclass.
     */
    disconnectedCallback() {
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
            this.setPropertyValue('$', {});
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
                if (child._isIoElement) {
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
                    child._textNode.nodeValue = String(vChildren[i].children);
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
        element._textNode = element.childNodes[0];
        if (element.childNodes.length > 1) {
            const textContent = element.textContent;
            for (let i = element.childNodes.length; i--;) {
                if (i !== 0)
                    element.removeChild(element.childNodes[i]);
            }
            element._textNode.nodeValue = textContent;
        }
    }
    get textNode() {
        this.flattenTextNode(this);
        return this._textNode.nodeValue;
    }
    set textNode(value) {
        this.flattenTextNode(this);
        this._textNode.nodeValue = String(value);
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
// Global mixin record
const mixinRecord = {};
// Regular expressions for style string processing.
const commentsRegex = new RegExp('(\\/\\*[\\s\\S]*?\\*\\/)', 'gi');
const keyframeRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mediaQueryRegex = new RegExp('((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mixinRegex = new RegExp('((--[\\s\\S]*?): {([\\s\\S]*?)})', 'gi');
const applyRegex = new RegExp('(@apply\\s.*?;)', 'gi');
const cssRegex = new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi');
/**
 * Register function for `IoElement`. Registers custom element.
 * @param {IoElement} element - Element class to register.
 */
const RegisterIoElement = function (element) {
    RegisterIoNode(element);
    const localName = element.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    Object.defineProperty(element, 'localName', { value: localName });
    Object.defineProperty(element.prototype, 'localName', { value: localName });
    Object.defineProperty(element, '_isIoElement', { enumerable: false, value: true });
    Object.defineProperty(element.prototype, '_isIoElement', { enumerable: false, value: true });
    if (window.customElements !== undefined) {
        window.customElements.define(localName, element);
    }
    else {
        document.body.insertBefore(warning, document.body.children[0]);
        return;
    }
    let mixinsString = '';
    const mixins = element.prototype._protochain.style.match(mixinRegex);
    if (mixins) {
        for (let i = 0; i < mixins.length; i++) {
            const m = mixins[i].split(': {');
            const name = m[0];
            const value = m[1].replace(/}/g, '').trim().replace(/^ +/gm, '');
            mixinRecord[name] = value;
            mixinsString += mixins[i].replace('--', '.').replace(': {', ' {');
        }
    }
    // Remove mixins
    let styleString = element.prototype._protochain.style.replace(mixinRegex, '');
    // Apply mixins
    const apply = styleString.match(applyRegex);
    if (apply) {
        for (let i = 0; i < apply.length; i++) {
            const name = apply[i].split('@apply ')[1].replace(';', '');
            if (mixinRecord[name]) {
                styleString = styleString.replace(apply[i], mixinRecord[name]);
            }
            else {
                console.warn('IoElement: cound not find mixin:', name);
            }
        }
    }
    {
        let styleStringStripped = styleString;
        styleStringStripped = styleStringStripped.replace(commentsRegex, '');
        styleStringStripped = styleStringStripped.replace(keyframeRegex, '');
        styleStringStripped = styleStringStripped.replace(mediaQueryRegex, '');
        const match = styleStringStripped.match(cssRegex);
        if (match) {
            match.map((selector) => {
                selector = selector.trim();
                if (!selector.startsWith(':host')) {
                    console.warn(localName + ': CSS Selector not prefixed with ":host"! This will cause style leakage!');
                    console.warn(selector);
                }
            });
        }
    }
    // Replace `:host` with element tag and add mixin CSS variables.
    styleString = mixinsString + styleString.replace(new RegExp(':host', 'g'), localName);
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styleString;
    styleElement.setAttribute('id', 'io-style-' + localName.replace('io-', ''));
    document.head.appendChild(styleElement);
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
    if (ConstructorClass && ConstructorClass._isIoElement)
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
    if (!element._eventDispatcher) {
        // TODO: test
        Object.defineProperty(element, '_eventDispatcher', { value: new EventDispatcher$1(element) });
        // TODO: disconnect on disposal?
    }
    element._eventDispatcher.setPropListeners(props, element);
};
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
class Object1$1 {
}
class Object2 extends Object1$1 {
}
class Object3 extends Object2 {
}
class HTMLElement1 extends HTMLElement {
}
class HTMLElement2 extends HTMLElement1 {
}
class HTMLElement3 extends HTMLElement2 {
}
class IoNode1$1 extends IoNode {
}
class IoElement1 extends IoElement {
}
class IoNode2$1 extends IoNodeMixin(Object3) {
}
class FakeIoNode1 {
    static get Properties() {
        return {
            prop1: {
                notify: false
            }
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
    static get Style() {
        return 'a';
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
            prop1: {
                observe: true
            },
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
    static get Style() {
        return 'b';
    }
}
class FakeIoNode3 extends FakeIoNode2 {
}
class ProtoChain {
    run() {
        describe('ProtoChain', () => {
            it('Should include an array of all inherited constructors', () => {
                let constructors = new ProtoChain$1(Array3).constructors;
                chai.expect(constructors[0]).to.be.equal(Array3);
                chai.expect(constructors[1]).to.be.equal(Array2);
                chai.expect(constructors[2]).to.be.equal(Array1);
                constructors = new ProtoChain$1(Object3).constructors;
                chai.expect(constructors[0]).to.be.equal(Object3);
                chai.expect(constructors[1]).to.be.equal(Object2);
                chai.expect(constructors[2]).to.be.equal(Object1$1);
                constructors = new ProtoChain$1(HTMLElement3).constructors;
                chai.expect(constructors[0]).to.be.equal(HTMLElement3);
                chai.expect(constructors[1]).to.be.equal(HTMLElement2);
                chai.expect(constructors[2]).to.be.equal(HTMLElement1);
                constructors = new ProtoChain$1(IoNode1$1).constructors;
                chai.expect(constructors[0]).to.be.equal(IoNode1$1);
                chai.expect(constructors[1]).to.be.equal(IoNode);
                constructors = new ProtoChain$1(IoElement1).constructors;
                chai.expect(constructors[0]).to.be.equal(IoElement1);
                chai.expect(constructors[1]).to.be.equal(IoElement);
                constructors = new ProtoChain$1(IoNode2$1).constructors;
                chai.expect(constructors[0]).to.be.equal(IoNode2$1);
            });
            it('Should end constructor array at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`', () => {
                let constructors = new ProtoChain$1(Array3).constructors;
                chai.expect(constructors[3]).to.be.equal(undefined);
                constructors = new ProtoChain$1(Object3).constructors;
                chai.expect(constructors[3]).to.be.equal(undefined);
                constructors = new ProtoChain$1(HTMLElement3).constructors;
                chai.expect(constructors[3]).to.be.equal(undefined);
                constructors = new ProtoChain$1(IoNode1$1).constructors;
                chai.expect(constructors[2]).to.be.equal(undefined);
                constructors = new ProtoChain$1(IoElement1).constructors;
                chai.expect(constructors[4]).to.be.equal(undefined);
                constructors = new ProtoChain$1(IoNode2$1).constructors;
                chai.expect(constructors[1]).to.be.equal(undefined);
            });
            it('Should include an array of auto-binding functions starting with "on" or "_"', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                chai.expect(protoChain.functions).to.be.eql(['onFunction2', '_function2', 'onFunction1', '_function1']);
            });
            it('Should bind the auto-binding functions to specified instance with `.bindFunctions(node)` function', () => {
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
            it('Should include all declared properties correctly', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                chai.expect(Object.keys(protoChain.properties)).to.be.eql(['prop1', 'prop2']);
                chai.expect(protoChain.properties).to.be.eql({
                    prop1: { value: undefined, type: undefined, binding: undefined, notify: false, reflect: 0, observe: true, readonly: false, strict: false, enumerable: true },
                    prop2: { value: undefined, type: undefined, binding: undefined, notify: true, reflect: 0, observe: false, readonly: false, strict: false, enumerable: true },
                });
            });
            it('Should include all declared listeners correctly', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                chai.expect(Object.keys(protoChain.listeners)).to.be.eql(['listener1', 'listener3', 'listener4', 'listener2']);
                chai.expect(protoChain.listeners['listener1']).to.be.eql([['function1'], ['_function2']]);
                chai.expect(protoChain.listeners['listener2']).to.be.eql([['function2', { capture: true, passive: true }]]);
                chai.expect(protoChain.listeners['listener3']).to.be.eql([['_function1', { capture: true, passive: true }]]);
            });
            it('Should include all declared style strings correctly', () => {
                const protoChain = new ProtoChain$1(FakeIoNode3);
                chai.expect(protoChain.style).to.be.equal('a\nb\n');
            });
            it('Should include names of all observed object properties', () => {
                const protoChain = new ProtoChain$1(FakeIoNode2);
                chai.expect(protoChain.observedObjects).to.be.eql(['prop1']);
            });
        });
    }
}

class Object1 {
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
class Property {
    run() {
        describe('Property', () => {
            it('Should initialize correct values from weakly typed property definition', () => {
                let protoProp, prop;
                // initialize with empty object as property definition
                protoProp = new PropertyDefinition({});
                prop = new Property$1(protoProp);
                chai.expect(protoProp).to.be.eql(prop).to.be.eql({
                    value: undefined,
                    type: undefined,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with null property definition
                protoProp = new PropertyDefinition(null);
                prop = new Property$1(protoProp);
                chai.expect(protoProp).to.be.eql(prop).to.be.eql({
                    value: null,
                    type: undefined,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with undefined property definition
                protoProp = new PropertyDefinition(undefined);
                prop = new Property$1(protoProp);
                chai.expect(protoProp).to.be.eql(prop).to.be.eql({
                    value: undefined,
                    type: undefined,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with Number property definition
                protoProp = new PropertyDefinition(Number);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: 0,
                    type: Number,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with type:Number property definition
                protoProp = new PropertyDefinition({ type: Number });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: 0,
                    type: Number,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with number property definition
                protoProp = new PropertyDefinition(1);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: 1,
                    type: Number,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with value:number property definition
                protoProp = new PropertyDefinition({ value: 2 });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: 2,
                    type: Number,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with String property definition
                protoProp = new PropertyDefinition(String);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: '',
                    type: String,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with type:String property definition
                protoProp = new PropertyDefinition({ type: String });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: '',
                    type: String,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with string property definition
                protoProp = new PropertyDefinition('test');
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: 'test',
                    type: String,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with value:string property definition
                protoProp = new PropertyDefinition({ value: 'test' });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: 'test',
                    type: String,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with Boolean property definition
                protoProp = new PropertyDefinition(Boolean);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: false,
                    type: Boolean,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with type:Boolean property definition
                protoProp = new PropertyDefinition({ type: Boolean });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: false,
                    type: Boolean,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with boolean property definition
                protoProp = new PropertyDefinition(true);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: true,
                    type: Boolean,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with value:boolean property definition
                protoProp = new PropertyDefinition({ value: true });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: true,
                    type: Boolean,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with Object property definition
                protoProp = new PropertyDefinition(Object);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: {},
                    type: Object,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with type:Object property definition
                protoProp = new PropertyDefinition({ type: Object });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: {},
                    type: Object,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // // initialize with object property definition
                // // This should not initialize with object value
                const object = { prop: true };
                // protoProp = new PropertyDefinition(object as any);
                // prop = new Property(protoProp);
                // chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                //   value: {prop: true},
                //   type: Object,
                //   binding: undefined,
                //   reflect:0,
                //   notify:true,
                //   observe:false,
                //   readonly:false,
                //   strict:false,
                //   enumerable:true
                // });
                // chai.expect(protoProp.value).to.equal(object);
                // chai.expect(prop.value).not.to.equal(object);
                // initialize with object:value property definition
                protoProp = new PropertyDefinition({ value: object });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: { prop: true },
                    type: Object,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                chai.expect(protoProp.value).to.equal(object);
                chai.expect(prop.value).not.to.equal(object);
                // initialize with Array property definition
                protoProp = new PropertyDefinition(Array);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: [],
                    type: Array,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with type:Array property definition
                protoProp = new PropertyDefinition({ type: Array });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: [],
                    type: Array,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with custom Object1 property definition
                protoProp = new PropertyDefinition(Object1);
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: new Object1(),
                    type: Object1,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with an object property definition with object value property
                const array = [1, 2, 3];
                protoProp = new PropertyDefinition({ value: array });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: [1, 2, 3],
                    type: Array,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                chai.expect(protoProp.value).to.equal(array);
                chai.expect(prop.value).not.to.equal(array);
                // initialize with an object property definition with custom object1 value property
                const object1 = new Object1();
                protoProp = new PropertyDefinition({ value: object1 });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: new Object1(),
                    type: Object1,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                chai.expect(protoProp.value).to.equal(object1);
                chai.expect(prop.value).not.to.equal(object1);
                // initialize with an object property definition with custom Object1 type property
                protoProp = new PropertyDefinition({ type: Object1 });
                prop = new Property$1(protoProp);
                chai.expect(prop).to.be.eql(protoProp).to.be.eql({
                    value: { prop: true },
                    type: Object1,
                    binding: undefined,
                    reflect: 0,
                    notify: true,
                    observe: false,
                    readonly: false,
                    strict: false,
                    enumerable: true
                });
                // initialize with non-default property definition
                protoProp = new PropertyDefinition({
                    reflect: -1,
                    notify: false,
                    observe: true,
                    readonly: true,
                    strict: true,
                    enumerable: false
                });
                prop = new Property$1(protoProp);
                chai.expect(protoProp).to.be.eql(prop).to.be.eql({
                    value: undefined,
                    type: undefined,
                    binding: undefined,
                    reflect: -1,
                    notify: false,
                    observe: true,
                    readonly: true,
                    strict: true,
                    enumerable: false
                });
            });
            // it('Should initialize correct values from property definition', () => {
            // });
            it('Should initialize binding properly', () => {
                let protoProp, prop;
                let binding = new Binding$1(new TestIoNode$1({ label: 'lorem' }), 'label');
                protoProp = new PropertyDefinition(binding);
                prop = new Property$1(protoProp);
                chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
                chai.expect(protoProp.value).to.be.equal('lorem');
                chai.expect(prop.value).to.be.equal('lorem');
                const node = new TestIoNode$1({ label: 'lorem' });
                binding = new Binding$1(node, 'label');
                protoProp = new PropertyDefinition({ binding: binding, value: 'ipsum' });
                prop = new Property$1(protoProp);
                chai.expect(protoProp.binding).to.be.equal(prop.binding).to.be.equal(binding);
                chai.expect(protoProp.value).to.be.equal('ipsum');
                chai.expect(prop.value).to.be.equal('lorem');
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
class Binding {
    run() {
        describe('Binding', () => {
            it('Should initialize with correct default values', () => {
                const node = new TestIoNode();
                const binding = new Binding$1(node, 'prop1');
                chai.expect(binding.node).to.be.equal(node);
                chai.expect(binding.property).to.be.equal('prop1');
                chai.expect(binding.targets instanceof Array).to.be.equal(true);
                chai.expect(binding.targets.length).to.be.equal(0);
                chai.expect(binding.targetProperties instanceof WeakMap).to.be.equal(true);
            });
            it('Should get and set property value on source node with `value` getter/setter', () => {
                const node = new TestIoNode();
                const binding = new Binding$1(node, 'prop1');
                node.prop1 = 1;
                chai.expect(binding.value).to.be.equal(1);
                node.prop1 = 2;
                chai.expect(binding.value).to.be.equal(2);
                binding.value = 3;
                chai.expect(node.prop1).to.be.equal(3);
            });
            it('Should add/remove target nodes and properties with `.addTarget()` and `removeTarget()`', () => {
                const srcIoNode = new TestIoNode();
                const binding0 = new Binding$1(srcIoNode, 'prop1');
                const binding1 = new Binding$1(srcIoNode, 'prop2');
                const dstIoNode0 = new TestIoNode();
                const dstIoNode1 = new TestIoNode();
                binding0.addTarget(dstIoNode0, 'prop1');
                binding1.addTarget(dstIoNode0, 'prop2');
                binding1.addTarget(dstIoNode1, 'prop1');
                binding1.addTarget(dstIoNode1, 'prop2');
                chai.expect(binding0.targets[0]).to.be.equal(dstIoNode0);
                chai.expect(binding0.targets[1]).to.be.equal(undefined);
                chai.expect(binding1.targets[0]).to.be.equal(dstIoNode0);
                chai.expect(binding1.targets[1]).to.be.equal(dstIoNode1);
                chai.expect(binding1.targets[2]).to.be.equal(undefined);
                const binding0target0Props = binding0.getTargetProperties(dstIoNode0);
                const binding0target1Props = binding0.getTargetProperties(dstIoNode1);
                chai.expect(binding0target0Props[0]).to.be.equal('prop1');
                chai.expect(binding0target0Props.length).to.be.equal(1);
                chai.expect(binding0target1Props.length).to.be.equal(0);
                const binding1target0Props = binding1.getTargetProperties(dstIoNode0);
                const binding1target1Props = binding1.getTargetProperties(dstIoNode1);
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
                const node = new TestIoNode();
                const binding = new Binding$1(node, 'prop1');
                binding.dispose();
                chai.expect(binding.node).to.be.equal(undefined);
                chai.expect(binding.property).to.be.equal(undefined);
                chai.expect(binding.targets).to.be.equal(undefined);
                chai.expect(binding.targetProperties).to.be.equal(undefined);
            });
        });
    }
}

const handlerFunction = () => { };
class IoNode1 extends IoNode {
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
RegisterIoNode(IoNode1);
class IoNode2 extends IoNode1 {
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
RegisterIoNode(IoNode2);
class IoNode3 extends IoNode2 {
    static get Listeners() {
        return {
            'event1': 'handler3',
            'event2': [handlerFunction, { passive: true }],
            'event3': handlerFunction
        };
    }
}
RegisterIoNode(IoNode3);
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
                const node = {};
                const eventDispatcher = new EventDispatcher$1(node);
                chai.expect(eventDispatcher.node).to.be.equal(node);
                chai.expect(eventDispatcher.protoListeners).to.be.eql({});
                chai.expect(eventDispatcher.propListeners).to.be.eql({});
                chai.expect(eventDispatcher.addedListeners).to.be.eql({});
            });
            it('Should initialize listeners from ProtoChain', () => {
                let node = new IoNode1();
                let eventDispatcher = new EventDispatcher$1(node);
                chai.expect(eventDispatcher.protoListeners).to.be.eql({
                    event1: [[node.handler1]],
                });
                node = new IoNode2();
                eventDispatcher = new EventDispatcher$1(node);
                chai.expect(eventDispatcher.protoListeners).to.be.eql({
                    event1: [[node.handler1]],
                    event2: [[node.handler2, { capture: true }]]
                });
                node = new IoNode3();
                eventDispatcher = new EventDispatcher$1(node);
                chai.expect(eventDispatcher.protoListeners).to.be.eql({
                    event1: [[node.handler1], [node.handler3]],
                    event2: [[node.handler2, { capture: true }], [handlerFunction, { passive: true }]],
                    event3: [[handlerFunction]]
                });
            });
            it('Should set property listeners correctly', () => {
                const node = new IoNode2();
                const eventDispatcher = new EventDispatcher$1(node);
                const handler4 = () => { };
                const handler5 = () => { };
                eventDispatcher.setPropListeners({ 'on-event3': 'handler3', 'on-event4': handler4 });
                chai.expect(eventDispatcher.propListeners).to.be.eql({
                    event3: [[node.handler3]], event4: [[handler4]]
                });
                eventDispatcher.setPropListeners({ 'on-event5': ['handler3'], 'on-event6': [handler4] });
                chai.expect(eventDispatcher.propListeners).to.be.eql({
                    event5: [[node.handler3]], event6: [[handler4]]
                });
                eventDispatcher.setPropListeners({ 'on-event7': [node.handler3, { capture: true }], 'on-event8': [handler5, { capture: true }] });
                chai.expect(eventDispatcher.propListeners).to.be.eql({
                    event7: [[node.handler3, { capture: true }]], event8: [[handler5, { capture: true }]]
                });
                eventDispatcher.setPropListeners({});
                chai.expect(eventDispatcher.propListeners).to.be.eql({});
            });
            it('Should add/remove listeners correctly', () => {
                const node = new IoNode2();
                const eventDispatcher = new EventDispatcher$1(node);
                const listener1 = () => { };
                const listener2 = () => { };
                eventDispatcher.addEventListener('event1', listener1);
                eventDispatcher.addEventListener('event1', listener2, { capture: true });
                chai.expect(eventDispatcher.addedListeners).to.be.eql({
                    event1: [[listener1], [listener2, { capture: true }]]
                });
                eventDispatcher.removeEventListener('event1', listener1);
                chai.expect(eventDispatcher.addedListeners).to.be.eql({
                    event1: [[listener2, { capture: true }]]
                });
                eventDispatcher.removeEventListener('event1');
                chai.expect(eventDispatcher.addedListeners).to.be.eql({});
            });
            it('Should dispatch added events', () => {
                const node = new IoNode2();
                const eventDispatcher = new EventDispatcher$1(node);
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
                chai.expect(node.handler1Count).to.be.equal(1);
                chai.expect(node.handler2Count).to.be.equal(1);
                chai.expect(node.handler3Count).to.be.equal(1);
                chai.expect(handler4Count).to.be.equal(1);
                chai.expect(handler5Count).to.be.equal(1);
                // Remove events
                eventDispatcher.setPropListeners({ 'on-event4': handler4 });
                eventDispatcher.removeEventListener('event5', handler5);
                eventDispatcher.dispatchEvent('event1');
                eventDispatcher.dispatchEvent('event2');
                eventDispatcher.dispatchEvent('event3');
                eventDispatcher.dispatchEvent('event4');
                eventDispatcher.dispatchEvent('event5');
                chai.expect(node.handler1Count).to.be.equal(2);
                chai.expect(node.handler2Count).to.be.equal(2);
                chai.expect(node.handler3Count).to.be.equal(1);
                chai.expect(handler4Count).to.be.equal(2);
                chai.expect(handler5Count).to.be.equal(1);
            });
            it('Should dispatch events with correct event detail', () => {
                const node = new IoNode2();
                const eventDispatcher = new EventDispatcher$1(node);
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
            // TODO: test bubbling and explicit event target.
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
                chai.expect(element.handler3Count).to.be.equal(1);
                chai.expect(handler4Count).to.be.equal(1);
                chai.expect(handler5Count).to.be.equal(1);
                chai.expect(element.handler3Detail).to.be.equal('detail3');
                chai.expect(handler4Detail).to.be.equal('detail4');
                chai.expect(handler5Detail).to.be.equal('detail5');
            });
            it('Should dispose correctly', () => {
                const node = new IoNode2();
                const eventDispatcher = new EventDispatcher$1(node);
                eventDispatcher.dispose();
                chai.expect(eventDispatcher.node).to.be.equal(undefined);
                chai.expect(eventDispatcher.protoListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.propListeners).to.be.equal(undefined);
                chai.expect(eventDispatcher.addedListeners).to.be.equal(undefined);
            });
        });
    }
}

class FakeIoNode {
    connected = true;
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
                chai.expect(changeQueue.node).to.be.equal(node);
                chai.expect(JSON.stringify(changeQueue.changes)).to.be.equal('[]');
                chai.expect(changeQueue.changes.length).to.be.equal(0);
                chai.expect(changeQueue.dispatching).to.be.equal(false);
            });
            it('Should dispatch change events with correct payloads', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.queue('test', 1, 0);
                changeQueue.queue('test', 2, 1);
                chai.expect(changeQueue.changes.length).to.be.equal(1);
                changeQueue.dispatch();
                chai.expect(changeQueue.changes.length).to.be.equal(0);
                chai.expect(node.eventName).to.be.equal('test-changed');
                chai.expect(node.eventChange?.property).to.be.equal('test');
                chai.expect(node.eventChange?.value).to.be.equal(2);
                chai.expect(node.eventChange?.oldValue).to.be.equal(0);
                chai.expect(node.eventDispatchCounter).to.be.equal(1);
                chai.expect(node.changeCounter).to.be.equal(1);
                chai.expect(node.applyComposeCounter).to.be.equal(1);
                changeQueue.queue('test2', 0, -1);
                changeQueue.queue('test3', 2, 1);
                chai.expect(changeQueue.changes.length).to.be.equal(2);
                changeQueue.dispatch();
                chai.expect(changeQueue.changes.length).to.be.equal(0);
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
            it('Should dispose correctly', () => {
                const node = new FakeIoNode();
                const changeQueue = new ChangeQueue$1(node);
                changeQueue.dispose();
                chai.expect(changeQueue.node).to.be.equal(undefined);
                chai.expect(changeQueue.changes).to.be.equal(undefined);
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
// import Property from "./elements/object/properties.test.js";
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
        new ProtoChain().run();
        new Property().run();
        new Binding().run();
        new EventDispatcher().run();
        new ChangeQueue().run();
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
