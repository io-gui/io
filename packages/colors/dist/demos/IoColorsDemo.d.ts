import { IoElement } from '@io-gui/core';
export declare class IoColorsDemo extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
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
export declare const ioColorsDemo: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
