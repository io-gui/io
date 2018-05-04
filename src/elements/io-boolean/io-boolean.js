import {html} from "../../iocore.js";
import {IoButton} from "../../elements/io-button/io-button.js";

export class IoBoolean extends IoButton {
  static get properties() {
    return {
      value: {
        type: Boolean,
        observer: 'update'
      },
      true: {
        value: 'true',
        type: String,
        observer: 'update'
      },
      false: {
        value: 'false',
        type: String,
        observer: 'update'
      }
    };
  }
  constructor(props) {
    super(props);
    this.__properties.action.value = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  update() {
    this.render([['span', this.value ? this.true : this.false]]);
  }
}

window.customElements.define('io-boolean', IoBoolean);
