import { IoNodeMixin, RegisterIoNode } from '../../../core/node.js';
import { Property } from '../../../core/internals/property.js';

@RegisterIoNode
export class MenuPath extends IoNodeMixin(Array) {

  @Property({type: Array, observe: true})
  declare value: any[];

  @Property(undefined)
  declare root: any;

  @Property(undefined)
  declare leaf: any;

  // TODO document. Note: string values only!
  @Property('')
  declare string: string;

  @Property(',')
  declare delimiter: string;

  init() {
    // TODO: make sure minimal number of instances is used!
    this.valueChanged();
  }

  valueChanged() {
    this.setProperties({
      'string': this.toString(),
      'leaf': this.value[this.value.length - 1],
      'root': this.value[0],
    });
  }
  toString() {
    let string = '';
    const value = this.value;
    for (let i = 0; i < value.length; i++) {
      const val = value[i];
      if (typeof val === 'string') {
        if (val.search(this.delimiter) !== -1) {
          return '';
        }
        string += val;
      } else {
        return '';
      }
      if (i !== value.length - 1 && String(value[value.length - 1]) !== '') string += this.delimiter;
    }
    return string;
  }

  stringChanged() {
    const array = this.string ? [...this.string.split(this.delimiter)] : [];
    for (let i = 0; i < array.length; i++) {
      const num = Number(array[i]);
      this.value[i] = isNaN(num) ? array[i] : num;
    }
    this.value.length = array.length;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
  }

  rootChanged() {
    if (this.root !== undefined) {
      if (this.value[0] !== this.root) {
        this.value.length = 0;
        this.value.push(this.root);
        this.setProperties({
          string: this.toString(),
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

  leafChanged() {
    debug: {
      if (this.value[this.value.length - 1] !== this.leaf) {
        console.warn(`MenuPath: leaf property "${this.leaf}" diverged from path value[value.length - 1] "${this.value[this.value.length - 1]}"`);
      }
    }
  }

  bind(prop: string) {
    debug: {
      if (prop === 'leaf') {
        console.warn('MenuPath: Binding to "leaf" property not recommended by design!');
      }
    }
    return super.bind(prop);
  }
}