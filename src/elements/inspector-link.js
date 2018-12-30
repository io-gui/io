import {html} from "../core/element.js";
import {IoButton} from "./button.js";

export class IoInspectorLink extends IoButton {
  static get style() {
    return html`<style>
      :host {
        border: none;
        overflow: hidden;
        text-overflow: ellipsis;
        background: none;
        padding: 0;
        color: #15e;
      }
      :host:focus {
        outline: none;
        background: none;
        text-decoration: underline;
      }
      :host:hover {
        background: none;
        text-decoration: underline;
      }
      :host[pressed] {
        background: none;
      }
    </style>`;
  }
  changed() {
    this.template([['span', this.value.constructor.name]]);
  }
}

IoInspectorLink.Register();
