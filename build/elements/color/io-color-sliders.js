var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoColorBase } from './io-color-base.js';
import { IoSlider } from '../sliders/io-slider.js';
import { IoSlider2d } from '../sliders/io-slider-2d.js';
/**
 * A generic color slider element.
 * It is a wrapper for channel-specific sliders which are added as a child of this element depending on the `channel` property.
 * For example, setting `channel: 'h'` will instantiate a slider for "hue" color channel and hook up necessary conversions, bindings and event callbacks.
 *
 * <io-element-demo element="io-color-slider-hs"
 * width="64px" height="64px"
 * properties='{"value": [1, 0.5, 0, 1], "horizontal": true}'
 * config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
let IoColorSlider = class IoColorSlider extends IoColorBase {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
      }
    `;
    }
    _onValueInput(event) {
        const v = event.detail.value;
        switch (this.channel) {
            case 'r':
                this.value.r = v;
                break;
            case 'g':
                this.value.g = v;
                break;
            case 'b':
                this.value.b = v;
                break;
            case 'a':
                this.value.a = v;
                break;
            case 'h':
                this.hsv[0] = v;
                this.rgbFromHsv();
                this.valueFromRgb();
                break;
            case 's':
                this.hsv[1] = v;
                this.rgbFromHsv();
                this.valueFromRgb();
                break;
            case 'v':
                this.hsv[2] = v;
                this.rgbFromHsv();
                this.valueFromRgb();
                break;
            case 'l':
                this.hsl[2] = v;
                this.rgbFromHsl();
                this.valueFromRgb();
                break;
            case 'c':
                this.cmyk[0] = v;
                this.rgbFromCmyk();
                this.valueFromRgb();
                break;
            case 'm':
                this.cmyk[1] = v;
                this.rgbFromCmyk();
                this.valueFromRgb();
                break;
            case 'y':
                this.cmyk[2] = v;
                this.rgbFromCmyk();
                this.valueFromRgb();
                break;
            case 'k':
                this.cmyk[3] = v;
                this.rgbFromCmyk();
                this.valueFromRgb();
                break;
            case 'hs':
                this.hsv[0] = v[0];
                this.hsv[1] = v[1];
                this.rgbFromHsv();
                this.valueFromRgb();
                break;
            case 'sv':
                this.hsv[1] = v[0];
                this.hsv[2] = v[1];
                this.rgbFromHsv();
                this.valueFromRgb();
                break;
            case 'sl':
                this.hsl[1] = v[0];
                this.hsl[2] = v[1];
                this.rgbFromHsl();
                this.valueFromRgb();
                break;
        }
        this.dispatchEvent('object-mutated', { object: this.value }, false, window);
        this.dispatchEvent('value-input', { property: 'value', value: this.value }, false);
    }
    changed() {
        const c = this.channel;
        debug: {
            if (['r', 'g', 'b', 'a', 'h', 's', 'v', 'l', 'c', 'm', 'y', 'k', 'hs', 'sv', 'sl'].indexOf(c) === -1) {
                console.warn('IoColorSlider: Incorrect channel value!', c);
            }
        }
        const sliderInputTagName = `io-color-slider-${c}`;
        let value = 0;
        let color = [0, 0, 0, 0];
        let min = 0;
        let max = 1;
        let step = 0.0001;
        switch (this.channel) {
            case 'r':
                value = this.value.r;
                color = [...this.rgba];
                break;
            case 'g':
                value = this.value.g;
                color = [...this.rgba];
                break;
            case 'b':
                value = this.value.b;
                color = [...this.rgba];
                break;
            case 'a':
                value = this.value.a || 0;
                color = [...this.rgba];
                break;
            case 'h':
                value = this.hsv[0];
                color = [...this.hsv, 1];
                break;
            case 's':
                value = this.hsv[1];
                color = [...this.hsv, 1];
                break;
            case 'v':
                value = this.hsv[2];
                color = [...this.hsv, 1];
                break;
            case 'l':
                value = this.hsl[2];
                color = [...this.hsl, 1];
                break;
            case 'c':
                value = this.cmyk[0];
                color = [...this.cmyk];
                break;
            case 'm':
                value = this.cmyk[1];
                color = [...this.cmyk];
                break;
            case 'y':
                value = this.cmyk[2];
                color = [...this.cmyk];
                break;
            case 'k':
                value = this.cmyk[3];
                color = [...this.cmyk];
                break;
            case 'hs':
                value = [this.hsv[0], this.hsv[1]];
                color = [...this.hsv, 1];
                min = [min, min];
                max = [max, max];
                step = [step, step];
                break;
            case 'sv':
                value = [this.hsv[1], this.hsv[2]];
                color = [...this.hsv, 1];
                min = [min, min];
                max = [max, max];
                step = [step, step];
                break;
            case 'sl':
                value = [this.hsl[1], this.hsl[2]];
                color = [...this.hsl, 1];
                min = [min, min];
                max = [max, max];
                step = [step, step];
                break;
        }
        this.template([
            [sliderInputTagName, { id: c, value: value, min: min, max: max, step: step, vertical: this.vertical, color: color, '@value-input': this._onValueInput }],
        ]);
    }
};
__decorate([
    Property({ type: Array, init: [0, 0, 0, 0] })
], IoColorSlider.prototype, "color", void 0);
__decorate([
    Property('')
], IoColorSlider.prototype, "channel", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoColorSlider.prototype, "vertical", void 0);
IoColorSlider = __decorate([
    Register
], IoColorSlider);
export { IoColorSlider };
/**
 * A base class for 1D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
export class IoColorSliderBase extends IoSlider {
    static get GlUtils() {
        return /* glsl */ `
      // Note: Implement in subclass!
      // TODO: Allow GlUtils to rewrite inherited functions!
      // vec3 getStariotColor(vec2 uv) {}
      // vec3 getEndColor(vec2 uv) {}
    `;
    }
    static get Frag() {
        return /* glsl */ `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.0, 0.5));

      // Background
      vec3 finalCol = iotBackgroundColorField.rgb;

      // Line
      vec3 startCol = getStariotColor(uv);
      vec3 endCol = getEndColor(uv);
      vec3 lineCol = mix(startCol, endCol, uv.x);

      vec2 linePos = translate(size * uv, 0.0, size.y / 2.);
      finalCol = paintHorizontalLine(finalCol, linePos, lineCol);

      // Slider
      vec3 sliderCol = hsv2rgb(uColor.rgb);
      finalCol = paintSlider(finalCol, position, size, startCol, endCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
    }
}
/**
 * A base class for 2D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
export class IoColorSlider2dBase extends IoSlider2d {
    static get GlUtils() {
        return /* glsl */ `
      // Note: Implement in subclass!
      // TODO: Allow GlUtils to rewrite inherited functions!
      // vec3 geiotColor(vec2 uv) {}
    `;
    }
    static get Frag() {
        return /* glsl */ `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.5));

      // Colors
      vec3 finalCol = geiotColor(uv);
      vec3 sliderCol = geiotColor(uValue);

      vec2 gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;
      vec2 offsetPosition = translate(position, -gridOffset);

      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, offsetPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
    }
}
/**
 * A 1D slider for "red" color channel.
 **/
