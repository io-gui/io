import {Io} from "../io.js"
import {html} from "../ioutil.js"
import {IoVector} from "../io-vector/io-vector.js"
import {IoPropertyMixin} from "../ioproperty.js"

export class IoColorPicker extends IoPropertyMixin(Io) {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          min-width: 1.22em;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      key: {
        value:'*'
      }
    }
  }
  update() {
    let r = parseInt(this.value.r * 255);
    let g = parseInt(this.value.g * 255);
    let b = parseInt(this.value.b * 255);
    this.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    this.innerHTML = '&nbsp;';
  }
}

window.customElements.define('io-color-picker', IoColorPicker);
