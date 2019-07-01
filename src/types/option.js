export class Options extends Array {
  constructor(options) {
    super(...(options.map ? options.map(option => { return new Option(option); }) : []));
    // console.log(this);
    // if (options) {
    //   const _options = options.map(option => { return new Option(option); });
    //   console.log(_options);
    //   //
    //   // this.push(_options);
    // }
  }
}
export class Option {
  constructor(option) {
    if (typeof option === 'object' && (option.options !== undefined || option.action !== undefined || option.value !== undefined)) {
      Object.assign(this, option);
      if (this.options && this.options.length) {
        if (!(this.options instanceof Options)) this.options = new Options(this.options);
      }
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
