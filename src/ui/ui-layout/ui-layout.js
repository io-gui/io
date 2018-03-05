import {Io, html} from "../../io.js";
import "./ui-layout-split.js";

export class UiLayout extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          display: flex;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      layout: {
        type: Array
      }
    };
  }
  update() {
    // TODO: fix layout split
    const Prop = entry => [entry[0], Object.assign({elements: this.elements}, entry[1])];
    this.render([this.layout.map(Prop)]);
  }
}

window.customElements.define('ui-layout', UiLayout);
