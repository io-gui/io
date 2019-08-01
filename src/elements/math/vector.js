import {html, IoElement} from "../../io.js";

export class IoVector extends IoElement {
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
      :host > .io-slot {
        display: flex;
        flex: 0 0 auto;
      }
      :host > .io-slot > * {
        flex: 0 0 auto;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [0, 0, 0, 0],
      conversion: 1,
      step: 0.01,
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
    const prop = item.id;
    if (prop !== null) { //TODO: is this necessary?
      const value = event.detail.value;
      const oldValue = event.detail.oldValue;
      this.value[prop] = value;
      if (this.linked) {
        const change = value / oldValue;
        for (let i in this.components) {
          const p = this.components[i];
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
    this.components = this.value instanceof Array ? [0, 1, 2, 3] : ['x', 'y', 'z', 'w'];
  }
  changed() {
    const elements = [];
    for (let i in this.components) {
      const prop = this.components[i];
      if (this.value[prop] !== undefined) {
        elements.push(['io-number', {
          id: prop,
          value: this.value[prop],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          ladder: true,
          'on-value-set': this._onValueSet
        }]);
      }
    }
    elements.push(['div', {id: 'slot', class: 'io-slot'}, [this.getSlotted()]]);
    this.template(elements);
  }
  getSlotted() {
    return this.linkable ? ['io-boolean', {display: "icon", value: this.bind('linked'), trueicon: 'icons:link', falseicon: 'icons:unlink'}] : null;
  }
}

IoVector.Register();
