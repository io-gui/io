/**
 * An array of all prototypes in the inheritance chain.
 */
class ProtoChain extends Array {
  /**
   * Creates an array of protptypes by traversing down the prototype inheritance chain of the specified prototype and adds each prototype to itself.
   * It terminates with `HTMLElement`, `Object` or `Array`.
   * @param {Object} proto - Prototype object.
   */
  constructor(proto) {
    super();
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object && proto.constructor !== Array) {
      this.push(proto); proto = proto.__proto__;
    }
  }
}

/**
 * Collection of all functions defined in the prototype chain that start with "on" or "_"
 */
class ProtoFunctions extends Array {
  /**
   * Creates a collection of all function from protochain that start with "on" or "_".
   * @param {ProtoChain} protochain - Array of protochain constructors.
   */
  constructor(protochain) {
    super();
    for (let i = protochain.length; i--;) {
      const names = Object.getOwnPropertyNames(protochain[i]);
      for (let j = 0; j < names.length; j++) {
        if (names[j] === 'constructor') continue;
        const p = Object.getOwnPropertyDescriptor(protochain[i], names[j]);
        if (p.get || p.set) continue;
        if (typeof protochain[i][names[j]] === 'function') {
          if (names[j].startsWith('_') || names[j].startsWith('on')) {
            this.push(names[j]);
          }
        }
      }
    }
  }
  /**
   * Binds all functions to `this`.
   * @param {IoNode} instance - Array of protochain constructors.
   */
  bind(instance) {
    for (let i = this.length; i--;) {
      instance[this[i]] = instance[this[i]].bind(instance);
    }
  }
}

/**
 * Binding object. It manages data binding between source and targets using `[prop]-changed` events.
 */
class Binding {
  /**
   * Creates a binding object with specified `sourceNode` and `sourceProp`.
   * @param {IoNode} sourceNode - Source node.
   * @param {string} sourceProp - Source property.
   */
  constructor(sourceNode, sourceProp) {
    Object.defineProperty(this, 'source', {value: sourceNode, configurable: true});
    Object.defineProperty(this, 'sourceProp', {value: sourceProp, configurable: true});
    Object.defineProperty(this, 'targets', {value: [], configurable: true});
    Object.defineProperty(this, 'targetProps', {value: new WeakMap(), configurable: true});
    this._onTargetChanged = this._onTargetChanged.bind(this);
    this._onSourceChanged = this._onSourceChanged.bind(this);
    this.source.addEventListener(this.sourceProp + '-changed', this._onSourceChanged);
  }
  set value(value) {
    this.source[this.sourceProp] = value;
  }
  get value() {
    return this.source[this.sourceProp];
  }
  /**
   * Adds a target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener, unless already added.
   * @param {IoNode} targetNode - Target node.
   * @param {string} targetProp - Target property.
   */
  addTarget(targetNode, targetProp) {
    const props = targetNode.__properties;
    if (props) {
      props[targetProp].binding = this;
      props[targetProp].value = this.source[this.sourceProp];
    }

    if (this.targets.indexOf(targetNode) === -1) this.targets.push(targetNode);
    if (this.targetProps.has(targetNode)) {
      const targetProps = this.targetProps.get(targetNode);
      if (targetProps.indexOf(targetProp) === -1) {
        targetProps.push(targetProp);
        targetNode.addEventListener(targetProp + '-changed', this._onTargetChanged);
      }
    } else {
      this.targetProps.set(targetNode, [targetProp]);
      targetNode.addEventListener(targetProp + '-changed', this._onTargetChanged);
    }
  }
  /**
   * Removes target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener.
   * If `targetProp` is not specified, it removes all target properties.
   * @param {IoNode} targetNode - Target node.
   * @param {string} targetProp - Target property.
   */
  removeTarget(targetNode, targetProp) {
    if (this.targetProps.has(targetNode)) {
      const targetProps = this.targetProps.get(targetNode);
      if (targetProp) {
        const index = targetProps.indexOf(targetProp);
        if (index !== -1) {
          targetProps.splice(index, 1);
        }
        targetNode.removeEventListener(targetProp + '-changed', this._onTargetChanged);
      } else {
        for (let i = targetProps.length; i--;) {
          targetNode.removeEventListener(targetProps[i] + '-changed', this._onTargetChanged);
        }
        targetProps.length = 0;
      }
      if (targetProps.length === 0) this.targets.splice(this.targets.indexOf(targetNode), 1);
    }
  }
  /**
   * Event handler that updates source property when one of the targets emits `[prop]-changed` event.
   * @param {Object} event - Event object.
   * @param {IoNode} event.target - Event target (source node that emitted the event).
   * @param {Object} event.detail - Event detail.
   * @param {*} event.detail.value - New value.
   */
  _onTargetChanged(event) {
    if (this.targets.indexOf(event.target) === -1) {
      console.error(
        `Io: _onTargetChanged() should never fire when target is removed from binding.
        Please file an issue at https://github.com/arodic/io/issues.`
      );
      return;
    }
    const oldValue = this.source[this.sourceProp];
    const value = event.detail.value;
    if (oldValue !== value) {
      // JavaScript is weird NaN != NaN
      if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) return;
      this.source[this.sourceProp] = value;
    }
  }
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[prop]-changed` event.
   * @param {Object} event - Event object.
   * @param {IoNode} event.target - Event target (source node that emitted the event).
   * @param {Object} event.detail - Event detail.
   * @param {*} event.detail.value - New value.
   */
  _onSourceChanged(event) {
    if (event.target != this.source) {
      console.error(
        `Io: _onSourceChanged() should always originate form source node.
        Please file an issue at https://github.com/arodic/io/issues.`
      );
      return;
    }
    const value = event.detail.value;
    for (let i = this.targets.length; i--;) {
      const targetProps = this.targetProps.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        const oldValue = this.targets[i][targetProps[j]];
        if (oldValue !== value) {
          // JavaScript is weird NaN != NaN
          if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) continue;
          this.targets[i][targetProps[j]] = value;
        }
      }
    }
  }
  /**
   * Dispose of the binding by removing all targets and listeners.
   * Use this when node is no longer needed.
   */
  dispose() {
    this.source.removeEventListener(this.sourceProp + '-changed', this._onSourceChanged);
    for (let t in this.targets) {
      this.removeTarget(this.targets[t]);
      delete this.targets[t];
    }
    delete this.source;
    delete this.sourceProp;
    delete this.targets;
    delete this.targetProps;
    delete this._onTargetChanged;
    delete this._onSourceChanged;
  }
}

