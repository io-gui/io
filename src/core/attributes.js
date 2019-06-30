export class ProtoAttributes {
  constructor(protochain) {
    const attributeDefs = {};
    for (let i = protochain.length; i--;) {
      const attrs = protochain[i].constructor.attributes;
      for (let key in attrs) {
        if (!attributeDefs[key]) attributeDefs[key] = new ProtoAttribute(attrs[key]);
        else Object.assign(attributeDefs[key], new ProtoAttribute(attrs[key]));
      }
    }
    for (let key in attributeDefs) {
      this[key] = new ProtoAttribute(attributeDefs[key]);
    }
  }
}

class ProtoAttribute {
  constructor(cfg) {
    const cType = typeof cfg;
    if (cfg === Number || cfg === String || cfg === Boolean) {
      cfg = {type: cfg};
    } else if (cType === 'number' || cType === 'string' || cType === 'boolean') {
      cfg = {value: cfg, type: cfg.constructor};
    } else if (cType === 'object') {
      if (typeof cfg.type !== 'function') {
        if (cfg.value === undefined || cfg.value === null) {
          console.error('Defining an attribute requires value or type');
        } else {
          cfg.type = cfg.value.constructor;
        }
      }
    }
    if (cfg.value !== undefined) this.value = cfg.value;
    if (cfg.type !== undefined) this.type = cfg.type;
    if (cfg.observe !== undefined) this.observe = cfg.observe;
  }
}

export class Attributes {
  constructor(node, protoAttributes) {
    Object.defineProperty(this, 'node', {value: node});
    for (let prop in protoAttributes) {
      this[prop] = new Attribute(protoAttributes[prop]);
      this.node.setAttribute(prop, this[prop].value);
    }
  }
  get(prop) {
    return this[prop].value;
  }
  set(prop, value) {
    let oldValue = this[prop].value;
    if (value !== oldValue) {
      this[prop].value = value;
      this.node.setAttribute(prop, value);
    }
  }
  dispose() {
    for (let p in this) {
      delete this[p];
    }
  }
}

class Attribute {
  constructor(cfg) {
    this.value = cfg.value;
    this.type = cfg.type;
    this.observe = cfg.observe;
    if (cfg.type === undefined) console.error('Could not infer attribute type!');
    if (this.value === undefined) {
      if (this.type === Boolean) this.value = false;
      else if (this.type === String) this.value = '';
      else if (this.type === Number) this.value = 0;
    }
    if (this.observe === undefined) this.observe = true;
  }
}
