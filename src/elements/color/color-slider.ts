import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoColorBase } from './color-base.js';
import { IoSlider } from '../sliders/slider.js';

const COLORS = {
  'r': [1, 0.25, 0.25, 1],
  'g': [0.35, 0.75, 0.25, 1],
  'b': [0.35, 0.35, 1, 1],
  'a': [0.8, 0.8, 0.8, 1],
};

@RegisterIoElement
export class IoColorSlider extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: row;
        flex: 0 1 17.2em;
      }
      :host[vertical] {
        /* flex: 0 0 17.2em; */
      }
    `;
  }

  @IoProperty('')
  declare channel: string;

  @IoProperty({value: false, reflect: 'prop'})
  declare vertical: boolean;

  _onValueInput(event: CustomEvent) {
    const c = this.channel as keyof typeof this.value;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    const detail = {object: this.value, property: c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, false);
  }

  changed() {
    const c = this.channel as keyof typeof this.value;

    debug: {
      if (['r', 'g', 'b', 'a', 'h', 's', 'v', 'l'].indexOf(c) === -1) {
        console.warn('IoColorSlider: Incorrect channel value!', c);
      }
    }

    if (['r', 'g', 'b', 'a'].indexOf(c) !== -1) {
      this.template([
        ['io-slider', {value: this.value[c], min: 0, max: 1, step: 0.001, vertical: this.vertical, color: COLORS[c], 'on-value-input': this._onValueInput}],
      ]);
    }

    if (this.channel === 'h') {
      this.template([
        ['io-slider-h', {id: c, value: this.hsv[0], min: 0, max: 1, step: 0.1, vertical: this.vertical, color: [...this.hsv, 1], 'on-value-input': this._onValueInput}],
      ]);
    }

  }
}

@RegisterIoElement
export class IoSliderH extends IoSlider {
  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.0, 0.5));

      // Colors
      vec3 finalCol = hsv2rgb(vec3(uv.x, uColor[1], uColor[2]));
      vec3 sliderCol = hsv2rgb(uColor.rgb);

      // Slider
      vec4 slider = paintSlider(position, size, sliderCol, sliderCol);
      finalCol = mix(finalCol.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}