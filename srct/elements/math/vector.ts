import {IoElement, RegisterIoElement} from '../../components/io-element.js';

/*
 * Extends `IoElement`. Implements `IoNumber` and `IoBoolicon`.
 *
 * Input element for vector arrays and objects.
 *
 * <io-element-demo element="io-vector" properties='{"value": {"x": 1, "y": 0.5}, "linkable": false}'></io-element-demo>
 *
 * <io-element-demo element="io-vector" properties='{"value": [0, 0.5, 1], "linkable": true}'></io-element-demo>
 **/

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
  static get Properties(): any {
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
  _onValueSet(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const c = item.id;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    if (this.linked) {
      const change = value / oldValue;
      for (const i in this.components) {
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
    for (const i in this.components) {
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

RegisterIoElement(IoVector);
