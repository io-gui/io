import { Node, Register, ReactiveProperty, WithBinding, NodeArray } from 'io-gui';

export type MenuOptionMode = 'select' | 'toggle' | 'none';

export type MenuOptionProps = {
  id: string,
  value?: any,
  label?: string,
  icon?: string,
  hint?: string,
  action?: (value?: any) => void,
  mode?: MenuOptionMode,
  disabled?: boolean,
  selected?: WithBinding<boolean>,
  options?: MenuOptionProps[]
};

@Register
export class MenuOption extends Node {

  @ReactiveProperty({value: '', type: String})
  declare id: string;

  @ReactiveProperty({value: undefined})
  declare value: any;

  @ReactiveProperty({value: '', type: String})
  declare label: string;

  @ReactiveProperty({value: '', type: String})
  declare icon: string;

  @ReactiveProperty({value: '', type: String})
  declare hint: string;

  @ReactiveProperty({value: false, type: Boolean})
  declare disabled: boolean;

  @ReactiveProperty()
  declare action?: (value?: any) => void;

  @ReactiveProperty({value: 'select', type: String})
  declare mode: MenuOptionMode;

  @ReactiveProperty({value: false, type: Boolean})
  declare selected: boolean;

  @ReactiveProperty({value: '', type: String})
  declare selectedIDImmediate: string;

  @ReactiveProperty({value: '', type: String})
  declare selectedID: string;

  @ReactiveProperty({value: '', type: String})
  declare path: string;

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare options: NodeArray<MenuOption>;

  static get Listeners() {
    return {
      'io-node-array-option-selected': 'optionSelected',
    };
  }
  
  constructor(args: MenuOptionProps) {
    args = { ...args };
    args.label = args.label ?? args.id;
    args.options = args.options ?? [];
    args.options = args.options.map(option => new MenuOption(option));

    const selectedOptions = args.options.filter(option => option.mode === 'select' && option.selected);
    for (let i = 1; i < selectedOptions.length; i++) {
      debug: console.warn(`Duplicate selected options with mode "select" found!`, selectedOptions[i]);
      selectedOptions[i].selected = false;
    }

    super(args);
  }
  getAllOptions() {
    const options: MenuOption[] = [this];
    for (let i = 0; i < this.options.length; i++) {
      options.push(...this.options[i].getAllOptions());
    }
    debug: {
      const ids = new Set();
      for (let i = 0; i < options.length; i++) {
        if (ids.has(options[i].id)) console.warn(`Duplicate id "${options[i].id}"`, this);
        ids.add(options[i].id);
      }
    }
    return options;
  }
  findItemByValue(value: any) {
    const allItems = this.getAllOptions();
    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].value === value) return allItems[i];
    }
    return null;
  }
  findItemById(id: string) {
    const allItems = this.getAllOptions();
    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].id === id) return allItems[i];
    }
    return null;
  }
  selectDefault() {
    let walker: MenuOption | undefined = this.mode === 'select' ? this : undefined;
    while (walker) {
      const next = walker.options.find(option => option.mode === 'select');
      if (walker.mode === 'select' && next) {
        walker = next;
      } else {
        break;
      }
    }
    if (walker) walker.selected = true;
  }
  selectedChanged() {
    if (this.selected === false) {
      this.selectedIDImmediate = '';
      this.unselectAll();
    }
  }
  selectedIDChanged() {
    const option = this.findItemById(this.selectedID);
    if (option) option.selected = true;
  }
  selectedIDImmediateChanged() {
    this.selected = !!this.selectedIDImmediate;
    const option = this.options.find(option => option.id === this.selectedIDImmediate);
    if (option) option.selected = true;
    this.updatePaths();
  }
  optionSelected(event: CustomEvent) {
    const selectedItem = event.detail.option;
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i] as MenuOption;
      if (option !== selectedItem && option.mode === 'select') {
        option.selected = false;
      }
    }
  }
  updatePaths() {
    const path: string[] = [];
    if (this.mode !== 'select' || !this.selected) {
      this.path = '';
      return;
    }

    let walker = this.options.selected ? this.options.find(option => option.mode === 'select' && option.selected && option.id === this.options.selected) : undefined;
    if (!walker) return;

    let lastSelected = walker;
    while (walker) {
      path.push(walker.id);
      lastSelected = walker;
      walker = walker.options.selected ? walker.options.find(option => option.mode === 'select' && option.selected && option.id === walker!.options.selected) : undefined;
    }
    this.path = path.join(',');
  }
  pathChanged() {
    const path = this.path ? [...this.path.split(',')] : [];
    if (path.length) this.selectedID = path[path.length - 1];
  }
  optionsMutated(event: CustomEvent) {
    // console.log('optionsMutated', this.id, this.options.length);
    if (this.mode === 'select' && this.options.selected && this.options.length) {
      const selectedIDImmediate = this.options.selected;
      this.setProperties({
        selected: !!selectedIDImmediate,
        selectedIDImmediate: selectedIDImmediate,
      });
    }
    this.dispatchMutation();
  }
  unselectAll() {
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i];
      if (option.mode === 'select') {
        option.selected = false;
        option.unselectAll();
      }
    }
  }
  toJSON(): MenuOptionProps {
    return {
      id: this.id,
      value: this.value,
      label: this.label,
      icon: this.icon,
      hint: this.hint,
      disabled: this.disabled,
      // action: N/A for serialization
      mode: this.mode,
      options: this.options.map(option => option.toJSON()),
    };
  }
  fromJSON(json: MenuOptionProps) {
    this.setProperties({
      id: json.id,
      value: json.value ?? undefined,
      label: json.label ?? json.id,
      icon: json.icon ?? '',
      hint: json.hint ?? '',
      disabled: json.disabled ?? false,
      // action: N/A for serialization
      mode: json.mode ?? 'select',
      selected: json.selected ?? false,
      options: json.options?.map(option => new MenuOption(option)) ?? [],
    });
    return this;
  }
  changed() {
    debug: {
      if (['select', 'toggle', 'none'].indexOf(this.mode) === -1) {
        console.warn(`Unknown "mode" property "${this.mode}"!`, this);
      }
      if (this.selected && ['select', 'toggle'].indexOf(this.mode) === -1) {
        console.warn('"selected" property is only valid when mode is "select" or "toggle"!', this);
      }
      if (!this.id) {
        console.warn('"id" property is required!', this);
      }
      if (this.action && typeof this.action !== 'function') {
        console.warn(`Invalid type "${typeof this.action}" of "action" property!`, this);
      }
    }
  }
  dispose() {
    this.options.length = 0; // TODO: test magic!
    super.dispose();
  }
}