import { ReactiveElement, Theme } from '@io-gui/core';
/** @internal Demo: scoped style container for nested elements. */
export declare class IoStyleContainer extends ReactiveElement {
    static get Style(): string;
    static get Properties(): {
        theme: {
            type: typeof Theme;
            value: Theme;
        };
    };
    constructor();
    themeMutated(): void;
    generateWhiteNoise(): void;
}
export declare const ioStyleContainer: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
