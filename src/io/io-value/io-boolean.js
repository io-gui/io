import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoBoolean extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
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
        observer: '_update'
      },
      true: {
        value: 'true',
        type: String
      },
      false: {
        value: 'false',
        type: String
      },
      listeners: {
        'mouseup': '_toggleHandler',
        'keyup': '_toggleHandler',
        'mousedown': '_preventHandler'
      },
      attributes: {
        'tabindex': 0
      }
    }
  }
  _toggleHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup') {
      event.preventDefault();
      this._setValue(!this.value);
    }
  }
  _preventHandler(event) {
    event.preventDefault();
  }
  _update() {
    this.classList.toggle('invalid', typeof this.value !== 'boolean');
    this.innerText = this.value ? this.true : this.false;
  }
}

window.customElements.define('io-boolean', IoBoolean);
