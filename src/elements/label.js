import {IoElement} from "../core/element.js";

export class IoLabel extends IoElement {
  static get properties() {
    return {
      label: String
    };
  }
  update() {
    this.innerText = String(this.label);
  }
}

IoLabel.Register();
