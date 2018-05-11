import {IoButton} from "../../io/io-button/io-button.js";
import "../../menu/menu-root/menu-root.js";

export class IoOption extends IoButton {
  static get properties() {
    return {
      value: {},
      action: {
        type: Function
      },
      options: {
        type: Array
      }
    };
  }
  _actionHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'mouseup' || event.type == 'touchend') {
      event.preventDefault();
      this.$['menu'].expanded = true;
      let firstItem = this.$['menu'].$['group'].querySelector('menu-item');
      if (firstItem) firstItem.focus();
    }
  }
  _menuHandler(event) {
    this.$['menu'].expanded = false;
    this.set('value', event.detail.value);
    if (typeof this.action === 'function') {
      this.action(this.value);
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
    this.__state.label.value = label;
    this.render([
      ['span', String(label)],
      ['menu-root', {
        id: 'menu',
        options: this.options,
        position: 'bottom',
        listeners: {'menu-item-clicked': this._menuHandler}}]
    ]);
  }
}

IoOption.Register();
