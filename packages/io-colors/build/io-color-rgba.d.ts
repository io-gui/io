import { IoColorBase } from './elements/color-base.js';
/**
 * Input element for color displayed as vector and an interactive picker.
 **/
export declare class IoColorRgba extends IoColorBase {
    static get Style(): string;
    _onNumberValueInput(event: CustomEvent): void;
    changed(): void;
}
export declare const ioColorRgba: (arg0?: import("./elements/color-base.js").IoColorBaseArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-color-rgba.d.ts.map