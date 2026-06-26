import { ReactiveElement } from '@io-gui/core';
export declare class IoColorsDemo extends ReactiveElement {
    static get Style(): string;
    static get Properties(): {
        rgb: {
            value: {
                r: number;
                g: number;
                b: number;
            };
        };
        rgba: {
            value: {
                r: number;
                g: number;
                b: number;
                a: number;
            };
        };
    };
    ready(): void;
}
export declare const ioColorsDemo: (arg0?: import("@io-gui/core").ReactiveElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
