import {html} from "../../io.js";
import {IoMatrix2} from "./matrix2.js";

export class IoMatrix4 extends IoMatrix2 {
  static get Style() {
    return html`<style>
      :host {
        grid-template-columns: auto auto auto auto;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      _c: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    };
  }
}

IoMatrix4.Register();
