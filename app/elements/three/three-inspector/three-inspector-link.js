import {IoButton} from "../../../../src/io.js";

export class ThreeInspectorLink extends IoButton {
  update() {
    this.render([['span', this.value.constructor.name]]);
  }
}

ThreeInspectorLink.Register();
