import {IoElement} from "../core/element.js";

export class IoLabel extends IoElement {
  static get properties() {
    return {
      label: String
    };
  }
  changed() {
    this.innerText = String(this.label);
  }
}

IoLabel.Register();
