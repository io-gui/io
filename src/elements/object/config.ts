import {Binding} from '../../core/internals/binding.js';

// TODO: display read only as non-editable

/*

 **/

export class Config {
    constructor(prototypes: any) {
      for (let i = 0; i < prototypes.length; i++) {
        this.registerConfig(prototypes[i].Config || {});
      }
    }
    registerConfig(config: any) {
      for (const c in config) {
        const self = this as any;
        self[c] = self[c] || [];
        self[c] = [config[c][0] || self[c][0], Object.assign(self[c][1] || {}, config[c][1] || {})];
      }
    }
    getConfig(object: any, customConfig: any) {
      const keys = Object.getOwnPropertyNames(object);
      // const keys = Object.keys(object);
      const prototypes = [];

      let proto = object.__proto__;
      while (proto) {
        prototypes.push(proto.constructor.name);
        // keys.push(...Object.getOwnPropertyNames(proto));
        keys.push(...Object.keys(proto));
        proto = proto.__proto__;
      }

      const protoConfigs: any = {};

      for (const i in this) {
        const cfg = i.split('|');
        if (cfg.length === 1) cfg.splice(0, 0, 'Object');
        if (prototypes.indexOf(cfg[0]) !== -1) protoConfigs[cfg[1]] = this[i];
      }

      for (const i in customConfig) {
        const cfg = i.split('|');
        if (cfg.length === 1) cfg.splice(0, 0, 'Object');
        if (prototypes.indexOf(cfg[0]) !== -1) {
            protoConfigs[cfg[1]] = customConfig[i];
        }
      }

      const config: any = {};

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const value = object[k] instanceof Binding ? object[k].value : object[k]; // TODO: Unhack demovalues
        // const value = object[k]

        const type = value === null ? 'null' : typeof value;
        const cstr = (value !== undefined && value.constructor) ? value.constructor.name : 'null';

        if (type === 'function') continue;

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
