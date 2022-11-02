import { convert } from './lib/convert.js';
import { IoElement } from '../../core/element.js';
import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoNodeConstructor } from '../../core/node.js';

@RegisterIoElement
export class IoColorBase extends IoElement {

  @IoProperty({value: {r: 1, g: 1, b: 1, a: 1}, observe: true})
  declare value: {r: number, g: number, b: number, a?: number};

  @IoProperty({value: [1, 1, 1]})
  declare rgb: [number, number, number];

  @IoProperty({value: [1, 1, 1]})
  declare hsv: [number, number, number];

  @IoProperty({value: [1, 1, 1]})
  declare hsl: [number, number, number];

  init() {
    this.valueChanged();
  }

  valueMutated() {
    this.valueChanged();
  }

  setValueFromRgb() {
    this.value.r = this.rgb[0];
    this.value.g = this.rgb[1];
    this.value.b = this.rgb[2];
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
  }
  setValueFromHsv() {
    const rgb = convert.hsv.rgb([
      this.hsv[0] * 360,
      this.hsv[1] * 100,
      this.hsv[2] * 100,
    ]);
    this.value.r = rgb[0] / 255;
    this.value.g = rgb[1] / 255;
    this.value.b = rgb[2] / 255;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
  }
  setValueFromHsl() {
    const rgb = convert.hsl.rgb([
      this.hsl[0] * 360,
      this.hsl[1] * 100,
      this.hsl[2] * 100,
    ]);
    this.value.r = rgb[0] / 255;
    this.value.g = rgb[1] / 255;
    this.value.b = rgb[2] / 255;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
  }

  valueChanged() {
    debug: {
      const c = Object.keys(this.value);
      if (c.indexOf('r') === -1 || c.indexOf('g') === -1 || c.indexOf('b') === -1) {
        console.warn('IoColor: Incorrect value type!');
      }
    }

    let rgb = [this.value.r * 255, this.value.g * 255, this.value.b * 255];
    let hsv = convert.rgb.hsv(rgb);
    let hsl = convert.rgb.hsl(rgb);

    // TODO: Investigate
    // Prevent color collapsing to 0.
    if (hsv[1] === 0) hsv[0] = this.hsv[0] * 360;
    if (hsv[2] === 0) hsv[1] = this.hsv[1] * 100;
    if (hsl[1] === 0) hsl[0] = this.hsl[0] * 360;
    if (hsl[2] === 0 || hsl[2] === 100) {
      hsl[0] = this.hsl[0] * 360;
      hsl[1] = this.hsl[1] * 100;
    }

    this.setProperties({
      rgb: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255],
      hsv: [hsv[0] / 360, hsv[1] / 100, hsv[2] / 100],
      hsl: [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100],
    });
  }
}

