import {ProtoChain} from './internals/protoChain.js';
import {Binding} from './internals/binding.js';
import {ChangeQueue} from './internals/changeQueue.js';
import {PropertyInstance, PropertyDefinitionLoose} from './internals/property.js';
import {EventDispatcher, ListenerDefinitionLoose, AnyEventListener} from './internals/eventDispatcher.js';
import { Register } from './decorators/register.js';

export type Constructor = new (...args: any[]) => unknown;
export type PropertyDefinitions = Record<string, PropertyDefinitionLoose>;
export type ListenerDefinitions = Record<string, ListenerDefinitionLoose>;

export interface IoNodeConstructor<T> {
  new (...args: any[]): T;
  Properties?: PropertyDefinitions;
  Listeners?: ListenerDefinitions;
  Style?: string;
}

export type CallbackFunction = (arg?: any) => void;

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;

export type IoNodeArgs = {
  reactivity?: 'none' | 'immediate' | 'debounced';
  [key: prefix<string, '@'>]: string | ((event: CustomEvent<any>) => void)
}

/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export function IoNodeMixin<T extends IoNodeConstructor<any>>(superclass: T) {
  const IoNodeMixinConstructor = class extends (superclass as any) {
    static get Properties(): PropertyDefinitions {
      return {
        reactivity: {
          value: 'immediate',
          type: String,
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
     * @overload
     * @constructor
     * @param {...any} args - Additional arguments
     *
     * Creates a class instance and initializes the internals with properties.
     * @overload
     * @constructor
     * @param {IoNodeArgs} properties - Initial property values
     * @param {...any} args - Additional arguments
     */
    constructor(...args: any[]);
    constructor(properties: IoNodeArgs = {}, ...args: any[]) {
      // eslint-disable-next-line constructor-super
      super(...args);

      debug: {
        const constructor = Object.getPrototypeOf(this).constructor;
        if (this._protochain.constructors[0] !== constructor) {
          console.error(`${constructor.name} not registered! Call "Register([ClassName])" of @Register decorator before using ${constructor.name} class!`);
        }
      }

      this._protochain.autobindHandlers(this);

      Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)});
      Object.defineProperty(this, '_properties', {enumerable: false, configurable: true, value: new Map()});
      Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()});
      Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)});

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

      for (const name in this._protochain.properties) {
        const property = new PropertyInstance(this, this._protochain.properties[name]);
        this._properties.set(name, property);

        if (property.binding) property.binding.addTarget(this, name);
        if (property.value?._isIoNode) {
          property.value.addEventListener('changed', this.onIoNodePropertyChanged);
        }
      }

      this.applyProperties(properties);

      if (this._protochain.mutationObservedProperties.length) {
        window.addEventListener('object-mutated', this.onObjectMutated as EventListener);
      }

      this.init();
    }
    /**
     * Sets multiple properties in batch.
     * [property]-changed` events will be broadcast in the end.
     * @param {Object} props - Map of property names and values.
     */
    applyProperties(props: any) {
      for (const p in props) {
        if (!this._properties.has(p)) {
          // TODO: document!
          debug: if (!p.startsWith('@') && p !== 'style' && p !== 'config' && p !== '$') {
            console.warn(`Property "${p}" is not defined`, this);
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
          debug: console.warn(`Property "${p}" is not defined`, this);
          continue;
        }
        this.setProperty(p, props[p], true);
      }
      this.dispatchQueue();
    }
    /**
     * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
     * @param {string} name Property name to set value of.
     * @param {any} value Peroperty value.
     * @param {boolean} [debounce] flag to skip event dispatch.
     */
    setProperty(name: string, value: any, debounce = false) {
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
            binding.addTarget(this, name);
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

        // TODO: test removal of event listeners.
        if (value !== oldValue) {
          if (value?._isIoNode) {
            value.addEventListener('changed', this.onIoNodePropertyChanged);
          }
          if (oldValue?._isIoNode) {
            oldValue.removeEventListener('changed', this.onIoNodePropertyChanged);
          }
        }

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
          } else if (typeof prop.type === 'function') {
            if (!(value instanceof prop.type)) {
              console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
            }
          }
        }
        if (oldValue !== value) {
          this.queue(name, value, oldValue);
          this.dispatchQueue(debounce);
        }
      }
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
      if (this.reactivity === 'none') return;
      this._changeQueue.queue(prop, value, oldValue);
    }
    /**
     * Dispatches the queue in the next rAF cycle if `reactivity` property is set to `"debounced"`. Otherwise it dispatches the queue immediately.
     */
    dispatchQueue(debounce = false) {
      if (this.reactivity === 'debounced' || debounce || this._changeQueue.dispatching) {
        this.debounce(this._changeQueue.dispatch);
      } else if (this.reactivity === 'immediate') {
        this._changeQueue.dispatch();
      }
      debug: if (['none', 'immediate', 'debounced'].indexOf(this.reactivity) === -1) {
        console.warn(`IoNode.dispatchQueue(): Invalid reactivity property value: "${this.reactivity}". Expected one of: "none", "immediate", "debounced".`);
      }
    }
    /**
     * Throttles function execution once per frame (rAF).
     * @param {function} func - Function to throttle.
     * @param {*} arg - argument for throttled function.
     */
    throttle(func: CallbackFunction, arg: any = undefined) {
      throttle(this, func, arg, 0);
    }
    /**
     * Debounces function execution to next frame (rAF).
     * @param {function} func - Function to throttle.
     * @param {*} arg - argument for debounced function.
     * @param {number} timeout - minimum delay in ms before executing the function.
     */
    debounce(func: CallbackFunction, arg: any = undefined, timeout = 1) {
      throttle(this, func, arg, timeout);
    }
    /**
     * Event handler for '[property]-changed' events emitted from the properties which are IoNode instances.
     * This is used to propagate 'object-mutated' event from the parent node.
     * @param {Object} event - Event payload.
     * @param {IoNode} event.detail.object - Mutated node.
     */
    onIoNodePropertyChanged = (event: CustomEvent) => {
      const node = event.target as unknown as IoNode;
      debug: if (!node._isIoNode) {
        console.warn('IoNode.onIoNodePropertyChanged(): Handler evoked on a property which is not an IoNode instance.');
      }
      this.dispatchEvent('object-mutated', {object: node}, false, window);
    };
    /**
     * Event handler for 'object-mutated' event emitted from the `window`.
     * Node should be listening for this event if it has an observed object property
     * @param {Object} event - Event payload.
     * @param {Object} event.detail.object - Mutated object.
     */
    onObjectMutated(event: CustomEvent) {
      for (let i = 0; i < this._protochain.mutationObservedProperties.length; i++) {
        const prop = this._protochain.mutationObservedProperties[i];
        const value = this._properties.get(prop)!.value;
        if (value === event.detail.object) {
          this.throttle(this.objectMutated, prop);
          return;
        }
        debug: if (event.detail.objects) {
          console.error('Deprecation warning! `objects` property no longer supported. Use `object` property instead.');
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
      this.dispatchEvent('changed');
    };
    /**
     * Returns a binding to a specified property`.
     * @param {string} prop - Property to bind to.
     * @return {Binding} Binding object.
     */
    bind(prop: string): Binding {
      debug: if (!this._properties.has(prop)) {
        console.warn(`IoGUI Node: cannot bind to ${prop} property. Does not exist!`);
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
      debug: if (typeof listener !== 'function') {
        console.warn(`${this.constructor.name}incorrect listener type.`, this);
        return;
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
      debug: if (this._disposed) {
        // TODO: figure out how to prevent redundant disposals from nested io-selectors with cache:false
        // console.warn('IoNode.dispose(): Already disposed!', this.constructor.name);
      }
      if (this._disposed) return;

      // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!

      this._bindings.forEach((binding, key) => {
        binding.dispose();
        this._bindings.delete(key);
      });
      delete (this as any)._bindings;

      if (this._protochain.mutationObservedProperties.length) {
        window.removeEventListener('object-mutated', this.onObjectMutated as EventListener);
      }
      delete (this as any)._protochain;

      this._changeQueue.dispose();
      delete (this as any)._changeQueue;

      this._properties.forEach((property, key) => {
        property.binding?.removeTarget(this, key);
        if (property.value?._isIoNode) {
          property.value.removeEventListener('changed', this.onIoNodePropertyChanged);
        }
      });

      this._eventDispatcher.dispose();
      delete (this as any)._eventDispatcher;
      delete (this as any)._properties;

      Object.defineProperty(this, '_disposed', {value: true});
    }
    Register(ioNodeConstructor: typeof IoNode) {
      Object.defineProperty(ioNodeConstructor, '_isIoNode', {enumerable: false, value: true});
      Object.defineProperty(ioNodeConstructor.prototype, '_isIoNode', {enumerable: false, value: true});
      Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)});
    }
  };
  return IoNodeMixinConstructor;
}