let IoColorSliderR = class IoColorSliderR extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return vec3(uv.x, uColor[1], uColor[2]);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uv.x, uColor[1], uColor[2]);
      }
    `;
    }
};
IoColorSliderR = __decorate([
    Register
], IoColorSliderR);
export { IoColorSliderR };
/**
 * A 1D slider for "green" color channel.
 **/
let IoColorSliderG = class IoColorSliderG extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return vec3(uColor[0], uv.x, uColor[2]);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uColor[0], uv.x, uColor[2]);
      }
    `;
    }
};
IoColorSliderG = __decorate([
    Register
], IoColorSliderG);
export { IoColorSliderG };
/**
 * A 1D slider for "blue" color channel.
 **/
let IoColorSliderB = class IoColorSliderB extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return vec3(uColor[0], uColor[1], uv.x);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uColor[0], uColor[1], uv.x);
      }
    `;
    }
};
IoColorSliderB = __decorate([
    Register
], IoColorSliderB);
export { IoColorSliderB };
/**
 * A 1D slider for "alpha" color channel.
 **/
let IoColorSliderA = class IoColorSliderA extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 position = size * (uv - vec2(0.0, 0.5));
        return mix(vec3(0.5), vec3(1.0), checkerX(position, iotFieldHeight / 4.0));
      }
      vec3 getEndColor(vec2 uv) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 position = size * (uv - vec2(0.0, 0.5));
        vec3 chkCol = mix(vec3(0.5), vec3(1.0), checkerX(position, iotFieldHeight / 4.0));
        return mix(chkCol, uColor.rgb, uColor.a);
      }
    `;
    }
};
IoColorSliderA = __decorate([
    Register
], IoColorSliderA);
export { IoColorSliderA };
/**
 * A 1D slider for "hue" color channel.
 **/
