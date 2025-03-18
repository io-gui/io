import { Register } from '../../core/decorators/register.js';
import { IoColorBase } from './io-color-base.js';

/**
 * Element displaying colored square.
 *
 * <io-element-demo element="io-color-swatch"
 * properties='{"value": [1, 0.5, 0, 1]}'
 * config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
@Register
export class IoColorSwatch extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
        min-width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        background-color: white;
        background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
        background-size: 12px 12px;
        background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
        overflow: visible;
      }
      :host > div { 
        width: 100%;
        height: 100%;
      }
    `;
  }
  valueChanged() {
    super.valueChanged();
    this.template([
      ['div', {style: {'background-color': `rgba(${this.rgba[0] * 255 },${this.rgba[1] * 255}, ${this.rgba[2] * 255}, ${this.rgba[3]})`}}]
    ]);
  }
}
