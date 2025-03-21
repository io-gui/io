import { convert } from './lib/convert.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/decorators/property.js';

export class IoColorBase extends IoElement {

  @Property({type: Object, init: {r: 1, g: 1, b: 1, a: 1}})
  declare value: {r: number, g: number, b: number, a?: number};

  @Property({type: Array, init: [1, 1, 1, 1]})
  declare rgba: [number, number, number, number];

  @Property({type: Array, init: [1, 1, 1]})
  declare hsv: [number, number, number];

  @Property({type: Array, init: [1, 1, 1]})
  declare hsl: [number, number, number];

  init() {
    this.valueChanged();
  }

  valueMutated() {
    this.valueChanged();
  }

  rgbFromHsv() {
    const rgb = convert.hsv.rgb([
      this.hsv[0] * 360,
      this.hsv[1] * 100,
      this.hsv[2] * 100,
    ]);
    this.rgba[0] = rgb[0] / 255;
    this.rgba[1] = rgb[1] / 255;
    this.rgba[2] = rgb[2] / 255;
  }
  rgbFromHsl() {
    const rgb = convert.hsl.rgb([
      this.hsl[0] * 360,
      this.hsl[1] * 100,
      this.hsl[2] * 100,
    ]);
    this.rgba[0] = rgb[0] / 255;
    this.rgba[1] = rgb[1] / 255;
    this.rgba[2] = rgb[2] / 255;
  }
  valueFromRgb() {
    this.value.r = this.rgba[0];
    this.value.g = this.rgba[1];
    this.value.b = this.rgba[2];
  }

  valueChanged() {
    debug: {
      const c = Object.keys(this.value);
      if (c.indexOf('r') === -1 || c.indexOf('g') === -1 || c.indexOf('b') === -1) {
        console.warn('IoColor: Incorrect value type!');
      }
    }

    const rgb = [this.value.r * 255, this.value.g * 255, this.value.b * 255];
    const hsv = convert.rgb.hsv(rgb);
    const hsl = convert.rgb.hsl(rgb);

    // Prevent color conversion from flippping hue 360.
    if (hsv[0] === 0 || hsv[0] === 360) hsv[0] = this.hsv[0] * 360;
    if (hsl[1] === 0 || hsl[1] === 0) hsl[0] = this.hsl[0] * 360;

    // Prevent saturation 0 from collapsing hue to 0.
    if (hsv[1] === 0) hsv[0] = this.hsv[0] * 360;
    if (hsl[1] === 0) hsl[0] = this.hsl[0] * 360;

    // Prevent lightness/value 0 from collapsing hue/saturation to 0.
    if (hsv[2] === 0) hsv[1] = this.hsv[1] * 100;
    if (hsl[2] === 0 || hsl[2] === 100) {
      hsl[0] = this.hsl[0] * 360;
      hsl[1] = this.hsl[1] * 100;
    }

    this.setProperties({
      rgba: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, this.value.a ?? 1],
      hsv: [hsv[0] / 360, hsv[1] / 100, hsv[2] / 100],
      hsl: [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100],
    });
  }
}
