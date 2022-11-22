import { IoNode, RegisterIoNode } from '../../../core/node.js';
import { MenuOptions } from './menu-options.js';
import { Property } from '../../../core/internals/property.js';


// TODO: document and test!
// TODO: consider menu model mutations.
// TODO: test for robustness and document.
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

  @Property(undefined)
  declare action: () => void | undefined;

  @Property('pick')
  declare select: 'pick' | 'toggle' | 'link' | 'none';

  @Property(false)
  declare selected: boolean;

  @Property(MenuOptions)
  declare options: MenuOptions;

  get path() {
    return this.options.path;
  }

  get hasmore() {
    return !!(this.options.length);
  }

  getSubitem(value: any) {
    return this.options.getItem(value);
  }

  constructor(option: any) {
    if (typeof option !== 'object' || option === null) {
      option = {
        value: option,
        label: option,
      };
    }
    if (option.options) {
      if (!(option.options instanceof MenuOptions)) {
        option.options = new MenuOptions(option.options);
      }
    }
    if (!option.label) {
      if (typeof option.value === 'object') {
        option.label = option.value.constructor.name;
      } else {
        option.label = String(option.value);
      }
    }
    if (option.select === 'toggle' && option.options && option.options.length) {
      console.warn('IoGUI Item: options with {select: "toggle"} cannot have suboptions!');
      option.options = new MenuOptions();
    }
    if (option.select === 'pick' && option.options.length) {
      option.selected = !!option.options.path.value.length;
      option.path.value = [...option.options.path.value];
    }
    super(option);
    if (this.select === 'pick' && this.options.length) {
      this.selectByPath(!!this.options.path.value.length, [...this.options.path.value]);
    }
  }

  onOptionsSelectedPathChanged() {
    if (this.select === 'pick') {
      this.selectByPath(!!this.options.path.value.length, [...this.options.path.value]);
    }
  }
  optionsChanged() {
    // TODO: test GC
    this.options.addEventListener('path-changed', this.onOptionsSelectedPathChanged);
  }
  selectedChanged() {
     if (this.select === 'pick') {
      if (!this.selected) {
        this.options.selectByPath([]);
        this.selectByPath(false, []);
      }
    }
  }
  selectByPath(selected: boolean, path: string[]) {
    this.options.path.value = path;
    this.selected = selected;
    this.dispatchEvent('path-changed', this.options.path); // TODO: TEMP HACK
  }
  changed() {
    this.dispatchEvent('changed');
  }
}