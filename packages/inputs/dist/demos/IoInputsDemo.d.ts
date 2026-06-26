import { ReactiveElement } from '@io-gui/core';
export declare class IoInputsDemo extends ReactiveElement {
    static get Style(): string;
    static get Properties(): {
        string: string;
        number: number;
        boolean: boolean;
    };
    ready(): void;
}
export declare const ioInputsDemo: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