/**
 * Manager for `IoNode` property bindings. It holds all bindings for a particular IoNode.
 */
class Bindings {
  /**
   * Creates binding manager with a node reference.
   * @param {IoNode} node - Reference to the node.
   */
  constructor(node) {
    Object.defineProperty(this, '__node', {value: node, configurable: true});
  }
  /**
   * Returns a binding to the specified property name or creates one if it does not exist.
   * @param {string} prop - property name.
   * @return {Binding} Property binding.
   */
  bind(prop) {
    this[prop] = this[prop] || new Binding(this.__node, prop);
    return this[prop];
  }
  /**
   * Disposes a binding for the specified property name.
   * @param {string} prop - property name.
   */
  unbind(prop) {
    if (this[prop]) this[prop].dispose();
    delete this[prop];
  }
  /**
   * Disposes all bindings. Use this when node is no longer needed.
   */
  dispose() {
    for (let prop in this) {
      this[prop].dispose();
      delete this[prop];
    }
    delete this.__node;
  }
}

/**
 * Property change queue manager responsible for dispatching change events and triggering change handler functions.
 */
class Queue {
  /**
   * Creates queue manager for the specified `IoNode` instance.
   * @param {IoNode} node - Reference to the owner node/element.
   */
  constructor(node) {
    Object.defineProperty(this, '__array', {value: new Array(), configurable: true});
    Object.defineProperty(this, '__node', {value: node, configurable: true});
  }
  /**
   * Adds property change to the queue by specifying property name, previous and the new value.
   * If the change is already in the queue, the new value is updated.
   * @param {string} prop - Property name.
   * @param {*} value Property value.
   * @param {*} oldValue Old property value.
   */
  queue(prop, value, oldValue) {
    const i = this.__array.indexOf(prop);
    if (i === -1) {
      this.__array.push(prop, {property: prop, value: value, oldValue: oldValue});
    } else {
      this.__array[i + 1].value = value;
    }
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue, it fires the `'[propName]-changed'` event with `oldValue` and new `value` in `event.detail` payload.
   * It also executes node's `[propName]Changed(payload)` change handler function if it is defined.
   */
  dispatch() {
    if (this._dispatchInProgress === true) return;
    this._dispatchInProgress = true;

    const node = this.__node;
    let changed = false;

    while (this.__array.length) {
      const j = this.__array.length - 2;
      const prop = this.__array[j];
      const detail = this.__array[j + 1];
      const payload = {detail: detail};

      if (detail.value !== detail.oldValue) {
        changed = true;
        if (node[prop + 'Changed']) node[prop + 'Changed'](payload);
        node.dispatchEvent(prop + '-changed', payload.detail);
      }
      this.__array.splice(j, 2);
    }

    if (changed) node.dispatchChange();

    this.__array.length = 0;
    this._dispatchInProgress = false;
  }
  /**
   * Clears the queue and removes the node reference.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.__array.length = 0;
    delete this.__node;
    delete this.__array;
  }
}

/**
 * Property configuration object for a class **prototype**.
 * It is generated from property definitions in `static get Properties()` return object.
 * @property {*} value - Default value.
 * @property {function} type - Constructor of value.
 * @property {number} reflect - Reflects to HTML attribute
 * @property {boolean} notify - Trigger change handlers and change events.
 * @property {boolean} observe - Observe object mutations for this property.
 * @property {boolean} enumerable - Makes property enumerable.
 * @property {Binding} binding - Binding object.
 */
class ProtoProperty {
  /**
   * Creates the property configuration object and sets the default values.
   * @param {ProtoProperty} prop - Configuration object.
   * @param {boolean} noDefaults - Assign default values.
   */
  constructor(prop, noDefaults) {

    if (!noDefaults) {
      this.value = undefined;
      this.type = undefined;
      this.notify = true;
      this.reflect = 0;
      this.observe = false;
      this.enumerable = true;
      this.binding = undefined;
    }

    if (prop === null) {

      this.value = null;

    } else if (typeof prop === 'function') {

      this.type = prop;

      if (!noDefaults) {
        if (this.type === Boolean) this.value = false;
        else if (this.type === String) this.value = '';
        else if (this.type === Number) this.value = 0;
        else if (this.type === Object) this.value = {};
        else if (this.type === Array) this.value = [];
      }

    } else if (typeof prop === 'number' || typeof prop === 'string' || typeof prop === 'boolean') {

      this.value = prop;
      this.type = prop.constructor;

    } else if (typeof prop === 'object') {

      if (prop instanceof Array) {

        this.value = [...prop];
        this.type = Array;
        
      } else if (prop instanceof Binding) {
        
        this.value = prop.value;
        this.binding = prop;

      } else {

        if (typeof prop.type !== 'function' && prop.value && prop.value.constructor) {
          prop.type = prop.value.constructor;
        }

        if (prop && prop.value !== undefined) {
          if (prop.value instanceof Array) {
            this.value = [...prop.value];
          } else if (prop.value && typeof prop.value === 'object') {
            this.value = new prop.value.constructor();
          } else {
            this.value = prop.value;
          }
        }

        if (typeof prop.type === 'function') {
          this.type = prop.type;
          if (this.value === undefined) {
            if (prop.type === Boolean) this.value = false;
            else if (prop.type === String) this.value = '';
            else if (prop.type === Number) this.value = 0;
            else if (prop.type === Object) this.value = {};
            else if (prop.type === Array) this.value = [];
            else if (prop.type !== HTMLElement && prop.type !== Function) {
              this.value = new prop.type();
            }
          }
        }

      }
      
    }

    prop = prop || {};

    if (typeof prop.notify == 'boolean') this.notify = prop.notify;
    if (typeof prop.reflect == 'number') this.reflect = prop.reflect;
    if (typeof prop.observe == 'boolean') this.observe = prop.observe;
    if (typeof prop.enumerable == 'boolean') this.enumerable = prop.enumerable;
    if (prop.binding instanceof Binding) {
      this.binding = prop.binding;
      this.value = prop.binding.value;
    }

    return this;
  }
}

/**
 * Collection of all property configurations for a class **prototype**.
 * Property configurations are inferred from all property definitions in the prototype chain.
 */
class ProtoProperties {
  /**
   * Creates all property configurations for specified prototype chain.
   * @param {ProtoChain} protochain - Prototype chain.
   */
  constructor(protochain) {
    for (let i = protochain.length; i--;) {
      const props = protochain[i].constructor.Properties;
      for (let p in props) {
        if (!this[p]) this[p] = new ProtoProperty(props[p]);
        else Object.assign(this[p], new ProtoProperty(props[p], true));
        if (p.charAt(0) === '_') {
          this[p].notify = false;
          this[p].enumerable = false;
        }
      }
    }
  }
}

/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `ProtoProperty`.
 * @property {*} value - Property value.
 * @property {function} type - Constructor of the property value.
 * @property {number} reflect - HTML attribute [-1, 0, 1 or 2]
 * @property {boolean} notify - Enables change handlers and events.
 * @property {boolean} observe - Observe object mutations for this property.
 * @property {boolean} enumerable - Makes property enumerable.
 * @property {Binding} binding - Binding object.
 */
class Property {
  /**
   * Creates the property configuration object and copies values from `ProtoProperty`.
   * @param {ProtoProperty} protoProp - ProtoProperty.
   */
  constructor(protoProp) {
    this.value = protoProp.value;
    this.notify = protoProp.notify;
    this.reflect = protoProp.reflect;
    this.observe = protoProp.observe;
    this.enumerable = protoProp.enumerable;
    this.type = protoProp.type;
    this.binding = protoProp.binding;
    if (this.type === Array && this.value instanceof Array) {
      this.value = [...this.value];
    }
    if (this.type === Object && this.value) {
      this.value = {};
    }
    if (this.value === undefined && this.type) {
      if (this.type === Boolean) this.value = false;
      else if (this.type === String) this.value = '';
      else if (this.type === Number) this.value = 0;
      else if (this.type === Array) this.value = [];
      else if (this.type === Object) this.value = {};
    }
    if (this.value === undefined && this.type) {
      if (this.type !== HTMLElement && this.type !== Function) {
        this.value = new this.type();
      }
    }
  }
}

/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
class Properties {
  /**
   * Creates the properties for specified `IoNode`.
   * @param {IoNode} node - Owner instance of `IoNode`.
   * @param {ProtoProperties} protoProps - Configuration object.
   */
  constructor(node, protoProps) {
    Object.defineProperty(this, '__node', {value: node, configurable: true});
    for (let prop in protoProps) {
      Object.defineProperty(this, prop, {
        value: new Property(protoProps[prop]),
        enumerable: protoProps[prop].enumerable,
        configurable: true
      });
      const value = this[prop].value;
      if (value !== undefined && value !== null) {
        // TODO: document special handling of object and node values
        if (typeof value === 'object') {
          node.queue(prop, value, undefined);
          if (value.__isIoNode && node.__isConnected) value.connect(node);
        } else if (this[prop].reflect >= 1 && node.__isIoElement) {
          node.setAttribute(prop, value);
        }
      }
      const binding = this[prop].binding;
      if (binding) binding.addTarget(node, prop);
    }
    Object.defineProperty(this, '__keys', {value: Object.getOwnPropertyNames(this), configurable: true});
  }
  /**
   * Returns the property value.
   * @param {string} key - property name.
   * @return {*} Property value.
   */
  get(key) {
    return this[key].value;
  }
  /**
   * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
   * @param {string} key - property name.
   * @param {*} value - property value or binding.
   * @param {boolean} skipDispatch - Skips queue dispatch if `true`.
   */
  set(key, value, skipDispatch) {

    const prop = this[key];
    const oldValue = prop.value;

    if (value !== oldValue) {

      const node = this.__node;
      const binding = (value instanceof Binding) ? value : undefined;

      if (binding) {

        const oldBinding = prop.binding;
        if (oldBinding && binding !== oldBinding) {
          oldBinding.removeTarget(node, key);
        }

        binding.addTarget(node, key);
        value = binding.source[binding.sourceProp];

      } else {

        prop.value = value;

      }

      if (value && value.__isIoNode) value.connect(node);
      if (oldValue && oldValue.__isIoNode) oldValue.disconnect(node);

      if (prop.notify && oldValue !== value) {
        node.queue(key, value, oldValue);
        if (node.__isConnected && !skipDispatch) {
          node.queueDispatch();
        }
      }

      if (prop.reflect >= 1 && node.__isIoElement) node.setAttribute(key, value);
    }

  }
  /**
   * Connects all property bindings and `IoNode` properties.
   */
  connect() {
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      if (this[p].binding) {
        this[p].binding.addTarget(this.__node, p);
      }
      if (this[p].value && this[p].value.__isIoNode) {
        this[p].value.connect(this.__node);
      }
    }
  }
  /**
   * Disconnects all property bindings and `IoNode` properties.
   */
  disconnect() {
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      if (this[p].binding) {
        this[p].binding.removeTarget(this.__node, p);
      }
      if (this[p].value && this[p].value.__isIoNode) {
        this[p].value.disconnect(this.__node);
      }
    }
  }
  /**
   * Disconnects all property bindings and `IoNode` properties.
   * Use this when properties are no loner needed.
   */
  dispose() {
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      if (this[p].binding) {
        this[p].binding.removeTarget(this.__node, p);
        delete this[p].binding;
      }
      delete this[p];
    }
    delete this['__node'];
    delete this['__keys'];
  }
}

