import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"
import {UiButton} from "../ui-button/ui-button.js"

export class UiCollapsable extends Io {
  static get style() {
    return html`
      <style>
        :host:not([expanded]) > *:not(:first-child) {
          display: none;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflectToAttribute: true
      }
    }
  }
  _toggleHandler(event) {
    this.expanded = !this.expanded;
  }
}


window.customElements.define('io-collapsable', UiCollapsable);
