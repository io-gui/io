import {Io} from "../../../iocore.js";

export class IoString extends Io {
  static get properties() {
    return {
      value: {
        type: String
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
  _blurHandler() {
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

IoString.Register();
