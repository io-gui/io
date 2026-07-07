var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReactiveObject_1;
import { Register } from '../decorators/Register.js';
import { ProtoChain } from '../core/ProtoChain.js';
import { Binding } from '../core/Binding.js';
import { PropertyInstance, removeSelfMutationListener, removeWindowMutationListener } from '../core/Property.js';
import { NodeArray } from '../core/NodeArray.js';
import { throttle, debounce, clearNodeCallbacks } from '../core/FrameScheduler.js';
import { addParent, detachNodeParents, initReactiveNodeInternals, isReactiveNode, removeParent } from '../core/ReactiveCore.js';
import { Property } from '../decorators/Property.js';
import { ReactiveElement } from '../elements/ReactiveElement.js';
/** Instantiates a property type constructor with runtime constructor arguments. */
export function constructType(ctor, ...args) {
    return new ctor(...args);
}
export const NODES = {
    active: new Set(),
    disposed: new WeakSet(),
};
function hasValueAtOtherProperty(node, prop, value) {
    let found = false;
    node._properties.forEach((p) => {
        if (p !== prop && p.value === value)
            found = true;
    });
    return found;
}
/**
 * Base class for reactive data models and state containers.
 *
 * ReactiveObject provides the core Io-Gui reactive property system without DOM
 * integration. Subclass it for domain models (for example menu options, layout
 * tabs, or theme state). Field changes dispatch change events and invoke
 * matching handlers; object mutations can propagate via {@link dispatchMutation}.
 *
 * Use {@link bind} for two-way synchronization between properties. Nodes register
 * with {@link Register} and declare reactive properties via static
 * `Properties` or `@Property` decorators.
 *
 * @see ReactiveElement for the DOM-integrated counterpart
 */
