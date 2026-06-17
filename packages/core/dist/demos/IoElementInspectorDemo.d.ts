import { IoElement } from '@io-gui/core';
/** @internal Demo: component inspector playground. */
export declare class IoElementInspectorDemo extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        selected: any;
    };
    ready(): void;
    onElementMutated(): void;
    selectedChanged(): void;
}
export declare const ioElementInspectorDemo: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
