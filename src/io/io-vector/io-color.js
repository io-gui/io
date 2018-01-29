import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoColor extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }
        ::slotted(span) {
          width: 3em;
          margin-right: 2px;
        }
        ::slotted(io-number) {
          flex: 1;
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
      ['span', {style: 'background: rgb(' + parseInt(this.value.r * 255) + ',' + parseInt(this.value.g * 255) + ',' + parseInt(this.value.b * 255) + ');'}],
      ['io-number', {value: this.value.r}],
      ['io-number', {value: this.value.g}],
      ['io-number', {value: this.value.b}]
    ])
  }
}

window.customElements.define('io-color', IoColor);