let ReactiveObject = ReactiveObject_1 = class ReactiveObject extends Object {
    static get Properties() {
        return {};
    }
    static get Fields() {
        return {};
    }
    /** Class-level listeners wired at construction; subclass overrides same event name (last wins). */
    static get Listeners() {
        return {};
    }
    constructor(args) {
        super();
        this._protochain.init(this);
        initReactiveNodeInternals(this);
        this.init();
        initProperties(this);
        initFields(this);
        this.applyProperties((typeof args === 'object' && args !== null ? args : {}), true);
        NODES.active.add(this);
        this.ready();
        this.dispatchQueue();
    }
    applyProperties(props, debounce = false) {
        for (const name in props) {
            if (this._properties.has(name)) {
                this.setProperty(name, props[name], true);
            }
            else {
                if (!name.startsWith('@')) {
                    this[name] = props[name];
                    debug: if (props[name] instanceof Binding) {
                        console.warn(`ReactiveObject: Not a Property! Cannot set binding to "${name}" property on "${this.constructor.name}"`);
                    }
                }
            }
        }
        this._eventDispatcher.applyPropListeners(props);
        if (!debounce)
            this.dispatchQueue();
    }
    setProperties(props, debounce = false) {
        setProperties(this, props, debounce);
    }
    setProperty(name, value, debounce = false) {
        if (this._disposed)
            return;
        setProperty(this, name, value, debounce);
    }
    copy(node) {
        const primitiveProps = {};
        for (const name in node._properties) {
            const prop = node._properties.get(name).value;
            const ownValue = this._properties.get(name).value;
            if (isReactiveNode(prop) && ownValue instanceof ReactiveObject_1) {
                ownValue.copy(prop);
            }
            else {
                primitiveProps[name] = prop;
            }
        }
        this.setProperties(primitiveProps);
    }
    toJSON() {
        const out = {};
        for (const key of this._properties.keys()) {
            if (key === 'dispatchTiming')
                continue;
            const value = this._properties.get(key).value;
            if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
                out[key] = value.toJSON();
            }
            else if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                out[key] = value;
            }
        }
        return out;
    }
    applyJSON(json) {
        const jsonObject = json;
        const primitiveProps = {};
        for (const name in jsonObject) {
            const propDef = this._properties.get(name);
            const value = propDef.value;
            const type = propDef.type;
            if (typeof value === 'object' && value !== null) {
                if (typeof value.applyJSON === 'function') {
                    value.applyJSON(jsonObject[name]);
                }
                else {
                    console.warn(`ReactiveObject.applyJSON(): Field "${name}" does not have applyJSON() method implemented!`);
                    continue;
                }
            }
            else {
                debug: {
                    if (type && jsonObject[name]?.constructor !== type) {
                        console.warn(`ReactiveObject.applyJSON(): Field "${name}" is not a ${type.name}!`, json);
                        continue;
                    }
                }
                primitiveProps[name] = jsonObject[name];
            }
        }
        this.setProperties(primitiveProps);
        return this;
    }
    init() { }
    ready() { }
    mutated() { }
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    queue(name, value, oldValue) {
        this._changeQueue.queue(name, value, oldValue);
    }
    dispatchQueue(debounce = false) {
        dispatchQueue(this, debounce);
    }
    throttle(func, arg, timeout = 1) {
        throttle(func, arg, this, timeout);
    }
    debounce(func, arg, timeout = 1) {
        debounce(func, arg, this, timeout);
    }
    onPropertyMutated(event) {
        return onPropertyMutated(this, event);
    }
    dispatchMutation(object = this, properties = []) {
        dispatchMutation(this, object, properties);
    }
    bind(name) {
        return bind(this, name);
    }
    unbind(name) {
        unbind(this, name);
    }
    addEventListener(type, listener, options) {
        this._eventDispatcher.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        this._eventDispatcher.removeEventListener(type, listener, options);
    }
    dispatch(type, detail = undefined, bubbles = false, src) {
        this._eventDispatcher.dispatchEvent(type, detail, bubbles, src);
    }
    addParent(parent) {
        addParent(this, parent);
    }
    removeParent(parent) {
        removeParent(this, parent);
    }
    dispose() {
        dispose(this);
        NODES.active.delete(this);
        NODES.disposed.add(this);
    }
    Register(ioNodeConstructor) {
        Object.defineProperty(ioNodeConstructor.prototype, '_isReactiveObject', { enumerable: false, value: true, writable: false });
        Object.defineProperty(ioNodeConstructor.prototype, '_protochain', { value: new ProtoChain(ioNodeConstructor) });
    }
};
__decorate([
    Property({ type: String, value: 'immediate' })
], ReactiveObject.prototype, "dispatchTiming", void 0);
ReactiveObject = ReactiveObject_1 = __decorate([
    Register
], ReactiveObject);
export { ReactiveObject };
export function initProperties(node) {
    for (const name in node._protochain.properties) {
        Object.defineProperty(node, name, {
            get: function () {
                return node._properties.get(name).value;
            },
            set: function (value) {
                node.setProperty(name, value);
            },
            configurable: true,
            enumerable: true,
        });
        const property = new PropertyInstance(node, node._protochain.properties[name]);
        node._properties.set(name, property);
        if (property.binding)
            property.binding.addTarget(node, name);
        property.observer.start(property.value);
        if (isReactiveNode(property.value)) {
            property.value.addParent(node);
        }
        if (node instanceof ReactiveElement) {
            if (property.reflect && property.value !== undefined && property.value !== null) {
                node.setAttribute(name, property.value);
            }
        }
    }
}
export function initFields(node) {
    for (const name in node._protochain.fields) {
        let initialValue = node._protochain.fields[name];
        if (typeof initialValue === 'function') {
            initialValue = constructType(initialValue);
        }
        else if (initialValue instanceof Array) {
            initialValue = initialValue.slice();
        }
        else if (typeof initialValue === 'object') {
            // TODO: Consider removing this copy and just use the initialValue directly or prevent object field values
            initialValue = Object.assign({}, initialValue);
        }
        node[name] = initialValue;
    }
}
export function setProperties(node, props, debounce = false) {
    for (const name in props) {
        if (!node._properties.has(name)) {
            debug: console.warn(`Field "${name}" is not defined`, node);
            continue;
        }
        node.setProperty(name, props[name], true);
    }
    if (!debounce)
        node.dispatchQueue();
}
function applyPropertyBinding(node, name, prop, value) {
    if (!(value instanceof Binding))
        return false;
    const binding = value;
    const oldBinding = prop.binding;
    if (binding !== oldBinding) {
        if (oldBinding) {
            oldBinding.removeTarget(node, name);
        }
        binding.addTarget(node, name);
        // NOTE: binding.addTarget() triggers setProperty() again with the resolved value.
        return true;
    }
    // NOTE: Remedy for batch-set via change() > template() > setProperties() with existing bindings.
    return true;
}
function applyNodeArrayAssignment(name, prop, value) {
    if (prop.type !== NodeArray || !Array.isArray(value) || value instanceof NodeArray)
        return false;
    const nodeArray = prop.value;
    debug: if (value.some(item => !isReactiveNode(item))) {
        console.error(`Node: Field "${name}" should be assigned as an Array of nodes!`, value);
    }
    debug: if (nodeArray.constructor !== NodeArray) {
        console.error(`Node: Field "${name}" should be initialized as a NodeArray!`, nodeArray);
    }
    nodeArray.splice(0, nodeArray.length, ...value);
    return true;
}
function disconnectPropertyValue(node, prop, oldValue) {
    if (!hasValueAtOtherProperty(node, prop, oldValue)) {
        prop.observer.stop(oldValue);
        if (isReactiveNode(oldValue) && !oldValue._disposed) {
            oldValue.removeParent(node);
        }
    }
    else {
        prop.observer.observing = false;
    }
}
function connectPropertyValue(node, prop, value) {
    if (!hasValueAtOtherProperty(node, prop, value)) {
        prop.observer.start(value);
        if (isReactiveNode(value)) {
            value.addParent(node);
        }
    }
}
function debugPropertyType(node, name, prop, value) {
    debug: {
        if (prop.type === String) {
            if (typeof value !== 'string') {
                console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
            }
        }
        else if (prop.type === Number) {
            if (typeof value !== 'number') {
                console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
            }
        }
        else if (prop.type === Boolean) {
            if (typeof value !== 'boolean') {
                console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
            }
        }
        else if (prop.type === Array) {
            if (!(value instanceof Array)) {
                console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
            }
        }
        else if (prop.type === Object) {
            if (value instanceof Array) {
                console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
            }
        }
        else if (prop.type === NodeArray) {
            if (!(value instanceof NodeArray)) {
                console.error(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
            }
            if (value.some(item => !isReactiveNode(item))) {
                console.error(`Wrong type of property "${name}". NodeArray items should be nodes!`, value);
            }
        }
        else if (typeof prop.type === 'function') {
            if (!(value instanceof prop.type)) {
                console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
            }
        }
    }
}
/** Assigns a reactive property, queuing change dispatch unless debounced. */
export function setProperty(node, name, value, debounce = false) {
    const prop = node._properties.get(name);
    const oldValue = prop.value;
    if (value === oldValue)
        return;
    if (applyPropertyBinding(node, name, prop, value))
        return;
    if (applyNodeArrayAssignment(name, prop, value))
        return;
    disconnectPropertyValue(node, prop, oldValue);
    prop.value = value;
    connectPropertyValue(node, prop, value);
    debugPropertyType(node, name, prop, value);
    node.queue(name, value, oldValue);
    node.dispatchQueue(debounce);
}
export function dispatchQueue(node, debounce = false) {
    if (node.dispatchTiming === 'debounced' || debounce || node._changeQueue.dispatching) {
        node.debounce(node._changeQueue.dispatch);
    }
    else if (node.dispatchTiming === 'throttled') {
        node.throttle(node._changeQueue.dispatch);
    }
    else if (node.dispatchTiming === 'immediate') {
        node._changeQueue.dispatch();
    }
    debug: if (['immediate', 'throttled', 'debounced'].indexOf(node.dispatchTiming) === -1) {
        console.warn(`ReactiveObject.dispatchQueue(): Invalid dispatchTiming property value: "${node.dispatchTiming}".
      Expected one of: "immediate", "throttled", "debounced".`);
    }
}
/** Dispatches `io-mutation` for in-place object or nested Io value changes. */
export function dispatchMutation(node, object, properties) {
    if (isReactiveNode(object)) {
        node.dispatch('io-mutation', { object, properties });
    }
    else {
        node.dispatch('io-mutation', { object, properties }, false, window);
    }
}
export function onPropertyMutated(node, event) {
    const object = event.detail.object;
    let hasMutated = false;
    node._properties.forEach((prop, name) => {
        if (prop.observer.observing && prop.value === object) {
            const handlerName = name + 'Mutated';
            const handler = node[handlerName];
            if (typeof handler === 'function') {
                handler(event);
            }
            hasMutated = true;
        }
    });
    return hasMutated;
}
export function bind(node, name) {
    debug: if (!node._properties.has(name)) {
        console.warn(`IoGUI Node: cannot bind to ${name} property. Does not exist!`);
    }
    if (!node._bindings.has(name)) {
        node._bindings.set(name, new Binding(node, name));
    }
    return node._bindings.get(name);
}
export function unbind(node, name) {
    const binding = node._bindings.get(name);
    if (binding) {
        binding.dispose();
        node._bindings.delete(name);
    }
    const property = node._properties.get(name);
    property?.binding?.removeTarget(node, name);
}
export { detachNodeParents } from '../core/ReactiveCore.js';
/** Tears down bindings, listeners, queues, and parent links for a reactive owner. */
export function dispose(node) {
    debug: if (node._disposed) {
        console.warn('ReactiveObject.dispose(): Already disposed!', node.constructor.name);
    }
    if (node._disposed)
        return;
    node._properties.forEach((property) => {
        // NodeArray may be shared across nodes. only the owner disposes it.
        if (property.value instanceof NodeArray && property.value.node === node) {
            property.value.dispose(true);
        }
    });
    detachNodeParents(node);
    clearNodeCallbacks(node);
    const mutable = node;
    node._bindings.forEach((binding, name) => {
        binding.dispose();
        node._bindings.delete(name);
    });
    delete mutable._bindings;
    node._changeQueue.dispose();
    delete mutable._changeQueue;
    node._properties.forEach((property, name) => {
        property.binding?.removeTarget(node, name);
        property.observer.stop(property.value);
        property.observer.dispose();
    });
    removeWindowMutationListener(node);
    removeSelfMutationListener(node);
    for (const name in node._protochain.fields) {
        delete node[name];
    }
    delete mutable._protochain;
    // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
    node._eventDispatcher.dispose();
    delete mutable._eventDispatcher;
    delete mutable._properties;
    if (mutable._parents) {
        mutable._parents.length = 0;
        delete mutable._parents;
    }
    if (mutable._children) {
        mutable._children.length = 0;
        delete mutable._children;
    }
    Object.defineProperty(node, '_disposed', { value: true });
}
;
