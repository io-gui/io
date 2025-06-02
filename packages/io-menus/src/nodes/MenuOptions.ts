import { NodeMixin, NodeProps, ReactiveProperty, Register, WithBinding } from 'io-gui';
import { MenuItem, MenuItemDefLoose } from './MenuItem.js';

export type MenuOptionsProps = NodeProps & {
  selected?: WithBinding<string>,
  path?: string,
  delimiter?: string,
  items?: MenuItem[],
};

@Register
export class MenuOptions extends NodeMixin(Array) {
  @ReactiveProperty('')
  declare selected: string;

  @ReactiveProperty('')
  declare path: string;

  @ReactiveProperty(',')
  declare delimiter: string;

  @ReactiveProperty([])
  declare items: MenuItem[];

  @ReactiveProperty('debounced')
  declare reactivity: string;

  constructor(properties: MenuOptionsProps = {}) {
    super(properties);
    this.push(...this.items);

    if (this.path !== '') this.pathChanged();

    this.initItems(this.items);
  }

  getAllItems() {
    const items: MenuItem[] = [];
    for (let i = 0; i < this.length; i++) {
      items.push(this[i]);
      if (this[i].options) {
        items.push(...this[i].options.getAllItems());
      }
    }
    // Check if there are items with duplicate ida
    debug: {
      const ids = new Set();
      for (let i = 0; i < items.length; i++) {
        if (items[i].id !== undefined && ids.has(items[i].id)) {
          console.warn(`MenuOptions.getAllItems: duplicate id "${items[i].id}"`, this);
        }
        ids.add(items[i].id);
      }
    }
    return items;
  }

  findItemByValue(value: any) {
    const allItems = this.getAllItems();
    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].value === value) return allItems[i];
    }
    return null;
  }

  findItemById(id: string) {
    const allItems = this.getAllItems();
    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].id === id) return allItems[i];
    }
    return null;
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
        if (this.find((otherItem: MenuItem) =>  otherItem !== item && otherItem.id !== undefined && otherItem.id === item.id)) {
          console.warn(`MenuOptions.addItems: duplicate id "${item.id}"`);
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

  unselectAll() {
    for (let i = 0; i < this.length; i++) {
      if (this[i].mode === 'select') {
        this[i].selected = false;
      }
    }
    this.updatePaths();
  }

  pathChanged() {
    const path = this.path ? [...this.path.split(this.delimiter)] : [];
    if (this.length && path.length) {
      const first = path.shift();
      const item = this.find((item: MenuItem) => (item.id === first));
      if (item) {
        debug: if (item.mode !== 'select') {
          console.warn('MenuOptions.pathChanged: Path set to non-selectable MenuItem!');
        }
        if (item.mode === 'select') {
          if (item.options) {
            item.options.path = path.join(this.delimiter);
          }
          item.selected = true;
        }
      } else {
        debug: console.warn(`MenuOptions.pathChanged: cannot find item for specified path "${this.path}"!`);
        for (let i = 0; i < this.length; i++) {
          if (this[i].mode === 'select') this[i].selected = false;
        }
      }
    } else {
      for (let i = 0; i < this.length; i++) {
        if (this[i].mode === 'select') this[i].selected = false;
      }
    }
  }

  selectedChanged() {
    if (!this.selected) return;
    // Deep search options for matching item id
    const item = this.findItemById(this.selected);
    if (item) {
      item.selected = true;
    } else {
      console.warn(`MenuOptions.selectedChanged: cannot find item for specified selected id "${this.selected}"!`, this);
    }

    // NOTE: this does nothing. It is only for debugging.
    debug: if (this.selected !== undefined) {
      const path = this.path ? [...this.path.split(this.delimiter)] : [];
      if (path.length) {
        let id = path.shift();
        let item = this.find((item: MenuItem) => (item.selected === true && item.id === id && (item.mode === 'select')));
        let options = item?.options || undefined;
        while (path.length && options) {
          id = path.shift();
          item = options.find((item: MenuItem) => (item.selected === true && item.id === id && (item.mode === 'select')));
          options = item?.options || undefined;
        }
        if (item === undefined) {
          console.warn(`MenuOptions.selectedChanged: cannot find item for specified selected id "${this.selected}"!`);
        } else if (
          (item.id !== this.selected)
        ) {
          // TODO: test this?
          console.warn(`MenuOptions.selectedChanged: selected property id "${this.selected}" diverged from item specified by path "${this.path}"!`);
        }
      } else {
        console.warn(`MenuOptions.selectedChanged: selected property id set "${this.selected}" but path is empty!`);
        // TODO: this case happens in io-element-demo.js options. Consider updating paths on selectedChanged.
        // TODO: running updatePaths() here breaks the demo - id "[element-name]" becomes "element-name" for some reason.
      }
    }
  }

  updatePaths(item?: MenuItem) {
    const path: string[] = [];
    let walker: MenuItem | undefined = (item?.mode === 'select') ? item : undefined;
    let lastSelected: MenuItem | undefined = item?.mode === 'select' ? item : undefined;

    const hasSelected = this.find((item: MenuItem) => item.mode === 'select' && item.selected);
    if (!walker && hasSelected) return;

    while (walker) {
      path.push(walker.id);
      if (walker.mode === 'select') lastSelected = walker;
      walker = walker.options?.find((item: MenuItem) => (item.mode === 'select') && item.selected);
    }

    this.setProperties({
      path: path.join(this.delimiter),
      selected: lastSelected !== undefined ? lastSelected.id : this.selected,
    });
  }

  _onItemSelectedChanged(event: CustomEvent) {
    const item = event.target as unknown as MenuItem;
    if (item.mode === 'select') {
      if (item.selected) {
        for (let i = 0; i < this.length; i++) {
          if (this[i] !== item && this[i].mode === 'select') {
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
      if (this[i].mode === 'select') {
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

  // bind<T>(prop: string): Binding<T> {
  //   debug: if (prop === 'selected') {
  //     console.warn('MenuPath: Binding to `selected` property is not recommended!');
  //     // TODO: remove this warning and test edge cases. Binding to selected is useful for nested options.
  //   }
  //   return super.bind<T>(prop);
  // }

  dispose() {
    for (let i = 0; i < this.length; i++) {
      this[i].removeEventListener('selected-changed', this._onItemSelectedChanged);
      this[i].removeEventListener('path-changed', this._onSubOptionsPathChanged);
    }
    super.dispose();
  }
}