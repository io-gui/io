import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {UiMenu} from "../../ui/ui-menu/ui-menu.js"
import {UiButton} from "../../ui/ui-button/ui-button.js"

const menu = new UiMenu({position: 'bottom'});

export class IoOption extends Io {
  static get style() {
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
      }
    }
  }
  _expandHandler(event) {
    this.appendChild(menu);
    menu.options = this.options;
    menu.expanded = true;
    if (menu.$group.$options[0]) menu.$group.$options[0].focus();
    if (menu._listerer) {
      menu.removeEventListener('ui-menu-option-clicked', menu._listerer);
      delete menu._listener;
    }
    menu.addEventListener('ui-menu-option-clicked', this._menuHandler);
    menu._listener = this._menuHandler;
  }
  _menuHandler(event) {
    if (event.detail.option.value !== undefined) {
      this._setValue(event.detail.option.value);
    }
    menu.expanded = false;
    menu.removeEventListener('ui-menu-option-clicked', this._menuHandler);
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
    this.render([
      ['ui-button', {action: this._expandHandler}, label + ' ⊻']
    ]);
  }
}

window.customElements.define('io-option', IoOption);
