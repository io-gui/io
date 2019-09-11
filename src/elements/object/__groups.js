export class Groups {
    constructor(prototypes) {
      for (let i = 0; i < prototypes.length; i++) {
        this.registerGroups(prototypes[i].constructor.Groups || {});
      }
    }
    registerGroups(groups) {
      for (let g in groups) {
        this[g] = this[g] || [];
        this[g] = [...this[g], ...groups[g]];
      }
    }
    getGroups(object, customGroups) {
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
  
      const protoGroups = {};
  
      for (let i in this) {
        const grp = i.split('|');
        if (grp.length === 1) grp.splice(0, 0, 'Object');
        if (prototypes.indexOf(grp[0]) !== -1) {
          protoGroups[grp[1]] = protoGroups[grp[1]] || [];
          protoGroups[grp[1]].push(...this[i]);
        }
      }
  
      for (let i in customGroups) {
        const grp = i.split('|');
        if (grp.length === 1) grp.splice(0, 0, 'Object');
        if (prototypes.indexOf(grp[0]) !== -1) {
          protoGroups[grp[1]] = protoGroups[grp[1]] || [];
          protoGroups[grp[1]].push(customGroups[i]);
        }
      }
  
      const groups = {};
      const assigned = [];
  
      for (let g in protoGroups) {
        groups[g] = groups[g] || [];
        for (let gg in protoGroups[g]) {
          const gKey = protoGroups[g][gg];
          const reg = new RegExp(gKey);

          for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (typeof gKey === 'string') {
              if (k == gKey && assigned.indexOf(k) == -1) {
                groups[g].push(k);
                assigned.push(k);
              }
            } else if (typeof gKey === 'object') {
              if (reg.exec(k) && assigned.indexOf(k) == -1) {
                groups[g].push(k);
                assigned.push(k);
              }
            }
          }
        }
      }
  
      if (assigned.length === 0) {
        groups['properties'] = keys;
      } else {
        for (let i = 0; i < keys.length; i++) {
          groups['properties'] = groups['properties'] || [];
          if (assigned.indexOf(keys[i]) === -1) groups['properties'].push(keys[i]);
        }
      }
  
      for (let group in groups) { if (groups[group].length === 0) delete groups[group]; }
      delete groups.hidden;
  
      return groups;
    }
}