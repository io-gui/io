import { IoElement } from '@io-gui/core';
export declare class IoElementInspectorDemo extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        selected: any;
    };
    ready(): void;
    onElementMutated(): void;
    selectedChanged(): void;
}
export declare const ioElementInspectorDemo: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoElementInspectorDemo.d.ts.map