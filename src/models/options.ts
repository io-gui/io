import { IoNodeMixin, RegisterIoNode } from '../core/node.js';
import { MenuItem } from './item.js';
import { Path } from './path.js';
import { Property } from '../core/internals/property.js';

// TODO: document and test!
// TODO: consider menu model mutations.
@RegisterIoNode
export class MenuOptions extends IoNodeMixin(Array) {

  // static get Properties() {
  //   return {};
  // }

  @Property(Array) // TODO: investigate why this breaks
  declare items: Array<MenuItem>;

  @Property(Path)
  declare path: Path;

  @Property(true) // TODO: test and recosider
  declare lazy: boolean;

  getItem(value: any) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value === value) return this[i];
    }
    return null;
  }

  push(...items: Array<MenuItem | any>) {
    for (let i = 0; i < items.length; i++) {
      if (!(items[i] instanceof MenuItem)) {
        items[i] = new MenuItem(items[i]);
      }
    }
    super.push(...items);
  }

  constructor(options: Array<MenuItem | any> = [], props = {}) {
    super(props);
    for (let i = 0; i < options.length; i++) {
      let option;
      if (options[i] instanceof MenuItem) {
        option = options[i];
      } else if (typeof options[i] === 'object') {
        option = new MenuItem(options[i]);
      } else {
        option = new MenuItem({value: options[i]});
      }
      this.push(option);
      option.addEventListener('selected-changed', this.onItemSelectedChanged);
      option.addEventListener('path-changed', this.onItemSelectedPathChanged);
    }
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