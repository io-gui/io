import { ReactiveElement } from '@io-gui/core';
export declare class IoSlidersDemo extends ReactiveElement {
    static get Style(): string;
    static get Properties(): {
        number: number;
        array2: number[];
    };
    ready(): void;
}
export declare const ioSlidersDemo: (arg0?: import("@io-gui/core").ReactiveElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