/**
 * Collection of all listeners defined in the prototype chain.
 */
class ProtoListeners {
  /**
   * Creates a collection of all listeners from protochain.
   * @param {ProtoChain} protochain - Array of protochain constructors.
   */
  constructor(protochain) {
    for (let i = protochain.length; i--;) {
      const prop = protochain[i].constructor.Listeners;
      for (let j in prop) this[j] = prop[j];
    }
  }
}

/**
 * Manager of listeners for a class **instance**.
 */
class Listeners {
  /**
   * Creates manager for listener.
   * @param {IoNode} node - Reference to the node/element itself.
   * @param {ProtoListeners} protoListeners - Collection of all listeners defined in the protochain.
   */
  constructor(node, protoListeners) {
    Object.defineProperty(this, 'node', {value: node});
    Object.defineProperty(this, 'propListeners', {value: {}});
    Object.defineProperty(this, 'activeListeners', {value: {}});
    Object.defineProperty(this, '__isConnected', {writable: true});
    for (let prop in protoListeners) this[prop] = protoListeners[prop];
  }
  /**
   * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
   * @param {Object} props - Properties.
   */
  setPropListeners(props) {
    // TODO: Unset propListeners, test.
    const listeners = this.propListeners;
    const node = this.node;
    const newListeners = {};
    for (let l in props) {
      if (l.startsWith('on-')) newListeners[l.slice(3, l.length)] = props[l];
    }
    for (let l in newListeners) {
      if (listeners[l]) {
        if (listeners[l] instanceof Array) {
          const listener = typeof listeners[l][0] === 'function' ? listeners[l][0] : node[listeners[l][0]];
          node.removeEventListener(l, listener, listeners[l][1]);
        } else {
          const listener = typeof listeners[l] === 'function' ? listeners[l] : node[listeners[l]];
          node.removeEventListener(l, listener);
        }
      }
      listeners[l] = newListeners[l];
      if (this.__isConnected) {
        if (newListeners[l] instanceof Array) {
          const listener = typeof newListeners[l][0] === 'function' ? newListeners[l][0] : node[newListeners[l][0]];
          node.addEventListener(l, listener, newListeners[l][1]);
        } else {
          const listener = typeof newListeners[l] === 'function' ? newListeners[l] : node[newListeners[l]];
          node.addEventListener(l, listener);
        }
      }
    }
  }
  /**
   * Connects all event listeners.
   */
  connect() {
    this.__isConnected = true;
    const node = this.node;
    const listeners = this.propListeners;
    for (let l in this) {
      if (this[l] instanceof Array) {
        this.addEventListener(l, node[this[l][0]], this[l][1]);
      } else {
        this.addEventListener(l, node[this[l]]);
      }
    }
    for (let l in listeners) {
      if (listeners[l] instanceof Array) {
        const listener = typeof listeners[l][0] === 'function' ? listeners[l][0] : node[listeners[l][0]];
        this.addEventListener(l, listener, listeners[l][1]);
      } else {
        const listener = typeof listeners[l] === 'function' ? listeners[l] : node[listeners[l]];
        this.addEventListener(l, listener);
      }
    }
  }
  /**
   * Disconnects all event listeners.
   */
  disconnect() {
    this.__isConnected = false;
    const node = this.node;
    const listeners = this.propListeners;
    for (let l in this) {
      if (this[l] instanceof Array) {
        this.removeEventListener(l, node[this[l][0]], this[l][1]);
      } else {
        this.removeEventListener(l, node[this[l]]);
      }
    }
    for (let l in listeners) {
      if (listeners[l] instanceof Array) {
        const listener = typeof listeners[l][0] === 'function' ? listeners[l][0] : node[listeners[l][0]];
        this.removeEventListener(l, listener, listeners[l][1]);
      } else {
        const listener = typeof listeners[l] === 'function' ? listeners[l] : node[listeners[l]];
        this.removeEventListener(l, listener);
      }
    }
  }
  /**
   * Disconnects all event listeners and removes all references.
   * Use this when node is no longer needed.
   */
  dispose() {
    // TODO: test
    this.disconnect();
    const active = this.activeListeners;
    for (let i in active) {
      for (let j = active[i].length; j--;) {
        if (this.node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.node, i, active[i][j]);
        active[i].splice(j, 1);
      }
    }
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener.
   * @param {string} type - event name to listen to.
   * @param {function} listener - event handler function.
   * @param {Object} options - event listener options.
   */
  addEventListener(type, listener, options) {
    const active = this.activeListeners;
    active[type] = active[type] || [];
    const i = active[type].indexOf(listener);
    if (i === -1) {
      if (this.node.__isIoElement) HTMLElement.prototype.addEventListener.call(this.node, type, listener, options);
      active[type].push(listener);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener.
   * @param {string} type - event name to listen to.
   * @param {function} listener - event handler function.
   * @param {Object} options - event listener options.
   */
  removeEventListener(type, listener, options) {
    const active = this.activeListeners;
    if (active[type] !== undefined) {
      const i = active[type].indexOf(listener);
      if (i !== - 1 || listener === undefined) {
        if (this.node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.node, type, listener, options);
        active[type].splice(i, 1);
      }
    }
  }
  /**
   * Shorthand for custom event dispatch.
   * @param {string} type - event name to dispatch.
   * @param {Object} detail - event detail.
   * @param {boolean} bubbles - event bubbles.
   * @param {HTMLElement|IoNode} src source node/element to dispatch event from.
   */
  dispatchEvent(type, detail = {}, bubbles = true, src = this.node) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {type: type, detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      const active = this.activeListeners;
      if (active[type] !== undefined) {
        const array = active[type].slice(0);
        for (let i = 0; i < array.length; i ++) {
          array[i].call(src, {detail: detail, target: src, path: [src]});
          // TODO: consider bubbling.
        }
      }
    }
  }
}

/**
 * Core mixin for `IoNode` classes.
 * @param {function} superclass - Class to extend.
 * @return {function} - Extended class constructor with `IoNodeMixin` applied to it.
 */
const IoNodeMixin = (superclass) => {
  const classConstructor = class extends superclass {
    static get Properties() {
      return {
        lazy: Boolean,
      };
    }
    /**
     * Creates `IoNode` instance and initializes internals.
     * @param {Object} initProps - Property values to inialize instance with.
     */
    constructor(initProps = {}) {
      super(initProps);


      const constructor = this.__proto__.constructor;
      if (constructor.__isRegisteredAs !== constructor.name) {
        console.error(`${constructor.name}: Not registered! Call "Register()" before using ${constructor.name} class!`);
      }

      this.__protoFunctions.bind(this);

      Object.defineProperty(this, '__bindings', {value: new Bindings(this)});
      Object.defineProperty(this, '__queue', {value: new Queue(this)});

      Object.defineProperty(this, '__listeners', {value: new Listeners(this, this.__protoListeners)});

      Object.defineProperty(this, '__isConnected', {enumerable: false, writable: true});
      Object.defineProperty(this, '__connections', {enumerable: false, value: []});

      Object.defineProperty(this, '__properties', {value: new Properties(this, this.__protoProperties)});

      this.objectMutated = this.objectMutated.bind(this);
      this.objectMutatedThrottled = this.objectMutatedThrottled.bind(this);
      this.queueDispatchLazy = this.queueDispatchLazy.bind(this);

      this.setProperties(initProps);
      // TODO: consider auto-connect
    }
    /**
     * Connects IoNode to the application.
     * @param {IoNode} owner - Node to connect to.
     */
    connect(owner) {
      if (this.__connections.indexOf(owner) === -1) {
        this.__connections.push(owner);
        if (!this.__isConnected) this.connectedCallback();
      }
    }
    /**
     * Disconnects IoNode from the application.
     * @param {IoNode} owner - Node to disconnect from.
     */
    disconnect(owner) {
      if (this.__connections.indexOf(owner) !== -1) {
        this.__connections.splice(this.__connections.indexOf(owner), 1);
      }
      if (this.__connections.length === 0) {// && this.__isConnected) {
        this.disconnectedCallback();
      }
    }
    /**
     * Handler function with `event.preventDefault()`.
     * @param {Object} event - Event object.
     */
    preventDefault(event) {
      event.preventDefault();
    }
    /**
     * Handler function with `event.stopPropagation()`.
     * @param {Object} event - Event object.
     */
    stopPropagation(event) {
      event.stopPropagation();
    }
    /**
     * default change handler.
     */
    changed() {}
    /**
     * Applies compose object on change.
     */
    applyCompose() {
      // TODO: Test and documentation.
      const compose = this.compose;
      if (compose) {
        for (let prop in compose) {
          this[prop].setProperties(compose[prop]);
        }
      }
    }
    dispatchChange() {
      this.applyCompose();
      this.changed();
      if (this.setAria) this.setAria();
    }
    /**
     * Returns a binding to a specified property`.
     * @param {string} prop - Property to bind to.
     * @return {Binding} Binding object.
     */
    bind(prop) {
      return this.__bindings.bind(prop);
    }
    /**
     * Unbinds a binding to a specified property`.
     * @param {string} prop - Property to unbind.
     */
    unbind(prop) {
      this.__bindings.unbind(prop);
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
    set(prop, value, force) {
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
    setProperties(props) {
      for (let p in props) {
        if (this.__properties[p] === undefined) continue;
        this.__properties.set(p, props[p], true);
      }
      this.__listeners.setPropListeners(props, this);
      if (this.__isConnected) this.queueDispatch();
    }
    objectMutated(event) {
      for (let i = this.__observedProps.length; i--;) {
        const prop = this.__observedProps[i];
        const value = this.__properties[prop].value;
        if (value === event.detail.object) {
          this.throttle(this.objectMutatedThrottled, prop);
          return;
        } else if (event.detail.objects && event.detail.objects.indexOf(value) !== -1) {
          this.throttle(this.objectMutatedThrottled, prop);
          return;
        }
      }
    }
    /**
     * This function is called when `object-mutated` event is observed
     * and changed object is a property of the node.
     * @param {string} prop - Mutated object property name.
     */
    objectMutatedThrottled(prop) {
      if (this['propMutated']) this['propMutated'](prop);
      if (this[prop + 'Mutated']) this[prop + 'Mutated']();
      this.dispatchChange();
    }
    /**
     * Callback when `IoNode` is connected.
     */
    connectedCallback() {
      this.__listeners.connect();
      this.__properties.connect();
      this.__isConnected = true;
      if (this.__observedProps.length) {
        window.addEventListener('object-mutated', this.objectMutated);
      }
      this.queueDispatch();
    }
    /**
     * Callback when `IoNode` is disconnected.
     */
    disconnectedCallback() {
      this.__listeners.disconnect();
      this.__properties.disconnect();
      this.__isConnected = false;
      if (this.__observedProps.length) {
        window.removeEventListener('object-mutated', this.objectMutated);
      }
    }
    /**
     * Disposes all internals.
     * Use this when node is no longer needed.
     */
    dispose() {
      this.__queue.dispose();
      this.__bindings.dispose();
      this.__listeners.dispose();
      this.__properties.dispose();
    }
    /**
     * Wrapper for addEventListener.
     * @param {string} type - listener name.
     * @param {function} listener - listener handler.
     * @param {Object} options - event listener options.
     */
    addEventListener(type, listener, options) {
      if (typeof listener !== 'function') {
        console.warn(`Io ${this.constructor.name} "${type}" listener handler is not a function`);
        return;
      }
      this.__listeners.addEventListener(type, listener, options);
    }
    /**
     * Wrapper for removeEventListener.
     * @param {string} type - event name to listen to.
     * @param {function} listener - listener handler.
     * @param {Object} options - event listener options.
     */
    removeEventListener(type, listener, options) {
      this.__listeners.removeEventListener(type, listener, options);
    }
    /**
     * Wrapper for dispatchEvent.
     * @param {string} type - event name to dispatch.
     * @param {Object} detail - event detail.
     * @param {boolean} bubbles - event bubbles.
     * @param {HTMLElement|IoNode} src source node/element to dispatch event from.
     */
    dispatchEvent(type, detail, bubbles = false, src) {
      this.__listeners.dispatchEvent(type, detail, bubbles, src);
    }
    /**
     * Adds property change to the queue.
     * @param {string} prop - Property name.
     * @param {*} value - Property value.
     * @param {*} oldValue - Old property value.
     */
    queue(prop, value, oldValue) {
      this.__queue.queue(prop, value, oldValue);
    }
    /**
     * Dispatches the queue.
     */
    queueDispatch() {
      if (this.lazy) {
        preThrottleQueue.push(this.queueDispatchLazy);
        this.throttle(this.queueDispatchLazy);
      } else {
        this.__queue.dispatch();
      }
    }
    queueDispatchLazy() {
      this.__queue.dispatch();
    }
    /**
     * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
     * @param {function} func - Function to throttle.
     * @param {*} arg - argument for throttled function.
     * @param {boolean} asynchronous - execute with timeout.
     */
    throttle(func, arg, asynchronous) {
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
    requestAnimationFrameOnce(func) {
      requestAnimationFrameOnce(func);
    }
    filterObject(object, predicate, _depth = 5, _chain = [], _i = 0) {
      if (_chain.indexOf(object) !== -1) return; _chain.push(object);
      if (_i > _depth) return; _i++;
      if (predicate(object)) return object;
      for (let key in object) {
        const value = object[key] instanceof Binding ? object[key].value : object[key];
        if (predicate(value)) return value;
        if (typeof value === 'object') {
          const subvalue = this.filterObject(value, predicate, _depth, _chain, _i);
          if (subvalue) return subvalue;
        }
      }
    }
    filterObjects(object, predicate, _depth = 5, _chain = [], _i = 0) {
      const result = [];
      if (_chain.indexOf(object) !== -1) return result; _chain.push(object);
      if (_i > _depth) return result; _i++;
      if (predicate(object) && result.indexOf(object) === -1) result.push(object);
      for (let key in object) {
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
    import(path) {
      const importPath = new URL(path, window.location).href;
      return new Promise(resolve => {
        if (!path || IMPORTED_PATHS[importPath]) {
          resolve(importPath);
        } else {
          import(importPath)
          .then(() => {
            IMPORTED_PATHS[importPath] = true;
            resolve(importPath);
          });
        }
      });
    }
  };
  classConstructor.Register = Register;
  return classConstructor;
};

/**
 * Register function to be called once per class.
 */
const Register = function () {
  const protochain = new ProtoChain(this.prototype);
  let proto = this.prototype;
  
  Object.defineProperty(proto, '__isIoNode', {value: true});
  Object.defineProperty(proto.constructor, '__isRegisteredAs', {value: proto.constructor.name});  

  Object.defineProperty(proto, '__protochain', {value: protochain});

  Object.defineProperty(proto, '__protoFunctions', {value: new ProtoFunctions(protochain)});
  Object.defineProperty(proto, '__protoProperties', {value: new ProtoProperties(protochain)});
  Object.defineProperty(proto, '__protoListeners', {value: new ProtoListeners(protochain)});

  Object.defineProperty(proto, '__observedProps', {value: []});
  for (let p in proto.__protoProperties) {
    if (proto.__protoProperties[p].observe) proto.__observedProps.push(p);
  }

  for (let p in proto.__protoProperties) {
    Object.defineProperty(proto, p, {
      get: function() { return this.__properties.get(p); },
      set: function(value) { this.__properties.set(p, value); },
      enumerable: !!proto.__protoProperties[p].enumerable,
      configurable: true,
    });
  }
};

IoNodeMixin.Register = Register;

/**
 * IoNodeMixin applied to `Object` class.
 */
class IoNode extends IoNodeMixin(Object) {}

IoNode.Register();

const IMPORTED_PATHS = {};

// TODO: document and test
const preThrottleQueue = new Array();
const throttleQueue = new Array();
const argQueue = new WeakMap();
//
const funcQueue = new Array();

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

function requestAnimationFrameOnce(func) {
  if (funcQueue.indexOf(func) === -1) funcQueue.push(func);
}

/** @license
 * MIT License
 *
 * Copyright (c) 2019 Luke Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const isString = x => typeof x === 'string';
const isArray = Array.isArray;
const isObject = x => typeof x === 'object' && !isArray(x);

const clense = (a, b) => !b ? a : isString(b[0]) ? [...a, b] : [...a, ...b];

const buildTree = () => node => !!node && isObject(node[1]) ? {
   ['name']: node[0],
   ['props']: node[1],
   ['children']: isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2]
 } : buildTree()([node[0], {}, node[1]]);

/**
 * Core `IoElement` class.
 */
class IoElement extends IoNodeMixin(HTMLElement) {
  static get Style() {
    return /* css */`
    :host[hidden] {
      display: none;
    }
    :host[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
    `;
  }
  static get Properties() {
    return {
      $: {
        type: Object,
        notify: false,
      },
      tabindex: {
        type: String,
        reflect: 1,
      },
      contenteditable: {
        type: Boolean,
        reflect: 1,
      },
      class: {
        type: String,
        reflect: 1,
      },
      role: {
        type: String,
        reflect: 1,
      },
      label: {
        type: String,
        reflect: 1,
      },
      id: {
        type: String,
        reflect: -1,
      },
      hidden: {
        type: Boolean,
        reflect: 1,
      },
      disabled: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  static get Listeners() {
    return {
      'focus-to': '_onFocusTo',
    };
  }
  static get observedAttributes() {
    const observed = [];
    for (let prop in this.prototype.__protoProperties) {
      const r  = this.prototype.__protoProperties[prop].reflect;
      if (r === -1 || r === 2) {
        observed.push(prop);
      }
    }
    return observed;
  }
  attributeChangedCallback(prop, oldValue, newValue) {
    const type = this.__properties[prop].type;
    if (type === Boolean) {
      if (newValue === null) this[prop] = false;
      else if (newValue === '') this[prop] = true;
    } else if (type === Number || type === String) {
      this[prop] = type(newValue);
    } else if (type === Object || type === Array) {
      this[prop] = JSON.parse(newValue);
    } else {
      this[prop] = isNaN(Number(newValue)) ? newValue : Number(newValue);
    }
  }
  /**
   * Add resize listener if `onResized()` is defined in subclass.
   */
  connectedCallback() {
    super.connectedCallback();
    if (typeof this.onResized === 'function') {
      if (ro) {
        ro.observe(this);
      } else {
        // TODO: remove once resize observer implemented in Safari.
        // https://caniuse.com/#feat=resizeobserver
        window.addEventListener('resize', this.onResized);
        setTimeout(() => { this.onResized(); });
      }
    }
  }
  /**
   * Removes resize listener if `onResized()` is defined in subclass.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof this.onResized === 'function') {
      if (ro) {
        ro.unobserve(this);
      } else {
        // TODO: remove once resize observer implemented in Safari.
        // https://caniuse.com/#feat=resizeobserver
        window.removeEventListener('resize', this.onResized);
      }
    }
  }
  /**
    * Renders DOM from virtual DOM arrays.
    * @param {Array} vDOM - Array of vDOM children.
    * @param {HTMLElement} [host] - Optional template target.
    */
  template(vDOM, host) {
    const vChildren = buildTree()(['root', vDOM]).children;
    host = host || this;
    if (host === this) this.__properties.$.value = {};
    this.traverse(vChildren, host);
  }
  /**
   * Recurively traverses vDOM.
   * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
   * @param {HTMLElement} [host] - Optional template target.
    */
  traverse(vChildren, host) {
    const children = host.children;
    // focusBacktrack = new WeakMap();
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1];
      host.removeChild(child);
      // TODO: enable and test!
      // const nodes = Array.from(child.querySelectorAll('*'));
      // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
      // if (child.dispose) child.dispose();
    }
    // create new elements after existing
    if (children.length < vChildren.length) {
      const frag = document.createDocumentFragment();
      for (let i = children.length; i < vChildren.length; i++) {
        const element = constructElement(vChildren[i]);
        frag.appendChild(element);
      }
      host.appendChild(frag);
    }
    // replace existing elements
    for (let i = 0; i < children.length; i++) {
      if (children[i].localName !== vChildren[i].name) {
        const oldElement = children[i];
        const element = constructElement(vChildren[i]);
        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);
        // TODO: enable and test!
        // const nodes = Array.from(oldElement.querySelectorAll('*'));
        // for (let i = nodes.length; i--;) if (nodes[i].dispose) nodes[i].dispose();
        // if (oldElement.dispose) oldElement.dispose();
      // update existing elements
      } else {
        children[i].removeAttribute('className');
        if (children[i].__isIoElement) {
          // Set IoElement element properties
          // TODO: Test property and listeners reset. Consider optimizing.
          children[i].setProperties(vChildren[i].props);
        } else {
          // Set native HTML element properties
          setNativeElementProps(children[i], vChildren[i].props);
        }
      }
    }
    for (let i = 0; i < vChildren.length; i++) {
      // Update this.$ map of ids.
      if (vChildren[i].props.id) this.$[vChildren[i].props.id] = children[i];
      if (vChildren[i].children !== undefined) {
        if (typeof vChildren[i].children === 'string') {
          // Set textNode value.
          if (!children[i].__isIoElement) {
            this.flattenTextNode(children[i]);
            children[i]._textNode.nodeValue = String(vChildren[i].children);
          } else {
            console.log(children[i], children[i].__isIoElement, vChildren[i]);
          }
        } else if (typeof vChildren[i].children === 'object') {
          // Traverse deeper.
          this.traverse(vChildren[i].children, children[i]);
        }
      }
    }
  }
  /**
   * Helper function to flatten textContent into a single TextNode.
   * Update textContent via TextNode is better for layout performance.
   * @param {HTMLElement} element - Element to flatten.
   */
  flattenTextNode(element) {
    if (element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(''));
    }
    if (element.childNodes[0].nodeName !== '#text') {
      element.innerHTML = '';
      element.appendChild(document.createTextNode(''));
    }
    element._textNode = element.childNodes[0];
    if (element.childNodes.length > 1) {
      const textContent = element.textContent;
      for (let i = element.childNodes.length; i--;) {
        if (i !== 0) element.removeChild(element.childNodes[i]);
      }
      element._textNode.nodeValue = textContent;
    }
  }
  get textNode() {
    this.flattenTextNode(this);
    return this._textNode.nodeValue;
  }
  set textNode(value) {
    this.flattenTextNode(this);
    this._textNode.nodeValue = String(value);
  }
  setProperties(props) {
    super.setProperties(props);
    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
      }
    }
  }
  /**
   * Alias for HTMLElement setAttribute where falsey values remove the attribute.
   * @param {string} attr - Attribute name.
   * @param {*} value - Attribute value.
   */
  setAttribute(attr, value) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value === 'string' || typeof value === 'number') {
      if (this.getAttribute(attr) !== String(value)) HTMLElement.prototype.setAttribute.call(this, attr, value);
    }
  }
  /**
   * Sets aria attributes.
   */
  setAria() {
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    } else {
      this.removeAttribute('aria-label');
    }
    if (this.disabled) {
      this.setAttribute('aria-disabled', true);
    } else {
      this.removeAttribute('aria-disabled');
    }
  }
  _onFocusTo(event) {
    const src = event.composedPath()[0];
    const dir = event.detail.dir;
    const rect = event.detail.rect;
    rect.center = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};

