import {IoElement, RegisterIoElement} from '../../iogui.js';

/*
 * Extends `IoElement`. Implements `IoNumber`.
 *
 * Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.
 *
 * <io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>
 *
 * <io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 1, 0, 0, 0, 1]}'></io-element-demo>
 *
 * <io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>
 **/
@RegisterIoElement
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
  static get Properties(): any {
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
        reflect: 'prop',
      },
    };
  }
  _onValueSet(event: CustomEvent) {
    if (event.detail.object) return; // TODO: unhack
    const item = event.composedPath()[0] as HTMLElement;
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
    for (const i in this.components) {
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
