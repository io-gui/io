export class Properties {
  constructor(protochain) {
    for (let i = 0; i < protochain.length; i++) {
      let prop = protochain[i].constructor.properties;
      for (let key in prop) {
        if (key !== 'listeners' && key !== 'attributes') {
          if (prop[key].value === undefined) {
            if (prop[key].type === Boolean) prop[key].value = false;
            if (prop[key].type === Number) prop[key].value = 0;
            if (prop[key].type === String) prop[key].value = '';
          }
          prop[key].notify = prop[key].notify || false;
          prop[key].bubbles = prop[key].bubbles || false;
          this[key] = Object.assign(prop[key], this[key] || {});
        }
      }
    }
  }
}
