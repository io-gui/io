import {IoNode, RegisterIoNode} from '../components/io-node.js';
import {Options} from './options.js';
import {Path} from './path.js';


// TODO: document and test!
// TODO: consider menu model mutations.
// TODO: test for robustness and document.
export class Item extends IoNode {
  static get Properties() {
    return {
      value: undefined,
      label: '',
      icon: '',
      hint: '',
      action: undefined,
      select: 'pick', // 'toggle' | 'pick' | 'none'
      selected: Boolean,
      path: {
        type: Path,
        readonly: true,
        strict: true,
      },
      options: {
        type: Options,
        strict: true
      }
    };
  }
  get compose() {
    return {
      options: {'on-path-changed': this.onOptionsSelectedPathChanged},
    };
  }
  constructor(option: any) {
    if (typeof option !== 'object' || option === null) {
      option = {
        value: option,
        label: option,
      };
    }
    if (option.options) {
      if (!(option.options instanceof Options)) {
        option.options = new Options(option.options);
      }
    }
    if (!option.label) {
      if (typeof option.value === 'object') {
        option.label = option.value.constructor.name;
      } else {
        option.label = String(option.value);
      }
    }
    if (option.select === 'toggle' && option.options && option.options.length) {
      console.warn('IoGUI Item: options with {select: "toggle"} cannot have suboptions!');
      option.options = new Options();
    }
    if (option.select === 'pick' && option.options.length) {
      option.selected = !!option.options.path.value.length;
      option.path.value = [...option.options.path.value];
    }
    super(option);
    if (this.select === 'pick' && this.options.length) {
      this.setSelectedPath(!!this.options.path.value.length, [...this.options.path.value]);
    }
  }
  get hasmore() {
    return !!(this.options.length);
  }
  option(value: any) {
    return this.options.option(value);
  }
  onOptionsSelectedPathChanged() {
    if (this.select === 'pick') {
      this.setSelectedPath(!!this.options.path.value.length, [...this.options.path.value]);
    }
  }
  selectedChanged() {
    if (this.select === 'pick') {
      if (!this.selected) {
        this.options.setSelectedPath([]);
        this.setSelectedPath(false, []);
      }
    }
  }
  setSelectedPath(selected: any, path: any[] = []) {
    this.path.value = path;
    this.selected = selected;
    this.dispatchEvent('path-changed', this.path); // TODO: TEMP HACK
  }
  changed() {
    this.dispatchEvent('changed');
  }
}

RegisterIoNode(Item);
