import {Io} from "../build/io.js";

export class ThreeAppCtrl extends Io {
  static get properties() {
    return {
      value: {},
      scene: {}
    };
  }
  clearLocalStorage() {
    localStorage.clear();
  }
  update() {
    this.render([
      ['span', 'select: '],
      ['io-option', {value: this.bind('value'), options: this.scene.options}],
      ['br'],
      ['ui-button', {label: 'Reset layout', action: this.clearLocalStorage}]
    ]);
  }
}

customElements.define('three-app-ctrl', ThreeAppCtrl);
