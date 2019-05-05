import {html, IoElement} from "../core/element.js";
import "./layout-splits.js";

export class IoLayout extends IoElement {
  static get style() {
    return html`<style>
      :host  {
        flex: 1;
        display: flex;
      }
    </style>`;
  }
  static get properties() {
    return {
      layout: Object,
      elements: Object,
    };
  }
  changed() {
    this.template([
      ['io-layout-splits', {
        elements: this.elements,
        orientation: this.layout.orientation,
        splits: this.layout.splits,
      }],
    ]);
  }
}

IoLayout.Register();
