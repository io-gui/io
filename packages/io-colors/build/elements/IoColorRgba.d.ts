import { IoColorBase } from './IoColorBase';
/**
 * Input element for color displayed as vector and an interactive picker.
 **/
export declare class IoColorRgba extends IoColorBase {
    static get Style(): string;
    _onNumberValueInput(event: CustomEvent): void;
    changed(): void;
}
export declare const ioColorRgba: (arg0?: import("./IoColorBase").IoColorBaseArgs | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoColorRgba.d.ts.map