/**
 * IoNodeMixin applied to `Object` class.
 */
@Register
export class IoNode extends IoNodeMixin(Object) {}

interface QueueOptions {
  node: IoNode | undefined;
  arg: any;
  timeout: number;
}

const throttleQueueSync: CallbackFunction[] = [];
const throttleQueue0: CallbackFunction[] = [];
const throttleQueue1: CallbackFunction[] = [];
const throttleQueueOptions0: WeakMap<CallbackFunction, QueueOptions> = new WeakMap();
const throttleQueueOptions1: WeakMap<CallbackFunction, QueueOptions> = new WeakMap();
let throttleQueue = throttleQueue0;
let throttleQueueOptions = throttleQueueOptions0;

export async function nextQueue(): Promise<void> {
  return new Promise((resolve) => {
    throttleQueue.push(resolve);
    throttleQueueOptions.set(resolve, {
      arg: undefined,
      timeout: Date.now() + 1,
      node: undefined,
    });
  });
}

function throttle(node: IoNode, func: CallbackFunction, arg: any = undefined, timeout = 1) {
  if (timeout === 0) {
    if (throttleQueueSync.indexOf(func) === -1) {
      throttleQueueSync.push(func);
      try {
        func(arg);
      } catch (e) {
        console.error(e);
      }
      return;
    } else {
      timeout = 1;
    }
  }
  if (throttleQueue.indexOf(func) === -1) {
    throttleQueue.push(func);
  }
  if (!throttleQueueOptions.has(func)) {
    throttleQueueOptions.set(func, {
      node: node,
      arg: arg,
      timeout: Date.now() + timeout,
    });
  } else {
    throttleQueueOptions.get(func)!.arg = arg;
  }
}

function animate () {
  throttleQueueSync.length = 0;

  const activeThrottleQueue = throttleQueue;
  const activeThrottleQueueOptions = throttleQueueOptions;
  throttleQueue = throttleQueue === throttleQueue0 ? throttleQueue1 : throttleQueue0;
  throttleQueueOptions = throttleQueueOptions === throttleQueueOptions0 ? throttleQueueOptions1 : throttleQueueOptions0;

  const time = Date.now();
  for (let i = 0; i < activeThrottleQueue.length; i++) {
    const func = activeThrottleQueue[i];
    const options = activeThrottleQueueOptions.get(func)!;
    activeThrottleQueueOptions.delete(func);

    if (options === undefined) {
      console.warn(func);
    }
    if (options.timeout > time) {
      if (throttleQueue.indexOf(func) === -1) {
        throttleQueue.push(func);
      }
      throttleQueueOptions.set(func, options);
      continue;
    }

    if (options.node?._disposed) continue;
    try {
      if (options.arg !== undefined) func(options.arg);
      else func();
    } catch (e) {
      console.error(e);
    }
  }
  activeThrottleQueue.length = 0;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
