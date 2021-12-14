import {ProtoChain} from './internals/protoChain.js';
import {PropertyBinder, Binding} from './internals/propertyBinder.js';
import {ChangeQueue} from './internals/changeQueue.js';
import {Properties} from './internals/properties.js';
import {EventDispatcher} from './internals/eventDispatcher.js';

type Constructor<T> = new (...args: any[]) => T;
type ComposedProperties = null | Record<string, Record<string, any>>
type CallbackFunction = (arg?: any) => void;
type PredicateFunction = (object: any) => boolean;

type KeyboardEventListener = (event: KeyboardEvent) => void;
type PointerEventListener = (event: PointerEvent) => void;
type CustomEventListener = (event: CustomEvent) => void;
type FocusEventListener = (event: FocusEvent) => void;
type TouchEventListener = (event: TouchEvent) => void;
type AnyEventListener = EventListener |
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
export function IoNodeMixin<T extends Constructor<any>>(superclass: T) {
  const classConstructor = class extends (superclass as any) {
    static get Properties(): any {
      return {
        lazy: Boolean,
        // TODO: implement import as property.
        // import: {
        //   type: String,
        //   reflect: -1,
        // },
      } as any;
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
    get compose (): ComposedProperties {
      return null;
    }
     /**
     * Creates a class instance and initializes the internals.
     * @param {Object} properties - Initial property values.
     */
    constructor(properties: Record<string, any> = {}, ...args: any[]) {
      super(...args);

      debug: {
        const constructor = this.__proto__.constructor;
        if (constructor.__registeredAs !== constructor.name) {
          console.error(`${constructor.name} not registered! Call "RegisterIoNode()" before using ${constructor.name} class!`);
        }
      }

      this.__protochain.bindFunctions(this);

      Object.defineProperty(this, '__propertyBinder', {enumerable: false, value: new PropertyBinder(this)});
      Object.defineProperty(this, '__changeQueue', {enumerable: false, value: new ChangeQueue(this)});

      Object.defineProperty(this, '__eventDispatcher', {enumerable: false, value: new EventDispatcher(this)});
      Object.defineProperty(this, '__properties', {enumerable: false, value: new Properties(this)});

      Object.defineProperty(this, 'objectMutated', {enumerable: false, value: this.objectMutated.bind(this)});
      Object.defineProperty(this, 'objectMutatedThrottled', {enumerable: false, value: this.objectMutatedThrottled.bind(this)});
      Object.defineProperty(this, 'queueDispatch', {enumerable: false, value: this.queueDispatch.bind(this)});
      Object.defineProperty(this, 'queueDispatchLazy', {enumerable: false, value: this.queueDispatchLazy.bind(this)});

      Object.defineProperty(this, '__connected', {enumerable: false, writable: true, value: false});
      if (!this.__proto__.__isIoElement) {
        Object.defineProperty(this, '__connections', {enumerable: false, value: []});
      }

      this.setProperties(properties);
    }
    /**
     * Connects the instance to another node or element.
     * @param {IoNode} node - Node to connect to.
     * @return {this} this
     */
    connect(node: IoNode | HTMLElement | Document | Window = window): this {
      debug:
      if (this.__isIoElement) {
        console.error('"connect()" function is not intended for DOM Elements!');
      }
      debug:
      if (this.__connections.indexOf(node) !== -1) {
        console.warn('Node already connected to node');
      }
      this.__connections.push(node);
      if (!this.__connected) this.connectedCallback();
      return this;
    }
    /**
     * Disconnects the instance from an another node or element.
     * @param {IoNode} node - Node to disconnect from.
     * @return {this} this
     * */
    disconnect(node: IoNode | HTMLElement | Document | Window = window): this {
      debug:
      if (this.__isIoElement) {
        console.error('"disconnect()" function is not intended for DOM Elements!');
      }
      debug:
      if (this.__connections.indexOf(node) === -1) {
        console.error('Node not connected to:', node);
      }
      this.__connections.splice(this.__connections.indexOf(node), 1);
      if (this.__connections.length === 0 && this.__connected) {
        this.disconnectedCallback();
      }
      return this;
    }
    /**
     * Connected callback.
     */
    connectedCallback() {
      this.__connected = true;
      this.__eventDispatcher.connect();
      this.__properties.connect();
      if (this.__observedObjects.length) {
        window.addEventListener('object-mutated', this.objectMutated as EventListener);
      }
      this.queueDispatch();
    }
    /**
     * Disconnected callback.
     */
    disconnectedCallback() {
      this.__connected = false;
      this.__eventDispatcher.disconnect();
      this.__properties.disconnect();
      if (this.__observedObjects.length) {
        window.removeEventListener('object-mutated', this.objectMutated as EventListener);
      }
    }
    /**
     * Disposes all internals.
     * Use this when instance is no longer needed.
     */
    dispose() {
      this.__connected = false;
      this.__connections.length = 0;
      this.__changeQueue.dispose();
      this.__propertyBinder.dispose();
      this.__properties.dispose();
      this.__eventDispatcher.dispose();
      if (this.__observedObjects.length) {
        window.removeEventListener('object-mutated', this.objectMutated as EventListener);
      }
    }
    /**
     * default change handler.
     * Invoked when one of the properties change.
     */
    changed() {}
    /**
     * sets composed properties and invokes `changed()` function on change.
     */
    applyCompose() {
      // TODO: test compose
      const compose = this.compose as any;
      if (this.compose) {
        for (const prop in compose) {
          debug:
          if (!this.__properties[prop] || typeof this.__properties[prop].value !== 'object') {
            console.error(`Composed property ${prop} is not a Node or an object.`);
            continue;
          }
          const object = this.__properties[prop].value;
          if (object.__isIoNode) {
            // TODO: make sure composed and declarative listeners are working together
            object.setProperties(compose[prop]);
          } else {
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
    queue(prop: string, value: any, oldValue: any) {
      this.__changeQueue.queue(prop, value, oldValue);
    }
    /**
     * Dispatches the queue.
     */
    queueDispatch() {
      if (this.lazy) {
        preThrottleQueue.push(this.queueDispatchLazy);
        this.throttle(this.queueDispatchLazy);
      } else {
        this.__changeQueue.dispatch();
      }
    }
    /**
     * Dispatches the queue in the next rAF cycle.
     */
    queueDispatchLazy() {
      this.__changeQueue.dispatch();
    }
    /**
     * Event handler for 'object-mutated' event emitted from the `window`.
     * Node should be listening for this event if it has an object property
     * with `observe: "sync" || "async"` configuration.
     * @param {Object} event - Event payload.
     * @param {Object} event.detail.object - Mutated object.
     */
    objectMutated(event: CustomEvent) {
      for (let i = 0; i < this.__observedObjects.length; i++) {
        const prop = this.__observedObjects[i];
        const value = this.__properties[prop].value;
        if (value === event.detail.object) {
          this.throttle(this.objectMutatedThrottled, prop, false);
          return;
        }

        // else if (event.detail.objects && event.detail.objects.indexOf(value) !== -1) {
        //   this.throttle(this.objectMutatedThrottled, prop, false);
        //   return;
        // }

        debug:
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
    objectMutatedThrottled(prop: string) {
      if (this[prop + 'Mutated']) this[prop + 'Mutated']();
      this.applyCompose();
      this.changed();
    }
    /**
     * Returns a binding to a specified property`.
     * @param {string} prop - Property to bind to.
     * @return {Binding} Binding object.
     */
    bind(prop: string): Binding {
      debug:
      if (!this.__properties[prop]) {
        console.warn(`IoGUI Node: cannot bind to ${prop} property. Does not exist!`);
      }
      return this.__propertyBinder.bind(prop);
    }
    /**
     * Unbinds a binding to a specified property`.
     * @param {string} prop - Property to unbind.
     */
    unbind(prop: string) {
      this.__propertyBinder.unbind(prop);
      const binding = this.__properties[prop].binding;
      if (binding) binding.removeTarget(this, prop);
    }
    /**
     * Sets a property and emits `[property]-set` event.
     * Use this when property is set by user action (e.g. mouse click).
     * @param {string} prop - Property name.
     * @param {*} value - Property value.
     * @param {boolean} force - Force value set.
     */
    set(prop: string, value: any, force?: boolean) {
      if (this[prop] !== value || force) {
        const oldValue = this[prop];
        this[prop] = value;
        this.dispatchEvent('value-set', {property: prop, value: value, oldValue: oldValue}, false);
      }
    }
    /**
     * Sets multiple properties in batch.
     * [property]-changed` events will be broadcast in the end.
     * @param {Object} props - Map of property names and values.
     */
    setProperties(props: any) {
      for (const p in props) {
        if (this.__properties[p] === undefined) {
          debug:
          if (!p.startsWith('on-') && p !== 'import' && p !== 'style' && p !== 'config') {
            // TODO: consider converting import and style to properties
            console.warn(`Property "${p}" is not defined`, this);
          }
          continue;
        }
        this.__properties.set(p, props[p], true);
      }
      this.__eventDispatcher.setPropListeners(props, this);
      if (this.__connected) this.queueDispatch();
    }
    /**
     * Wrapper for addEventListener.
     * @param {string} type - listener name.
     * @param {function} listener - listener handler.
     * @param {Object} options - event listener options.
     */
    addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
      debug:
      if (typeof listener !== 'function') {
        console.warn(`${this.constructor.name}.${type}() is not a function`, this);
        return;
      }
      this.__eventDispatcher.addEventListener(type, listener, options);
    }
    /**
     * Wrapper for removeEventListener.
     * @param {string} type - event name to listen to.
     * @param {function} listener - listener handler.
     * @param {Object} options - event listener options.
     */
    removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
      this.__eventDispatcher.removeEventListener(type, listener, options);
    }
    /**
     * Wrapper for dispatchEvent.
     * @param {string} type - event name to dispatch.
     * @param {Object} detail - event detail.
     * @param {boolean} bubbles - event bubbles.
     * @param {HTMLElement|Node} src source node/element to dispatch event from.
     */
    dispatchEvent(type: string, detail = {}, bubbles = false, src?: Node | HTMLElement | Document | Window) {
      this.__eventDispatcher.dispatchEvent(type, detail, bubbles, src);
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
    // TODO: implement fAF debounce
    requestAnimationFrameOnce(func: CallbackFunction) {
      requestAnimationFrameOnce(func);
    }
    filterObject(object: any, predicate: PredicateFunction, _depth = 5, _chain: any[] = [], _i = 0): any {
      if (_chain.indexOf(object) !== -1) return; _chain.push(object);
      if (_i > _depth) return; _i++;
      if (predicate(object)) return object;
      for (const key in object) {
        const value = object[key] instanceof Binding ? object[key].value : object[key];
        if (predicate(value)) return value;
        if (typeof value === 'object') {
          const subvalue = this.filterObject(value, predicate, _depth, _chain, _i);
          if (subvalue) return subvalue;
        }
      }
    }
    filterObjects(object: any, predicate: PredicateFunction, _depth = 5, _chain: any[] = [], _i = 0): any {
      const result: any[] = [];
      if (_chain.indexOf(object) !== -1) return result; _chain.push(object);
      if (_i > _depth) return result; _i++;
      if (predicate(object) && result.indexOf(object) === -1) result.push(object);
      for (const key in object) {
        const value = object[key] instanceof Binding ? object[key].value : object[key];
        if (predicate(value) && result.indexOf(value) === -1) result.push(value);
        if (typeof value === 'object') {
          const results = this.filterObjects(value, predicate, _depth, _chain, _i);
          for (let i = 0; i < results.length; i++) {
            if (result.indexOf(results[i]) === -1) result.push(results[i]);
          }
        }
      }
      return result;
    }
    import(path: string) {
      const importPath = new URL(path, String(window.location)).href;
      return new Promise(resolve => {
        if (!path || IMPORTED_PATHS[importPath]) {
          resolve(importPath);
        } else {
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
    preventDefault(event: Event) {
      event.preventDefault();
    }
    /**
     * Handler function with `event.stopPropagation()`.
     * @param {Object} event - Event object.
     */
    stopPropagation(event: CustomEvent) {
      event.stopPropagation();
    }
  };
  return classConstructor;
}

/**
 * Register function to be called once per class.
 * @param {IoNode} nodeConstructor - Node class to register.
 */
export const RegisterIoNode = function (nodeConstructor: typeof IoNode) {
  const proto = nodeConstructor.prototype;
  Object.defineProperty(proto, '__isIoNode', {value: true});
  Object.defineProperty(nodeConstructor, '__registeredAs', {value: nodeConstructor.name});

  Object.defineProperty(proto, '__protochain', {value: new ProtoChain(nodeConstructor)});
  Object.defineProperty(proto, '__observedObjects', {value: []});

  const protoProps = proto.__protochain.properties;
  for (const p in protoProps) if (protoProps[p].observe) proto.__observedObjects.push(p);

  for (const p in protoProps) {
    Object.defineProperty(proto, p, {
      get: function() {
        return this.__properties.get(p);
      },
      set: function(value) {
        debug: {
          if (protoProps[p].readonly) console.error(`IoGUI error. Cannot set value "${value}" to read only property "${p}"`);
        }
        this.__properties.set(p, value);
      },
      enumerable: !!protoProps[p].enumerable,
      configurable: true,
    });
  }
};

/**
 * IoNodeMixin applied to `Object` class.
 */
export class IoNode extends IoNodeMixin(Object) {}
RegisterIoNode(IoNode);

const IMPORTED_PATHS: Record<string, any> = {};

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