function merge() {
  let extended = {};
  let apply = function (obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop].constructor.name === 'Object') {
          extended[prop] = merge(obj[prop], extended[prop]);
        } else if (obj[prop].constructor.name === 'Array') {
            if (extended[prop]) {
            extended[prop] = [obj[prop][0], merge(obj[prop][1], extended[prop][1])];
          } else {
            extended[prop] = obj[prop];
          }
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };
  // TODO: consider reversing order
  for (let i = arguments.length; i--;) apply(arguments[i]);
  return extended;
}


export class ProtoConfig {
  constructor(prototypes) {
    let protoConfig = {};
    for (let i = prototypes.length; i--;) {
      let config = prototypes[i].constructor.config;
      protoConfig = merge(config, protoConfig);
    }
    for (let key in protoConfig) {
      this[key] = protoConfig[key];
    }
  }
  getConfig(object, instanceConfig) {
    const keys = Object.keys(object);
    let configs = {};

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      configs = merge(configs, this[proto.constructor.name]);
      configs = merge(configs, instanceConfig[proto.constructor.name]);
      proto = proto.__proto__;
    }

    let propConfigs = {};

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = object[key];
      let type = typeof value;
      let cstr = (value && value.constructor) ? value.constructor.name : 'null';

      if (type == 'function') continue;

      propConfigs[key] = {};

      if (configs.hasOwnProperty('type:' + type)) {
        propConfigs[key] = configs['type:' + type];
      }
      if (configs.hasOwnProperty('constructor:'+cstr)) {
        propConfigs[key] = configs['constructor:'+cstr];
      }
      if (configs.hasOwnProperty('key:' + key)) {
        propConfigs[key] = configs['key:' + key];
      }
      if (configs.hasOwnProperty('value:' + String(value))) {
        propConfigs[key] = configs['value:' + String(value)];
      }
    }
    return propConfigs;


  }
}
