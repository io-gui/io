import {IoSlider} from "./slider.js";

export class IoSliderRange extends IoSlider {
	static get Properties() {
		return {
			value: {
				type: Array,
				value: [0, 0],
				observe: true,
			},
		};
	}
	_onPointermoveThrottled(event) {
		if (this._active === 1) {
			if (document.activeElement !== this ) this.focus();
			const rect = this.getBoundingClientRect();
			const x = Math.pow(Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width)), this.exponent);
			const y = Math.pow(Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height)), this.exponent);

			let _x = this.min * (1 - x) + this.max * x;
			_x = Math.min(this.max, Math.max(this.min, _x));
			_x = Math.round(_x / this.step) * this.step;
			let _y = this.min * (1 - y) + this.max * y;
			_y = Math.min(this.max, Math.max(this.min, _y));
			_y = Math.round(_y / this.step) * this.step;

			this._setValue(this.horizontal ? _x : _y, this.horizontal ? _y : _x);
		}
	}
	_setValue(x) {
		this.set('value', [0, Number(x.toFixed(5))]);
	}
	_onKeydown(event) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			if (!event.shiftKey) this.focusTo('left');
			else this._setDecrease();
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (!event.shiftKey) this.focusTo('up');
			else this._setIncrease();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			if (!event.shiftKey) this.focusTo('right');
			else this._setIncrease();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!event.shiftKey) this.focusTo('down');
			else this._setDecrease();
		} else if (event.key === 'PageUp' || event.key === '+') {
			event.preventDefault();
			this._setIncrease();
		} else if (event.key === 'PageDown' || event.key === '-') {
			event.preventDefault();
			this._setDecrease();
		} else if (event.key === 'Home') {
			event.preventDefault();
			this._setMin();
		} else if (event.key === 'PageDown') {
			event.preventDefault();
			this._setMax();
		}
	}
	// TODO: round to step
	_setIncrease() {
		let value = this.value + this.step;
		value = Math.min(this.max, Math.max(this.min, (value)));
		this._setValue(value);
	}
	_setDecrease() {
		let value = this.value - this.step;
		value = Math.min(this.max, Math.max(this.min, (value)));
		this._setValue(value);
	}
	_setMin() {
		let value = this.min;
		value = Math.min(this.max, Math.max(this.min, (value)));
		this._setValue(value);
	}
	_setMax() {
		let value = this.max;
		value = Math.min(this.max, Math.max(this.min, (value)));
		this._setValue(value);
	}
	setAria() {
		// this.setAttribute('aria-invalid', this.value instanceof Array ? 'true' : false);
		// this.setAttribute('aria-valuenow', isNaN(this.value) ? 0 : this.value);
		// this.setAttribute('aria-valuemin', this.min);
		// this.setAttribute('aria-valuemax', this.max);
		// this.setAttribute('aria-valuestep', this.step);
	}
	static get Frag() {
		return /* glsl */`
		#extension GL_OES_standard_derivatives : enable

		varying vec2 vUv;

		void main(void) {
			vec3 finalColor = cssBackgroundColorField.rgb;

			vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
			vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
			vec2 position = size * uv;


			float stepInPx = size.x / ((uMax - uMin) / uStep);
			vec4 stepColorBg = mix(cssColor, cssBackgroundColorField, 0.75);

			float lineWidth = cssStrokeWidth;
			if (stepInPx > lineWidth * 2.0) {
				// TODO: grid with exponent
				float gridWidth = size.x / ((uMax - uMin) / uStep);
				float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
				vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
				float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
				finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
			}

			vec4 slotGradient = mix(cssColorFocus, cssColorLink, uv.x);
			float knobRadius = cssItemHeight * 0.25;
			float slotWidth = cssItemHeight * 0.125;

			float valueInRangeStart = saturate((uValue[0] - uMin) / (uMax - uMin));
			valueInRangeStart = pow(valueInRangeStart, 1./uExponent);

			float valueInRangeEnd = saturate((uValue[1] - uMin) / (uMax - uMin));
			valueInRangeEnd = pow(valueInRangeEnd, 1./uExponent);

			vec2 sliderStart = vec2(size.x * valueInRangeStart, size.y * 0.5);
			vec2 sliderEnd = vec2(size.x * valueInRangeEnd, size.y * 0.5);

			vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
			finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

			gl_FragColor = vec4(finalColor, 1.0);
		}`;
	}
}

IoSliderRange.Register();
