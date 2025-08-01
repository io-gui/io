import { IoElement } from 'io-gui';
export declare class IoElementInspectorDemo extends IoElement {
    static get Style(): string;
    static get ReactiveProperties(): {
        selected: any;
    };
    ready(): void;
    onElementMutated(): void;
    selectedChanged(): void;
}
export declare const ioElementInspectorDemo: (arg0?: import("io-gui").IoElementProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoElementInspectorDemo.d.ts.map