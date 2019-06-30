import {Binding} from "./bindings.js";

export class ProtoProperties {
  constructor(protochain) {
    this._p = protochain;
    const defs = {};
    for (let i = protochain.length; i--;) {
      // Attributes
      const attrs = protochain[i].constructor.attributes;
      for (let a in attrs) {
        if (!defs[a]) defs[a] = new ProtoProperty(attrs[a]);
        else Object.assign(defs[a], new ProtoProperty(attrs[a]));
        if (defs[a].reflect === undefined) defs[a].reflect = 1;
        if (defs[a].notify === undefined) defs[a].notify = false;
        if (defs[a].enumerable === undefined) defs[a].enumerable = false;
      }
      // Properties
      const props = protochain[i].constructor.properties;
      for (let p in props) {
        if (!defs[p]) defs[p] = new ProtoProperty(props[p]);
        else Object.assign(defs[p], new ProtoProperty(props[p]));
        if (defs[p].reflect === undefined) defs[p].reflect = 0;
        if (defs[p].notify === undefined) defs[p].notify = true;
        if (defs[p].enumerable === undefined) defs[p].enumerable = true;
      }
    }
    for (let p in defs) {
      const isPrivate = p.charAt(0) === '_';
      if (isPrivate) {
        defs[p].notify = false;
        defs[p].enumerable = false;
      }
      this[p] = new Property(defs[p]);
    }
  }

  get() {
    console.log('Error getting value');
  }
  set(prop, value) {
    console.error('Error setting', prop, value, this._p[0].constructor);
  }
}

class ProtoProperty {
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
            console.error('Properties require value or type');
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
    if (cfg.binding !== undefined) this.binding = cfg.binding;
    if (cfg.enumerable !== undefined) this.enumerable = cfg.enumerable;
    if (cfg.notify !== undefined) this.notify = cfg.notify;
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
          if (this[prop].value.isNode) this[prop].value.connect(node);
          node.queue(prop, this[prop].value, undefined);
        } else if (this[prop].reflect === 1) {
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
      let oldBinding = this[prop].binding;

      let binding = (value instanceof Binding) ? value : null;

      if (binding && oldBinding && binding !== oldBinding) {
        oldBinding.removeTarget(this.node, prop); // TODO: test extensively
      }
      if (binding) {
        binding.addTarget(this.node, prop);
        this[prop].binding = binding;
        this[prop].value = value.source[value.sourceProp];
        value = value.source[value.sourceProp];
      } else {
        this[prop].value = value;
      }

      if (value && value.isNode) {
        value.connect(this.node);
      }

      if (oldValue && oldValue.isNode) {
        oldValue.disconnect(this.node);
      }

      if (this[prop].notify && oldValue !== this[prop].value) {
        this.node.queue(prop, this[prop].value, oldValue);
        if (this.node.__connected && !suspendDispatch) {
          this.node.queueDispatch();
        }
      }
      if (this[prop].reflect === 1) this.node.setAttribute(prop, value);
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
   * @param {Object} config - Configuration object.
   * @param {*} config.value - Default value.
   * @param {function} config.type - Constructor of value.
   * @param {boolean} config.reflect - Reflects to HTML attribute
   * @param {Binding} config.binding - Binding object.
   * @param {boolean} config.enumerable - Makes property enumerable.
   * @param {boolean} config.notify - Trigger change handlers and change events.
   */
  constructor(cfg) {
    this.value = cfg.value;
    this.type = cfg.type;
    this.reflect = cfg.reflect;
    this.binding = cfg.binding;
    this.enumerable = cfg.enumerable;
    this.notify = cfg.notify;
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
