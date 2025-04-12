import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoColorBase, IoColorBaseArgs } from './IoColorBase';
import { IoSlider, IoSlider2d } from 'io-sliders';
export type IoColorSliderArgs = IoColorBaseArgs & ArgsWithBinding<{
    color?: [number, number, number, number];
    step?: number;
    channel?: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'v' | 'l' | 'hs' | 'sv' | 'sl';
    vertical?: boolean;
}>;
/**
 * A generic color slider element.
 * It is a wrapper for channel-specific sliders which are added as a child of this element depending on the `channel` property.
 * For example, setting `channel: 'h'` will instantiate a slider for "hue" color channel and hook up necessary conversions, bindings and event callbacks.
 **/
export declare class IoColorSlider extends IoColorBase {
    static vConstructor: (arg0?: IoColorSliderArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    color: [number, number, number, number];
    step: number;
    channel: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'v' | 'l' | 'hs' | 'sv' | 'sl';
    vertical: boolean;
    _onValueInput(event: CustomEvent): void;
    changed(): void;
}
export declare const ioColorSlider: (arg0?: IoColorSliderArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
export declare const ioColorSliderR: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 1D slider for "green" color channel.
 **/
export declare class IoColorSliderG extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderG: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 1D slider for "blue" color channel.
 **/
export declare class IoColorSliderB extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderB: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 1D slider for "alpha" color channel.
 **/
export declare class IoColorSliderA extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderA: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 1D slider for "hue" color channel.
 **/
export declare class IoColorSliderH extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderH: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 1D slider for "saturation" color channel.
 **/
export declare class IoColorSliderS extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderS: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 1D slider for "value" color channel.
 **/
export declare class IoColorSliderV extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderV: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 1D slider for "level" color channel.
 **/
export declare class IoColorSliderL extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderL: (arg0?: import("io-sliders").IoSliderBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 2D slider gor "hue" and "saturation" color channels.
 **/
export declare class IoColorSliderHs extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderHs: (arg0?: import("io-sliders").IoSlider2dArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 2D slider gor "saturation" and "value" color channels.
 **/
export declare class IoColorSliderSv extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderSv: (arg0?: import("io-sliders").IoSlider2dArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
/**
 * A 2D slider gor "saturation" and "level" color channels.
 **/
export declare class IoColorSliderSl extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderSl: (arg0?: import("io-sliders").IoSlider2dArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoColorSliders.d.ts.map