    if (src !== this) {
      let closest = src;
      let closestX = Infinity;
      let closestY = Infinity;

      // TODO: improve backtracking
      // const backtrack = focusBacktrack.get(src);
      // if (backtrack && backtrack[dir]) {
      //   backtrack[dir].focus();
      //   setBacktrack(backtrack[dir], dir, src);
      //   return;
      // }

      const siblings = this.querySelectorAll('[tabindex="0"]:not([disabled])');

      for (let i = siblings.length; i--;) {

        if (!siblings[i].offsetParent) {
          continue;
        }
        // TODO: unhack
        const sStyle = window.getComputedStyle(siblings[i]);
        if (sStyle.visibility !== 'visible') {
          continue;
        }

        const sRect = siblings[i].getBoundingClientRect();
        sRect.center = {x: sRect.x + sRect.width / 2, y: sRect.y + sRect.height / 2};

        // TODO: improve automatic direction routing.
        switch (dir) {
          case 'right': {
            if (sRect.left >= (rect.right - 1)) {
              const distX = Math.abs(sRect.left - rect.right);
              const distY = Math.abs(sRect.center.y - rect.center.y);
              if (distX < closestX || distY < closestY / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distX === closestX && distY < closestY) {
                closest = siblings[i];
                closestY = distY;
              }
            }
            break;
          }
          case 'left': {
            if (sRect.right <= (rect.left + 1)) {
              const distX = Math.abs(sRect.right - rect.left);
              const distY = Math.abs(sRect.center.y - rect.center.y);
              if (distX < closestX || distY < closestY / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distX === closestX && distY < closestY) {
                closest = siblings[i];
                closestY = distY;
              }
            }
            break;
          }
          case 'down': {
            if (sRect.top >= (rect.bottom - 1)) {
              const distX = Math.abs(sRect.center.x - rect.center.x);
              const distY = Math.abs(sRect.top - rect.bottom);
              if (distY < closestY || distX < closestX / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distY === closestY && distX < closestX) {
                closest = siblings[i];
                closestX = distX;
              }
            }
            break;
          }
          case 'up':{
            if (sRect.bottom <= (rect.top + 1)) {
              const distX = Math.abs(sRect.center.x - rect.center.x);
              const distY = Math.abs(sRect.bottom - rect.top);
              if (distY < closestY || distX < closestX / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distY === closestY && distX < closestX) {
                closest = siblings[i];
                closestX = distX;
              }
            }
            break;
          }
        }
      }

      if (closest !== src) {
        closest.focus();
        // setBacktrack(closest, dir, src);
        event.stopPropagation();
      }
    }
  }
  focusTo(dir) {
    const rect = this.getBoundingClientRect();
    this.dispatchEvent('focus-to', {dir: dir, rect: rect}, true);
  }
}

