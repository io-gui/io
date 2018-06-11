import {html, IoObject} from "../../../../src/io.js";

export class ThreeVector extends IoObject {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
      }
      :host > io-number {
        flex: 1 1;
        padding: 0.25em 0.5em;
      }
      :host > io-number:not(:first-child) {
        border-left: 0.5px solid #666;
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
    this.render([elements]);
  }
}

ThreeVector.Register();
