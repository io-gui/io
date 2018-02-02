import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoMenu} from "../io-menu/io-menu.js"

const menu = new IoMenu({position: 'bottom'});

export class IoOption extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: '_update'
      },
      options: {
        type: Array,
        observer: '_update'
      },
      listeners: {
        'focus': '_focusHandler',
        'mousedown': '_expandHandler',
        'keydown': '_expandHandler'
      },
      attributes: {
        'tabindex': 0
      }
    }
  }
  _expandHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mousedown') {
      event.preventDefault();
      this.appendChild(menu);
      menu.options = this.options;
      menu.expanded = true;
      if (menu._listerer) {
        menu.removeEventListener('io-menu-option-clicked', menu._listerer);
        delete menu._listener;
      }
      menu.addEventListener('io-menu-option-clicked', this._menuHandler);
      menu._listener = this._menuHandler;
    }
  }
  _menuHandler(event) {
    if (event.detail.option.value !== undefined) {
      this._setValue(event.detail.option.value);
    }
    menu.expanded = false;
    menu.removeEventListener('io-menu-option-clicked', this._menuHandler);
  }
  _update() {
    let label = this.value;
    if (label instanceof Object) label = label.__proto__.constructor.name
    if (this.options) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          label = this.options[i].label || label;
          break;
        }
      }
    }
    this.innerText = label;
  }
}

window.customElements.define('io-option', IoOption);
