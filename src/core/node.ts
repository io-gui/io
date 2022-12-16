import {ProtoChain} from './internals/protoChain.js';
import {Binding} from './internals/binding.js';
import {ChangeQueue} from './internals/changeQueue.js';
import {PropertyInstance, PropertyDeclarations} from './internals/property.js';
import {EventDispatcher, ListenersDeclaration} from './internals/eventDispatcher.js';

export type Constructor = new (...args: any[]) => unknown;

export interface IoNodeConstructor<T> {
  new (...args: any[]): T;
  Properties?: PropertyDeclarations;
  Listeners?: ListenersDeclaration;
  Style?: string;
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

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;

export type IoNodeArgs = {
  lazy?: boolean;
  [key: prefix<string, 'on-'>]: string | ((event: CustomEvent<any>) => void)
}

/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export function IoNodeMixin<T extends IoNodeConstructor<any>>(superclass: T) {
  const IoNodeMixinConstructor = class extends (superclass as any) {
    static get Properties(): PropertyDeclarations {
      return {
        lazy: {
          value: false,
          notify: false,
          reflect: true
        }
      };
    }
    declare readonly _protochain: ProtoChain;
    declare readonly _properties: Map<string, PropertyInstance>;
    declare readonly _bindings: Map<string, Binding>;
    declare readonly _changeQueue: ChangeQueue;
    declare readonly _eventDispatcher: EventDispatcher;

     /**
     * Creates a class instance and initializes the internals.
     * @param {Object} properties - Initial property values.
     */
    constructor(...args: any[]); // TODO: reconsider?
    constructor(properties: IoNodeArgs = {}, ...args: any[]) {
      super(...args);

      debug: {
        const constructor = Object.getPrototypeOf(this).constructor;
        if (this._protochain.constructors[0] !== constructor) {
          console.error(`${constructor.name} not registered! Call "RegisterIoNode([ClassName])" of @RegisterIoNode decorator before using ${constructor.name} class!`);
        }
      }

      this._protochain.autobindFunctions(this);

      Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)});
      Object.defineProperty(this, '_properties', {enumerable: false, configurable: true, value: new Map()});
      Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()});
      Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)});

      for (const name in this._protochain.properties) {
        const property = new PropertyInstance(this._protochain.properties[name]);
        this._properties.set(name, property);

        const value = property.value;
        if (value !== undefined && value !== null) {
          if (property.reflect && this._isIoElement) {
            this.setAttribute(name, value);
          }
        }

        debug: {
          if (property.value === undefined && typeof property.type === 'function') {
            const propArg = properties[name as any];
            if (!(propArg && propArg.constructor === property.type)) {
              console.warn(`IoNode: property "${name}" of type "${property.type.name}" is specified but no initial value is provided!`);
            }
          }
        }

        if (property.binding) property.binding.addTarget(this, name);
      }

      for (const p in this._protochain.properties) {
        Object.defineProperty(this, p, {
          get: function() {
            return this._properties.get(p).value;
          },
          set: function(value) {
            (this as IoNode).setProperty(p, value);
          },
          configurable: true,
        });
      }
      this.applyProperties(properties);

      if (this._protochain.observedObjectProperties.length) {
        window.addEventListener('object-mutated', this.onObjectMutated as EventListener);
      }

      this.init();
    }
    /**
     * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
     * @param {string} name Property name to set value of.
     * @param {any} value Peroperty value.
     * @param {boolean} [skipDispatch] flag to skip event dispatch.
     */
    setProperty(name: string, value: any, skipDispatch?: boolean) {
      const prop = this._properties.get(name)!;
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
          } else {
            // NOTE: Whenusing change() > template() > setProperties() to batch-set multiple properties with bindings, it causes
            // all but one of those properties to be reset to original value once parents's change event happens.
            // This fixed the bug by setting binding value from target when binding already exists.
            // TODO: make more tests to make sure this does not cause regressions and unexpected behaviors.
            binding.value = value = prop.value;
          }
        }
        prop.value = value;
        if (value instanceof Binding) console.log(value instanceof Binding);

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
          } else if (prop.type === Array) {
            if (!(value instanceof Array)) {
              console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
            }
          } else if (prop.type === Object) {
            if (value instanceof Array) {
              console.warn(`Wrong type of property "${name}". Value: "${JSON.stringify(value)}". Expected type: ${prop.type.name}`, this);
            }
          } else if (prop.type instanceof Array) {
            let match = false;
            for (let i = 0; i < prop.type.length; i++) {
              if (value.constructor === prop.type[i]) {
                // TODO test extensively!
                match = true;
                continue;
              }
            }
            if (!match) console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type}`, this);
          } else if (prop.type instanceof Function) {
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
        if ((prop.reflect) && this._isIoElement) this.setAttribute(name, value);
      }
    }
    /**
     * Sets multiple properties in batch.
     * [property]-changed` events will be broadcast in the end.
     * @param {Object} props - Map of property names and values.
     */
    applyProperties(props: any) {
      for (const p in props) {
        if (!this._properties.has(p)) {
          debug: {
            // TODO: consider converting style and config to properties
            // TODO: document!
            if (!p.startsWith('on-') && p !== 'style' && p !== 'config' && p !== '$') {
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
    setProperties(props: any) {
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
    inputValue(value: any) {
      if (this.value !== value || typeof this.value === 'object') {
        const oldValue = this.value;
        this.setProperty('value', value);
        this.dispatchEvent('value-input', {value: value, oldValue: oldValue}, false);
      }
    }
    /**
     * default change handler.
     * Invoked when one of the properties change.
     */
    changed() {}
    init() {}
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
     * Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.
     */
    dispatchQueue() {
      if (this.lazy) {
        this.throttle(this.dispatchQueueSync);
      } else {
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
    throttle(func: CallbackFunction, arg: any = undefined, sync = false) {
      throttle(func, arg, sync);
    }
    /**
     * Event handler for 'object-mutated' event emitted from the `window`.
     * Node should be listening for this event if it has an observed object property
     * @param {Object} event - Event payload.
     * @param {Object} event.detail.object - Mutated object.
     */
    onObjectMutated = (event: CustomEvent) => {
      for (let i = 0; i < this._protochain.observedObjectProperties.length; i++) {
        const prop = this._protochain.observedObjectProperties[i];
        const value = this._properties.get(prop)!.value;
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
    objectMutated = (prop: string) => {
      if (this[prop + 'Mutated']) this[prop + 'Mutated']();
      this.changed();
    };
    /**
     * Returns a binding to a specified property`.
     * @param {string} prop - Property to bind to.
     * @return {Binding} Binding object.
     */
    bind(prop: string): Binding {
      debug: {
        if (!this._properties.has(prop)) {
          console.warn(`IoGUI Node: cannot bind to ${prop} property. Does not exist!`);
        }
      }
      if (!this._bindings.has(prop)) {
        this._bindings.set(prop, new Binding(this, prop));
      }
      return this._bindings.get(prop) as Binding;
    }
    /**
     * Unbinds a binding to a specified property`.
     * @param {string} prop - Property to unbind.
     */
    unbind(prop: string) {
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
      if (this._disposed) return;

      // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!

      this._bindings.forEach((binding, key) => {
        binding.dispose();
        this._bindings.delete(key);
      });
      delete (this as any)._bindings;

      if (this._protochain.observedObjectProperties.length) {
        window.removeEventListener('object-mutated', this.onObjectMutated as EventListener);
      }
      delete (this as any)._protochain;

      this._changeQueue.dispose();
      delete (this as any)._changeQueue;

      this._properties.forEach((property, key) => {
        property.binding?.removeTarget(this, key);
      });

      this._eventDispatcher.dispose();
      delete (this as any)._eventDispatcher;
      delete (this as any)._properties;

      Object.defineProperty(this, '_disposed', {value: true});
    }
  };
  return IoNodeMixinConstructor;
}

/**
 * Register function to be called once per class.
 * @param {IoNode} target - Node class to register.
 */
export function RegisterIoNode(target: typeof IoNode) {
  Object.defineProperty(target.prototype, '_protochain', {value: new ProtoChain(target)});
}

/**
 * IoNodeMixin applied to `Object` class.
 */
@RegisterIoNode
export class IoNode extends IoNodeMixin(Object) {}

// TODO: Document and test. Improve argument handling. Consider edge-cases.
const throttleQueueSync: CallbackFunction[] = [];
const throttleQueue: CallbackFunction[] = [];
const throttleQueueArgs = new WeakMap();

function throttle(func: CallbackFunction, arg: any = undefined, sync = false) {
  if (throttleQueueSync.indexOf(func) === -1) {
    throttleQueueSync.push(func);
    if (sync === true) {
      try {
        func(arg);
      } catch (e) {
        console.error(e);
      }
      return;
    }
  }
  if (throttleQueue.indexOf(func) === -1) {
    throttleQueue.push(func);
  }
  if (throttleQueueArgs.has(func)) {
    const args = throttleQueueArgs.get(func);
    if (args.indexOf(arg) === -1) args.push(arg);
  } else {
    throttleQueueArgs.set(func, [arg]);
  }
}

function animate () {
  requestAnimationFrame(animate);
  throttleQueueSync.length = 0;
  for (let i = throttleQueue.length; i--;) {
    const func = throttleQueue[i];
    const args = throttleQueueArgs.get(func);
    for (let p = args.length; p--;) {
      try {
        func(args[p]);
      } catch (e) {
        console.error(e);
      }
      args.splice(args.indexOf(p), 1);
    }
    throttleQueue.splice(throttleQueue.indexOf(func), 1);
  }
}
requestAnimationFrame(animate);