// let focusBacktrack = new WeakMap();
// const backtrackDir = {'left': 'right', 'right': 'left', 'down': 'up', 'up': 'down'};
// function setBacktrack(element, dir, target) {
//   const backtrack = focusBacktrack.get(element) || {};
//   backtrack[backtrackDir[dir]] = target;
//   focusBacktrack.set(element, backtrack);
// }

const warning = document.createElement('div');
warning.innerHTML = `
No support for custom elements detected! <br />
Sorry, modern browser is required to view this page.<br />
Please try <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>,
<a href="https://www.google.com/chrome/">Chrome</a> or
<a href="https://www.apple.com/lae/safari/">Safari</a>`;

/**
 * Register function for `IoElement`. Registers custom element.
 */
IoElement.Register = function() {
  IoNodeMixin.Register.call(this);
  
  const localName = this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  Object.defineProperty(this, 'localName', {value: localName});
  Object.defineProperty(this.prototype, 'localName', {value: localName});

  Object.defineProperty(this, '__isIoElement', {value: true});
  Object.defineProperty(this.prototype, '__isIoElement', {value: true});

  if (window.customElements !== undefined) {
    window.customElements.define(localName, this);
  } else {
    document.body.insertBefore(warning, document.body.children[0]);
    return;
  }

  _initProtoStyle(this.prototype.__protochain);
};

