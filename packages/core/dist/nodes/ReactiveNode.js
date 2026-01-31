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
import { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance } from '../core/ReactiveProperty.js';
import { EventDispatcher } from '../core/EventDispatcher.js';
import { NodeArray } from '../core/NodeArray.js';
import { throttle, debounce } from '../core/Queue.js';
import { ReactiveProperty } from '../decorators/Property.js';
import { IoElement } from '../elements/IoElement.js';
export const NODES = {
    active: new Set(),
    disposed: new WeakSet(),
};
function isIoObject(value) {
    return (typeof value === 'object' && value !== null && (value._isNode || value._isIoElement));
}
function hasValueAtOtherProperty(node, prop, value) {
    let found = false;
    node._reactiveProperties.forEach((p) => {
        if (p !== prop && p.value === value)
            found = true;
    });
    return found;
}
let ReactiveNode = ReactiveNode_1 = class ReactiveNode extends Object {
    static get ReactiveProperties() {
        return {};
    }
    static get Properties() {
        return {};
    }
    static get Listeners() {
        return {};
    }
    constructor(args) {
        super();
        this._protochain.init(this);
        Object.defineProperty(this, '_changeQueue', { enumerable: false, configurable: true, value: new ChangeQueue(this) });
        Object.defineProperty(this, '_reactiveProperties', { enumerable: false, configurable: true, value: new Map() });
        Object.defineProperty(this, '_bindings', { enumerable: false, configurable: true, value: new Map() });
        Object.defineProperty(this, '_eventDispatcher', { enumerable: false, configurable: true, value: new EventDispatcher(this) });
        Object.defineProperty(this, '_parents', { enumerable: false, configurable: true, value: [] });
        this.init();
        initReactiveProperties(this);
        initProperties(this);
        this.applyProperties(typeof args === 'object' ? args : {}, true);
        NODES.active.add(this);
        this.ready();
        this.dispatchQueue();
    }
    // TODO: add types
    applyProperties(props, skipDispatch = false) {
        for (const name in props) {
            if (this._reactiveProperties.has(name)) {
                this.setProperty(name, props[name], true);
            }
            else {
                if (!name.startsWith('@')) {
                    this[name] = props[name];
                    debug: if (props[name] instanceof Binding) {
                        console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on "${this.constructor.name}"`);
                    }
                }
            }
        }
        this._eventDispatcher.applyPropListeners(props);
        if (!skipDispatch)
            this.dispatchQueue();
    }
    // TODO: add types
    setProperties(props) {
        setProperties(this, props);
    }
    setProperty(name, value, debounce = false) {
        if (this._disposed)
            return;
        setProperty(this, name, value, debounce);
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
        if (parent._isNode || parent._isIoElement) {
            this._parents.push(parent);
        }
    }
    removeParent(parent) {
        if (this._disposed)
            return;
        if (parent._isNode || parent._isIoElement) {
            const index = this._parents.indexOf(parent);
            if (index !== -1) {
                this._parents.splice(index, 1);
            }
            else {
                debug: console.warn('ReactiveNode.removeParent(): Parent not found!', this, parent);
            }
        }
    }
    dispose() {
        dispose(this);
        NODES.active.delete(this);
        NODES.disposed.add(this);
    }
    Register(ioNodeConstructor) {
        Object.defineProperty(ioNodeConstructor.prototype, '_isNode', { enumerable: false, value: true, writable: false });
        Object.defineProperty(ioNodeConstructor.prototype, '_isIoElement', { enumerable: false, value: false, writable: false });
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
        if (property.value?._isNode) {
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
export function setProperty(node, name, value, debounce = false) {
    const prop = node._reactiveProperties.get(name);
    const oldValue = prop.value;
    if (value !== oldValue) {
        const binding = (value instanceof Binding) ? value : null;
        if (binding) {
            const oldBinding = prop.binding;
            if (binding !== oldBinding) {
                if (oldBinding) {
                    oldBinding.removeTarget(node, name);
                }
                binding.addTarget(node, name);
                // NOTE: We return here because binding.setTarget() will trigger execution of setProperty() again.
                return;
            }
            else {
                // NOTE: This was a remedy for an old bug that might not be relevant anymore.
                // Whenusing change() > template() > setProperties() to batch-set multiple properties with bindings,
                // it used to cause all but one of those properties to be reset to original value once parent changed.
                // This ugly hack fixed the bug by setting binding value from target when binding already exists.
                // TODO: keep an eye on this and remove if not needed.
                // binding.value = value = prop.value;
                return;
            }
        }
        // TODO: test!
        // TODO: Document magic!
        if (prop.type === NodeArray && value.constructor === Array) {
            const nodeArray = prop.value;
            debug: if (value.some(item => !item._isNode)) {
                console.error(`Node: Property "${name}" should be assigned as an Array of nodes!`, value);
            }
            debug: if (nodeArray.constructor !== NodeArray) {
                console.error(`Node: Property "${name}" should be initialized as a NodeArray!`, nodeArray);
            }
            // TODO: test, benchmark!
            nodeArray.withInternalOperation(() => {
                nodeArray.length = 0;
                nodeArray.push(...value);
                if (value.length === 0) {
                    nodeArray.dispatchMutation();
                }
            });
            return;
        }
        // TODO: Untangle and redesign this mess! P0
        const oldValueShared = hasValueAtOtherProperty(node, prop, oldValue);
        if (!oldValueShared) {
            prop.observer.stop(oldValue);
            if (oldValue?._isNode && !oldValue._disposed) {
                oldValue.removeParent(node);
            }
        }
        else {
            prop.observer.observing = false;
        }
        prop.value = value;
        if (!hasValueAtOtherProperty(node, prop, value)) {
            prop.observer.start(value);
            if (value?._isNode) {
                value.addParent(node);
            }
        }
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
                if (value.some(item => !item._isNode)) {
                    console.error(`Wrong type of property "${name}". NodeArray items should be nodes!`, value);
                }
            }
            else if (typeof prop.type === 'function') {
                if (!(value instanceof prop.type)) {
                    console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
                }
            }
        }
        if (oldValue !== value) {
            node.queue(name, value, oldValue);
            node.dispatchQueue(debounce);
        }
    }
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
        console.warn(`ReactiveNode.dispatchQueue(): Invalid reactivity property value: "${node.reactivity}". Expected one of: "immediate", "throttled", "debounced".`);
    }
}
// TODO: Consider using global event bus for all mutation events!
export function dispatchMutation(node, object, properties) {
    if (isIoObject(object)) {
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
            if (typeof node[handlerName] === 'function') {
                node[handlerName](event);
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
export function dispose(node) {
    debug: if (node._disposed) {
        console.warn('ReactiveNode.dispose(): Already disposed!', node.constructor.name);
    }
    if (node._disposed)
        return;
    node._bindings.forEach((binding, name) => {
        binding.dispose();
        node._bindings.delete(name);
    });
    delete node._bindings;
    node._changeQueue.dispose();
    delete node._changeQueue;
    node._reactiveProperties.forEach((property, name) => {
        property.binding?.removeTarget(node, name);
        property.observer.stop(property.value);
        property.observer.dispose();
    });
    for (const name in node._protochain.properties) {
        delete node[name];
    }
    delete node._protochain;
    // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
    node._eventDispatcher.dispose();
    delete node._eventDispatcher;
    delete node._reactiveProperties;
    if (node._parents) {
        node._parents.length = 0;
        delete node._parents;
    }
    Object.defineProperty(node, '_disposed', { value: true });
}
;
//# sourceMappingURL=ReactiveNode.js.map