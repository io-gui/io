import {html} from "../../../iocore.js";
import {IoButton} from "../../io/io-button/io-button.js";

export class IoBoolean extends IoButton {
  static get properties() {
    return {
      value: {
        type: Boolean
      },
      true: {
        value: 'true',
        type: String
      },
      false: {
        value: 'false',
        type: String
      }
    };
  }
  constructor(props) {
    super(props);
    this.__state.action.value = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  update() {
    this.render([['span', this.value ? this.true : this.false]]);
  }
}

IoBoolean.Register();
