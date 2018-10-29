function extendTypes(types, typesExtend) {
  for (let type in typesExtend) {
    types[type] = types[type] || [];
    types[type] = [typesExtend[type][0], Object.assign(types[type][1] || {}, typesExtend[type][1] || {})];
  }
  return types;
}

function extendGroups(groups, groupsExtend) {
  for (let group in groupsExtend) {
    groups[group] = groups[group] || [];
    for (var i = 0; i < groupsExtend[group].length; i++) {
      if (groups[group].indexOf(groupsExtend[group][i]) === -1) {
        groups[group].push(groupsExtend[group][i]);
      }
    }
  }
  return groups;
}

export class ProtoConfig {
  constructor(prototypes) {
    this.types = {};
    this.groups = {};
    for (let i = 0; i < prototypes.length; i++) {
      const config = prototypes[i].constructor.config || {};
      const types = config.types || {};
      for (let cstr in types) {
        this.types[cstr] = extendTypes(this.types[cstr] || {}, types[cstr]);
      }
      const groups = config.groups || {};
      for (let cstr in groups) {
        this.groups[cstr] = extendGroups(this.groups[cstr] || {}, groups[cstr]);
      }
    }
  }
  getConfig(object) {
    const keys = Object.keys(object);
    let types = {};
    let groups = {};

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      types = extendTypes(types, this.types[proto.constructor.name]);
      groups = extendGroups(groups, this.groups[proto.constructor.name]);
      proto = proto.__proto__;
    }

    let configs = {
      types: {},
      groups: {
        'properties': [],
      }
    };

    let assigned = []; // TODO: rename

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const value = object[k];
      const type = typeof value;
      const cstr = (value && value.constructor) ? value.constructor.name : 'null';

      const typeStr = 'type:' + type;
      const cstrStr = 'constructor:' + cstr;
      const keyStr = 'k:' + k;
      const valueStr = 'value:' + String(value); // TODO: consider optimizing against large strings.

      if (type == 'function') continue;

      configs.types[k] = {};

      if (types.hasOwnProperty(typeStr)) configs.types[k] = types[typeStr];
      if (types.hasOwnProperty(cstrStr)) configs.types[k] = types[cstrStr];
      if (types.hasOwnProperty(keyStr)) configs.types[k] = types[keyStr];
      if (types.hasOwnProperty(valueStr)) configs.types[k] = types[valueStr];

      for (let g in groups) {
        let group = groups[g];
        configs.groups[g] = configs.groups[g] || [];
        if (group.indexOf(typeStr) !== -1) { configs.groups[g].push(k); assigned.push(k); }
        if (group.indexOf(cstrStr) !== -1) { configs.groups[g].push(k); assigned.push(k); }
        if (group.indexOf(keyStr) !== -1) { configs.groups[g].push(k); assigned.push(k); }
        if (group.indexOf(valueStr) !== -1) { configs.groups[g].push(k); assigned.push(k); }
      }
    }

    if (assigned.length === 0) {
      configs.groups['properties'] = keys;
    } else {
      for (let i = 0; i < keys.length; i++) {
        if (assigned.indexOf(keys[i]) === -1) configs.groups['properties'].push(keys[i]);
      }
    }

    for (let group in configs.groups) { if (configs.groups[group].length === 0) delete configs.groups[group]; }
    delete configs.groups.hidden;

    return configs;
  }
}
