import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoColor extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: grid;
          grid-template-columns: 25% 25% 25% 25%;
        }
        :host > div {
          display: flex;
        }
        :host > io-object-prop > io-number {
          width: 100%;
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
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  _objectMutatedHandler(event) {
    if (event.detail.object === this.value) {
      this._update();
    }
  }
  _update() {
    this.render([
      ['div', {style: 'background: rgb(' + parseInt(this.value.r * 255) + ',' + parseInt(this.value.g * 255) + ',' + parseInt(this.value.b * 255) + ');'}],
      ['io-object-prop', {key: 'r', value: this.value, config: {tag: 'io-number'} }],
      ['io-object-prop', {key: 'g', value: this.value, config: {tag: 'io-number'} }],
      ['io-object-prop', {key: 'b', value: this.value, config: {tag: 'io-number'} }]
    ]);
  }
}

window.customElements.define('io-color', IoColor);
