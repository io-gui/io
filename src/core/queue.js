// TODO: Documentation and tests

export class Queue extends Array {
  constructor(instance) {
    super();
    Object.defineProperty(this, 'instance', {value: instance});
  }
  queue(prop, value, oldValue) {
    const i = this.indexOf(prop);
    if (i === -1) {
      this.push(prop, {property: prop, value: value, oldValue: oldValue});
    } else {
      this[i + 1].value = value;
    }
  }
  dispatch() {
    const instance = this.instance;
    if (this.length) {
      for (let j = 0; j < this.length; j += 2) {
        const prop = this[j];
        const payload = {detail: this[j + 1]};
        if (instance[prop + 'Changed']) instance[prop + 'Changed'](payload);
        instance.dispatchEvent(prop + '-changed', payload.detail);
      }
      if (instance.changed) {
        instance.changed();
        if (!(instance instanceof HTMLElement)) {
          instance.dispatchEvent('object-mutated', {object: instance}, null, window);
        }
      }
      this.length = 0;
    }
  }
}
