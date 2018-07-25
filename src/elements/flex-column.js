import {html, IoElement} from "../core/element.js";

export class IoFlexColumn extends IoElement {
  static get style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: column;
    }
    :host > * {
      flex: 1 1 none;
    }
    </style>`;
  }
}

IoFlexColumn.Register();
