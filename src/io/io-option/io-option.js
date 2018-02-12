import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {UiMenu} from "../../ui/ui-menu/ui-menu.js"
import {UiButton} from "../../ui/ui-button/ui-button.js"

export class IoOption extends UiButton {
  static get properties() {
    return {
      value: {
        observer: 'update'
      },
      action: {
        type: Function
      },
      options: {
        type: Array,
        observer: 'update'
      }
    }
  }
  _actionHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
      this.querySelector('ui-menu').expanded = true;
      this.querySelector('ui-menu').$group.$options[0].focus();
    }
  }
  _menuHandler(event) {
    if (event.detail.option.value !== undefined) {
      this._setValue(event.detail.option.value);
      if (typeof this.action === 'function') {
        this.action(this.value !== undefined ? this.value : event);
      }
    }
  }
  update() {
    this.label = this.value;
    if (this.label instanceof Object) this.label = this.label.__proto__.constructor.name
    if (this.options) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          this.label = this.options[i].label || this.label;
          break;
        }
      }
    }
    this.render([
      ['span', this.label],
      ['ui-menu', {
        options: this.options,
        position: 'bottom',
        listeners: {'ui-menu-option-clicked': this._menuHandler}}]
    ]);
  }
}

window.customElements.define('io-option', IoOption);
