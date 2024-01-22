import { IoSliderBase } from './io-slider-base.js';
/**
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider" properties='{"value": 0, "step": 0.01, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
export declare class IoSlider extends IoSliderBase {
    value: number;
    step: number;
    min: number;
    max: number;
    static get GlUtils(): string;
    static get Frag(): string;
}
//# sourceMappingURL=io-slider.d.ts.map