import {IoNode, IoNodeMixin} from './io-node.js';

// TODO: document and test!
// TODO: consider menu model mutations.
export class Options extends IoNodeMixin(Array) {
  static get Properties() {
    return {
      selectedPath: {
        type: Array,
        strict: true,
      },
      selectedRoot: String,
      selectedLeaf: String,
    };
  }
  constructor(options = [], props = {}) {
    super(props);
    for (let i = 0; i < options.length; i++) {
      let option;
      if (options[i] instanceof OptionItem) {
        option = options[i];
      } else if (typeof options[i] === 'object') {
        option = new OptionItem(options[i]);
      } else {
        option = new OptionItem({value: options[i]});
      }
      this.push(option);
      option.addEventListener('selected-changed', this.onOptionItemSelectedChanged);
      option.addEventListener('selectedPath-changed', this.onOptionItemSelectedPathChanged);
      option.connect(this);
    }
  }
  option(value) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value === value) return this[i];
    }
    return null; 
  }
  selectedPathChanged() {
    if (!this.selectedPath.length) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick') {
          this[i].setSelectedPath([]);
        }
      }
    } else {
      this.setSelectedPath(this.selectedPath);
      const selected = this.selectedPath[0];
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick' && this[i].value === selected) {
          const nextpath = [...this.selectedPath];
          nextpath.shift();
          this[i].setSelectedPath(nextpath);
        }
      }
    }
  }
  onOptionItemSelectedPathChanged(event) {
    const target = event.target;
    if (target.select === 'pick') {
      if (target.selectedPath.length) {
        this.setSelectedPath([target.value, ...target.selectedPath]);
      }
    }
  }
  onOptionItemSelectedChanged(event) {
    const target = event.target;
    if (target.select === 'pick') {
      if (target.selected) {
        for (let i = 0; i < this.length; i++) {
          if (this[i].select === 'pick' && this[i] !== target) {
            this[i].setSelectedPath([]);
          }
        }
        this.setSelectedPath([target.value, ...target.selectedPath]);
      } else {
        let hasSelected = false;
        for (let i = 0; i < this.length; i++) {
          if (this[i].selected) {
            hasSelected = true;
            continue;
          }
        }
        if (!hasSelected) this.setSelectedPath([]);
      }
    }
  }
  setSelectedPath(path = []) {
    this.setProperties({
      selectedPath: path,
      selectedRoot: path[0] || '',
      selectedLeaf: path[path.length - 1] || '',
    });
  }
  changed() {
    this.dispatchEvent('changed');
  }
}
Options.Register();

// TODO: test for robustness and document.
export class OptionItem extends IoNode {
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
      selectedRoot: String,
      selectedLeaf: String,
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
      this.setSelectedPath([...this.options.selectedPath]);
    }
  }
  get hasmore() {
    return !!(this.options.length);
  }
  onOptionsSelectedPathChanged() {
    if (this.select === 'pick') {
      this.setSelectedPath([...this.options.selectedPath]);
    }
  }
  selectedChanged() {
    if (this.select === 'pick') {
      if (!this.selected) {
        this.options.setSelectedPath([]);
        this.setSelectedPath([]);
      }
    }
  }
  setSelectedPath(path = []) {
    this.setProperties({
      selected: path.length ? true : false,
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
