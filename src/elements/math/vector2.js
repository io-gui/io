import {html, IoElement} from "../../io.js";

export class IoVector2 extends IoElement {
  static get Style() {
    return html`<style>
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
      :host > io-number:not(:last-child) {
        margin-right: var(--io-spacing);
      }
      :host > io-boolean {
        flex: 0 0 auto;
        border-color: transparent;
        background: none;
      }
      :host > io-boolean:not([value]) {
        opacity: 0.25;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [0, 0],
      conversion: 1,
      step: 0.001,
      min: -Infinity,
      max: Infinity,
      canlink: false,
      linked: false,
      _c: [0, 1],
    };
  }
  _onValueSet(event) {
    const item = event.composedPath()[0];
    const prop = item.id;
    if (prop !== null) {
      const value = event.detail.value;
      const oldValue = event.detail.oldValue;
      this.value[prop] = value;
      if (this.linked) {
        const change = value / oldValue;
        for (let i in this._c) {
          const p = this._c[i];
          if (oldValue === 0) {
            this.value[p] = value;
          } else if (p !== prop) {
            this.value[p] *= change;
          }
        }
      }
      // TODO: test
      const detail = {object: this.value, prop: this.linked ? null : prop, value: value, oldValue: oldValue};
      this.dispatchEvent('object-mutated', detail, false, window);
    }
  }
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1] : ['x', 'y'];
  }
  changed() {
    const elements = [];
    for (let i in this._c) {
      const prop = this._c[i];
      if (this.value[prop] !== undefined) {
        elements.push(['io-number', {
          id: prop,
          value: this.value[prop],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          'on-value-set': this._onValueSet
        }]);
      }
    }
    if (this.canlink) {
      elements.push(['io-boolean', {value: this.bind('linked'), true: '🔗', false: '🔗'}]);
    }
    this.template(elements);
  }
}

IoVector2.Register();
