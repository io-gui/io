import {IoButton} from "./button.js";

export class IoInspectorLink extends IoButton {
  changed() {
    this.template([['span', this.value.constructor.name]]);
  }
  _onAction(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      this.pressed = false;
      this.dispatchEvent('io-inspector-link-clicked', {value: this.value});
    }
    this._onUp(event);
  }
}

IoInspectorLink.Register();
