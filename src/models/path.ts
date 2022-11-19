import {IoNode, RegisterIoNode} from '../core/node.js';
import { Property } from '../core/internals/property.js';
import { Binding } from '../core/internals/binding.js';

@RegisterIoNode
export class Path extends IoNode {

  @Property({type: Array})
  // @Property([]) // TODO: consider prohibiting this pattern!
  declare value: any[];

  @Property({value: null})
  declare root: any;

  @Property({value: null})
  declare leaf: any;

  @Property('')
  declare string: string;

  @Property(':')
  declare delimiter: string;

  init() {
    // TODO: make sure minimal number of instances is used
    this.valueChanged();
  }

  valueChanged() {
    // TODO: redesign. Investigate why inputValue causes infinite loop.
    this._properties.get('value')!.value = new Proxy(this._properties.get('value')!.value, {
      get: (target, prop) => target[prop],
      set: (target, prop, value) => {
        if (target[prop] === value) return true;
        target[prop] = value;
        this.update();
        this.throttle(this.onMutation);
        return true;
      }
    });
    this.update();
    this.throttle(this.onMutation, undefined, true);
  }
  onMutation() {
    this.dispatchQueue();
  }
  update() {
    this.setProperties({
      'string': this._valueToString(this.value),
      'leaf': this.value[this.value.length - 1],
      'root': this.value[0],
    });
  }

  // valueChanged() {
  //   this.setProperties({
  //     'string': this._valueToString(this.value),
  //     'leaf': this.value[this.value.length - 1] || '',
  //     'root': this.value[0] || '',
  //   });
  // }

  _valueToString(value: string[]) {
    let string = '';
    for (let i = 0; i < value.length; i++) {
      const val = value[i];
      debug: {
        if (val && typeof val === 'string' && val.search(this.delimiter) !== -1) {
          console.warn(`IoGUI Path: Value ${val} with special string "${this.delimiter}" cannot be used in path!`);
          break;
        }
      }
      // if (typeof val === 'string' || typeof val === 'number') {
        string += val;
      // }
      if (i !== value.length - 1 && String(value[value.length - 1]) !== '') string += this.delimiter;
    }
    // console.log(string);
    return string;
  }

  stringChanged() {
    const array = this.string ? [...this.string.split(this.delimiter)] : [];
    for (let i = 0; i < array.length; i++) {
      if (this.value[i] !== array[i]) this.value[i] = array[i];
    }
    this.value.length = array.length;
  }

  rootChanged() {
    if (this.root !== undefined) {
      if (this.value[0] !== this.root) {
        this.value.length = 0;
        this.value.push(this.root);
        this.setProperties({
          string: this.root !== undefined ? this.root : '',
          leaf: this.root,
        });
        this.dispatchEvent('object-mutated', {object: this.value}, false, window);
      }
    } else {
      this.value.length = 0;
      this.setProperties({
        string: '',
        leaf: undefined,
      });
      this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    }
  }

  bind(prop: string): Binding {
    debug: {
      if (prop === 'leaf') {
        console.warn('Path: Binding to "leaf" property not recommended by design!');
      }
    }
    return super.bind(prop);
  }
}