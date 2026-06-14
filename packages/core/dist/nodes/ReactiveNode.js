var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReactiveNode_1;
import { Register } from '../decorators/Register.js';
import { ProtoChain } from '../core/ProtoChain.js';
import { Binding } from '../core/Binding.js';
import { ReactivePropertyInstance, removeSelfMutationListener, removeWindowMutationListener } from '../core/ReactiveProperty.js';
import { NodeArray } from '../core/NodeArray.js';
import { throttle, debounce, clearNodeQueue } from '../core/Queue.js';
import { addParent, detachChildParents, initReactiveOwnerInternals, isIoValue, removeParent } from '../core/ReactiveCore.js';
import { ReactiveProperty } from '../decorators/Property.js';
import { IoElement } from '../elements/IoElement.js';
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
    node._reactiveProperties.forEach((p) => {
        if (p !== prop && p.value === value)
            found = true;
    });
    return found;
}
/**
 * Base class for reactive data models and state containers.
 *
 * ReactiveNode provides the core Io-Gui reactive property system without DOM
 * integration. Subclass it for domain models (for example menu options, layout
 * tabs, or theme state). Property changes dispatch change events and invoke
 * matching handlers; object mutations can propagate via {@link dispatchMutation}.
 *
 * Use {@link bind} for two-way synchronization between properties. Nodes register
 * with {@link Register} and declare reactive properties via static
 * `ReactiveProperties` or `@ReactiveProperty` decorators.
 *
 * @see IoElement for the DOM-integrated counterpart
 */
