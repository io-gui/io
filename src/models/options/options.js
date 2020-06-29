import {NodeMixin} from '../../core/node.js';
import {OptionItem} from '../option-item/option-item.js';

// TODO: document and test!
// TODO: consider menu model mutations.
export class Options extends NodeMixin(Array) {
  static get Properties() {
    return {
      selectedPath: {
        type: Array,
        strict: true,
      },
      selectedRoot: null,
      selectedLeaf: null,
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
          this[i].setSelectedPath(false, []);
        }
      }
    } else {
      this.setSelectedPath(this.selectedPath);
      const selected = this.selectedPath[0];
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick' && this[i].value === selected) {
          const nextpath = [...this.selectedPath];
          nextpath.shift();
          this[i].setSelectedPath(true, nextpath);
          return;
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
            this[i].setSelectedPath(false, []);
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
      selectedRoot: path[0],// || '',
      selectedLeaf: path[path.length - 1],// || '',
    });
  }
  // TODO: test
  selectDefault() {
    for (let i = 0; i < this.length; i++) {
      if (this[i].select === 'pick') {
        if (this[i].hasmore) {
          const selected = this[i].options.selectDefault();
          if (selected) return true;
        } else {
          this[i].setSelectedPath(true, []);
          return true;
        }
      }
    }
    return false;
  }
  changed() {
    this.dispatchEvent('changed');
  }
}
Options.Register();
