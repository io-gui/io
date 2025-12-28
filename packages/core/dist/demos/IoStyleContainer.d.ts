import { IoElement, Theme } from '@io-gui/core';
/**
 * `IoStyleContainer` is a container element that applies styles to the elements inside it.
 * It is used to apply styles to the elements inside it.
 */
export declare class IoStyleContainer extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        theme: {
            type: typeof Theme;
            value: Theme;
        };
    };
    constructor();
    themeMutated(): void;
    generateWhiteNoise(): void;
}
export declare const ioStyleContainer: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoStyleContainer.d.ts.map