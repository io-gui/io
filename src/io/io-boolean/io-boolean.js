import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {UiButton} from "../../ui/ui-button/ui-button.js"

export class IoBoolean extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
        :host(.invalid) {
          text-decoration: underline;
          text-decoration-style: dashed;
          text-decoration-color: red;
          opacity: 0.25;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Boolean,
        observer: '_update'
      },
      true: {
        value: 'true',
        type: String
      },
      false: {
        value: 'false',
        type: String
      }
    }
  }
  _toggleHandler(event) {
    this._setValue(!this.value);
  }
  _update() {
    this.classList.toggle('invalid', typeof this.value !== 'boolean');
    this.render([
      ['ui-button', {action: this._toggleHandler}, this.value ? this.true : this.false]
    ]);
  }
}

window.customElements.define('io-boolean', IoBoolean);
