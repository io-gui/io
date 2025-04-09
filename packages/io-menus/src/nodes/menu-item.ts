import { IoNode, Register, IoNodeArgs, Property, ArgsWithBinding } from 'io-gui';
import { MenuOptions } from './menu-options.js';

export type MenuItemSelectType = 'select' | 'scroll' | 'toggle' | 'link' | 'none';

// TODO: MenuItemArgs options shoudl be array of MenuItemDefLoose
export type MenuItemDefLoose = undefined | null | string | number | MenuItemArgs;

export type MenuItemArgs = IoNodeArgs & ArgsWithBinding<{
  value?: any,
  label?: string,
  icon?: string,
  hint?: string,
  action?: () => void,
  mode?: MenuItemSelectType,
  hidden?: boolean,
  disabled?: boolean,
  selected?: boolean,
  options?: MenuOptions | MenuItemDefLoose[]
}>;

// TODO: documentation!

@Register
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
  declare hidden: boolean;

  @Property(false)
  declare disabled: boolean;

  @Property(undefined)
  declare action?: (value?: any) => void;

  @Property('select')
  declare mode: MenuItemSelectType;

  @Property(false)
  declare selected: boolean;

  @Property(undefined)
  declare options?: MenuOptions;

  get hasmore() {
    return !!(this.options?.length);
  }

  getSubitem(value: any) {
    return this.options?.getItem(value);
  }

  constructor(args?: MenuItemArgs) {

    const item: MenuItemArgs = {...args};

    if (item.label === undefined) {
      if (typeof item.value === 'object') {
        if (item.value === null) {
          item.label = 'null';
        } else {
          item.label = `${item.value.constructor.name}` + (item.value instanceof Array ? `(${item.value.length})` : '');
        }
      } else {
        item.label = String(item.value);
      }
    }

    if (item.selected === undefined && (item.mode === 'select' || item.mode === undefined) && item.options) {
      item.selected = !!(item.options as MenuOptions).find((item: MenuItem) => item.selected && item.mode === 'select');
    }

    debug: {
      if (item.mode && (item.mode === 'toggle') && item.options) {
        console.warn('MenuItem: cannot have suboptions when `mode === "toggle"`');
      }
      if (item.mode && (item.mode === 'scroll') && item.options) {
        console.warn('MenuItem: cannot have suboptions when `mode === "scroll"`');
      }
      if (item.mode && ['select', 'toggle', 'scroll', 'link', 'none'].indexOf(item.mode as string) === -1) {
        console.warn('MenuItem: unknown `mode` property!', item.mode);
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

  fromJSON(looseDef: MenuItemDefLoose) {

    const item: MenuItemArgs = {};
    if (typeof looseDef === 'object' && looseDef !== null) {
      if (Object.hasOwn(looseDef, 'value')) item.value = looseDef.value;
      if (Object.hasOwn(looseDef, 'label')) item.label = looseDef.label;
      if (Object.hasOwn(looseDef, 'icon')) item.icon = looseDef.icon;
      if (Object.hasOwn(looseDef, 'hint')) item.hint = looseDef.hint;
      if (Object.hasOwn(looseDef, 'hidden')) item.hidden = looseDef.hidden;
      if (Object.hasOwn(looseDef, 'disabled')) item.disabled = looseDef.disabled;
      if (Object.hasOwn(looseDef, 'action')) item.action = looseDef.action;
      if (Object.hasOwn(looseDef, 'mode')) item.mode = looseDef.mode;
      if (Object.hasOwn(looseDef, 'selected')) item.selected = looseDef.selected;
      if (Object.hasOwn(looseDef, 'options')) {
        item.options = new MenuOptions().fromJSON(looseDef.options as MenuItemDefLoose[]);
      }
    } else {
      item.value = looseDef;
    }

    if (item.label === undefined) {
      if (typeof item.value === 'object') {
        if (item.value === null) {
          item.label = 'null';
        } else {
          item.label = `${item.value.constructor.name}` + (item.value instanceof Array ? `(${item.value.length})` : '');
        }
      } else {
        item.label = String(item.value);
      }
    }

    if (item.selected === undefined && (item.mode === 'select' || item.mode === undefined) && item.options) {
      item.selected = !!(item.options as MenuOptions).find((item: MenuItem) => item.selected && item.mode === 'select');
    }

    debug: {
      if (item.mode && (item.mode === 'toggle') && item.options) {
        console.warn('MenuItem: cannot have suboptions when `mode === "toggle"`');
      }
      if (item.mode && (item.mode === 'scroll') && item.options) {
        console.warn('MenuItem: cannot have suboptions when `mode === "scroll"`');
      }
      if (item.mode && ['select', 'toggle', 'scroll', 'link', 'none'].indexOf(item.mode as string) === -1) {
        console.warn('MenuItem: unknown `mode` property!', item.mode);
      }
      if (item.action && typeof item.action !== 'function') {
        console.warn('MenuItem: invalid type of `action` property!', typeof item.action);
      }
    }

    this.applyProperties(item);

    if (this.options) {
      this.options.addEventListener('item-selected', this._onSubItemSelected);
      this.options.addEventListener('path-changed', this._onOptionsPathChanged);
    }

    return this;
  }

  toJSON() {
    const json: Record<string, any> = {
      value: this.value,
      label: this.label,
      icon: this.icon,
      hint: this.hint,
      hidden: this.hidden,
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
    if ((this.options?.first !== undefined || this.options?.scroll !== undefined) && this.mode === 'select') {
      this.selected = true;
    }
  }

  selectedChanged() {
     if (this.mode === 'select' && this.selected === false && this.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].mode === 'select' || this.options[i].mode === 'scroll') {
          this.options[i].selected = false;
        }
      }
      this.options.updatePaths();
    }
  }

  dispose() {
    if (this.options) {
      this.options.removeEventListener('item-selected', this._onSubItemSelected);
      this.options.removeEventListener('path-changed', this._onOptionsPathChanged);
    }
    super.dispose();
  }
}