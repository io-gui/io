import {Io} from "../io.js";

export class IoString extends Io {
  static get properties() {
    return {
      value: {
        type: String,
        observer: 'update'
      },
      listeners: {
        'blur': '_blurHandler',
        'keydown': '_keydownhandler'
      },
      attributes: {
        'tabindex': 0,
        'contenteditable': true
      }
    };
  }
  _blurHandler(event) {
    this.set('value', this.innerText);
  }
  _keydownhandler(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.set('value', this.innerText);
    }
  }
  update() {
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

window.customElements.define('io-string', IoString);
