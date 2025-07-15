import { Node, NodeProps, ReactiveProperty, Register, WithBinding } from 'io-gui';
import { MenuItem, MenuItemDefLoose } from './MenuItem.js';

export type MenuOptionsProps = NodeProps & {
  selected?: WithBinding<string>,
  path?: string,
  delimiter?: string,
  items?: MenuItem[] | MenuItemDefLoose[],
};

function hardenMenuItems(itemsOrDefs: MenuItem[] | MenuItemDefLoose[]) {
  const items: MenuItem[] = [];
  for (let i = 0; i < itemsOrDefs.length; i++) {
    if (itemsOrDefs[i] instanceof MenuItem) {
      items.push(itemsOrDefs[i] as MenuItem);
    } else {
      items.push(new MenuItem().fromJSON(itemsOrDefs[i] as MenuItemDefLoose));
    }
  }
  return items;
}

@Register
export class MenuOptions extends Node {
  @ReactiveProperty('')
  declare selected: string;

  @ReactiveProperty('')
  declare selectedShallow: string;

  @ReactiveProperty('')
  declare path: string;

  @ReactiveProperty(',')
  declare delimiter: string;

  @ReactiveProperty([])
  declare items: MenuItem[];

  constructor(properties: MenuOptionsProps = {}) {
    const props = {...properties};
    if (props.items) {
      props.items = hardenMenuItems(props.items);
    }

    super(props);

    if (this.path !== '') this.pathChanged();

    this.initItems();
  }

  init() {
    this.updatePathsDebounced = this.updatePathsDebounced.bind(this);
  }

