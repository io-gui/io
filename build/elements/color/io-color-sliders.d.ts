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
export declare class IoColorSlider extends IoColorBase {
    static get Style(): string;
    color: [number, number, number, number];
    channel: string;
    vertical: boolean;
    _onValueInput(event: CustomEvent): void;
    changed(): void;
}
/**
 * A base class for 1D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
export declare class IoColorSliderBase extends IoSlider {
    static get GlUtils(): string;
    static get Frag(): string;
}
/**
 * A base class for 2D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
export declare class IoColorSlider2dBase extends IoSlider2d {
    static get GlUtils(): string;
    static get Frag(): string;
}
/**
 * A 1D slider for "red" color channel.
 **/
export declare class IoColorSliderR extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "green" color channel.
 **/
export declare class IoColorSliderG extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "blue" color channel.
 **/
export declare class IoColorSliderB extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "alpha" color channel.
 **/
export declare class IoColorSliderA extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "hue" color channel.
 **/
export declare class IoColorSliderH extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "saturation" color channel.
 **/
export declare class IoColorSliderS extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "value" color channel.
 **/
export declare class IoColorSliderV extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "level" color channel.
 **/
export declare class IoColorSliderL extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "cyan" color channel.
 **/
export declare class IoColorSliderC extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "magenta" color channel.
 **/
export declare class IoColorSliderM extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "yellow" color channel.
 **/
export declare class IoColorSliderY extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 1D slider for "key" color channel.
 **/
export declare class IoColorSliderK extends IoColorSliderBase {
    static get GlUtils(): string;
}
/**
 * A 2D slider gor "hue" and "saturation" color channels.
 **/
export declare class IoColorSliderHs extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
/**
 * A 2D slider gor "saturation" and "value" color channels.
 **/
export declare class IoColorSliderSv extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
/**
 * A 2D slider gor "saturation" and "level" color channels.
 **/
export declare class IoColorSliderSL extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
//# sourceMappingURL=io-color-sliders.d.ts.map