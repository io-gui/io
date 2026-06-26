import { ReactiveElement } from '@io-gui/core';
/** @internal Demo: component inspector playground. */
export declare class IoInspectorDemo extends ReactiveElement {
    static get Style(): string;
    static get Properties(): {
        selected: any;
    };
    ready(): void;
    onElementMutated(): void;
    selectedChanged(): void;
}
export declare const ioInspectorDemo: (arg0?: import("@io-gui/core").ReactiveElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
