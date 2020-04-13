import {IoNode} from './io-node.js';

// TODO: document and test!

class Option {
  constructor(option) {
    if (typeof option === 'string') {
      option = {
        value: option,
        label: option,
      };
    }
    if (!option) {
      option = {
        value: null,
        label: 'Menu option not initialized!',
      };
    }
    this.label = option.label;
    this.value = option.value;
    this.action = option.action || null;
    this.selectable = option.selectable || false;
    this.icon = option.icon || '';
    this.options = option.options instanceof Options ? option.options : null;
  }
}

export class Options extends Array {
  constructor(options) {
    super();
    if (options instanceof Array) {
      for (let i = 0; i < options.length; i++) {
        if (options[i] instanceof Option) this.push(options[i]);
        else this.push(new Option(options[i]));
      }
    }
  }
}

export class Route extends IoNode {
  static get Properties() {
    return {
      value: '',
      options: Options,
    };
  }
  constructor(props) {
    super(props);
    this.value = this._getDefault().value;

    // if (this.options instanceof Array) {
    //   for (let i = 0; i < this.options.length; i++) {
    //     const option = this.options[i];
    //     if (typeof option === 'object' && option.options) {
    //       this[option.value] = new Route({options: option.options});
    //     }
    //   }
    // }

    // this.connect();
  }
  _getValidOption(option) {
    if (typeof option === 'string') {
      return {value: option};
    } else if (typeof option === 'object') {
      return {
        value: option.value,
        options: option.options,
      };
    }
  }
  _getDefault() {
    if (this.options instanceof Array && this.options[0]) {
      return this._getValidOption(this.options[0]);
    }
  }
  _getSelected() {
    const value = this.value;
    for (let i = 0; i < this.options.length; i++) {
      let option = this.options[i];
      if (typeof option === 'string' && option === value) {
        return [this._getValidOption(option)];
      } else if (typeof option === 'object') {
        option = this._getValidOption(option);
        if (option.value === value) {
          if (option.options && this[value] instanceof Route) {
            const selected = this[value]._getSelected();
            return [option, ...selected];
          } else {
            return [option];
          }
        }
      }
    }
  }
  valueChanged() {
    const selected = this._getSelected();
    let values = '';
    for (let i = 0; i < selected.length; i++) {
      values = values + '/' + selected[i].value;
    }
    console.log('value:', values);
  }
}
Route.Register();

// export class Router extends Route {
//   valueChanged() {
//     const selected = this._getSelected();
//     let values = '';
//     for (let i = 0; i < selected.length; i++) {
//       values = values + '/' + selected[i].value;
//     }
//     console.log('value:', values);
//   }
// }
// Router.Register();