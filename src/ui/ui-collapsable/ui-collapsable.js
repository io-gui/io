import {html} from "../../io/ioutil.js"
import {Io} from "../../io/io.js"
import {UiButton} from "../ui-button/ui-button.js"

export class UiCollapsable extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        :host ui-button {
          cursor: pointer;
          line-height: 1em;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      label: {
        type: String,
        observer: '_update'
      },
      expanded: {
        type: Boolean,
        observer: '_update'
      }
    }
  }
  _toggleHandler(event) {
    this.expanded = !this.expanded;
  }
  _update() {
    this.render([
      ['ui-button', {action: this._toggleHandler}, (this.expanded ? '▾' : '▸') + this.label],
      this.expanded ? ['slot'] : null
    ], this.shadowRoot);
  }
}


window.customElements.define('io-collapsable', UiCollapsable);
