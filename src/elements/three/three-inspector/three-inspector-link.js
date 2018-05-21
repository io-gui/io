import {IoButton} from "../../io/io-button/io-button.js";

export class ThreeInspectorLink extends IoButton {
  update() {
    this.render([['span', this.value.constructor.name]]);
  }
}

ThreeInspectorLink.Register();
