import { IoNode, RegisterIoNode } from '../../../core/node.js';
import { Property } from '../../../core/internals/property.js';
import { MenuOptions } from './menu-options.js';

export type MenuItemSelectType = 'pick' | 'toggle' | 'link' | 'none';

export type MenuItemArgsWeak = undefined | null | string | number | {
  value?: any,
  label?: string,
  icon?: string,
  hint?: string,
  disabled?: boolean,
  action?: () => void,
  select?: MenuItemSelectType,
  selected?: boolean,
  options?: MenuItemArgsWeak[] | MenuOptions,
};

export type MenuItemArgs = {
  value: any,
  label: string,
  icon?: string,
  hint?: string,
  disabled?: boolean,
  action?: () => void,
  select?: MenuItemSelectType,
  selected?: boolean,
  options?: MenuOptions,
};

// TODO: documentation!

@RegisterIoNode
export class MenuItem extends IoNode {

  @Property(undefined)
  declare value: any;

  @Property('')
  declare label: string;

  @Property('')
  declare icon: string;

  @Property('')
  declare hint: string;

  @Property(false)
  declare disabled: boolean;

  @Property(undefined)
  declare action: (value?: any) => void | undefined;

  @Property('pick')
  declare select: MenuItemSelectType;

  @Property(false)
  declare selected: boolean;

  @Property(undefined)
  declare options?: MenuOptions;

  get path() {
    return this.options?.path;
  }

  get hasmore() {
    return !!(this.options?.length);
  }

  getSubitem(value: any) {
    return this.options?.getItem(value);
  }

  constructor(args?: MenuItemArgsWeak) {
    const item: MenuItemArgs = {
      value: '',
      label: '',
    };

    if (typeof args !== 'object' || args === null) {
      item.value = args;
      item.label = String(args);
    } else {
      item.value = args.value;
      if (args.label === undefined) {
        if (typeof item.value === 'object') {
          item.label = item.value?.constructor.name || 'null';
        } else {
          item.label = String(item.value);
        }
      } else {
        item.label = args.label;
      }
      if (args.icon !== undefined) item.icon = args.icon;
      if (args.hint !== undefined) item.hint = args.hint;
      if (args.disabled !== undefined) item.disabled = args.disabled;
      if (args.action !== undefined) item.action = args.action;
      if (args.select !== undefined) item.select = args.select;
      if (args.selected !== undefined) item.selected = args.selected;

      if (args.options) {
        if (args.options instanceof MenuOptions) {
          item.options = args.options;
        } else {
          item.options = new MenuOptions(args.options);
        }
      }
    }

    debug: {
      if (item.select && item.select === 'toggle' && item.options) {
        console.warn('MenuItem: cannot have suboptions when `select === "toggle"`');
      }
      if (item.select && ['pick', 'toggle', 'link', 'none'].indexOf(item.select as string) === -1) {
        console.warn('MenuItem: unknown `select` property!', item.select);
      }
      if (item.action && typeof item.action !== 'function') {
        console.warn('MenuItem: invalid type of `action` property!', typeof item.action);
      }
    }

    super(item);

    if (this.options) {
      this.options.addEventListener('item-selected', this.onSubItemSelected);
    }
  }

  onSubItemSelected() {
    this.selected = true;
  }

  selectedChanged() {
     if (this.select === 'pick' && this.selected === false && this.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].select === 'pick') {
          this.options[i].selected = false;
        }
      }
      this.options.updatePaths();
    }
  }

  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }

  dispose() {
    if (this.options) {
      this.options.removeEventListener('item-selected', this.onSubItemSelected);
    }
    super.dispose();
  }
}