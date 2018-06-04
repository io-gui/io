import {html} from "../../../io-element.js";
import {ThreeVector} from "../three-vector/three-vector.js";
import "./three-color-picker.js";

export class ThreeColor extends ThreeVector {
  static get style() {
    return html`<style>

    </style>`;
  }
  update() {
    let elements = [];
    let configs = this.getPropConfigs(['r', 'g', 'b', 'a']);
    for (let key in configs) {
      if (this.value[key] !== undefined) {
        elements.push(['io-number', Object.assign({value: this.value[key], id: key}, configs[key].props)]);
      }
    }
    elements.push(['three-color-picker', {value: this.bind('value')}]),
    this.render([elements]);
  }
}

ThreeColor.Register();
