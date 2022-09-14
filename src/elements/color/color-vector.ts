import {IoElement, RegisterIoElement} from '../../iogui.js';
import {IoColorMixin} from './color.js';
import './color-picker.js';

/*
 * Extends `IoColorMixin(IoElement)`.
 *
 * Implements `IoNumber` and `IoColorPicker`.
 *
 * Input element for color displayed as vector and an interactive picker.
 *
 * <io-element-demo element="io-color-vector"
 * properties='{"mode": 0, "value": [1, 0.5, 0, 1]}'
 * config='{"value": ["io-properties"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}, {"value": 3, "label": "3 - cmyk"}]}]}
 * '></io-element-demo>
 **/

@RegisterIoElement
export class IoColorVector extends IoColorMixin(IoElement) {
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
    :host > io-color-picker {
      width: calc(var(--io-line-height) + calc(2 * var(--io-spacing)));
    }
    `;
  }
  static get Properties(): any {
    return {
      value: [0, 0, 0, 0],
      conversion: 1,
      step: 0.01,
      min: 0,
      max: 1,
    };
  }
  _onValueSet(event: CustomEvent) {
    const item = event.composedPath()[0];
    const c = (item as any).id;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    // TODO: test
    const detail = {object: this.value, property: this.linked ? null : c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
    this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
  }
  changed() {
    const elements = [];
    const components = Object.keys(this.value);
    for (const i in components) {
      const c = components[i];
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
    return ['io-color-picker', {id: 'swatch', mode: this.mode, value: this.value}]; // , 'on-value-set': this._onValueSet
  }
}
