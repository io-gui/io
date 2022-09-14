import {ProtoChain} from './internals/protoChain.js';
import {Binding} from './internals/binding.js';
import {ChangeQueue} from './internals/changeQueue.js';
import {Property, PropertyDefinitionWeak, PropertyDefinitionStrong} from './internals/property.js';
import {EventDispatcher, ListenerDefinitionWeak} from './internals/eventDispatcher.js';

export type ListenersDeclaration = Record<string, ListenerDefinitionWeak>;
export type PropertiesDeclaration = Record<string, PropertyDefinitionWeak>;

export interface IoNodeConstructor<T> {
  new (...args: any[]): T;
  _Properties?: PropertiesDeclaration;
  Properties?: PropertiesDeclaration;
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

// TODO: Rename, test default values and change events.
// TODO: consider alowing weak definitions.
export const IoProperty = function(propertyDefinition: PropertyDefinitionStrong) {
  return (target: IoNode, propertyName: string) => {
    // const _Properties = (target as any)._Properties as PropertiesDeclaration;
    const _Properties = (target.constructor as any)._Properties as PropertiesDeclaration;
    _Properties[propertyName] = propertyDefinition;
    // console.log(_Properties);
  };
};

// TODO: find purpose
export const IoBind = function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  target[propertyKey] = target[propertyKey].bind(target);
  console.log(descriptor);
  return descriptor;
};

/**
 * Core mixin for `Node` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
export function IoNodeMixin<T extends IoNodeConstructor<any>>(superclass: T) {
  const IoNodeMixinConstructor = class extends (superclass as any) {
    static _Properties = {};
    static get Properties(): PropertiesDeclaration {
      return {
        lazy: {
          value: false,
          notify: false,
          reflect: -1
        }
      };
    }
    declare readonly _protochain: ProtoChain;
    declare readonly _properties: Record<string, Property>;
    declare readonly _bindings: Record<string, Binding>;
    declare readonly _changeQueue: ChangeQueue;
    declare readonly _eventDispatcher: EventDispatcher;
     /**
     * Creates a class instance and initializes the internals.
     * @param {Object} properties - Initial property values.
     */
    constructor(properties: Record<string, any> = {}, ...args: any[]) {
      super(...args);

      debug: {
        const constructor = Object.getPrototypeOf(this).constructor;
        if (this._protochain.constructors[0] !== constructor) {
          console.error(`${constructor.name} not registered! Call "RegisterIoNode([ClassName])" of @RegisterIoNode decorator before using ${constructor.name} class!`);
        }
      }

      this._protochain.autobindFunctions(this);

      Object.defineProperty(this, '_properties', {enumerable: false, value: {}});
      Object.defineProperty(this, '_bindings', {enumerable: false, value: {}});
      Object.defineProperty(this, '_changeQueue', {enumerable: false, value: new ChangeQueue(this)});
      Object.defineProperty(this, '_eventDispatcher', {enumerable: false, value: new EventDispatcher(this)});

      if (this._protochain.observedObjectProperties.length) {
        window.addEventListener('object-mutated', this.onObjectMutated as EventListener);
      }

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

      for (const p in this._protochain.properties) {
        Object.defineProperty(this, p, {
          get: function() {
            return (this as IoNode)._properties[p].value;
          },
          set: function(value) {
            (this as IoNode).setProperty(p, value);
          },
          configurable: true,
        });
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
          if (binding !== oldBinding) {
            if (oldBinding) {
              oldBinding.removeTarget(this, name);
            }
            binding.addTarget(this, name);
          }
          value = binding.value;
        } else {
          // TODO: Verify and test this edge-case fix. Look for regressions.
          // If user uses setProperties() to batch-set multiple properties that are bound to parent element it causes
          // all but one of those properties to be reset to original value once parents's change event happens.
          // This fixes the bug by setting parent's property value with skipDispatch. This can possibly introduce
          // bug when parent has properties bound to other elements. Create and extensive test for this but fix.
          // TODO: finish this fix - it caused regression in io-option-menu
          // WARNING: Enabling this breaks the menu.
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
            this.dispatchQueue();
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
      this.dispatchQueue();
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
      this.dispatchQueue();
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
      // TODO: document and test.
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
        const value = this._properties[prop].value;
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
  return IoNodeMixinConstructor;
}

/**
 * Register function to be called once per class.
 * @param {IoNode} target - Node class to register.
 */
export const RegisterIoNode = function(target: typeof IoNode) {
  Object.defineProperty(target.prototype, '_protochain', {value: new ProtoChain(target)});
};

/**
 * IoNodeMixin applied to `Object` class.
 */
@RegisterIoNode
export class IoNode extends IoNodeMixin(Object) {}

// TODO: document and test
const throttleQueueSync: CallbackFunction[] = [];
const throttleQueue: CallbackFunction[] = [];
const throttleQueueArgs = new WeakMap();

function throttle(func: CallbackFunction, arg: any = undefined, sync = false) {
  if (throttleQueueSync.indexOf(func) === -1) {
    throttleQueueSync.push(func);
    if (sync === true) {
      func(arg);
      return;
    }
  }
  if (throttleQueue.indexOf(func) === -1) {
    throttleQueue.push(func);
  }
  // TODO: improve argument handling. Consider edge-cases.
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
    const args = throttleQueueArgs.get(throttleQueue[i]);
    for (let p = args.length; p--;) {
      throttleQueue[i](args[p]);
      args.splice(args.indexOf(p), 1);
    }
    throttleQueue.splice(throttleQueue.indexOf(throttleQueue[i]), 1);
  }
}
requestAnimationFrame(animate);
