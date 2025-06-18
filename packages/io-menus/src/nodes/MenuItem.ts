import { Node, Register, NodeProps, ReactiveProperty, WithBinding, Change } from 'io-gui';
import { MenuOptions } from './MenuOptions.js';

export type MenuItemSelectType = 'select' | 'toggle' | 'link' | 'action'| 'none';

// TODO: MenuItemProps options should be array of MenuItemDefLoose?
export type MenuItemDefLoose = undefined | null | string | number | MenuItemProps;

// TODO: consider deprecating inferring id from value.
function defaultId(item: MenuItemProps) {
  if (typeof item.value === 'string') return item.value;
  if (typeof item.value === 'number') return String(item.value);
  return '';
}

function defaultLabel(item: MenuItemProps) {
  if (item.id) return item.id;
  if (typeof item.value === 'object') {
    if (item.value === null) return 'null';
    return `${item.value.constructor.name}` + (item.value instanceof Array ? `(${item.value.length})` : '');
  }
  if (item.value !== undefined) return String(item.value);
  return '';
}

export type MenuItemProps = NodeProps & {
  value?: any,
  id?: string,
  label?: string,
  icon?: string,
  hint?: string,
  action?: () => void,
  mode?: MenuItemSelectType,
  hidden?: boolean,
  disabled?: boolean,
  selected?: WithBinding<boolean>,
  options?: MenuOptions | MenuItemDefLoose[]
};

@Register
export class MenuItem extends Node {

  @ReactiveProperty({value: undefined})
  declare value: any;

  @ReactiveProperty({value: '', type: String})
  declare id: string;

  @ReactiveProperty({value: '', type: String})
  declare label: string;

  @ReactiveProperty({value: '', type: String})
  declare icon: string;

  @ReactiveProperty({value: '', type: String})
  declare hint: string;

  @ReactiveProperty({value: false, type: Boolean})
  declare hidden: boolean;

  @ReactiveProperty({value: false, type: Boolean})
  declare disabled: boolean;

  @ReactiveProperty({value: undefined, type: Function, init: null})
  declare action?: (value?: any) => void;

  @ReactiveProperty({value: 'select', type: String})
  declare mode: MenuItemSelectType;

  @ReactiveProperty({value: false, type: Boolean})
  declare selected: boolean;

  @ReactiveProperty({value: undefined, type: MenuOptions, init: null})
  declare options?: MenuOptions;

  get hasmore() {
    return !!(this.options?.items.length);
  }
  constructor(args?: MenuItemProps) {
    const item: MenuItemProps = {...args};
    if (item.id === undefined) item.id = defaultId(item);
    if (item.label === undefined) item.label = defaultLabel(item);
    super(item as NodeProps);
  }
  findItemByValue(value: any) {
    return this.options?.findItemByValue(value) || null;
  }
  findItemById(id: string) {
    return this.options?.findItemById(id) || null;
  }
  fromJSON(looseDef: MenuItemDefLoose) {
    const item: MenuItemProps = {};
    if (typeof looseDef === 'object' && looseDef !== null) {
      if (Object.hasOwn(looseDef, 'value')) item.value = looseDef.value;
      if (Object.hasOwn(looseDef, 'id')) item.id = looseDef.id;
      if (Object.hasOwn(looseDef, 'label')) item.label = looseDef.label;
      if (Object.hasOwn(looseDef, 'icon')) item.icon = looseDef.icon;
      if (Object.hasOwn(looseDef, 'hint')) item.hint = looseDef.hint;
      if (Object.hasOwn(looseDef, 'hidden')) item.hidden = looseDef.hidden;
      if (Object.hasOwn(looseDef, 'disabled')) item.disabled = looseDef.disabled;
      if (Object.hasOwn(looseDef, 'action')) item.action = looseDef.action;
      if (Object.hasOwn(looseDef, 'mode')) item.mode = looseDef.mode;
      if (Object.hasOwn(looseDef, 'selected')) item.selected = looseDef.selected;
      if (Object.hasOwn(looseDef, 'options')) {
        if (looseDef.options instanceof MenuOptions) {
          item.options = looseDef.options;
        } else {
          item.options = new MenuOptions().fromJSON(looseDef.options as MenuItemDefLoose[]);
        }
      }
    } else {
      item.value = looseDef;
    }
    if (item.id === undefined) item.id = defaultId(item);
    if (item.label === undefined) item.label = defaultLabel(item);
    this.applyProperties(item);
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
  onOptionsItemSelected() {
    if (this.mode === 'select') {
      this.selected = true;
    }
  }
  onOptionsPathChanged(event: CustomEvent) {
    this.dispatchEvent('path-changed', event.detail);
    if (this.mode === 'select') {
      this.selected = !!this.options?.path;
    }
  }
  optionsChanged(change: Change) {
    if (change.oldValue) {
      change.oldValue.removeEventListener('item-selected', this.onOptionsItemSelected);
      change.oldValue.removeEventListener('path-changed', this.onOptionsPathChanged);
    }
    if (change.value) {
      change.value.addEventListener('item-selected', this.onOptionsItemSelected);
      change.value.addEventListener('path-changed', this.onOptionsPathChanged);
    }
    if (this.mode === 'select') {
      this.selected = !!this.options?.selected;
    }
  }
  selectedChanged() {
    if (this.selected === false) this.options?.unselectAll();
  }
  changed() {
    debug: {
      if (this.options && ['select', 'none'].indexOf(this.mode) === -1) {
        console.warn('MenuItem: item with options must have mode set to "select" or "none"', this);
      }
      if (['select', 'toggle', 'link', 'action','none'].indexOf(this.mode) === -1) {
        console.warn(`MenuItem: unknown mode property "${this.node}"!`, this);
      }
      if (this.mode === 'action' && !this.action) {
        console.warn('MenuItem: action property is required when mode is "action"!', this);
      }
      if (this.selected && ['select', 'toggle'].indexOf(this.mode) === -1) {
        console.warn('MenuItem: selected property is only valid when mode is "select" or "toggle"!', this);
      }
      if (this.mode === 'select' && !this.id) {
        console.warn('MenuItem: id property is required when mode is "select"!', this);
      }
      if (this.action && typeof this.action !== 'function') {
        console.warn(`MenuItem: invalid type of action property type "${typeof this.action}"!`, this);
      }
    }
  }
  dispose() {
    if (this.options) {
      this.options.removeEventListener('item-selected', this.onOptionsItemSelected);
      this.options.removeEventListener('path-changed', this.onOptionsPathChanged);
    }
    super.dispose();
  }
}