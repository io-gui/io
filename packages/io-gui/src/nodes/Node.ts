import { Register } from '../decorators/Register.js';
import { ProtoChain } from '../core/ProtoChain.js';
import { Binding } from '../core/Binding.js';
import { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js';
import { EventDispatcher, ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js';
import { throttle, debounce, CallbackFunction } from '../core/Queue.js';

export type AnyConstructor = new (...args: any[]) => unknown;
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>;
export type ListenerDefinitions = Record<string, ListenerDefinitionLoose>;

export interface NodeConstructor<T> {
  new (...args: any[]): T;
  ReactiveProperties?: ReactivePropertyDefinitions;
  Properties?: Record<string, any>;
  Listeners?: ListenerDefinitions;
  Style?: string;
}

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;

// Utility type to add Binding to all properties of a type
export type WithBinding<T> = T | Binding<T>;

export type NodeProps = {
  reactivity?: 'none' | 'immediate' | 'throttled' | 'debounced';
  [key: prefix<string, '@'>]: string | ((event: CustomEvent<any>) => void) | ((event: PointerEvent) => void)
};

/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `NodeMixin` applied to it.
 */
export function NodeMixin<T extends NodeConstructor<any>>(superclass: T) {
  return class NodeMixinConstructor extends (superclass as any) {
    static get ReactiveProperties(): ReactivePropertyDefinitions {
      return {
        reactivity: {
          value: 'immediate',
          type: String,
        }
      };
    }
    declare readonly _protochain: ProtoChain;
    declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
    declare readonly _bindings: Map<string, Binding<any>>;
    declare readonly _changeQueue: ChangeQueue;
    declare readonly _eventDispatcher: EventDispatcher;

     /**
     * Creates a class instance and initializes the core with properties.
     * @overload
     * @constructor
     * @param {NodeProps} args - Initial property values
     * @param {...any} superProps - Additional arguments
     */
    // constructor(...superProps: any[]); // TODO: remove this after fixing types.
    constructor(args: NodeProps = {}, ...superProps: any[]) {
      // eslint-disable-next-line constructor-super
      super(...superProps);

      this.init();

      debug: {
        const constructor = Object.getPrototypeOf(this).constructor;
        if (this._protochain.constructors[0] !== constructor) {
          console.error(`${constructor.name} not registered! Call "Register([ClassName])" of @Register decorator before using ${constructor.name} class!`);
        }
      }

      this._protochain.autobindHandlers(this);

      Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)});
      Object.defineProperty(this, '_reactiveProperties', {enumerable: false, configurable: true, value: new Map()});
      Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()});
      Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)});


      // TODO: move in loop below
      for (const name in this._protochain.reactiveProperties) {
        Object.defineProperty(this, name, {
          get: function() {
            return this._reactiveProperties.get(name).value;
          },
          set: function(value) {
            (this as Node).setProperty(name, value);
          },
          configurable: true,
          enumerable: true,
        });
      }

      for (const name in this._protochain.reactiveProperties) {
        const property = new ReactivePropertyInstance(this, this._protochain.reactiveProperties[name]);
        this._reactiveProperties.set(name, property);

        if (property.binding) property.binding.addTarget(this, name);
        if (property.value?._isNode) {
          let hasSameValueAtOtherProperty = false;
          this._reactiveProperties.forEach((p, n) => {
            if (p.value === property.value && n !== name) hasSameValueAtOtherProperty = true;
          });
          if (!hasSameValueAtOtherProperty) property.value.addEventListener('object-mutated', this.onPropertyMutated);
        }
      }

      for (const name in this._protochain.properties) {
        let initialValue = this._protochain.properties[name];
        if (typeof initialValue === 'function') {
          initialValue = initialValue();
        } else if (initialValue instanceof Array) {
          initialValue = initialValue.slice();
        } else if (typeof initialValue === 'object') {
          initialValue = Object.assign({}, initialValue);
        }
        this[name] = initialValue;
      }

      this.applyProperties(args, true);

      if (this._protochain.observedObjectProperties.length) {
        window.addEventListener('object-mutated', this.onPropertyMutated as EventListener);
      }

      this.ready();

      this.dispatchQueue();
    }
    /**
     * Sets multiple properties in batch.
     * [property]-changed` events will be broadcast in the end.
     * @param {Object} props - Map of property names and values.
     */
    // TODO: add types
    applyProperties(props: any, skipDispatch = false) {
      for (const name in props) {
        if (!this._reactiveProperties.has(name)) {
          // TODO: document!
          if (!name.startsWith('@')) {
            // this[name] = props[name];
            debug: if (props[name] instanceof Binding) {
              console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on "${this.constructor.name}"`);
            }
          }
        }
        this.setProperty(name, props[name], true);
      }
      this._eventDispatcher.applyPropListeners(props);
      if (!skipDispatch) this.dispatchQueue();
    }
    /**
     * Sets multiple properties in batch.
     * [property]-changed` events will be broadcast in the end.
     * @param {Object} props - Map of property names and values.
     */
    // TODO: add types
    setProperties(props: any) {
      for (const name in props) {
        if (!this._reactiveProperties.has(name)) {
          debug: console.warn(`Property "${name}" is not defined`, this);
          continue;
        }
        this.setProperty(name, props[name], true);
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
      const prop = this._reactiveProperties.get(name)!;
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

        // TODO: test!
        if (value !== oldValue) {
          let hasNewValueAtOtherProperty = false;
          let hasOldValueAtOtherProperty = false;
          this._reactiveProperties.forEach((property, n) => {
            if (property.value === value && n !== name) hasNewValueAtOtherProperty = true;
            if (property.value === oldValue && n !== name) hasOldValueAtOtherProperty = true;
          });
          if (value?._isNode) {
            if (!hasNewValueAtOtherProperty) value.addEventListener('object-mutated', this.onPropertyMutated);
          }
          if (oldValue?._isNode) {
            if (!hasOldValueAtOtherProperty && !oldValue._disposed) oldValue.removeEventListener('object-mutated', this.onPropertyMutated);
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
    ready() {}
    init() {}
    /**
     * default change handler.
     * Invoked when one of the properties change.
     */

    changed() {}
    /**
     * Adds property change to the queue.
     * @param {string} name - Property name.
     * @param {*} value - Property value.
     * @param {*} oldValue - Old property value.
     */
    queue(name: string, value: any, oldValue: any) {
      if (this.reactivity === 'none') return;
      this._changeQueue.queue(name, value, oldValue);
    }
    /**
     * Dispatches the queue in the next rAF cycle if `reactivity` property is set to `"debounced"`. Otherwise it dispatches the queue immediately.
     */
    dispatchQueue(debounce = false) {
      if (this.reactivity === 'debounced' || debounce || this._changeQueue.dispatching) {
        this.debounce(this._changeQueue.dispatch);
      } else if (this.reactivity === 'throttled') {
        this.throttle(this._changeQueue.dispatch);
      } else if (this.reactivity === 'immediate') {
        this._changeQueue.dispatch();
      }
      debug: if (['none', 'immediate', 'throttled', 'debounced'].indexOf(this.reactivity) === -1) {
        console.warn(`Node.dispatchQueue(): Invalid reactivity property value: "${this.reactivity}". Expected one of: "none", "immediate", "throttled", "debounced".`);
      }
    }
    /**
     * Throttles function execution once per frame (rAF).
     * @param {CallbackFunction} func - Function to throttle.
     * @param {*} [arg] - Optional argument for throttled function.
     */
    throttle(func: CallbackFunction, arg?: any, timeout = 1) {
      throttle(func, arg, this, timeout);
    }
    /**
     * Debounces function execution to next frame (rAF).
     * @param {CallbackFunction} func - Function to debounce.
     * @param {*} [arg] - Optional argument for debounced function.
     */
    debounce(func: CallbackFunction, arg?: any, timeout = 1) {
      debounce(func, arg, this, timeout);
    }
    /**
     * Event handler for 'object-mutated' events emitted from the properties which are Node instances.
     * Aditionally, it handles events emitted from the `window` object (used for observing non-Node object properties).
     * NOTE: non-Node objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
     * This is used to evoke '[propName]Mutated()' mutation handler
     * @param {Object} event - Event payload.
     * @param {EventTarget} event.target - Node that emitted the event.
     * @param {Node} event.detail.object - Mutated node.
     */
    onPropertyMutated(event: CustomEvent) {
      const object = event.detail.object;
      // TODO: consider situations where node is listening to object-mutated events from multiple sources (window and property).
      // This might cause multiple executions of the same handler.
      // TODO: consider optimizing. This handler might be called a lot.
      const properties = [...new Set([...this._protochain.observedObjectProperties, ...this._protochain.observedNodeProperties])];
      for (let i = 0; i < properties.length; i++) {
        const name = properties[i];
        const value = this._reactiveProperties.get(name)!.value;
        if (value === object) {
          if (typeof this[name + 'Mutated'] === 'function') {
            this.throttle(this[name + 'Mutated']);
          }
          return true;
        }
      }
    };
    /**
     * Returns a binding to a specified property`.
     * @param {string} name - Property name to bind to.
     * @return {Binding} Binding object.
     */
    bind<T>(name: string) {
      debug: if (!this._reactiveProperties.has(name)) {
        console.warn(`IoGUI Node: cannot bind to ${name} property. Does not exist!`);
      }
      if (!this._bindings.has(name)) {
        this._bindings.set(name, new Binding<T>(this, name));
      }
      return this._bindings.get(name)! as Binding<T>;
    }
    /**
     * Unbinds a binding to a specified property`.
     * @param {string} name - Property name to unbind.
     */
    unbind(name: string) {
      const binding = this._bindings.get(name);
      if (binding) {
        binding.dispose();
        this._bindings.delete(name);
      }

      const property = this._reactiveProperties.get(name);
      property?.binding?.removeTarget(this, name);
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
    dispatchEvent(type: string, detail: any = undefined, bubbles = false, src?: Node | HTMLElement | Document | Window) {
      this._eventDispatcher.dispatchEvent(type, detail, bubbles, src);
    }
    /**
     * Disposes the node when it is no longer needed.
     */
    dispose() {
      debug: if (this._disposed) {
        console.warn('Node.dispose(): Already disposed!', this.constructor.name);
      }

      if (this._disposed) return;

      this._bindings.forEach((binding, name) => {
        binding.dispose();
        this._bindings.delete(name);
      });
      delete (this as any)._bindings;

      if (this._protochain.observedObjectProperties.length) {
        window.removeEventListener('object-mutated', this.onPropertyMutated as EventListener);
      }
      delete (this as any)._protochain;

      this._changeQueue.dispose();
      delete (this as any)._changeQueue;

      let removed: Node[] = [];
      this._reactiveProperties.forEach((property, name) => {
        property.binding?.removeTarget(this, name);
        if (property.value?._isNode && !removed.includes(property.value) && !property.value._disposed) {
          property.value.removeEventListener('object-mutated', this.onPropertyMutated);
          removed.push(property.value);
        }
      });

      for (const name in this._protochain.properties) {
        delete this[name];
      }

      // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
      this._eventDispatcher.dispose();
      delete (this as any)._eventDispatcher;
      delete (this as any)._reactiveProperties;

      Object.defineProperty(this, '_disposed', {value: true});
    }
    Register(ioNodeConstructor: typeof Node) {
      Object.defineProperty(ioNodeConstructor, '_isNode', {enumerable: false, value: true});
      Object.defineProperty(ioNodeConstructor.prototype, '_isNode', {enumerable: false, value: true});
      Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)});
    }
  };
}

/**
 * NodeMixin applied to `Object` class.
 */
@Register
export class Node extends NodeMixin(Object) {}