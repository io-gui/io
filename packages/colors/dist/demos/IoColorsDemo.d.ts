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
export declare const ioColorsDemo: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoColorsDemo.d.ts.map