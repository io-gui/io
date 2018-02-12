import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoString extends Io {
  static get properties() {
    return {
      value: {
        observer: 'update'
      },
      type: {
        type: String,
        reflectToAttribute: true
      },
      listeners: {
        'blur': '_blurHandler'
      },
      attributes: {
        'tabindex': 0,
        'contenteditable': true
      }
    }
  }
  _blurHandler(event) {
    this._setValue(this.innerText);
  }
  update() {
    this.classList.toggle('invalid', typeof this.value !== 'string');
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

window.customElements.define('io-string', IoString);