let ro;
if (window.ResizeObserver !== undefined) {
  ro = new ResizeObserver(entries => {
    for (let entry of entries) entry.target.onResized();
  });
}

/**
 * Creates an element from a virtual dom object.
 * @param {Object} vDOMNode - Virtual dom object.
 * @param {string} vDOMNode.name - Element tag.
 * @param {Object} vDOMNode.props - Element properties.
 * @return {HTMLElement} - Created element.
 */
const constructElement = function(vDOMNode) {
  // IoElement classes constructed with constructor.
  const ConstructorClass = window.customElements ? window.customElements.get(vDOMNode.name) : null;
  if (ConstructorClass && ConstructorClass.__isIoElement) return new ConstructorClass(vDOMNode.props);

  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMNode.name);
  setNativeElementProps(element, vDOMNode.props);
  return element;
};

const superCreateElement = document.createElement;
document.createElement = function() {
  const tag = arguments[0];
  if (tag.startsWith('io-')) {
    const constructor = customElements.get(tag);
    if (constructor) {
      return new constructor();
    } else {
      return superCreateElement.apply(this, arguments);
    }
  } else  {
    return superCreateElement.apply(this, arguments);
  }
};

/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
const setNativeElementProps = function(element, props) {
  for (let p in props) {
    const prop = props[p];
    if (p.startsWith('@')) {
      element.setAttribute(p.substr(1), prop);
    } else if (p === 'style') for (let s in prop) element.style.setProperty(s, prop[s]);
    else if (p === 'class') element['className'] = prop;
    else if (p !== 'id') element[p] = prop;
    if (p === 'name') element.setAttribute('name', prop); // TODO: Reconsider
  }
  if (!element.__listeners) {
    Object.defineProperty(element, '__listeners', {value: new Listeners(element)});
    element.__listeners.connect();
  }
  element.__listeners.setPropListeners(props, element);
};

