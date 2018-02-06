import {html} from "../ioutil.js"
import {IoVector} from "../io-vector/io-vector.js"
import {IoObjectProp} from "../io-object/io-object-prop.js"

export class IoColor extends IoVector {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }
        :host > span {
          min-width: 1.22em;
        }
      </style>
    `;
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
    let elements = [];
    if (this.value.r !== undefined) elements.push('r');
    if (this.value.g !== undefined) elements.push('g');
    if (this.value.b !== undefined) elements.push('b');
    if (this.value.a !== undefined) elements.push('a');
    this.columns = elements.length + 1;
    const Prop = i => ['io-object-prop', {key: i, value: this.value, config: {tag: 'io-number'}}];
    let r = parseInt(this.value.r * 255);
    let g = parseInt(this.value.g * 255);
    let b = parseInt(this.value.b * 255);
    this.render([
      elements.map(Prop),
      ['span', {style: {background: 'rgb(' + r + ',' + g + ',' + b + ')'}}, '&nbsp;'],
    ]);
  }
}

window.customElements.define('io-color', IoColor);
