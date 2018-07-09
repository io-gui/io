import {html} from "../core/element.js";
import {IoObject} from "./object.js";

export class IoColorPicker extends IoObject {
  static get style() {
    return html`<style>
      :host {

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

IoColorPicker.Register();
