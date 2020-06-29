import {IoElement} from '../../core/io-element.js';

export class IoMatrix extends IoElement {
  static get Style() {
    return /* css */`
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
    `;
  }
  static get Properties() {
    return {
      value: {
        value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        observe: true,
      },
      step: 0.001,
      components: {
        type: Array,
        notify: false,
      },
      columns: {
        value: 4,
        reflect: 1,
      },
    };
  }
  _onValueSet(event) {
    if (event.detail.object) return; // TODO: unhack
    const item = event.composedPath()[0];
    const c = item.id;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    const detail = {object: this.value, property: c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
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
    this.components = c;
  }
  changed() {
    const elements = [];
    for (let i in this.components) {
      const c = this.components[i];
      if (this.value[c] !== undefined) {
        elements.push(['io-number', {
          id: String(c),
          value: this.value[c],
          step: this.step,
          'on-value-set': this._onValueSet
        }]);
      }
    }
    this.template(elements);
  }
}

IoMatrix.Register();
