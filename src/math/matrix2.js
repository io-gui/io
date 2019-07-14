import {html, IoElement} from "../io.js";

export class IoMatrix2 extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: var(--io-spacing);
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [0, 0],
      step: 0.001,
      _components: [0, 1, 2, 3],
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
  changed() {
    const elements = [];
    for (let i in this._components) {
      const prop = this._components[i];
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

IoMatrix2.Register();
