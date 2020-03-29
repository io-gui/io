import {IoElement} from '../../io.js';
import {convert} from '../../../lib/color-convert.js';

export const IoColorMixin = (superclass) => {
	const classConstructor = class extends superclass {
		static get Properties() {
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
		static get GlUtils() {
			return /* glsl */`
			vec3 hue2rgb(float hue) {
				hue=fract(hue);
				float R = abs(hue * 6. - 3.) - 1.;
				float G = 2. - abs(hue * 6. - 2.);
				float B = 2. - abs(hue * 6. - 4.);
				return saturate(vec3(R,G,B));
			}
			vec3 hsv2rgb(vec3 hsv) {
				vec3 rgb = hue2rgb(hsv.r);
				return ((rgb - 1.) * hsv.g + 1.) * hsv.b;
			}
			vec3 hsl2rgb(vec3 hsl) {
				vec3 rgb = hue2rgb(hsl.x);
				float C = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
				return (rgb - 0.5) * C + hsl.z;
			}
			vec3 cmyk2rgb(vec4 cmyk) {
				float r = 1. - min(1., cmyk.x * (1. - cmyk.w) + cmyk.w);
				float g = 1. - min(1., cmyk.y * (1. - cmyk.w) + cmyk.w);
				float b = 1. - min(1., cmyk.z * (1. - cmyk.w) + cmyk.w);
				return vec3(r, g, b);
			}
			\n\n`;
		}
		valueMutated() {
			this.valueChanged();
		}
		modeChanged() {
			this.valueChanged();
		}
		setValueFromRgb() {
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
			this._notifyValueChange();
		}
		setValueFromHsv() {
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
			this._notifyValueChange();
		}
		setValueFromHsl() {
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
			this._notifyValueChange();
		}
		setValueFromCmyk() {
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
			this._notifyValueChange();
		}
		valueChanged() {
			let c = Object.keys(this.value);

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

			this.setProperties({
				rgb: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255],
				hsv: [hsv[0] / 360, hsv[1] / 100, hsv[2] / 100],
				hsl: [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100],
				cmyk: [cmyk[0] / 100, cmyk[1] / 100, cmyk[2] / 100, cmyk[3] / 100],
				alpha: alpha !== undefined ? alpha / 100 : undefined,
				mode: mode,
			});
		}
	};
	classConstructor.Register = IoElement.Register;
	return classConstructor;
};
