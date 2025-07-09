import { Register } from '../decorators/Register.js';
import { ProtoChain } from '../core/ProtoChain.js';
import { Binding } from '../core/Binding.js';
import { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js';
import { EventDispatcher, ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js';
import { throttle, debounce, CallbackFunction } from '../core/Queue.js';
import { ReactiveProperty } from '../decorators/Property.js';
import { IoElement } from '../elements/IoElement.js';

export type AnyConstructor = new (...args: any[]) => unknown;
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>;

export type ListenerDefinitions = {
  [key: string]: ListenerDefinitionLoose;
}
export interface NodeConstructor {
  ReactiveProperties?: ReactivePropertyDefinitions;
  Properties?: Record<string, any>;
  Listeners?: ListenerDefinitions;
  Style?: string;
  name?: string;
  prototype: NodeConstructor | Object | HTMLElement;
}


export type ReactivityType = 'immediate' | 'throttled' | 'debounced';

// Utility type to add Binding to all properties of a type
export type WithBinding<T> = T | Binding<T>;

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;

export type NodeProps = {
  reactivity?: ReactivityType;
  [key: prefix<string, '@'>]: string | ((event: CustomEvent<any>) => void) | ((event: PointerEvent) => void)
};

/**
 * NodeMixin applied to `Object` class.
 */
@Register
export class Node extends Object {

  @ReactiveProperty({type: String, value: 'immediate'})
  declare reactivity: ReactivityType;

  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {};
  }

  static get Properties(): Record<string, any> {
    return {};
  }

  static get Listeners(): ListenerDefinitions {
    return {};
  }

  declare readonly _protochain: ProtoChain;
  declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
  declare readonly _bindings: Map<string, Binding<any>>;
  declare readonly _changeQueue: ChangeQueue;
  declare readonly _eventDispatcher: EventDispatcher;
  declare readonly _isNode: boolean;
  declare _disposed: boolean;

  constructor(args: NodeProps = {}) {
    super();
    this.init();
    this._protochain.init(this);

    Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)});
    Object.defineProperty(this, '_reactiveProperties', {enumerable: false, configurable: true, value: new Map()});
    Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()});
    Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)});

    initReactiveProperties(this);
    initProperties(this);

    this.applyProperties(args, true);

    this.ready();
    this.dispatchQueue();
  }
  // TODO: add types
  applyProperties(props: any, skipDispatch = false) {
    for (const name in props) {
      if (this._reactiveProperties.has(name)) {
        this.setProperty(name, props[name], true);
      } else {
        if (!name.startsWith('@')) {
          this[name as keyof this] = props[name];
          debug: if (props[name] instanceof Binding) {
            console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on "${this.constructor.name}"`);
          }
        }
      }
    }
    this._eventDispatcher.applyPropListeners(props);
    if (!skipDispatch) this.dispatchQueue();
  }
  // TODO: add types
  setProperties(props: any) {
    setProperties(this, props);
  }
  setProperty(name: string, value: any, debounce = false) {
    setProperty(this, name, value, debounce);
  }
  init() {}
  ready() {}
  changed() {}
  queue(name: string, value: any, oldValue: any) {
    this._changeQueue.queue(name, value, oldValue);
  }
  dispatchQueue(debounce = false) {
    dispatchQueue(this, debounce);
  }
  throttle(func: CallbackFunction, arg?: any, timeout = 1) {
    throttle(func, arg, this, timeout);
  }
  debounce(func: CallbackFunction, arg?: any, timeout = 1) {
    debounce(func, arg, this, timeout);
  }
  onPropertyMutated(event: CustomEvent) {
    return onPropertyMutated(this, event);
  };
  bind<T>(name: string): Binding<T> {
    return bind<T>(this, name);
  }
  unbind(name: string): void {
    unbind(this, name);
  }
  addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.addEventListener(type, listener as EventListener, options);
  }
  removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.removeEventListener(type, listener as EventListener, options);
  }
  dispatch(type: string, detail: any = undefined, bubbles = false, src?: Node | HTMLElement | Document | Window) {
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src);
  }
  dispose() {
    dispose(this);
  }
  Register(ioNodeConstructor: typeof Node) {
    Object.defineProperty(ioNodeConstructor, '_isNode', {enumerable: false, value: true, writable: false});
    Object.defineProperty(ioNodeConstructor.prototype, '_isNode', {enumerable: false, value: true, writable: false});
    Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)});
  }
}

export function initReactiveProperties(node: Node | IoElement) {
  for (const name in node._protochain.reactiveProperties) {
    Object.defineProperty(node, name, {
      get: function() {
        return node._reactiveProperties.get(name)!.value;
      },
      set: function(value) {
        (node as Node).setProperty(name, value);
      },
      configurable: true,
      enumerable: true,
    });
    const property = new ReactivePropertyInstance(node, node._protochain.reactiveProperties[name]);
    node._reactiveProperties.set(name, property);
    if (property.binding) property.binding.addTarget(node, name);
    if (property.value?._isNode) {
      let hasSameValueAtOtherProperty = false;
      node._reactiveProperties.forEach((p, n) => {
        if (p.value === property.value && n !== name) hasSameValueAtOtherProperty = true;
      });
      if (!hasSameValueAtOtherProperty) property.value.addEventListener('object-mutated', node.onPropertyMutated);
    }

    if (node instanceof IoElement) {
      if (property.reflect && property.value !== undefined && property.value !== null) {
        node.setAttribute(name, property.value);
      }
    }
  }
}
export function initProperties(node: Node | IoElement) {
  for (const name in node._protochain.properties) {
    let initialValue = node._protochain.properties[name];
    if (typeof initialValue === 'function') {
      initialValue = new initialValue();
    } else if (initialValue instanceof Array) {
      initialValue = initialValue.slice();
    } else if (typeof initialValue === 'object') {
      initialValue = Object.assign({}, initialValue);
    }
    (node as any)[name] = initialValue;
  }
}
export function setProperties(node: Node | IoElement, props: any) {
  for (const name in props) {
    if (!node._reactiveProperties.has(name)) {
      debug: console.warn(`Property "${name}" is not defined`, node);
      continue;
    }
    node.setProperty(name, props[name], true);
  }
  node.dispatchQueue();
}
export function setProperty(node: Node | IoElement, name: string, value: any, debounce = false) {
  const prop = node._reactiveProperties.get(name)!;
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
      } else {
        // NOTE: This was a remedy for an old bug that might not be relevant anymore.
        // Whenusing change() > template() > setProperties() to batch-set multiple properties with bindings,
        // it used to cause all but one of those properties to be reset to original value once parent changed.
        // This ugly hack fixed the bug by setting binding value from target when binding already exists.
        // TODO: keep an eye on this and remove if not needed.
        // binding.value = value = prop.value;
        return;
      }
    }

    prop.value = value;

    // TODO: test!
    if (value !== oldValue) {
      let hasNewValueAtOtherProperty = false;
      let hasOldValueAtOtherProperty = false;
      node._reactiveProperties.forEach((property, n) => {
        if (property.value === value && n !== name) hasNewValueAtOtherProperty = true;
        if (property.value === oldValue && n !== name) hasOldValueAtOtherProperty = true;
      });
      if (value?._isNode) {
        if (!hasNewValueAtOtherProperty) value.addEventListener('object-mutated', node.onPropertyMutated);
      }
      if (oldValue?._isNode) {
        if (!hasOldValueAtOtherProperty && !oldValue._disposed) oldValue.removeEventListener('object-mutated', node.onPropertyMutated);
      }
    }

    debug: {
      if (prop.type === String) {
        if (typeof value !== 'string') {
          console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
        }
      } else if (prop.type === Number) {
        if (typeof value !== 'number') {
          console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
        }
      } else if (prop.type === Boolean) {
        if (typeof value !== 'boolean') {
          console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
        }
      } else if (prop.type === Array) {
        if (!(value instanceof Array)) {
          console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node);
        }
      } else if (prop.type === Object) {
        if (value instanceof Array) {
          console.warn(`Wrong type of property "${name}". Value: "${JSON.stringify(value)}". Expected type: ${prop.type.name}`, node);
        }
      } else if (typeof prop.type === 'function') {
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
export function dispatchQueue(node: Node | IoElement, debounce = false) {
  if (node.reactivity === 'debounced' || debounce || node._changeQueue.dispatching) {
    node.debounce(node._changeQueue.dispatch);
  } else if (node.reactivity === 'throttled') {
    node.throttle(node._changeQueue.dispatch);
  } else if (node.reactivity === 'immediate') {
    node._changeQueue.dispatch();
  }
  debug: if (['immediate', 'throttled', 'debounced'].indexOf(node.reactivity) === -1) {
    console.warn(`Node.dispatchQueue(): Invalid reactivity property value: "${node.reactivity}". Expected one of: "immediate", "throttled", "debounced".`);
  }
}
export function onPropertyMutated(node: Node | IoElement, event: CustomEvent) {
  const object = event.detail.object;
  // TODO: consider situations where node is listening to object-mutated events from multiple sources (window and property).
  // This might cause multiple executions of the same handler.
  // TODO: consider optimizing. This handler might be called a lot.
  const properties = [...new Set([...node._protochain.observedObjectProperties, ...node._protochain.observedNodeProperties])];
  for (let i = 0; i < properties.length; i++) {
    const name = properties[i];
    const value = node._reactiveProperties.get(name)!.value;
    if (value === object) {
      const handlerName = name + 'Mutated' as keyof Node;
      if (typeof node[handlerName] === 'function') {
        node.throttle(node[handlerName] as CallbackFunction);
      }
      return true;
    }
  }
}
export function bind<T>(node: Node | IoElement, name: string) {
  debug: if (!node._reactiveProperties.has(name)) {
    console.warn(`IoGUI Node: cannot bind to ${name} property. Does not exist!`);
  }
  if (!node._bindings.has(name)) {
    node._bindings.set(name, new Binding<T>(node, name));
  }
  return node._bindings.get(name)! as Binding<T>;
}
export function unbind(node: Node | IoElement, name: string) {
  const binding = node._bindings.get(name);
  if (binding) {
    binding.dispose();
    node._bindings.delete(name);
  }
  const property = node._reactiveProperties.get(name);
  property?.binding?.removeTarget(node, name);
}
export function dispose(node: Node | IoElement) {
  debug: if (node._disposed) {
    console.warn('Node.dispose(): Already disposed!', node.constructor.name);
  }

  if (node._disposed) return;

  node._bindings.forEach((binding, name) => {
    binding.dispose();
    node._bindings.delete(name);
  });
  delete (node as any)._bindings;

  if (node._protochain.observedObjectProperties.length) {
    window.removeEventListener('object-mutated', node.onPropertyMutated as EventListener);
  }
  delete (node as any)._protochain;

  node._changeQueue.dispose();
  delete (node as any)._changeQueue;

  let removed: Node[] = [];
  node._reactiveProperties.forEach((property, name) => {
    property.binding?.removeTarget(node, name);
    if (property.value?._isNode && !removed.includes(property.value) && !property.value._disposed) {
      property.value.removeEventListener('object-mutated', node.onPropertyMutated);
      removed.push(property.value);
    }
  });

  for (const name in node._protochain.properties) {
    delete node[name as keyof Node];
  }

  // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
  node._eventDispatcher.dispose();
  delete (node as any)._eventDispatcher;
  delete (node as any)._reactiveProperties;

  Object.defineProperty(node, '_disposed', {value: true});
};