let ReactiveNode = ReactiveNode_1 = class ReactiveNode extends Object {
    static get ReactiveProperties() {
        return {};
    }
    static get Properties() {
        return {};
    }
    /** Class-level listeners wired at construction; subclass overrides same event name (last wins). */
    static get Listeners() {
        return {};
    }
    constructor(args) {
        super();
        this._protochain.init(this);
        initReactiveOwnerInternals(this);
        this.init();
        initReactiveProperties(this);
        initProperties(this);
        this.applyProperties((typeof args === 'object' && args !== null ? args : {}), true);
        NODES.active.add(this);
        this.ready();
        this.dispatchQueue();
    }
    applyProperties(props, skipDispatch = false) {
        for (const name in props) {
            if (this._reactiveProperties.has(name)) {
                this.setProperty(name, props[name], true);
            }
            else {
                if (!name.startsWith('@')) {
                    this[name] = props[name];
                    debug: if (props[name] instanceof Binding) {
                        console.warn(`ReactiveNode: Not a ReactiveProperty! Cannot set binding to "${name}" property on "${this.constructor.name}"`);
                    }
                }
            }
        }
        this._eventDispatcher.applyPropListeners(props);
        if (!skipDispatch)
            this.dispatchQueue();
    }
    setProperties(props) {
        setProperties(this, props);
    }
    setProperty(name, value, debounce = false) {
        if (this._disposed)
            return;
        setProperty(this, name, value, debounce);
    }
    copy(node) {
        const primitiveProps = {};
        for (const name in node._reactiveProperties) {
            const prop = node._reactiveProperties.get(name).value;
            const ownValue = this._reactiveProperties.get(name).value;
            if (isIoValue(prop) && ownValue instanceof ReactiveNode_1) {
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
        for (const key of this._reactiveProperties.keys()) {
            if (key === 'reactivity')
                continue;
            const value = this._reactiveProperties.get(key).value;
            if (value instanceof Object && typeof value.toJSON === 'function') {
                out[key] = value.toJSON();
            }
            else if (typeof value === 'number') {
                out[key] = value;
            }
        }
        return out;
    }
    applyJSON(json) {
        const primitiveProps = {};
        for (const name in json) {
            const propDef = this._reactiveProperties.get(name);
            const value = propDef.value;
            const type = propDef.type;
            if (value instanceof Object) {
                if (typeof value.applyJSON === 'function') {
                    value.applyJSON(json[name]);
                }
                else {
                    console.warn(`ReactiveNode.applyJSON(): Property "${name}" does not have applyJSON() method implemented!`);
                    continue;
                }
            }
            else {
                debug: {
                    if (type === json.constructor) {
                        console.warn(`ReactiveNode.applyJSON(): Property "${name}" is not a ${type.name}!`, json);
                        continue;
                    }
                }
                primitiveProps[name] = json[name];
            }
        }
        this.setProperties(primitiveProps);
        return this;
    }
    init() { }
    ready() { }
    changed() { }
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
        Object.defineProperty(ioNodeConstructor.prototype, '_isNode', { enumerable: false, value: true, writable: false });
        Object.defineProperty(ioNodeConstructor.prototype, '_protochain', { value: new ProtoChain(ioNodeConstructor) });
    }
};
__decorate([
    ReactiveProperty({ type: String, value: 'immediate' })
], ReactiveNode.prototype, "reactivity", void 0);
ReactiveNode = ReactiveNode_1 = __decorate([
    Register
], ReactiveNode);
export { ReactiveNode };
export function initReactiveProperties(node) {
    for (const name in node._protochain.reactiveProperties) {
        Object.defineProperty(node, name, {
            get: function () {
                return node._reactiveProperties.get(name).value;
            },
            set: function (value) {
                node.setProperty(name, value);
            },
            configurable: true,
            enumerable: true,
        });
        const property = new ReactivePropertyInstance(node, node._protochain.reactiveProperties[name]);
        node._reactiveProperties.set(name, property);
        if (property.binding)
            property.binding.addTarget(node, name);
        property.observer.start(property.value);
        if (isIoValue(property.value)) {
            property.value.addParent(node);
        }
        if (node instanceof IoElement) {
            if (property.reflect && property.value !== undefined && property.value !== null) {
                node.setAttribute(name, property.value);
            }
        }
    }
}
export function initProperties(node) {
    for (const name in node._protochain.properties) {
        let initialValue = node._protochain.properties[name];
        if (typeof initialValue === 'function') {
            initialValue = new initialValue();
        }
        else if (initialValue instanceof Array) {
            initialValue = initialValue.slice();
        }
        else if (typeof initialValue === 'object') {
            initialValue = Object.assign({}, initialValue);
        }
        node[name] = initialValue;
    }
}
export function setProperties(node, props) {
    for (const name in props) {
        if (!node._reactiveProperties.has(name)) {
            debug: console.warn(`Property "${name}" is not defined`, node);
            continue;
        }
        node.setProperty(name, props[name], true);
    }
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
function applyNodeArrayAssignment(node, name, prop, value) {
    if (prop.type !== NodeArray || !Array.isArray(value))
        return false;
    const nodeArray = prop.value;
    debug: if (value.some(item => !isIoValue(item))) {
        console.error(`Node: Property "${name}" should be assigned as an Array of nodes!`, value);
    }
    debug: if (nodeArray.constructor !== NodeArray) {
        console.error(`Node: Property "${name}" should be initialized as a NodeArray!`, nodeArray);
    }
    nodeArray.withInternalOperation(() => {
        nodeArray.length = 0;
        nodeArray.push(...value);
        if (value.length === 0) {
            nodeArray.dispatchMutation();
        }
    });
    return true;
}
function disconnectPropertyValue(node, prop, oldValue) {
    if (!hasValueAtOtherProperty(node, prop, oldValue)) {
        prop.observer.stop(oldValue);
        if (isIoValue(oldValue) && !oldValue._disposed) {
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
        if (isIoValue(value)) {
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
            if (value.some(item => !isIoValue(item))) {
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
    const prop = node._reactiveProperties.get(name);
    const oldValue = prop.value;
    if (value === oldValue)
        return;
    if (applyPropertyBinding(node, name, prop, value))
        return;
    if (applyNodeArrayAssignment(node, name, prop, value))
        return;
    disconnectPropertyValue(node, prop, oldValue);
    prop.value = value;
    connectPropertyValue(node, prop, value);
    debugPropertyType(node, name, prop, value);
    node.queue(name, value, oldValue);
    node.dispatchQueue(debounce);
}
export function dispatchQueue(node, debounce = false) {
    if (node.reactivity === 'debounced' || debounce || node._changeQueue.dispatching) {
        node.debounce(node._changeQueue.dispatch);
    }
    else if (node.reactivity === 'throttled') {
        node.throttle(node._changeQueue.dispatch);
    }
    else if (node.reactivity === 'immediate') {
        node._changeQueue.dispatch();
    }
    debug: if (['immediate', 'throttled', 'debounced'].indexOf(node.reactivity) === -1) {
        console.warn(`ReactiveNode.dispatchQueue(): Invalid reactivity property value: "${node.reactivity}".
      Expected one of: "immediate", "throttled", "debounced".`);
    }
}
/** Dispatches `io-object-mutation` for in-place object or nested Io value changes. */
export function dispatchMutation(node, object, properties) {
    if (isIoValue(object)) {
        node.dispatch('io-object-mutation', { object, properties });
    }
    else {
        node.dispatch('io-object-mutation', { object, properties }, false, window);
    }
}
export function onPropertyMutated(node, event) {
    const object = event.detail.object;
    let hasMutated = false;
    node._reactiveProperties.forEach((prop, name) => {
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
    debug: if (!node._reactiveProperties.has(name)) {
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
    const property = node._reactiveProperties.get(name);
    property?.binding?.removeTarget(node, name);
}
export { detachChildParents } from '../core/ReactiveCore.js';
/** Tears down bindings, listeners, queues, and parent links for a reactive owner. */
export function dispose(node) {
    debug: if (node._disposed) {
        console.warn('ReactiveNode.dispose(): Already disposed!', node.constructor.name);
    }
    if (node._disposed)
        return;
    detachChildParents(node);
    clearNodeQueue(node);
    const mutable = node;
    node._bindings.forEach((binding, name) => {
        binding.dispose();
        node._bindings.delete(name);
    });
    delete mutable._bindings;
    node._changeQueue.dispose();
    delete mutable._changeQueue;
    node._reactiveProperties.forEach((property, name) => {
        property.binding?.removeTarget(node, name);
        property.observer.stop(property.value);
        property.observer.dispose();
    });
    removeWindowMutationListener(node);
    removeSelfMutationListener(node);
    for (const name in node._protochain.properties) {
        delete node[name];
    }
    delete mutable._protochain;
    // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
    node._eventDispatcher.dispose();
    delete mutable._eventDispatcher;
    delete mutable._reactiveProperties;
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
//# sourceMappingURL=ReactiveNode.js.map