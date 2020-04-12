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