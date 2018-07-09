import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test

export class IoVector extends IoObject {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
      }
      :host > io-number {
        flex: 1 1;
      }
    </style>`;
  }
  update() {
    let elements = [];
    let configs = this.getPropConfigs(['x', 'y', 'z', 'w']);
    for (let key in configs) {
      if (this.value[key] !== undefined) {
        elements.push(['io-number', Object.assign({value: this.value[key], id: key}, configs[key].props)]);
      }
    }
    this.render(elements);
  }
}

IoVector.Register();
