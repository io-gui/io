import {Io} from "../../io/io.js"
import {UiLayoutSplit} from "./ui-layout-split.js"

export class UiLayout extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          display: flex;
          background: #999;
          flex: 1;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      splits: {
        type: Object
      }
    }
  }

  update() {
    this.render([
      ['ui-layout-split', {
          elements: this.elements,
          splits: this.splits
      }]
    ]);
  }
}

window.customElements.define('ui-layout', UiLayout);
