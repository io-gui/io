import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoVector extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }
        ::slotted(*) {
          flex: 1;
          margin-right: 0.5em;
        }
        ::slotted(*:last-child) {
          margin-right: 0;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: '_update'
      }
    }
  }
  _update() {
    this.render([
      ['io-number', {value: this.value.x}],
      ['io-number', {value: this.value.y}],
      ['io-number', {value: this.value.z}]
    ])
  }
}

window.customElements.define('io-vector', IoVector);
