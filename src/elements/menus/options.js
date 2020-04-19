import {IoNode, IoNodeMixin} from '../../io.js';

// TODO: document and test!
export class Options extends IoNodeMixin(Array) {
  static get Properties() {
    return {
      selected: undefined,
    };
  }
  constructor(options = [], props = {}) {
    super(props);
    for (let i = 0; i < options.length; i++) {
      let option;
      if (options[i] instanceof Option) {
        options[i].select = options[i].select || props.select || '';
        option = options[i];
      } else if (typeof options[i] === 'object') {
        options[i].select = options[i].select || props.select || '';
        option = new Option(options[i]);
      } else {
        option = new Option({value: options[i], select: props.select});
      }
      option.connect(this);
      option.addEventListener('selected-changed', this.onSubOptionSelectedChanged);
      this.push(option);
    }
  }
  option(value) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].value === value) return this[i];
    }
    return null; 
  }
  onSubOptionSelectedChanged(event) {
    const target = event.target;
    if ((target.select === 'pick') && event.detail.value) {
      for (let i = 0; i < this.length; i++) {
        const option = this[i];
        if (option !== target) {
          this.unpickAll(option);
        }
      }
      this.selected = target.value;
    }
  }
  unpickAll(option) {
    if (option.select === 'pick' && option.selected) {
      option.selected = false;
      for (let i = 0; i < option.options.length; i++) {
        this.unpickAll(option.options[i]);
      }
    }
  }
}
Options.Register();

export class Option extends IoNode {
  static get Properties() {
    return {
      value: undefined,
      label: '',
      icon: '',
      hint: '',
      action: undefined,
      select: '', // 'toggle' | 'pick' | 'none'
      selected: undefined,
      options: {
        type: Options,
        strict: true
      }
    };
  }
  // TODO: test for robustness and document.
  get compose() {
		return {
			options: {'on-selected-changed': this.onOptionsSelectedChanged},
		};
	}
  constructor(option) {
    if (typeof option !== 'object' || option === null) {
      option = {
        value: option,
        label: option,
      };
    }
    if (option.options) {
      if (option.options instanceof Options && option.select) {
        option.options.select = option.select;
      } else {
        option.options = new Options(option.options, {select: option.select});
      }
    }
    if (!option.label) {
      if (typeof option.value === 'object') {
        option.label = option.value.constructor.name;
      } else {
        option.label = String(option.value);
      }
    }
    super(option);
  }
  get hasmore() {
    return !!(this.options.length);
  }
  onOptionsSelectedChanged(event) {
    this.selected = event.detail.value;
  }
  changed() {
    this.dispatchEvent('changed');
  }
}
Option.Register();
