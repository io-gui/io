import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoObjectLabel extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host:after {
          content: ":";
          padding-right: 0.25em;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      key: {
        type: String,
        observer: '_update'
      }
    }
  }
  _update() {
    this.innerText = this.key;
  }
}


window.customElements.define('io-object-label', IoObjectLabel);
