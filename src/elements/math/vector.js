import {IoElement} from '../../iogui.js';

// TODO: preserve linked scaling through zero.
export class IoVector extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      width: inherit;
      flex: 1 1;
    }
    :host > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host > io-boolean {
      width: var(--io-line-height) !important;
    }
    `;
  }
  static get Properties() {
    return {
      value: {
        value: [0, 0, 0, 0],
        observe: true,
      },
      conversion: 1,
      step: 0.001,
      min: -Infinity,
      max: Infinity,
      linkable: false,
      linked: false,
      components: {
        type: Array,
        notify: false,
      },
    };
  }
  _onValueSet(event) {
    const item = event.composedPath()[0];
    const c = item.id;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    if (this.linked) {
      const change = value / oldValue;
      for (let i in this.components) {
        const p = this.components[i];
        if (oldValue === 0) {
          this.value[p] = value;
        } else if (p !== c) {
          this.value[p] *= change;
        }
      }
    }
    // TODO: test
    const detail = {object: this.value, property: this.linked ? null : c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
  }
  valueChanged() {
    this.components = Object.keys(this.value).filter(key => typeof this.value[key] === 'number');
  }
  changed() {
    const elements = [];
    for (let i in this.components) {
      const c = this.components[i];
      if (this.value[c] !== undefined) {
        elements.push(['io-number', {
          id: c,
          value: this.value[c],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          ladder: true,
          'on-value-set': this._onValueSet
        }]);
      }
    }
    elements.push(this.getSlotted());
    this.template(elements);
  }
  getSlotted() {
    return this.linkable ? ['io-boolicon', {value: this.bind('linked'), true: 'icons:link', false: 'icons:unlink'}] : null;
  }
}

IoVector.Register();
