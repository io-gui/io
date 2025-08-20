import { WithBinding } from 'io-core';
import { IoSliderBase, IoSliderBaseProps } from './IoSliderBase.js';
export type IoSlider2dProps = IoSliderBaseProps & {
    value?: WithBinding<[number, number]>;
    step?: [number, number];
    min?: [number, number];
    max?: [number, number];
};
export declare class IoSlider2d extends IoSliderBase {
    static get Style(): string;
    value: [number, number];
    step: [number, number];
    min: [number, number];
    max: [number, number];
    noscroll: boolean;
    constructor(args?: IoSlider2dProps);
    static get GlUtils(): string;
    static get Frag(): string;
}
export declare const ioSlider2d: (arg0?: IoSlider2dProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoSlider2d.d.ts.map