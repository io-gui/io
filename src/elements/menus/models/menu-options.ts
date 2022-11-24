import { IoNodeMixin, RegisterIoNode } from '../../../core/node.js';
import { MenuItem, MenuItemArgsWeak } from './menu-item.js';
import { Property } from '../../../core/internals/property.js';

// TODO: document!

@RegisterIoNode
export class MenuOptions extends IoNodeMixin(Array) {

  @Property('')
  declare path: string;

  @Property(undefined)
  declare root: any;

  @Property(undefined)
  declare leaf: any;

  @Property(',')
  declare delimiter: string;

  getItem(value: any) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value === value) return this[i];
    }
    return null;
  }

  constructor(args?: MenuItemArgsWeak | MenuItemArgsWeak[]) {
    super();
    if (args !== undefined) {
      args instanceof Array ? this._addItem(args) : this._addItem([args]);
    }
  }

  protected _addItem(items: MenuItemArgsWeak[]) {
    for (let i = 0; i < items.length; i++) {
      let item: MenuItem;
      if (items[i] instanceof MenuItem) {
        item = items[i] as MenuItem;
      } else {
        item = new MenuItem(items[i]);
      }
      debug: {
        if (this.find((otherItem: MenuItem) => otherItem.label === item.label)) {
          console.warn(`MenuOptions: duplicate label "${item.label}"`);
        }
      }
      this.push(item);
      item.addEventListener('selected-changed', this._onItemSelectedChanged);
    }
  }

  pathChanged() {
    const path = this.path ? [...this.path.split(this.delimiter)] : [];
    if (path.length) {
      const first = path.shift();
      const item = this.find((item: MenuItem) => item.label === first);
      debug: {
        if (item.select !== 'pick') {
          console.warn('MenuOptions: Path set to non-pickable MenuItem!');
        }
      }
      if (item.select === 'pick') {
        if (item.options) {
          item.options.path = path.join(this.delimiter);
        }
        item.selected = true;
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        this[i].selected = false;
      }
    }
  }

  rootChanged() {
    if (this.root !== undefined) {
      const item = this.find((item: MenuItem) => item.value === this.root);
      if (item) {
        item.selected = true;
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        this[i].selected = false;
      }
    }
  }

  leafChanged() {
    debug: {
      if (this.leaf !== undefined) {
        const path = this.path ? [...this.path.split(this.delimiter)] : [];
        if (path.length) {
          let label = path.shift();
          let item = this.find((item: MenuItem) => item.label === label);
          let options = item?.options || undefined;
          while (path.length && options) {
            label = path.shift();
            item = options.find((item: MenuItem) => item.label === label);
            options = item?.options || undefined;
          }
          if (item === undefined) {
            console.warn(`MenuOptions: cannot find subitem for specified leaf value "${this.leaf}"!`);
          } else if (item.value !== this.leaf && !isNaN(item.value) && !isNaN(this.leaf)) {
            console.warn(`MenuOptions: leaf property value "${this.leaf}" diverged from subitem specified by path!`);
          }
        } else {
          console.warn(`MenuOptions: leaf property value set "${this.leaf}" but path is empty!`);
        }
      }
    }
  }

  updatePaths(item?: MenuItem) {
    const path: string[] = [];
    let walker: MenuItem | undefined = item;
    let lastWalker: MenuItem | undefined = item;
    while (walker) {
      path.push(walker.label);
      lastWalker = walker;
      walker = walker.options?.find((item: MenuItem) => item.select === 'pick' && item.selected);
    }
    this.setProperties({
      root: item !== undefined ? item.value : undefined,
      leaf: lastWalker !== undefined ? lastWalker.value : undefined,
      path: path.join(this.delimiter)
    });
  }

  _onItemSelectedChanged(event: any) {
    const item = event.target;
    if (item.select === 'pick') {
      if (item.selected) {
        for (let i = 0; i < this.length; i++) {
          if (this[i] !== item && this[i].select === 'pick') {
            this[i].selected = false;
          }
        }
        this.updatePaths(item);
        this.dispatchEvent('item-selected', {item: item});
      } else {
        this.updatePaths();
      }
    }
  }

  selectDefault() {
    for (let i = 0; i < this.length; i++) {
      if (this[i].select === 'pick') {
        if (this[i].hasmore) {
          const selected = this[i].options.selectDefault();
          if (selected) return true;
        } else {
          this[i].selected = true;
          return true;
        }
      }
    }
    return false;
  }

  bind(prop: string) {
    debug: {
      if (prop === 'leaf') {
        console.warn('MenuPath: Binding to `leaf` property is not recommended. Use `path` or specific `root` instead.');
      }
    }
    return super.bind(prop);
  }

  dispose() {
    for (let i = 0; i < this.length; i++) {
      this[i].removeEventListener('selected-changed', this._onItemSelectedChanged);
    }
    super.dispose();
  }

  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
}