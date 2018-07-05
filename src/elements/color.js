import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test
const colors = ["#ff9977", "#55ff44", "#4499ff", "white"];

export class IoColor extends IoObject {
  static get style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: row;

    }
    :host > io-number {
      flex: 1 1;
      background-image: paint(color);
    }
    </style>`;
  }
  _onIoObjectMutated(event) {
    super._onIoObjectMutated(event);
    this.update();
  }
  update() {
    let elements = [];
    let configs = this.getPropConfigs(['r', 'g', 'b', 'a']);
    let i = 0;
    for (let key in configs) {
      if (this.value[key] !== undefined) {
        elements.push(['io-number', Object.assign({
          value: this.value[key],
          id: key,
          style: {
            '--color-color': colors[i++],
            '--color-value': this.value[key]
          }
        }, configs[key].props)]);
      }
    }
    elements.push(['io-color-picker', {value: this.bind('value')}]),
    this.render([elements]);
  }
}

IoColor.Register();
