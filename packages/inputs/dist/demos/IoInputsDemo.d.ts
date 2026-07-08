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
export declare const ioInputsDemo: (arg0: any) => import("@io-gui/core").VDOMElement;
