import { IoElement } from '@io-gui/core';
export declare class IoSlidersDemo extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        number: number;
        array2: number[];
    };
    ready(): void;
}
export declare const ioSlidersDemo: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
