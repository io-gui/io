import { ReactiveElement } from '@io-gui/core';
/** @internal Demo: component inspector playground. */
export declare class IoElementInspectorDemo extends ReactiveElement {
    static get Style(): string;
    static get Properties(): {
        selected: any;
    };
    ready(): void;
    onElementMutated(): void;
    selectedChanged(): void;
}
export declare const ioElementInspectorDemo: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
