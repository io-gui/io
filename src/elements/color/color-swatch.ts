import { RegisterIoElement } from '../../core/element.js';
import { IoColorBase } from './color-base.js';

@RegisterIoElement
export class IoColorSwatch extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
        min-width: var(--io-field-height);
        height: var(--io-field-height);
        background-color: white;
        background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
        background-size: 12px 12px;
        background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
      }
      :host > div { 
        width: 100%;
        height: 100%;
      }
    `;
  }
  valueChanged() {
    super.valueChanged();
    const alpha = this.value.a !== undefined ? this.value.a : 1;
    this.template([
      ['div', {style: {'background-color': `rgba(${this.rgb[0] * 255 },${this.rgb[1] * 255}, ${this.rgb[2] * 255}, ${alpha})`}}]
    ]);
  }
}
