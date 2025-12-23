import { IoColorBase, IoColorBaseProps } from './IoColorBase.js';
/**
 * Input element for color displayed as vector and an interactive picker.
 **/
export declare class IoColorRgba extends IoColorBase {
    static get Style(): string;
    _onNumberValueInput(event: CustomEvent): void;
    changed(): void;
}
export declare const ioColorRgba: (arg0?: IoColorBaseProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoColorRgba.d.ts.map