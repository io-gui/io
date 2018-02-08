import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"
import {UiLayoutBlock} from "./ui-layout-block.js"
import {UiLayoutDivider} from "./ui-layout-divider.js"

export class UiLayout extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          display: flex;
          flex: 1;
          background: #999;
        }
        :host .left,
        :host .right {
          flex: none;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      leftWidth: {
        value: 300,
        type: Number
      },
      rightWidth: {
        value: 500,
        type: Number
      }
    }
  }
  _update() {
    this.render([
      ['ui-layout-block', {class: 'left', width: this.bind('leftWidth'), elements: {
        object1: this.elements.object,
        object2: this.elements.object
      }}],
      ['ui-layout-divider'],
      ['ui-layout-block', {class: 'center', elements: {
        option: this.elements.option,
        object: this.elements.object,
        inspector: this.elements.inspector
      }}],
      ['ui-layout-divider'],
      ['ui-layout-block', {class: 'right', width: this.bind('rightWidth'), elements: {
        inspector: this.elements.inspector
      }}],
    ])
  }
}

// document.addEventListener("drag", function(event) {
//   console.log(event)
// }, false);

window.customElements.define('ui-layout', UiLayout);
