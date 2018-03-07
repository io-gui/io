import {UiButton} from "../../elements/ui-button/ui-button.js";
import "../../elements/ui-menu/ui-menu.js";

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
    };
  }
  _actionHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
      this.querySelector('ui-menu').expanded = true;
      this.querySelector('ui-menu').$group.$options[0].focus();
    }
  }
  _menuHandler(event) {
    event.stopPropagation();
    if (event.detail.option.value !== undefined) {
      this.set('value', event.detail.option.value);
      if (typeof this.action === 'function') {
        this.action(this.value !== undefined ? this.value : event);
      }
    }
  }
  update() {
    let label = this.value;
    if (label instanceof Object) label = label.__proto__.constructor.name;
    if (this.options) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          label = this.options[i].label || label;
          break;
        }
      }
    }
    this.__properties.label.value = label;
    this.render([
      ['span', String(label)],
      ['ui-menu', {
        options: this.options,
        position: 'bottom',
        listeners: {'ui-menu-option-clicked': this._menuHandler}}]
    ]);
  }
}

window.customElements.define('io-option', IoOption);
