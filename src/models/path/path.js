import {Node} from '../../core/node.js';

export class Path extends Node {
  static get Properties() {
    return {
      value: Array,
      string: String,
      root: {
        value: null,
        readonly: true,
      },
      leaf: {
        value: null,
        readonly: true,
      },
      delimiter: ':',
    };
  }
  valueChanged() {
    this.__properties.value.value = new Proxy(this.__properties.value.value, {
      get: (target, prop) => target[prop],
      set: (target, prop, value) => {
        if (target[prop] === value) return true;
        target[prop] = value;
        this.update();
        this.throttle(this.onMutation, null, true);
        return true;
      }
    });
    this.update();
    this.throttle(this.onMutation, null, false);
  }
  onMutation() {
    if (this.__connected) this.queueDispatch();
  }
  update() {
    let string = '';
    for (let i = 0; i < this.value.length; i++) {
      debug:
      if (this.value[i].search(this.delimiter) !== -1) {
        console.warn(`IoGUI Path: Value ${this.value[i]} with special string "${this.delimiter}" cannot be used in path!`);
        break;
      }
      string += this.value[i];
      if (i !== this.value.length - 1) string += this.delimiter;
    }
    this.__properties.set('string', string, true);
    this.__properties.set('root', this.value[0], true);
    this.__properties.set('leaf', this.value[this.value.length - 1], true);
  }
  stringChanged() {
    const array = this.string ? [...this.string.split(this.delimiter)] : [];
    for (let i = 0; i < array.length; i++) {
      if (this.value[i] !== array[i]) this.value[i] = array[i];
    }
    this.value.length = array.length;
  }
}
Path.Register();