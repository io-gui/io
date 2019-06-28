export class Option {
  constructor(option) {
    if (typeof option === 'object' && (option.options !== undefined || option.action !== undefined || option.value !== undefined)) {
      Object.assign(this, option);
    } else {
      this.value = option;
    }
    if (this.label === undefined) {
      if (this.value instanceof Array) {
        this.label = String(`${this.value.constructor.name} (${this.value.length})`);
      } else if (typeof this.value === 'object') {
        this.label = String(`${this.value.constructor.name}`);
      } else if (this.value !== undefined) {
        this.label = String(this.value);
      } else {
        console.warn('Option must have label or value!');
      }
    }
  }
}
