import {IoNodeMixin, RegisterIoNode} from '../core/io-node.js';
import {Item} from './item.js';
import {Path} from './path.js';

// TODO: document and test!
// TODO: consider menu model mutations.
export class Options extends IoNodeMixin(Array) {
  static get Properties() {
    return {
      items: {
        type: Array,
        readonly: true,
        strict: true,
      },
      path: {
        type: Path,
        readonly: true,
        strict: true,
      },
      lazy: true // TODO: test and recosider
    };
  }
  constructor(options: Array<Item | any> = [], props = {}) {
    super(props);

    for (let i = 0; i < options.length; i++) {
      let option;
      if (options[i] instanceof Item) {
        option = options[i];
      } else if (typeof options[i] === 'object') {
        option = new Item(options[i]);
      } else {
        option = new Item({value: options[i]});
      }
      this.push(option);
      option.addEventListener('selected-changed', this.onItemSelectedChanged);
      option.addEventListener('path-changed', this.onItemSelectedPathChanged);
    }
  }
  option(value: any) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value === value) return this[i];
    }
    return null;
  }
  pathChanged() {
    const path = this.path.value;
    if (!path.length) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick') {
          this[i].setSelectedPath(false, []);
        }
      }
    } else {
      this.setSelectedPath(path);
      const selected = path[0];
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick' && this[i].value === selected) {
          const nextpath = [...path];
          nextpath.shift();
          this[i].setSelectedPath(true, nextpath);
          return;
        }
      }
    }
  }
  onItemSelectedPathChanged(event: any) {
    // console.log('OPTION PATH CHANGED');
    const target = event.target;
    const targetPath = target.path.value;
    if (target.select === 'pick') {
      if (targetPath.length) {
        this.setSelectedPath([target.value, ...targetPath]);
      }
    }
  }
  onItemSelectedChanged(event: any) {
    const target = event.target;
    const targetPath = target.path.value;
    if (target.select === 'pick') {
      if (target.selected) {
        for (let i = 0; i < this.length; i++) {
          if (this[i].select === 'pick' && this[i] !== target) {
            this[i].setSelectedPath(false, []);
          }
        }
        this.setSelectedPath([target.value, ...targetPath]);
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
  setSelectedPath(path: any[] = []) {
    this.path.value = path;
    // TODO: TEMP HACK (pathChanged should not happen due to readonly)
    if (!path.length) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick') {
          this[i].setSelectedPath(false, []);
        }
      }
    }
    this.dispatchEvent('path-changed'); // TODO: TEMP HACK
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
RegisterIoNode(Options);
