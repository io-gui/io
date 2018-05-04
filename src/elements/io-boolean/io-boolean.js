import {html} from "../../iocore.js";
import {UiButton} from "../../elements/ui-button/ui-button.js";

export class IoBoolean extends UiButton {
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
