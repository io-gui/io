import {html} from "../../../io-element.js";
import {IoObject} from "../../io/io-object/io-object.js";

export class ThreeColorPicker extends IoObject {
  static get style() {
    return html`<style>
      :host {
        min-width: 1.4em;
        margin: 1px;
      }
    </style>`;
  }
  _onIoObjectMutated(event) {
    if (event.detail.object === this.value) {
      this.update();
    }
  }
  update() {
    let r = parseInt(this.value.r * 255);
    let g = parseInt(this.value.g * 255);
    let b = parseInt(this.value.b * 255);
    this.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
  }
}

ThreeColorPicker.Register();
