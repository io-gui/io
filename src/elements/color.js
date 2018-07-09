import {html} from "../core/element.js";
import {IoObject} from "./object.js";
import "./color-swatch.js";
// import {IoColorPicker} from "./color-picker.js";
//TODO: test
const colors = {
 'r': '#ff9977',
 'g': '#55ff44',
 'b': '#4499ff',
 'a': 'white'
};

export class IoColor extends IoObject {
  static get style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: row;
    }
    :host > io-number {
      flex: 1 1;
    }
    :host > io-color-swatch {
      flex: 1 1;
    }
    </style>`;
  }
  _onIoObjectMutated(event) {
    super._onIoObjectMutated(event);
    this.update();
    this.$.swatch.update();
  }
  update() {
    const elements = [];
    for (let key in colors) {
      if (this.value[key] !== undefined) {
        elements.push(['io-number', {
          value: this.value[key],
          id: key,
          step: 0.01,
          min: 0,
          max: 1,
          strict: false,
          underslider: true,
          style: {'--slider-color': colors[key]}
        }]);
      }
    }
    elements.push(['io-color-swatch', {value: this.value, id: 'swatch'}]);
    this.render(elements);
  }
}

IoColor.Register();
