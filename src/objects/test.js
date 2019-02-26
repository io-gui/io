import {IoCore} from "../io-core.js";

export class IoLeaf extends IoCore {
  static get properties() {
    return {
      value: 0
    };
  }
  constructor(props) {
    super(props);
    this.connect();
  }
}
IoLeaf.Register();

export class IoBranch extends IoCore {
  static get properties() {
    return {
      value: 1000,
      subTest: IoLeaf
    };
  }
  constructor(props, defValue) {
    super(props);
    this.mapProperties({
      subTest: {value: this.bind('value')}
    })
  }
  changed() {
    console.log('a', this.subTest.value);
  }
}

IoBranch.Register();
