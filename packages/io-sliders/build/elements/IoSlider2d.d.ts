import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoSliderBase, IoSliderBaseArgs } from './IoSliderBase';
export type IoSlider2dArgs = IoSliderBaseArgs & ArgsWithBinding<{}>;
export declare class IoSlider2d extends IoSliderBase {
    static vConstructor: (arg0?: IoSlider2dArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: [number, number];
    step: [number, number];
    min: [number, number];
    max: [number, number];
    noscroll: boolean;
    constructor(args?: IoSlider2dArgs);
    static get GlUtils(): string;
    static get Frag(): string;
}
export declare const ioSlider2d: (arg0?: IoSlider2dArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoSlider2d.d.ts.map