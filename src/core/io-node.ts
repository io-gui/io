import {ProtoChain} from './internals/protoChain.js';
import {Binding} from './internals/binding.js';
import {ChangeQueue} from './internals/changeQueue.js';
import {Property, PropertyDefinitionWeak} from './internals/property.js';
import {EventDispatcher, ListenerDefinitionWeak} from './internals/eventDispatcher.js';

export type ListenersDeclaration = Record<string, ListenerDefinitionWeak>;
export type PropertiesDeclaration = Record<string, PropertyDefinitionWeak>;

export interface IoNodeConstructor<T> {
  new (...args: any[]): T;
  Properties?: PropertiesDeclaration;
  Listeners?: ListenersDeclaration;
  Style?: string;
  __proto__?: IoNodeConstructor<T>
}

export type CallbackFunction = (arg?: any) => void;

export type KeyboardEventListener = (event: KeyboardEvent) => void;
export type PointerEventListener = (event: PointerEvent) => void;
export type CustomEventListener = (event: CustomEvent) => void | EventListener;
export type FocusEventListener = (event: FocusEvent) => void;
export type TouchEventListener = (event: TouchEvent) => void;
export type AnyEventListener = EventListener |
                        KeyboardEventListener |
                        PointerEventListener |
                        CustomEventListener |
                        FocusEventListener |
                        TouchEventListener;

