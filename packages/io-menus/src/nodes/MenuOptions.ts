import { NodeMixin, NodeProps, Property, Register, PropsWithBinding } from 'io-gui';
import { MenuItem, MenuItemDefLoose } from './MenuItem.js';

function _isNaN(value: any) {
  return typeof value === 'number' && isNaN(value);
}

function _isSelectable(value: string) {
  return value === 'select' || value === 'scroll';
}

export type MenuOptionsProps = NodeProps & PropsWithBinding<{
  first?: any,
  last?: any,
  scroll?: string,
  path?: string,
  delimiter?: string,
  items?: MenuItem[],
}>;

@Register
export class MenuOptions extends NodeMixin(Array) {
  @Property(undefined)
  declare first: any;

  @Property(undefined)
  declare last: any;

  @Property(undefined)
  declare scroll: any;

  @Property('')
  declare path: string;

  @Property(',')
  declare delimiter: string;

  @Property([])
  declare items: MenuItem[];

  // TODO: change to `find` and add find by id and label.
  getItem(value: any, deep = false) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value === value) return this[i];
      if (deep && this[i].options) {
        const item = this[i].options.getItem(value, deep);
        if (item) return item;
      }
    }
    return null;
  }

  constructor(properties: MenuOptionsProps = {}) {
    super(properties);
    this.push(...this.items);

    if (this.path !== '') this.pathChanged();
    if (this.first !== undefined) this.firstChanged();

    this.initItems(this.items);
  }

  fromJSON(menuItemDefLoose: MenuItemDefLoose[]) {
    this.length = 0;
    const items: MenuItem[] = [];
    for (let i = 0; i < menuItemDefLoose.length; i++) {
      items.push(new MenuItem().fromJSON(menuItemDefLoose[i]));
    }
    this.items = items;
    this.push(...items);

    if (this.path !== '') this.pathChanged();
    if (this.first !== undefined) this.firstChanged();

    this.initItems(items);
    return this;
  }

  initItems(items: MenuItem[]) {
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (!(item instanceof MenuItem)) {
        item = new MenuItem().fromJSON(item);
      }
      debug: {
        if (!(item instanceof MenuItem)) {
          console.warn('MenuOptions.constructor: item is not a MenuItem!');
        }
        // TODO check if same item is at other index
        if (this.find((otherItem: MenuItem) => otherItem !== item && otherItem.label === item.label)) {
          console.warn(`MenuOptions.addItems: duplicate label "${item.label}"`);
        }
      }
      item.addEventListener('selected-changed', this._onItemSelectedChanged);
      item.addEventListener('path-changed', this._onSubOptionsPathChanged);

      // TODO move updatePaths to MenuItem. Handle setProperties better.
      if (item.selected && item.mode === 'select') {
        this.updatePaths(item);
        continue;
      }
    }
  }

  pathChanged() {
    const path = this.path ? [...this.path.split(this.delimiter)] : [];
    if (this.length && path.length) {
      const first = path.shift();
      const item = this.find((item: MenuItem) => (item.label === first));
      if (item) {
        debug: if (!_isSelectable(item.mode)) {
          console.warn('MenuOptions.pathChanged: Path set to non-selectable MenuItem!');
        }
        if (_isSelectable(item.mode)) {
          if (item.options) {
            item.options.path = path.join(this.delimiter);
          }
          item.selected = true;
        }
      } else {
        debug: console.warn(`MenuOptions.pathChanged: cannot find item for specified path "${this.path}"!`);
        for (let i = 0; i < this.length; i++) {
          if (_isSelectable(this[i].mode)) this[i].selected = false;
        }
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        if (_isSelectable(this[i].mode)) this[i].selected = false;
      }
    }
  }

  firstChanged() {
    if (this.first !== undefined) {
      const item = this.find((item: MenuItem) => ((item.value === this.first && item.mode === 'select') || (_isNaN(item.value) && _isNaN(this.first))));
      if (item) {
        item.selected = true;
      }
      debug: if (item === undefined) {
        console.warn(`MenuOptions.firstChanged: cannot find pickable item for specified first value "${this.first}"!`);
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        if (this[i].mode === 'select') this[i].selected = false;
      }
    }
  }

  lastChanged() {
    // TODO: this function does nothing. Its only for debugging.
    debug: if (this.last !== undefined) {
      const path = this.path ? [...this.path.split(this.delimiter)] : [];
      if (path.length) {
        let label = path.shift();
        let item = this.find((item: MenuItem) => (item.selected === true && item.label === label && (item.mode === 'select' || item.mode === 'scroll')));
        let options = item?.options || undefined;
        while (path.length && options) {
          label = path.shift();
          item = options.find((item: MenuItem) => (item.selected === true && item.label === label && (item.mode === 'select' || item.mode === 'scroll')));
          options = item?.options || undefined;
        }
        if (item === undefined) {
          console.warn(`MenuOptions.lastChanged: cannot find item for specified last value "${this.last}"!`);
        } else if (
          (item.value !== this.last && !(_isNaN(item.value) && _isNaN(this.last))) &&
          (item.value !== this.scroll && !(_isNaN(item.value) && _isNaN(this.scroll)))
        ) {
          // TODO: test this?
          console.warn(`MenuOptions.lastChanged: last property value "${this.last}" diverged from item specified by path!`);
        }
      } else {
        console.warn(`MenuOptions.lastChanged: last property value set "${this.last}" but path is empty!`);
        // TODO: this case happens in io-element-demo.js options. Consider updating paths on lastChanged.
        // TODO: running updatePaths() here breaks the demo - value "[element-name]" becomes "element-name" for some reason.
      }
    }
  }

  updatePaths(item?: MenuItem) {
    const path: string[] = [];
    let walker: MenuItem | undefined = (item?.mode === 'select' || item?.mode === 'scroll') ? item : undefined;
    let lastSelected: MenuItem | undefined = item?.mode === 'select' ? item : undefined;
    let lastAnchor: MenuItem | undefined = item?.mode === 'scroll' ? item : undefined;

    const hasSelected = this.find((item: MenuItem) => item.mode === 'select' && item.selected);
    const hasAnchor = this.find((item: MenuItem) => item.mode === 'scroll' && item.selected);
    if (!walker && (hasSelected || hasAnchor)) return;

    while (walker) {
      path.push(walker.label);
      if (walker.mode === 'select') lastSelected = walker;
      if (walker.mode === 'scroll') lastAnchor = walker;
      walker = walker.options?.find((item: MenuItem) => (item.mode === 'select' || item.mode === 'scroll') && item.selected);
    }

    // TODO: when binding two menu elements to both `first` and `path` properties, it is important that we
    // update the `path` property before the `first`. Otherwise, the menu binding will be broken!
    // TODO: create a test for this edge-case.
    this.setProperties({
      path: path.join(this.delimiter),
      first: item?.mode === 'select' ? item.value : undefined,
      last: lastSelected !== undefined ? lastSelected.value : undefined,
      scroll: lastAnchor !== undefined ? lastAnchor.value : undefined,
    });
  }

  _onItemSelectedChanged(event: CustomEvent) {
    const item = event.target as unknown as MenuItem;
    if (_isSelectable(item.mode)) {
      if (item.selected) {
        for (let i = 0; i < this.length; i++) {
          if (this[i] !== item && _isSelectable(this[i].mode)) {
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

  _onSubOptionsPathChanged(event: CustomEvent) {
    const item = event.target as unknown as MenuItem;
    item.selected ? this.updatePaths(item) : this.updatePaths();
  }

  selectDefault() {
    for (let i = 0; i < this.length; i++) {
      if (_isSelectable(this[i].mode)) {
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
    debug: if (prop === 'last' || prop === 'scroll') {
      console.warn('MenuPath: Binding to `last` or `scroll` property is not recommended!');
      // TODO: remove this warning and test edge cases. Binding to last is useful for nested options.
    }
    return super.bind(prop);
  }

  dispose() {
    for (let i = 0; i < this.length; i++) {
      this[i].removeEventListener('selected-changed', this._onItemSelectedChanged);
      this[i].removeEventListener('path-changed', this._onSubOptionsPathChanged);
    }
    super.dispose();
  }
}