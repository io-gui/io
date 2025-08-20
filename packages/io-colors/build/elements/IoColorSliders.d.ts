import { WithBinding } from 'io-core';
import { IoSlider, IoSlider2d } from 'io-sliders';
import { IoColorBase, IoColorBaseProps } from './IoColorBase.js';
export type IoColorSliderProps = IoColorBaseProps & {
    color?: WithBinding<[number, number, number, number]>;
    step?: number;
    channel?: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'v' | 'l' | 'hs' | 'sv' | 'sl';
    vertical?: boolean;
};
/**
 * A generic color slider element.
 * It is a wrapper for channel-specific sliders which are added as a child of this element depending on the `channel` property.
 * For example, setting `channel: 'h'` will instantiate a slider for "hue" color channel and hook up necessary conversions, bindings and event callbacks.
 **/
export declare class IoColorSlider extends IoColorBase {
    static get Style(): string;
    color: [number, number, number, number];
    step: number;
    channel: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'v' | 'l' | 'hs' | 'sv' | 'sl';
    vertical: boolean;
    _onValueInput(event: CustomEvent): void;
    changed(): void;
}
export declare const ioColorSlider: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A base class for 1D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
declare class IoColorSliderBase extends IoSlider {
    color: [number, number, number, number];
    static get GlUtils(): string;
    static get Frag(): string;
    valueMutated(): void;
}
/**
 * A base class for 2D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
declare class IoColorSlider2dBase extends IoSlider2d {
    color: [number, number, number, number];
    static get GlUtils(): string;
    static get Frag(): string;
    valueMutated(): void;
}
/**
 * A 1D slider for "red" color channel.
 **/
export declare class IoColorSliderR extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderR: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 1D slider for "green" color channel.
 **/
export declare class IoColorSliderG extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderG: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 1D slider for "blue" color channel.
 **/
export declare class IoColorSliderB extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderB: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 1D slider for "alpha" color channel.
 **/
export declare class IoColorSliderA extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderA: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 1D slider for "hue" color channel.
 **/
export declare class IoColorSliderH extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderH: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 1D slider for "saturation" color channel.
 **/
export declare class IoColorSliderS extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderS: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 1D slider for "value" color channel.
 **/
export declare class IoColorSliderV extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderV: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 1D slider for "level" color channel.
 **/
export declare class IoColorSliderL extends IoColorSliderBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderL: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 2D slider gor "hue" and "saturation" color channels.
 **/
export declare class IoColorSliderHs extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderHs: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 2D slider gor "saturation" and "value" color channels.
 **/
export declare class IoColorSliderSv extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderSv: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
/**
 * A 2D slider gor "saturation" and "level" color channels.
 **/
export declare class IoColorSliderSl extends IoColorSlider2dBase {
    static get GlUtils(): string;
}
export declare const ioColorSliderSl: (arg0?: IoColorSliderProps) => import("io-core").VDOMElement;
export {};
//# sourceMappingURL=IoColorSliders.d.ts.map