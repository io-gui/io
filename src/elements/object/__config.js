import {Binding} from "../../io.js";

export class Config {
    constructor(prototypes) {
      for (let i = 0; i < prototypes.length; i++) {
        this.registerConfig(prototypes[i].constructor.Config || {});
      }
    }
    registerConfig(config) {
      for (let c in config) {
        this[c] = this[c] || [];
        this[c] = [config[c][0] || this[c][0], Object.assign(this[c][1] || {}, config[c][1] || {})];
      }
    }
    getConfig(object, customConfig) {
      const keys = Object.getOwnPropertyNames(object);
      // const keys = Object.keys(object);
      const prototypes = [];
  
      let proto = object.__proto__;
      while (proto) {
        prototypes.push(proto.constructor.name);
        keys.push(...Object.getOwnPropertyNames(proto));
        // keys.push(...Object.keys(proto));
        proto = proto.__proto__;
      }
  
      const protoConfigs = {};
  
      for (let i in this) {
        const cfg = i.split('|');
        if (cfg.length === 1) cfg.splice(0, 0, 'Object');
        if (prototypes.indexOf(cfg[0]) !== -1) protoConfigs[cfg[1]] = this[i];
      }
  
      for (let i in customConfig) {
        const cfg = i.split('|');
        if (cfg.length === 1) cfg.splice(0, 0, 'Object');
        if (prototypes.indexOf(cfg[0]) !== -1) {
            protoConfigs[cfg[1]] = customConfig[i];
        }
      }
  
      const config = {};
  
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const value = object[k] instanceof Binding ? object[k].value : object[k]; // TODO: Unhack demovalues
        // const value = object[k]
  
        const type = value === null ? 'null' : typeof value;
        const cstr = (value != undefined && value.constructor) ? value.constructor.name : 'null';
  
        if (type == 'function') continue;
  
        const typeStr = 'type:' + type;
        const cstrStr = 'constructor:' + cstr;
        const keyStr = k.replace('type:', '').replace('constructor:', '');
  
        config[k] = null;
  
        if (protoConfigs[typeStr]) config[k] = protoConfigs[typeStr];
        if (protoConfigs[cstrStr]) config[k] = protoConfigs[cstrStr];
        if (protoConfigs[keyStr]) config[k] = protoConfigs[keyStr];
      }
  
      return config;
    }
}