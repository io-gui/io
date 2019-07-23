import {html, IoElement} from "../../io.js";

export class IoMatrix extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: grid;
        align-self: stretch;
        justify-self: stretch;
        grid-gap: var(--io-spacing);
      }
      :host[columns="4"] {
        grid-template-columns: repeat(4, 1fr);
      }
      :host[columns="3"] {
        grid-template-columns: repeat(3, 1fr);
      }
      :host[columns="2"] {
        grid-template-columns: repeat(2, 1fr);
      }
      :host > io-number {
        width: inherit;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      columns: 4,
    };
  }
  static get Properties() {
    return {
      value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      step: 0.001,
      _c: Array,
    };
  }
  _onValueSet(event) {
    if (event.detail.object) return; // TODO: unhack
    const item = event.composedPath()[0];
    const prop = item.id;
    if (prop !== null) {
      const value = event.detail.value;
      const oldValue = event.detail.oldValue;
      this.value[prop] = value;
      const detail = {object: this.value, prop: prop, value: value, oldValue: oldValue};
      this.dispatchEvent('object-mutated', detail, false, window);
    }
  }
  valueChanged() {
    let c;
    if (this.value.length === 4) {
      c = [0, 1, 2, 3];
      this.columns = 2;
    }
    if (this.value.length === 9) {
      c = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      this.columns = 3;
    }
    if (this.value.length === 16) {
      c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      this.columns = 4;
    }
    this._c = c;
  }
  changed() {
    const elements = [];
    for (let i in this._c) {
      const prop = this._c[i];
      if (this.value[prop] !== undefined) {
        elements.push(['io-number', {
          id: prop,
          value: this.value[prop],
          step: this.step,
          'on-value-set': this._onValueSet
        }]);
      }
    }
    this.template(elements);
  }
}

IoMatrix.Register();