/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export function IoNodeMixin<T extends IoNodeConstructor<any>>(superclass: T) {
  const IoNodeMixinConstructor: IoNodeConstructor<any> = class extends (superclass as any) {
    static get Properties(): PropertiesDeclaration {
      return {
        lazy: {
          value: false,
          notify: false,
          reflect: -1
        }
      };
    }
    readonly _properties: Record<string, Property> = {};
    readonly _bindings: Record<string, Binding> = {};

    readonly _changeQueue: ChangeQueue;
    readonly _eventDispatcher: EventDispatcher;
     /**
     * Creates a class instance and initializes the internals.
     * @param {Object} properties - Initial property values.
     */
    constructor(properties: Record<string, any> = {}, ...args: any[]) {
      super(...args);

      debug: {
        const constructor = this.__proto__.constructor;
        if (constructor._registeredAs !== constructor.name) {
          console.error(`${constructor.name} not registered! Call "RegisterIoNode()" before using ${constructor.name} class!`);
        }
      }

      this._protochain.autobindFunctions(this);

      this._changeQueue = new ChangeQueue(this);
      Object.defineProperty(this, '_changeQueue', {enumerable: false});

      this._eventDispatcher = new EventDispatcher(this);
      Object.defineProperty(this, '_eventDispatcher', {enumerable: false});

      for (const name in this._protochain.properties) {
        const property = new Property(this._protochain.properties[name]);
        this._properties[name] = property;
        const value = property.value;
        if (value !== undefined && value !== null) {
          // TODO: document special handling of object and node values
          if (typeof value === 'object') {
            this.queue(name, value, undefined);
          } else if (property.reflect !== undefined && property.reflect >= 1 && this._isIoElement) {
            // TODO: Resolve bi-directional reflection when attributes are set in html (role, etc...)
            this.setAttribute(name, value);
          }
        }
        if (property.binding) property.binding.addTarget(this, name);
      }
      Object.defineProperty(this, '_properties', {enumerable: false});
      Object.defineProperty(this, '_bindings', {enumerable: false});

      Object.defineProperty(this, 'onObjectMutated', {enumerable: false, value: this.onObjectMutated.bind(this)});
      Object.defineProperty(this, 'objectMutated', {enumerable: false, value: this.objectMutated.bind(this)});
      Object.defineProperty(this, 'queueDispatch', {enumerable: false, value: this.queueDispatch.bind(this)});
      Object.defineProperty(this, 'queueDispatchLazy', {enumerable: false, value: this.queueDispatchLazy.bind(this)});

      if (this._protochain.observedObjectProperties.length) {
        window.addEventListener('object-mutated', this.onObjectMutated as EventListener);
      }

      this.applyProperties(properties);
    }
    /**
     * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
     * @param {string} name Property name to set value of.
     * @param {any} value Peroperty value.
     * @param {boolean} [skipDispatch] flag to skip event dispatch.
     */
    setProperty(name: string, value: any, skipDispatch?: boolean) {
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
        } else {
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
              console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
            }
          } else if (prop.type === Number) {
            if (typeof value !== 'number') {
              console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
            }
          } else if (prop.type === Boolean) {
            if (typeof value !== 'boolean') {
              console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
            }
          } else if (prop.type) {
            if (!(value instanceof prop.type)) {
              console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
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
        if (prop.reflect !== undefined && prop.reflect >= 1 && this._isIoElement) this.setAttribute(name, value);
      }
    }
    /**
     * Sets multiple properties in batch.
     * [property]-changed` events will be broadcast in the end.
     * @param {Object} props - Map of property names and values.
     */
    applyProperties(props: any) {
      for (const p in props) {
        if (this._properties[p] === undefined) {
          debug: {
            if (!p.startsWith('on-') && p !== 'style' && p !== 'config') {
              // TODO: consider converting style and config to properties
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
    setProperties(props: any) {
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
    setValue(value: any) {
      if (this.value !== value) {
        const oldValue = this.value;
        this.setProperty('value', value);
        this.dispatchEvent('value-set', {value: value, oldValue: oldValue}, false);
      }
    }
    /**
     * default change handler.
     * Invoked when one of the properties change.
     */
    changed() {}
    /**
     * Adds property change to the queue.
     * @param {string} prop - Property name.
     * @param {*} value - Property value.
     * @param {*} oldValue - Old property value.
     */
    queue(prop: string, value: any, oldValue: any) {
      this._changeQueue.queue(prop, value, oldValue);
    }
    /**
     * Dispatches the queue.
     */
    queueDispatch() {
      if (this.lazy) {
        preThrottleQueue.push(this.queueDispatchLazy);
        this.throttle(this.queueDispatchLazy);
      } else {
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
     * Node should be listening for this event if it has an observed object property
     * @param {Object} event - Event payload.
     * @param {Object} event.detail.object - Mutated object.
     */
    onObjectMutated(event: CustomEvent) {
      for (let i = 0; i < this._protochain.observedObjectProperties.length; i++) {
        const prop = this._protochain.observedObjectProperties[i];
        const value = this._properties[prop].value;
        if (value === event.detail.object) {
          this.throttle(this.objectMutated, prop, false);
          return;
        }
        debug: {
          if (event.detail.objects) {
            console.error('Deprecation warning! `objects` property no longer supported. Use `object` property instead.');
            return;
          }
        }
      }
    }
    /**
     * This function is called after `onObjectMutated()` determines that one of
     * the object properties has mutated.
     * @param {string} prop - Mutated object property name.
     */
    objectMutated(prop: string) {
      if (this[prop + 'Mutated']) this[prop + 'Mutated']();
      this.changed();
    }
    /**
     * Returns a binding to a specified property`.
     * @param {string} prop - Property to bind to.
     * @return {Binding} Binding object.
     */
    bind(prop: string): Binding {
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
    unbind(prop: string) {
      if (this._bindings[prop]) this._bindings[prop].dispose();
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
    addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
      debug: {
        if (typeof listener !== 'function') {
          console.warn(`${this.constructor.name}incorrect listener type.`, this);
          return;
        }
      }
      this._eventDispatcher.addEventListener(type, listener as EventListener, options);
    }
    /**
     * Wrapper for removeEventListener.
     * @param {string} type - event name to listen to.
     * @param {function} listener - listener handler.
     * @param {Object} options - event listener options.
     */
    removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
      this._eventDispatcher.removeEventListener(type, listener as EventListener, options);
    }
    /**
     * Wrapper for dispatchEvent.
     * @param {string} type - event name to dispatch.
     * @param {Object} detail - event detail.
     * @param {boolean} bubbles - event bubbles.
     * @param {HTMLElement|Node} src source node/element to dispatch event from.
     */
    dispatchEvent(type: string, detail = {}, bubbles = false, src?: Node | HTMLElement | Document | Window) {
      this._eventDispatcher.dispatchEvent(type, detail, bubbles, src);
    }
    /**
     * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
     * @param {function} func - Function to throttle.
     * @param {*} arg - argument for throttled function.
     * @param {boolean} asynchronous - execute with timeout.
     */
    throttle(func: CallbackFunction, arg?: any, asynchronous?: boolean) {
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
        if (queue.indexOf(arg) === -1) queue.push(arg);
      } else {
        argQueue.set(func, [arg]);
      }
    }
    // TODO: implement rAF debounce
    requestAnimationFrameOnce(func: CallbackFunction) {
      requestAnimationFrameOnce(func);
    }
    /**
     * Disposes all internals.
     * Use this when instance is no longer needed.
     */
    dispose() {
      for (const name in this._properties) {
        if (this._properties[name].binding) {
          // TODO: test this specifically
          this._properties[name].binding?.removeTarget(this, name);
        }
      }
      for (const name in this._bindings) {
        this._bindings[name].dispose();
        delete this._bindings[name];
      }
      if (this._protochain.observedObjectProperties.length) {
        window.removeEventListener('object-mutated', this.onObjectMutated as EventListener);
      }
      // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
      this._changeQueue.dispose();
      this._eventDispatcher.dispose();
    }
  };
  Object.defineProperty(IoNodeMixinConstructor, 'name', {value: 'IoNodeMixinConstructor'});
  return IoNodeMixinConstructor;
}

/**
 * Register function to be called once per class.
 * @param {IoNode} nodeConstructor - Node class to register.
 */
export const RegisterIoNode = function (nodeConstructor: typeof IoNode) {
  const proto = nodeConstructor.prototype;
  Object.defineProperty(proto, '_isIoNode', {value: true});
  Object.defineProperty(nodeConstructor, '_registeredAs', {value: nodeConstructor.name});
  Object.defineProperty(proto, '_protochain', {value: new ProtoChain(nodeConstructor)});

  for (const p in proto._protochain.properties) {
    Object.defineProperty(proto, p, {
      get: function() {
        return (this as IoNode)._properties[p].value;
      },
      set: function(value) {
        (this as IoNode).setProperty(p, value);
      },
      configurable: true,
    });
  }
};

/**
 * IoNodeMixin applied to `Object` class.
 */
export class IoNode extends IoNodeMixin(Object) {}
RegisterIoNode(IoNode);

// TODO: document and test
const preThrottleQueue: CallbackFunction[] = [];
const throttleQueue: CallbackFunction[] = [];
const argQueue = new WeakMap();
//
const funcQueue: CallbackFunction[] = [];

const animate = function() {
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

function requestAnimationFrameOnce(func: CallbackFunction) {
  if (funcQueue.indexOf(func) === -1) funcQueue.push(func);
}