import {Io} from "../../io/io.js"
import {html} from "../../io/ioutil.js"
import {UiLayoutBlock} from "./ui-layout-block.js"
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
      value: {
        type: Object
      }
    }
  }

  update() {
    this.render([
      ['ui-layout-split', {
          elements: this.elements,
          orientation: this.value.horizontal ? 'horizontal' : 'vertical',
          blocks: this.value.horizontal || this.value.vertical
      }]
    ]);
  }
}

window.customElements.define('ui-layout', UiLayout);
