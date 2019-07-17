import {html, IoElement} from "../io.js";

export class IoColorPicker extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        cursor: move;
        min-width: 2.75em;
        min-height: 1.375em;
        display: flex;
        flex-direction: column;
      }
      :host[horizontal] {
        flex-direction: row;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      horizontal: true,
    };
  }
  static get Properties() {
    return {
      hsva: [0.5, 0.5, 0.5, 1],
    };
  }
  changed() {
    this.template([
      ['io-hsv-sv', {hsva: this.hsva, horizontal: this.horizontal}],
      ['io-hsv-hue', {hsva: this.hsva, horizontal: this.horizontal}],
      ['io-hsv-alpha', {hsva: this.hsva, horizontal: this.horizontal}],
    ])
  }
}

IoColorPicker.Register();
