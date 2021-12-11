/*

 **/

export class Groups {
    constructor(prototypes: any) {
      for (let i = 0; i < prototypes.length; i++) {
        this.registerGroups(prototypes[i].Groups || {});
      }
    }
    registerGroups(groups: any) {
      for (const g in groups) {
        const self = this as any;
        self[g] = self[g] || [];
        self[g] = [...self[g], ...groups[g]];
      }
    }
    getGroups(object: any, customGroups: any, keys: any, doAdvanced = false) {
      const prototypes = [];

      let proto = object.__proto__;
      while (proto) {
        prototypes.push(proto.constructor.name);
        proto = proto.__proto__;
      }
      const protoGroups: any = {};
      const self = this as any;

      for (const i in self) {
        const grp: any = i.split('|');
        if (grp.length === 1) grp.splice(0, 0, 'Object');
        grp[1] = grp[1].split(':');
        if (prototypes.indexOf(grp[0]) !== -1) {
          const advanced = grp[1][1] === 'advanced';
          if (!advanced || doAdvanced) {
            protoGroups[grp[1][0]] = protoGroups[grp[1][0]] || [];
            for (let j = 0; j < self[i].length; j++) {
              const propName = self[i][j];
              if (typeof propName === 'string' && propName.startsWith('constructor:')) {
                const constructorName = propName.replace('constructor:', '');
                for (let k = 0; k < keys.length; k++) {
                  if (object[keys[k]] && object[keys[k]].name === constructorName) {
                    protoGroups[grp[1][0]].push(keys[k]);
                  }
                }
              } else if (typeof propName === 'string' && propName.startsWith('type:')) {
                const typeName = propName.replace('type:', '');
                for (let k = 0; k < keys.length; k++) {
                  if (object[keys[k]] && typeof object[keys[k]] === typeName) {
                    protoGroups[grp[1][0]].push(keys[k]);
                  }
                }
              } else {
                protoGroups[grp[1][0]].push(propName);
              }
            }
          }
        }
      }

      for (const i in customGroups) {
        const grp: any = i.split('|');
        if (grp.length === 1) grp.splice(0, 0, 'Object');
        grp[1] = grp[1].split(':');
        if (prototypes.indexOf(grp[0]) !== -1) {
          const advanced = grp[1][1] === 'advanced';
          if (!advanced || doAdvanced) {
            protoGroups[grp[1][0]] = protoGroups[grp[1][0]] || [];
            protoGroups[grp[1][0]].push(...customGroups[i]);
          }
        }
      }

      const groups: any = {};
      const assigned: any = [];

      for (const g in protoGroups) {
        groups[g] = groups[g] || [];
        for (const gg in protoGroups[g]) {
          const gKey = protoGroups[g][gg];
          const reg = new RegExp(gKey);

          for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (typeof gKey === 'string') {
              if (k === gKey && assigned.indexOf(k) === -1) {
                groups[g].push(k);
                assigned.push(k);
              }
            } else if (typeof gKey === 'object') {
              // Regex
              if (reg.exec(k) && assigned.indexOf(k) === -1) {
                groups[g].push(k);
                assigned.push(k);
              }
            }
          }
        }
      }


      if (assigned.length === 0) {
        groups['properties'] = keys;
      } else if (doAdvanced) {
        groups['advanced'] = groups['advanced'] || [];
        for (let i = 0; i < keys.length; i++) {
          if (assigned.indexOf(keys[i]) === -1) groups['advanced'].push(keys[i]);
        }
      }

      for (const group in groups) {
        if (groups[group].length === 0) delete groups[group];
      }

      delete groups.hidden;


      return groups;
    }
}
