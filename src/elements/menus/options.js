import {IoNode} from '../../io.js';

// TODO: document and test!

export class Options extends IoNode {
  static get Properties() {
    return {
      selected: undefined,
    };
  }
  constructor(options, props) {
    super(props);
    Object.defineProperty(this, '__options', {value: []});
    if (options && options instanceof Array) {
      for (let i = 0; i < options.length; i++) {
        let option = (options[i] instanceof Option) ? options[i] : new Option(options[i]);
        option.connect(this);
        option.addEventListener('selected-changed', this.onSubOptionSelectedChanged);
        // TODO: Test node connections!
        this.__options.push(option);
      }
    }
  }
  option(value) {
    for (let i = 0; i < this.__options.length; i++) {
      if (this.__options[i].value === value) {
        return this.__options[i];
      }
    }
    return null; 
  }
  map(fn) {
    return this.__options.map(fn);
  }
  find(fn) {
    return this.__options.find(fn);
  }
  onSubOptionSelectedChanged(event) {
    const target = event.target;
    if ((target.select === 'pick') && event.detail.value) {
      for (let i = 0; i < this.__options.length; i++) {
        const option = this.__options[i];
        if (option !== target) {
          this.unpickAll(option);
        }
      }
      this.dispatchEvent('option-picked', target);
      this.selected = target.value;
      // console.log(this.selected, target);
    }
  }
  unpickAll(option) {
    if (option.select === 'pick') {
      option.selected = false;
      for (let i = 0; i < option.options.__options.length; i++) {
        this.unpickAll(option.options.__options[i]);
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
      select: 'pick', // 'toggle' | 'pick' | 'none'
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
			options: {'on-option-picked': this.onSuboptionPicked},
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
      option.options = option.options instanceof Options ? option.options : new Options(option.options);
    }
    super(option);
  }
  get hasmore() {
    return !!(this.options.__options.length);
  }
  onSuboptionPicked(event) {
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
