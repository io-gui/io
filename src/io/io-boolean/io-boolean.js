import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {UiButton} from "../../ui/ui-button/ui-button.js"

export class IoBoolean extends UiButton {
  static get properties() {
    return {
      value: {
        type: Boolean,
        observer: '_update'
      },
      true: {
        value: 'true',
        type: String,
        observer: '_update'
      },
      false: {
        value: 'false',
        type: String,
        observer: '_update'
      }
    }
  }
  constructor(props) {
    super(props);
    this.action = this.toggle;
  }
  toggle() {
    this._setValue(!this.value);
  }
  _update() {
    this.render([['span', this.value ? this.true : this.false]]);
  }
}

window.customElements.define('io-boolean', IoBoolean);
