import {html} from "../../io.js";
import {IoMatrix2} from "./matrix2.js";

export class IoMatrix3 extends IoMatrix2 {
  static get Style() {
    return html`<style>
      :host {
        grid-template-columns: repeat(3, 1fr);
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      _c: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    };
  }
}

IoMatrix3.Register();
