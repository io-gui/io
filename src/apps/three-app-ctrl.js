import {Io} from "../io/io.js"

export class ThreeAppCtrl extends Io {
  static get properties() {
    return {
      value: {},
      scene: {}
    }
  }
  update() {
    this.render([
      ['span', 'select: '],
      ['io-option', {value: this.bind('value'), options: this.scene.options}]
    ]);
  }
}

customElements.define('three-app-ctrl', ThreeAppCtrl);
