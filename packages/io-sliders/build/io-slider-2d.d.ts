import { VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoSliderBase, IoSliderBaseArgs } from './io-slider-base.js';
export type IoSlider2dArgs = IoSliderBaseArgs & ArgsWithBinding<{}>;
export declare class IoSlider2d extends IoSliderBase {
    static get Style(): string;
    value: [number, number];
    step: [number, number];
    min: [number, number];
    max: [number, number];
    noscroll: boolean;
    static get GlUtils(): string;
    static get Frag(): string;
    static vDOM: (arg0?: IoSlider2dArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioSlider2d: (arg0?: IoSlider2dArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-slider-2d.d.ts.map