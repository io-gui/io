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
    if (option.select === 'pick') {
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
			options: {'on-selected-changed': this.onSuboptionPicked},
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
    super(option);
  }
  get hasmore() {
    return !!(this.options.length);
  }
  onSuboptionPicked(event) {
    console.log(event.detail.value);
    this.selected = event.detail.value;
  }
  changed() {
    this.dispatchEvent('changed');
  }
}
Option.Register();

// export class Route extends IoNode {
//   static get Properties() {
//     return {
//       value: '',
//       options: Options,
//     };
//   }
//   constructor(props) {
//     super(props);
//     this.value = this._getDefault().value;
//   }
//   _getValidOption(option) {
//     if (typeof option === 'string') {
//       return {value: option};
//     } else if (typeof option === 'object') {
//       return {
//         value: option.value,
//         options: option.options,
//       };
//     }
//   }
//   _getDefault() {
//     if (this.options instanceof Array && this.options[0]) {
//       return this._getValidOption(this.options[0]);
//     }
//   }
//   _getSelected() {
//     const value = this.value;
//     for (let i = 0; i < this.options.length; i++) {
//       let option = this.options[i];
//       if (typeof option === 'string' && option === value) {
//         return [this._getValidOption(option)];
//       } else if (typeof option === 'object') {
//         option = this._getValidOption(option);
//         if (option.value === value) {
//           if (option.options && this[value] instanceof Route) {
//             const selected = this[value]._getSelected();
//             return [option, ...selected];
//           } else {
//             return [option];
//           }
//         }
//       }
//     }
//   }
// }
// Route.Register();
