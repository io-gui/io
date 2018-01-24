import {html} from "./ioutil.js"
import {Io} from "./io.js"
import {IoMenu} from "./io-menu.js"

const menu = new IoMenu({position: 'bottom'});

export class IoOption extends Io {
  static get is() { return 'io-option'; }
  static get template() {
    return html`
      <style>
        :host {
          cursor: pointer;
          display: inline-block;
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
      }
    }
  }
  connectedCallback() {
    this.setAttribute('tabindex', 0);
    this.addEventListener('focus', this._focusHandler);
    this.addEventListener('mousedown', this._expandHandler);
    this._update();
  }
  disconnectedCallback() {
    this.removeEventListener('focus', this._focusHandler);
    this.removeEventListener('blur', this._blurHandler);
    this.removeEventListener('keydown', this._expandHandler);
    this.removeEventListener('mousedown', this._preventDefault);
  }
  _focusHandler(event) {
    this.addEventListener('blur', this._blurHandler);
    this.addEventListener('keydown', this._expandHandler);
  }
  _blurHandler(event) {
    this.removeEventListener('keydown', this._expandHandler);
    this.removeEventListener('blur', this._blurHandler);
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
  _preventDefault(event) {
    event.preventDefault();
  }
  _menuHandler(event) {
    if (event.detail.option.value !== undefined) {
      this._setValue(event.detail.option.value);
    }
    menu.expanded = false;
    menu.removeEventListener('io-menu-option-clicked', this._menuHandler);
  }
  _update() {
    if (this.options) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          this.innerText = this.options[i].label || this.options[i].value;
          return;
        }
      }
    }
    this.innerText = this.value;
  }
}

window.customElements.define(IoOption.is, IoOption);
