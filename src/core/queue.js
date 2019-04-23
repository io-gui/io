// TODO: Documentation and tests

export class Queue extends Array {
  constructor(node) {
    super();
    Object.defineProperty(this, 'node', {value: node, configurable: true});
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
    const node = this.node;
    if (this.length) {
      for (let j = 0; j < this.length; j += 2) {
        const prop = this[j];
        const payload = {detail: this[j + 1]};
        if (node[prop + 'Changed']) node[prop + 'Changed'](payload);
        node.dispatchEvent(prop + '-changed', payload.detail);
      }
      node.changed();
      if (!(node.isElement)) {
        // Emit change event for non-elements (nodes)
        node.dispatchEvent('object-mutated', {object: node}, null, window);
      }
      this.length = 0;
    }
  }
  dispose() {
    this.length = 0;
    delete this.node;
  }
}