@RegisterIoElement
export class IoColorRgba extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: row;
        flex: 0 1 17.2em;
      }
      :host > io-number {
        flex-grow: 1;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io-spacing);
      }
    `;
  }

  _onValueInput(event: CustomEvent) {
    const item = event.composedPath()[0];
    const c = (item as any).id as keyof typeof this.value;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    const detail = {object: this.value, property: c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, false);
  }

  changed() {
    this.template([
      ['io-number', {id: 'r', value: this.value.r, min: 0, max: 1, step: 0.001, ladder: true, 'on-value-input': this._onValueInput}],
      ['io-number', {id: 'g', value: this.value.g, min: 0, max: 1, step: 0.001, ladder: true, 'on-value-input': this._onValueInput}],
      ['io-number', {id: 'b', value: this.value.b, min: 0, max: 1, step: 0.001, ladder: true, 'on-value-input': this._onValueInput}],
      this.value.a !== undefined ? ['io-number', {id: 'a', value: this.value.a, min: 0, max: 1, step: 0.001, ladder: true, 'on-value-input': this._onValueInput}] : null,
      ['io-color-picker', {id: 'swatch', value: this.value}],
    ]);
  }
}

export function IoColorMixin<T extends IoNodeConstructor<any>>(superclass: T) {
  const classConstructor = class extends (superclass) {
    static get Properties(): any {
      return {
        value: {
          value: [1, 1, 1, 1],
          observe: true,
        },
        // Internal
        rgb: [1, 1, 1],
        hsv: [1, 1, 1],
        hsl: [1, 1, 1],
        cmyk: [1, 1, 1, 1],
        alpha: 1,
        // 0 - rgb
        // 1 - hsv
        // 2 - hsl
        // 3 - cmyk
        mode: 0,
      };
    }
    init() {
      this.valueChanged();
    }
    valueMutated() {
      this.valueChanged();
    }
    modeChanged() {
      this.valueChanged();
    }
    valueFromRgb() {
      const c = Object.keys(this.value);
      switch (this.mode) {
        case 0: {
          this.value[c[0]] = this.rgb[0];
          this.value[c[1]] = this.rgb[1];
          this.value[c[2]] = this.rgb[2];
          break;
        }
        case 1: {
          const hsv = convert.rgb.hsv([
            this.rgb[0] * 255,
            this.rgb[1] * 255,
            this.rgb[2] * 255,
          ]);
          this.value[c[0]] = hsv[0] / 360;
          this.value[c[1]] = hsv[1] / 100;
          this.value[c[2]] = hsv[2] / 100;
          break;
        }
        case 2: {
          const hsl = convert.rgb.hsl([
            this.rgb[0] * 255,
            this.rgb[1] * 255,
            this.rgb[2] * 255,
          ]);
          this.value[c[0]] = hsl[0] / 360;
          this.value[c[1]] = hsl[1] / 100;
          this.value[c[2]] = hsl[2] / 100;
          break;
        }
        case 3: {
          const cmyk = convert.rgb.cmyk([
            this.rgb[0] * 255,
            this.rgb[1] * 255,
            this.rgb[2] * 255,
          ]);
          this.value[c[0]] = cmyk[0] / 100;
          this.value[c[1]] = cmyk[1] / 100;
          this.value[c[2]] = cmyk[2] / 100;
          this.value[c[3]] = cmyk[3] / 100;
          break;
        }
      }
      this._notifyValueInput();
    }
    valueFromHsv() {
      const c = Object.keys(this.value);
      switch (this.mode) {
        case 0: {
          const rgb = convert.hsv.rgb([
            this.hsv[0] * 360,
            this.hsv[1] * 100,
            this.hsv[2] * 100,
          ]);
          this.value[c[0]] = rgb[0] / 255;
          this.value[c[1]] = rgb[1] / 255;
          this.value[c[2]] = rgb[2] / 255;
          break;
        }
        case 1: {
          this.value[c[0]] = this.hsv[0];
          this.value[c[1]] = this.hsv[1];
          this.value[c[2]] = this.hsv[2];
          break;
        }
        case 2: {
          const hsl = convert.rgb.hsl(convert.hsv.rgb([
            this.hsv[0] * 360,
            this.hsv[1] * 100,
            this.hsv[2] * 100,
          ]));
          this.value[c[0]] = hsl[0] / 360;
          this.value[c[1]] = hsl[1] / 100;
          this.value[c[2]] = hsl[2] / 100;
          break;
        }
        case 3: {
          const cmyk = convert.rgb.cmyk(convert.hsv.rgb([
            this.hsv[0] * 360,
            this.hsv[1] * 100,
            this.hsv[2] * 100,
          ]));
          this.value[c[0]] = cmyk[0] / 100;
          this.value[c[1]] = cmyk[1] / 100;
          this.value[c[2]] = cmyk[2] / 100;
          this.value[c[3]] = cmyk[3] / 100;
          break;
        }
      }
      this._notifyValueInput();
    }
    valueFromHsl() {
      const c = Object.keys(this.value);
      switch (this.mode) {
        case 0: {
          const rgb = convert.hsl.rgb([
            this.hsl[0] * 360,
            this.hsl[1] * 100,
            this.hsl[2] * 100,
          ]);
          this.value[c[0]] = rgb[0] / 255;
          this.value[c[1]] = rgb[1] / 255;
          this.value[c[2]] = rgb[2] / 255;
          break;
        }
        case 1: {
          const hsv = convert.rgb.hsv(convert.hsl.rgb([
            this.hsl[0] * 360,
            this.hsl[1] * 100,
            this.hsl[2] * 100,
          ]));
          this.value[c[0]] = hsv[0] / 360;
          this.value[c[1]] = hsv[1] / 100;
          this.value[c[2]] = hsv[2] / 100;
          break;
        }
        case 2: {
          this.value[c[0]] = this.hsl[0];
          this.value[c[1]] = this.hsl[1];
          this.value[c[2]] = this.hsl[2];
          break;
        }
        case 3: {
          const cmyk = convert.rgb.cmyk(convert.hsl.rgb([
            this.hsl[0] * 360,
            this.hsl[1] * 100,
            this.hsl[2] * 100,
          ]));
          this.value[c[0]] = cmyk[0] / 100;
          this.value[c[1]] = cmyk[1] / 100;
          this.value[c[2]] = cmyk[2] / 100;
          this.value[c[3]] = cmyk[3] / 100;
          break;
        }
      }
      this._notifyValueInput();
    }
    valueFromCmyk() {
      const c = Object.keys(this.value);
      switch (this.mode) {
        case 0: {
          const rgb = convert.cmyk.rgb([
            this.cmyk[0] * 100,
            this.cmyk[1] * 100,
            this.cmyk[2] * 100,
            this.cmyk[3] * 100,
          ]);
          this.value[c[0]] = rgb[0] / 255;
          this.value[c[1]] = rgb[1] / 255;
          this.value[c[2]] = rgb[2] / 255;
          break;
        }
        case 1: {
          const hsv = convert.rgb.hsv(convert.cmyk.rgb([
            this.cmyk[0] * 100,
            this.cmyk[1] * 100,
            this.cmyk[2] * 100,
            this.cmyk[3] * 100,
          ]));
          this.value[c[0]] = hsv[0] / 360;
          this.value[c[1]] = hsv[1] / 100;
          this.value[c[2]] = hsv[2] / 100;
          break;
        }
        case 2: {
          const hsl = convert.rgb.hsl(convert.cmyk.rgb([
            this.cmyk[0] * 100,
            this.cmyk[1] * 100,
            this.cmyk[2] * 100,
            this.cmyk[3] * 100,
          ]));
          this.value[c[0]] = hsl[0] / 360;
          this.value[c[1]] = hsl[1] / 100;
          this.value[c[2]] = hsl[2] / 100;
          break;
        }
        case 3: {
          this.value[c[0]] = this.cmyk[0];
          this.value[c[1]] = this.cmyk[1];
          this.value[c[2]] = this.cmyk[2];
          this.value[c[3]] = this.cmyk[3];
          break;
        }
      }
      this._notifyValueInput();
    }
    valueChanged() {
      const c = Object.keys(this.value);
      if (c.length < 3 || c.length > 4) {
        console.error('IoGUI Color: Incorrect color type', this.value);
        return;
      }

      let mode = this.mode;
      if (c.indexOf('r') !== -1) mode = 0;
      else if (c.indexOf('h') !== -1 && c.indexOf('v') !== -1) mode = 1;
      else if (c.indexOf('h') !== -1 && c.indexOf('l') !== -1) mode = 2;
      else if (c.indexOf('c') !== -1) mode = 3;

      const val = [];
      for (let i = 0; i < c.length; i++) {
        val.push(this.value[c[i]]);
      }

      let rgb;
      let hsv;
      let hsl;
      let cmyk;
      let alpha = undefined;

      switch (mode) {
        case 3:
          cmyk = [val[0] * 100, val[1] * 100, val[2] * 100, val[3] * 100];
          rgb = convert.cmyk.rgb(cmyk);
          hsv = convert.rgb.hsv(convert.cmyk.rgb(cmyk));
          hsl = convert.rgb.hsl(convert.cmyk.rgb(cmyk));
          if (val[4] !== undefined) alpha = val[4] * 100;
          break;
        case 2:
          hsl = [val[0] * 360, val[1] * 100, val[2] * 100];
          rgb = convert.hsl.rgb(hsl);
          hsv = convert.hsl.hsv(hsl);
          cmyk = convert.rgb.cmyk(convert.hsl.rgb(hsl));
          if (val[3] !== undefined) alpha = val[3] * 100;
          break;
        case 1:
          hsv = [val[0] * 360, val[1] * 100, val[2] * 100];
          rgb = convert.hsv.rgb(hsv);
          hsl = convert.hsv.hsl(hsv);
          cmyk = convert.rgb.cmyk(convert.hsv.rgb(hsv));
          if (val[3] !== undefined) alpha = val[3] * 100;
          break;
        case 0:
        default:
          rgb = [val[0] * 255, val[1] * 255, val[2] * 255];
          hsv = convert.rgb.hsv(rgb);
          hsl = convert.rgb.hsl(rgb);
          cmyk = convert.rgb.cmyk(rgb);
          if (val[3] !== undefined) alpha = val[3] * 100;
          break;
      }

      // Prevent color collapsing to 0.

      if (hsv[1] === 0) hsv[0] = this.hsv[0] * 360;
      if (hsv[2] === 0) hsv[1] = this.hsv[1] * 100;

      if (hsl[1] === 0) hsl[0] = this.hsl[0] * 360;
      if (hsl[2] === 0 || hsl[2] === 100) {
        hsl[0] = this.hsl[0] * 360;
        hsl[1] = this.hsl[1] * 100;
      }

      if (cmyk[3] === 100) {
        cmyk[0] = this.cmyk[0] * 100;
        cmyk[1] = this.cmyk[1] * 100;
        cmyk[2] = this.cmyk[2] * 100;
      }

      //
      // TODO: allow rgb without alpha

      this.setProperties({
        rgb: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255],
        hsv: [hsv[0] / 360, hsv[1] / 100, hsv[2] / 100],
        hsl: [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100],
        cmyk: [cmyk[0] / 100, cmyk[1] / 100, cmyk[2] / 100, cmyk[3] / 100],
        alpha: alpha !== undefined ? alpha / 100 : 1,
        mode: mode,
      });
    }
  };
  return classConstructor;
}
