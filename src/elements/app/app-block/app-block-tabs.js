import {Io, html} from "../../../iocore.js";
import "./app-block-label.js";
// import "../../io/io-option/io-option.js";

export class AppBlockTabs extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          background: #bbb;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      tabs: {
        type: Array
      },
      selected: {
        type: String
      }
    };
  }
  update() {
    this.render([
      this.tabs.map((entry) => ['app-block-label', {
        element: this.elements[this.selected],
          label: entry,
          selected: (entry === this.selected && this.tabs.length != 1),
          attributes: {single: this.tabs.length == 1}
        }]),
        // ['io-option', {label: 'asd'}, '+']
    ]);
  }
}

AppBlockTabs.Register();
