import {Binding} from './binding.js';

export class ProtoProperties {
  constructor(protochain) {
    this._p = protochain;
    const defs = {};
    for (let i = protochain.length; i--;) {
      // Properties
      const props = protochain[i].constructor.Properties;
      for (let p in props) {
        if (!defs[p]) defs[p] = new ProtoProperty(props[p]);
        else Object.assign(defs[p], new ProtoProperty(props[p]));
        if (defs[p].reflect === undefined) defs[p].reflect = 0;
        if (defs[p].notify === undefined) defs[p].notify = true;
        if (defs[p].observe === undefined) defs[p].observe = false;
        if (defs[p].enumerable === undefined) defs[p].enumerable = true;
      }
    }
    for (let p in defs) {
      const isPrivate = p.charAt(0) === '_';
      if (isPrivate) {
        defs[p].notify = false;
        defs[p].enumerable = false;
      }
      // TODO: reconsider
      if (defs[p].value === undefined) defs[p].value = undefined;
      if (defs[p].type === undefined) defs[p].type = undefined;
      // if (defs[p].observe === undefined) defs[p].observe = [Object, Array].indexOf(defs[p].type) !== -1;
      this[p] = new Property(defs[p]);
    }
  }
}

export class ProtoProperty {
  constructor(cfg) {
    const cType = typeof cfg;
    if (cfg === null || cfg === undefined) {
      cfg = {value: cfg};
    } else if (cType === 'function') {
      cfg = {type: cfg};
    } else if (cType === 'number' || cType === 'string' || cType === 'boolean') {
      cfg = {value: cfg, type: cfg.constructor};
    } else if (cType === 'object') {
      if (cfg instanceof Array) {
        cfg = {value: [...cfg], type: Array}; // TODO: reconsider
      } else if (cfg instanceof Binding) {
        cfg = {value: cfg.value, binding: cfg};
      } else {
        if (typeof cfg.type !== 'function') {
          if (cfg.value === undefined || cfg.value === null) {
            // console.error('Properties require value or type'); // TODO: reconsider
          } else {
            cfg.type = cfg.value.constructor;
          }
        }
      }
    } else {
      console.error('Property error!', cType, cfg);
    }
    if (cfg.value !== undefined) this.value = cfg.value;
    if (cfg.type !== undefined) this.type = cfg.type;
    if (cfg.reflect !== undefined) this.reflect = cfg.reflect;
    if (cfg.notify !== undefined) this.notify = cfg.notify;
    if (cfg.observe !== undefined) this.observe = cfg.observe;
    if (cfg.enumerable !== undefined) this.enumerable = cfg.enumerable;
    if (cfg.binding !== undefined) this.binding = cfg.binding;
  }
}

export class Properties {
  constructor(node, protoProperties) {
    Object.defineProperty(this, 'node', {value: node});
    for (let prop in protoProperties) {
      this[prop] = new Property(protoProperties[prop]);
      this[prop].instantiateCustomType();
      // TODO: consider bindings
      if (this[prop].value !== undefined) {
        if (typeof this[prop].value === 'object' && this[prop].value !== null) {
          if (this[prop].value.__isIoNode) this[prop].value.connect(node);
          node.queue(prop, this[prop].value, undefined);
        } else if (this[prop].reflect >= 1) {
          this.node.setAttribute(prop, this[prop].value);
        }
      }
    }
  }
  get(prop) {
    return this[prop].value;
  }
  set(prop, value, suspendDispatch) {
    let oldValue = this[prop].value;
    if (value !== oldValue) {

      const node = this.node;

      let oldBinding = this[prop].binding;

      let binding = (value instanceof Binding) ? value : null;

      if (binding && oldBinding && binding !== oldBinding) {
        oldBinding.removeTarget(node, prop); // TODO: test extensively
      }
      if (binding) {
        binding.addTarget(node, prop);
        this[prop].binding = binding;
        this[prop].value = value.source[value.sourceProp];
        value = value.source[value.sourceProp];
      } else {
        this[prop].value = value;
      }

      if (value && value.__isIoNode) {
        value.connect(node);
      }

      if (oldValue && oldValue.__isIoNode) {
        oldValue.disconnect(node);
      }

      if (this[prop].notify && oldValue !== this[prop].value) {
        node.queue(prop, this[prop].value, oldValue);
        if (node.__isConnected && !suspendDispatch) {
          node.queueDispatch();
        }
      }
      if (this[prop].reflect >= 1) node.setAttribute(prop, value);
    }

  }
  connect() {
    // TODO: test dispose and disconnect for memory leaks!!
    // TODO: dispose bindings properly
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.addTarget(this.node, p); //TODO: test
      }
    }
  }
  disconnect() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.node, p);
      }
    }
  }
  dispose() {
    // TODO: use!
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.node, p);
        delete this[p].binding;
      }
      delete this[p];
    }
  }
}

class Property {
  /**
   * @param {Object} cfg - Configuration object.
   * @param {*} cfg.value - Default value.
   * @param {function} cfg.type - Constructor of value.
   * @param {boolean} cfg.reflect - Reflects to HTML attribute
   * @param {boolean} cfg.notify - Trigger change handlers and change events.
   * @param {boolean} cfg.observe - Observe object mutations for this property.
   * @param {boolean} cfg.enumerable - Makes property enumerable.
   * @param {Binding} cfg.binding - Binding object.
   */
  constructor(cfg) {
    this.value = cfg.value;
    this.type = cfg.type;
    this.reflect = cfg.reflect;
    this.notify = cfg.notify;
    this.observe = cfg.observe;
    this.enumerable = cfg.enumerable;
    this.binding = cfg.binding;
    if (this.type === Array && this.value) {
      this.value = [...this.value]; // TODO: reconsider
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
    // TODO: ocnsider bindings
  }
  instantiateCustomType() {
    if (this.value === undefined && this.type) {
      if (this.type !== HTMLElement && this.type !== Function) {
        this.value = new this.type();
      }
    }
  }
}
