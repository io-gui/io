import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoString extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: text;
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
  _update() {
    this.classList.toggle('invalid', typeof this.value !== 'string');
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

window.customElements.define('io-string', IoString);
