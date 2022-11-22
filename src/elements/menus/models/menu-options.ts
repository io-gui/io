import { IoNodeMixin, RegisterIoNode } from '../../../core/node.js';
import { MenuItem } from './menu-item.js';
import { MenuPath } from './menu-path.js';
import { Property } from '../../../core/internals/property.js';

// TODO: document and test!
// TODO: consider menu model mutations.
@RegisterIoNode
export class MenuOptions extends IoNodeMixin(Array) {

  @Property(MenuPath)
  declare path: MenuPath;

  @Property(true) // TODO: test and recosider, investigate why this is necessary?
  declare lazy: boolean;

  getItem(value: any) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value === value) return this[i];
    }
    return null;
  }

  push(...items: Array<MenuItem | any>) {
    for (let i = 0; i < items.length; i++) {
      let item: MenuItem;
      if (items[i] instanceof MenuItem) {
        item = items[i];
      } else if (typeof items[i] === 'object') {
        item = new MenuItem(items[i]);
      } else {
        item = new MenuItem({value: items[i]});
      }
      super.push(item);
      item.addEventListener('selected-changed', this.onItemSelectedChanged);
      item.addEventListener('path-changed', this.onItemSelectedPathChanged);
    }
  }

  constructor(items: Array<MenuItem | any> = [], props = {}) {
    super(props);
    if (!(items instanceof Array)) {
      console.log(items, this);
    }
    items instanceof Array ? this.push(...items) : this.push(items);
    // TODO: figure out where number is coming from
    // this.push(...items);
  }

  pathChanged() {
    const path = this.path.value;
    if (!path.length) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick') {
          this[i].selectByPath(false, []);
        }
      }
    } else {
      this.selectByPath(path);
      const selected = path[0];
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick' && this[i].value === selected) {
          const nextpath = [...path];
          nextpath.shift();
          this[i].selectByPath(true, nextpath);
          return;
        }
      }
    }
  }
  onItemSelectedPathChanged(event: any) {
    const target = event.target;
    const targetPath = target.path.value;
    // console.log('OPTION PATH CHANGED', targetPath);
    if (target.select === 'pick') {
      if (targetPath.length) {
        this.selectByPath([target.value, ...targetPath]);
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
            this[i].selectByPath(false, []);
          }
        }
        this.selectByPath([target.value, ...targetPath]);
      } else {
        let hasSelected = false;
        for (let i = 0; i < this.length; i++) {
          if (this[i].selected) {
            hasSelected = true;
            continue;
          }
        }
        if (!hasSelected) this.selectByPath([]);
      }
    }
  }

  selectByPath(path: any[] = []) {
    this.path.value = path;
    // TODO: TEMP HACK (pathChanged should not happen due to readonly)
    if (!path.length) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].select === 'pick') {
          this[i].selectByPath(false, []);
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
          this[i].selectByPath(true, []);
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