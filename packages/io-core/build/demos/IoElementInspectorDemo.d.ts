import { IoElement } from 'io-core';
export declare class IoElementInspectorDemo extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        selected: any;
    };
    ready(): void;
    onElementMutated(): void;
    selectedChanged(): void;
}
export declare const ioElementInspectorDemo: (arg0?: import("io-core").IoElementProps | Array<import("io-core").VDOMElement | null> | string, arg1?: Array<import("io-core").VDOMElement | null> | string) => import("io-core").VDOMElement;
//# sourceMappingURL=IoElementInspectorDemo.d.ts.map