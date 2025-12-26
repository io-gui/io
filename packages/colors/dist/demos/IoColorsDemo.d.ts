import { IoElement } from 'io-core';
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
export declare const ioColorsDemo: (arg0?: import("io-core").IoElementProps | Array<import("io-core").VDOMElement | null> | string, arg1?: Array<import("io-core").VDOMElement | null> | string) => import("io-core").VDOMElement;
//# sourceMappingURL=IoColorsDemo.d.ts.map