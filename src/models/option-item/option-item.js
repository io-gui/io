import {Node} from '../../core/node.js';
import {Options} from '../options/options.js';
import {Path} from '../path/path.js';

// TODO: document and test!
// TODO: consider menu model mutations.
// TODO: test for robustness and document.
export class OptionItem extends Node {
  static get Properties() {
    return {
      value: undefined,
      label: '',
      icon: '',
      hint: '',
      action: undefined,
      select: 'pick', // 'toggle' | 'pick' | 'none'
      selected: Boolean,
      selectedPath: {
        type: Array,
        strict: true,
      },
      selectedRoot: null,
      selectedLeaf: null,
      options: {
        type: Options,
        strict: true
      }
    };
  }
  get compose() {
    return {
      options: {'on-selectedPath-changed': this.onOptionsSelectedPathChanged},
    };
  }
  constructor(option) {
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
      console.warn('IoGUI OptionItem: options with {select: "toggle"} cannot have suboptions!');
      option.options = new Options();
    }
    if (option.select === 'pick' && option.options.length) {
      option.selected = !!option.options.selectedPath.length;
      option.selectedPath = [...option.options.selectedPath]; 
    }
    super(option);
    if (this.select === 'pick' && this.options.length) {
      this.setSelectedPath(!!this.options.selectedPath.length, [...this.options.selectedPath]);
    }
  }
  get hasmore() {
    return !!(this.options.length);
  }
  option(value) {
    return this.options.option(value);
  }
  onOptionsSelectedPathChanged() {
    if (this.select === 'pick') {
      this.setSelectedPath(!!this.options.selectedPath.length, [...this.options.selectedPath]);
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
  setSelectedPath(selected, path = []) {
    this.setProperties({
      selected: selected,
      selectedPath: path ,
      selectedRoot: path[0] || '',
      selectedLeaf: path[path.length - 1] || '',
    });
  }
  changed() {
    this.dispatchEvent('changed');
  }
}
OptionItem.Register();
