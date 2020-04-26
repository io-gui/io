import {IoNode, IoNodeMixin} from '../../io.js';

// TODO: document and test!
// TODO: consider menu model mutations.
export class Options extends IoNodeMixin(Array) {
  static get Properties() {
    return {
      selectedRoot: String,
      selectedPath: String,
      selectedLeaf: String,
    };
  }
  constructor(options = [], props = {}) {
    super(props);
    for (let i = 0; i < options.length; i++) {
      let option;
      if (options[i] instanceof Option) {
        option = options[i];
      } else if (typeof options[i] === 'object') {
        option = new Option(options[i]);
      } else {
        option = new Option({value: options[i]});
      }
      this.push(option);
      option.addEventListener('selected-changed', this.onOptionSelectedChanged);
      option.addEventListener('selectedPath-changed', this.onOptionSelectedPathChanged);
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
    if (!this.selectedPath) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick') {
          this[i].setSelectedPath(null);
        }
      }
    }
  }
  onOptionSelectedPathChanged(event) {
    const target = event.target;
    if (target.select === 'pick') {
      if (target.selectedPath) {
        this.setSelectedPath(String(target.value) + '///' + target.selectedPath);
      }
    }
  }
  onOptionSelectedChanged(event) {
    const target = event.target;
    if (target.select === 'pick') {
      if (target.selected) {
        let selectedPath = String(target.value) + '///' + target.selectedPath;
        for (let i = 0; i < this.length; i++) {
          if (this[i].select === 'pick' && this[i] !== target) {
            this[i].setSelectedPath(null);
          }
        }
        this.setSelectedPath(selectedPath);
      } else {
        let hasSelected = false;
        for (let i = 0; i < this.length; i++) {
          if (this[i].selected) {
            hasSelected = true;
            continue;
          }
        }
        if (!hasSelected) this.setSelectedPath(null);
      }
    }
  }
  setSelectedPath(path) {
    this.setProperties({
      selectedRoot: path ? path.split('///')[0] : '',
      selectedPath: path || '',
      selectedLeaf: path ? path.split('///').slice(-2)[0] : '',
    });
  }
  changed() {
    this.dispatchEvent('changed');
  }
}
Options.Register();

// TODO: test for robustness and document.
export class Option extends IoNode {
  static get Properties() {
    return {
      value: undefined,
      label: '',
      icon: '',
      hint: '',
      action: undefined,
      select: 'pick', // 'toggle' | 'pick' | 'none'
      selected: Boolean,
      selectedPath: String,
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
      console.warn('IoGUI Option: options with {select: "toggle"} cannot have suboptions!');
      option.options = new Options();
    }
    if (typeof option.value === 'string' && option.value.search('///') != -1) {
      console.error('IoGUI Option: option values should not contain "///" string!');
    }
    if (option.select === 'pick' && option.options.length) {
      option.selected = !!option.options.selectedPath;
      option.selectedPath = option.options.selectedPath; 
    }
    super(option);
    if (this.select === 'pick' && this.options.length) {
      this.setSelectedPath(this.options.selectedPath);
    }
  }
  get hasmore() {
    return !!(this.options.length);
  }
  onOptionsSelectedPathChanged() {    
    if (this.select === 'pick') {
      this.setSelectedPath(this.options.selectedPath);
    }
  }
  selectedChanged() {
    if (this.select === 'pick') {
      if (!this.selected) {
        this.options.setSelectedPath(null);
        this.setSelectedPath(null);
      }
    }
  }
  setSelectedPath(path) {
    this.setProperties({
      selected: path ? true : false,
      selectedRoot: path ? path.split('///')[0] : '',
      selectedPath: path || '',
      selectedLeaf: path ? path.split('///').slice(-2)[0] : '',
    });
  }
  changed() {
    this.dispatchEvent('changed');
  }
}
Option.Register();