  getAllItems() {
    const items: MenuItem[] = [];
    for (let i = 0; i < this.items.length; i++) {
      items.push(this.items[i]);
      if (this.items[i].options) {
        items.push(...this.items[i].options!.getAllItems());
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
    this.items.length = 0;
    const items: MenuItem[] = [];
    for (let i = 0; i < menuItemDefLoose.length; i++) {
      items.push(new MenuItem().fromJSON(menuItemDefLoose[i]));
    }
    this.items = items;

    if (this.path !== '') this.pathChanged();

    this.initItems();
    return this;
  }

  moveItem(oldIndex: number, newIndex: number) {
    if (oldIndex >= 0 && oldIndex < this.items.length && newIndex >= 0 && newIndex < this.items.length) {
      this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0]);
    }
    this.dispatchMutation();
  }
  addItem(itemLoose: MenuItem | MenuItemDefLoose, index?: number) {
    // TODO handle options mutation in a better way
    let item = itemLoose as MenuItem;
    if (!(itemLoose instanceof MenuItem)) {
      item = new MenuItem().fromJSON(itemLoose);
    }
    const existingIndex = this.items.findIndex((otherItem: MenuItem) =>  otherItem === item);

    this.items.splice(index ?? this.items.length, 0, item);

    if (existingIndex !== -1) {
      this.items.splice(existingIndex, 1);
    } else {
      item.addEventListener('selected-changed', this.onItemSelectedChanged);
      item.addEventListener('path-changed', this.onSubOptionsPathChanged);
    }

    const clashingItem = this.items.find((otherItem: MenuItem) =>  otherItem !== item && otherItem.id === item.id);
    if (clashingItem) {
      this.removeItem(clashingItem);
    }

    // TODO move updatePaths to MenuItem. Handle setProperties better.
    if (item.selected && item.mode === 'select') {
      this.updatePaths(item);
    }
    this.dispatchMutation();
  }
  removeItemById(id: string) {
    const item = this.findItemById(id);
    if (item) this.removeItem(item);
  }
  removeItemByIndex(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.removeItem(this.items[index]);
    }
  }
  removeItem(item: MenuItem) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      item.removeEventListener('selected-changed', this.onItemSelectedChanged);
      item.removeEventListener('path-changed', this.onSubOptionsPathChanged);
      this.items.splice(index, 1);
      this.updatePaths();
    } else debug: {
      console.warn('MenuOptions.removeItem: cannot find item to remove!', this);
    }
    this.dispatchMutation();
  }

  initItems() {
    const items = this.items;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (!(item instanceof MenuItem)) {
        item = new MenuItem().fromJSON(item);
      }
      debug: {
        // TODO check if same item is at other index
        if (items.find((otherItem: MenuItem) =>  otherItem !== item && ['select', 'toggle'].includes(otherItem.mode) && otherItem.id !== undefined && otherItem.id === item.id)) {
          console.warn(`MenuOptions.addItems: duplicate id "${item.id}"`);
        }
      }
      item.addEventListener('selected-changed', this.onItemSelectedChanged);
      item.addEventListener('path-changed', this.onSubOptionsPathChanged);

      // TODO move updatePaths to MenuItem. Handle setProperties better.
      if (item.selected && item.mode === 'select') {
        this.updatePaths(item);
        continue;
      }
    }
  }

  unselectAll() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].mode === 'select') {
        this.items[i].selected = false;
      }
    }
    this.updatePaths();
  }

  pathChanged() {
    const path = this.path ? [...this.path.split(this.delimiter)] : [];
    if (this.items.length && path.length) {
      const first = path.shift();
      const item = this.items.find((item: MenuItem) => (item.id === first));
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
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].mode === 'select') this.items[i].selected = false;
        }
      }
    } else {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].mode === 'select') this.items[i].selected = false;
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
    this.updatePaths();
  }
  updatePaths(item?: MenuItem) {
    this.debounce(this.updatePathsDebounced, item);
  }
  updatePathsDebounced(item?: MenuItem) {
    const path: string[] = [];
    let walker: MenuItem | undefined = (item?.mode === 'select') ? item : undefined;
    let lastSelected: MenuItem | undefined = item?.mode === 'select' ? item : undefined;

    const hasSelected = this.items.find((item: MenuItem) => item.mode === 'select' && item.selected);
    if (!walker && hasSelected) return;

    while (walker) {
      path.push(walker.id);
      if (walker.mode === 'select') lastSelected = walker;
      walker = walker.options?.items.find((item: MenuItem) => (item.mode === 'select') && item.selected);
    }

    this.setProperties({
      path: path.join(this.delimiter),
      selected: lastSelected !== undefined ? lastSelected.id : '',
      selectedShallow: path[0] !== undefined ? path[0] : '',
    });

    if (path.length) {
      // NOTE: this does nothing. It is only for debugging.
      debug: {
        let id = path.shift();
        let item = this.items.find((item: MenuItem) => (item.selected === true && item.id === id && (item.mode === 'select')));
        let options = item?.options || undefined;
        while (path.length && options) {
          id = path.shift();
          item = options.items.find((item: MenuItem) => (item.selected === true && item.id === id && (item.mode === 'select')));
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
      }
    }
  }

  onItemSelectedChanged(event: CustomEvent) {
    const item = event.target as unknown as MenuItem;
    if (item.mode === 'select') {
      if (item.selected) {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i] !== item && this.items[i].mode === 'select') {
            this.items[i].selected = false;
          }
        }
        this.updatePaths(item);
        this.dispatch('item-selected', {item: item});
      } else {
        this.updatePaths();
      }
    }
  }

  onSubOptionsPathChanged(event: CustomEvent) {
    const item = event.target as unknown as MenuItem;
    item.selected ? this.updatePaths(item) : this.updatePaths();
  }

  selectDefault() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].mode === 'select') {
        if (this.items[i].hasmore) {
          const selected = this.items[i].options!.selectDefault();
          if (selected) return true;
        } else {
          this.items[i].selected = true;
          return true;
        }
      }
    }
    return false;
  }

  dispose() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].removeEventListener('selected-changed', this.onItemSelectedChanged);
      this.items[i].removeEventListener('path-changed', this.onSubOptionsPathChanged);
    }
    super.dispose();
  }
}