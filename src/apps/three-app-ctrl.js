import {Io} from "../io/io.js"

export class ThreeAppCtrl extends Io {
  static get properties() {
    return {
      value: {},
      scene: {}
    }
  }
  _update() {
    this.render([
      ['span', 'select: '],
      ['io-option', {value: this.bind('value'), options: this.scene.options}]
    ]);
  }
}

// TODO: enable non-HTML classes
customElements.define('three-app-ctrl', ThreeAppCtrl);
