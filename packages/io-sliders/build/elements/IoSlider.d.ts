import { IoSliderBase } from './IoSliderBase';
/**
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 **/
export declare class IoSlider extends IoSliderBase {
    value: number;
    step: number;
    min: number;
    max: number;
    static get Frag(): string;
}
export declare const ioSlider: (arg0?: import("./IoSliderBase").IoSliderBaseArgs | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoSlider.d.ts.map