const mixinDB = {};

const commentsRegex =  new RegExp('(\\/\\*[\\s\\S]*?\\*\\/)', 'gi');
const keyframeRegex =  new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mediaQueryRegex =  new RegExp('((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mixinRegex = new RegExp('((--[\\s\\S]*?): {([\\s\\S]*?)})', 'gi');
const applyRegex = new RegExp('(@apply\\s.*?;)', 'gi');
const cssRegex =  new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi');

// Creates a `<style>` element for all `static get Style()` return strings.
function _initProtoStyle(prototypes) {
  const localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const styleID = 'io-style-' + localName.replace('io-', '');

  let finalStyleString = '';

  // Convert mixins to classes
  let styleString = prototypes[0].constructor.Style;

  if (styleString) {
    const mixins = styleString.match(mixinRegex);
    if (mixins) {
      for (let i = 0; i < mixins.length; i++) {
        const m = mixins[i].split(': {');
        const name = m[0];
        const value = m[1].replace(/}/g, '').trim().replace(/^ +/gm, '');
        mixinDB[name] = value;
        finalStyleString += mixins[i].replace('--', '.').replace(': {', ' {');
      }
    }

    for (let i = prototypes.length; i--;) {
      let styleString = prototypes[i].constructor.Style;
      if (styleString) {
        // Remove mixins
        styleString = styleString.replace(mixinRegex, '');

        // Apply mixins
        const apply = styleString.match(applyRegex);
        if (apply) {
          for (let i = 0; i < apply.length; i++) {
            const name = apply[i].split('@apply ')[1].replace(';', '');
            if (mixinDB[name]) {
              styleString = styleString.replace(apply[i], mixinDB[name]);
            } else {
              console.warn('IoElement: cound not find mixin:', name);
            }
          }
        }

        // Check selector validity (:host prefix)
        {
          let styleStringStripped = styleString;

          // Remove comments
          styleStringStripped = styleStringStripped.replace(commentsRegex, '');

          // Remove keyframes
          styleStringStripped = styleStringStripped.replace(keyframeRegex, '');

          // Remove media queries
          styleStringStripped = styleStringStripped.replace(mediaQueryRegex, '');

          const match = styleStringStripped.match(cssRegex);
          if (match) {
            match.map(selector => {
              selector = selector.trim();
              if (!selector.startsWith(':host')) {
                console.warn(localName + ': CSS Selector not prefixed with ":host"! This will cause style leakage!');
                console.warn(selector);
              }
            });
          }
        }

        // Replace `:host` with element tag.
        finalStyleString += styleString.replace(new RegExp(':host', 'g'), localName);
      }
    }
  }

  if (finalStyleString) {
    const element = document.createElement('style');
    element.innerHTML = finalStyleString;
    element.setAttribute('id', styleID);
    document.head.appendChild(element);
  }
}

IoElement.Register();

export { Binding, IoElement, IoNode, IoNodeMixin, Property, ProtoChain, ProtoProperties, ProtoProperty };