let IoColorSliderH = class IoColorSliderH extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return hsv2rgb(vec3(uv.x, uColor[1], uColor[2]));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uv.x, uColor[1], uColor[2]));
      }
    `;
    }
};
IoColorSliderH = __decorate([
    Register
], IoColorSliderH);
export { IoColorSliderH };
/**
 * A 1D slider for "saturation" color channel.
 **/
let IoColorSliderS = class IoColorSliderS extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv.x, uColor[2]));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv.x, uColor[2]));
      }
    `;
    }
};
IoColorSliderS = __decorate([
    Register
], IoColorSliderS);
export { IoColorSliderS };
/**
 * A 1D slider for "value" color channel.
 **/
let IoColorSliderV = class IoColorSliderV extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
    `;
    }
};
IoColorSliderV = __decorate([
    Register
], IoColorSliderV);
export { IoColorSliderV };
/**
 * A 1D slider for "level" color channel.
 **/
let IoColorSliderL = class IoColorSliderL extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
      vec3 getEndColor(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
    `;
    }
};
IoColorSliderL = __decorate([
    Register
], IoColorSliderL);
export { IoColorSliderL };
/**
 * A 1D slider for "cyan" color channel.
 **/
let IoColorSliderC = class IoColorSliderC extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return cmyk2rgb(vec4(uv.x, uColor[1], uColor[2], uColor[3]));
      }
      vec3 getEndColor(vec2 uv) {
        return cmyk2rgb(vec4(uv.x, uColor[1], uColor[2], uColor[3]));
      }
    `;
    }
};
IoColorSliderC = __decorate([
    Register
], IoColorSliderC);
export { IoColorSliderC };
/**
 * A 1D slider for "magenta" color channel.
 **/
let IoColorSliderM = class IoColorSliderM extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return cmyk2rgb(vec4(uColor[0], uv.x, uColor[2], uColor[3]));
      }
      vec3 getEndColor(vec2 uv) {
        return cmyk2rgb(vec4(uColor[0], uv.x, uColor[2], uColor[3]));
      }
    `;
    }
};
IoColorSliderM = __decorate([
    Register
], IoColorSliderM);
export { IoColorSliderM };
/**
 * A 1D slider for "yellow" color channel.
 **/
let IoColorSliderY = class IoColorSliderY extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return cmyk2rgb(vec4(uColor[0], uColor[1], uv.x, uColor[3]));
      }
      vec3 getEndColor(vec2 uv) {
        return cmyk2rgb(vec4(uColor[0], uColor[1], uv.x, uColor[3]));
      }
    `;
    }
};
IoColorSliderY = __decorate([
    Register
], IoColorSliderY);
export { IoColorSliderY };
/**
 * A 1D slider for "key" color channel.
 **/
let IoColorSliderK = class IoColorSliderK extends IoColorSliderBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 getStariotColor(vec2 uv) {
        return cmyk2rgb(vec4(uColor[0], uColor[1], uColor[2], uv.x));
      }
      vec3 getEndColor(vec2 uv) {
        return cmyk2rgb(vec4(uColor[0], uColor[1], uColor[2], uv.x));
      }
    `;
    }
};
IoColorSliderK = __decorate([
    Register
], IoColorSliderK);
export { IoColorSliderK };
/**
 * A 2D slider gor "hue" and "saturation" color channels.
 **/
let IoColorSliderHs = class IoColorSliderHs extends IoColorSlider2dBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 geiotColor(vec2 uv) {
        return hsv2rgb(vec3(uv, uColor[2]));
      }
    `;
    }
};
IoColorSliderHs = __decorate([
    Register
], IoColorSliderHs);
export { IoColorSliderHs };
/**
 * A 2D slider gor "saturation" and "value" color channels.
 **/
let IoColorSliderSv = class IoColorSliderSv extends IoColorSlider2dBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 geiotColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv));
      }
    `;
    }
};
IoColorSliderSv = __decorate([
    Register
], IoColorSliderSv);
export { IoColorSliderSv };
/**
 * A 2D slider gor "saturation" and "level" color channels.
 **/
let IoColorSliderSL = class IoColorSliderSL extends IoColorSlider2dBase {
    static get GlUtils() {
        return /* glsl */ `
      vec3 geiotColor(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uv));
      }
    `;
    }
};
IoColorSliderSL = __decorate([
    Register
], IoColorSliderSL);
export { IoColorSliderSL };
//# sourceMappingURL=io-color-sliders.js.map