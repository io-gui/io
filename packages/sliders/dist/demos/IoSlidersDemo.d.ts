import { ReactiveElement } from '@io-gui/core';
export declare class IoSlidersDemo extends ReactiveElement {
    static get Style(): string;
    static get Properties(): {
        number: number;
        array2: number[];
    };
    ready(): void;
}
export declare const ioSlidersDemo: (arg0: any) => import("@io-gui/core").VDOMElement;
