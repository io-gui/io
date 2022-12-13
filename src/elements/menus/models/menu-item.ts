import { IoNode, RegisterIoNode } from '../../../core/node.js';
import { IoElementArgs } from '../../../core/element.js';
import { Property } from '../../../core/internals/property.js';
import { MenuOptions } from './menu-options.js';

export type MenuItemSelectType = 'pick' | 'toggle' | 'link' | 'none';

export type MenuItemArgsWeak = undefined | null | string | number | MenuItemArgs;

export type MenuItemArgs = IoElementArgs & {
  value?: any,
  icon?: string,
  hint?: string,
  action?: () => void,
  select?: MenuItemSelectType,
  selected?: boolean,
  options?: MenuItemArgsWeak[] | MenuOptions
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
  declare action?: (value?: any) => void;

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
          if (item.value === null) {
            item.label = 'null';
          } else {
            item.label = `${item.value.constructor.name}` + (item.value instanceof Array ? `(${item.value.length})` : '');
          }
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
      if (args.options !== undefined) {
        if (args.options instanceof MenuOptions) {
          item.options = args.options;
        } else {
          item.options = new MenuOptions(args.options);
        }
      }
      if (item.selected === undefined && (args.select === 'pick' || args.select === undefined) && item.options) {
        item.selected = !!item.options.find((item: MenuItem) => item.selected && item.select === 'pick');
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
      this.options.addEventListener('item-selected', this._onSubItemSelected);
      this.options.addEventListener('path-changed', this._onOptionsPathChanged);
    }
  }

  toJSON() {
    const json: Record<string, any> = {
      value: this.value,
      label: this.label,
      icon: this.icon,
      hint: this.hint,
      disabled: this.disabled,
    };
    if (this.options) json.options = this.options;
    return json;
  }

  _onSubItemSelected() {
    this.selected = true;
  }

  _onOptionsPathChanged(event: CustomEvent) {
    this.dispatchEvent('path-changed', event.detail);
  }

  optionsChanged() {
    // TODO test this behavior and look for regressions
    if (this.options?.root !== undefined && this.select === 'pick') {
      this.selected = true;
    }
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
      this.options.removeEventListener('item-selected', this._onSubItemSelected);
      this.options.removeEventListener('path-changed', this._onOptionsPathChanged);
    }
    super.dispose();
  }
}