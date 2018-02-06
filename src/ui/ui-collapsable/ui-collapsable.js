import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"

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
}


window.customElements.define('io-collapsable', UiCollapsable);
