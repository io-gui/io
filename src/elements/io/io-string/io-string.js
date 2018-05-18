import {Io} from "../../../iocore.js";

export class IoString extends Io {
  static get properties() {
    return {
      value: String,
      listeners: {
        'blur': '_onBlur',
        'keydown': '_onKeydown'
      },
      attributes: {
        'tabindex': 0,
        'contenteditable': true
      }
    };
  }
  _onBlur() {
    this.set('value', this.innerText);
  }
  _onKeydown(event) {
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
