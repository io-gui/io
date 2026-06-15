import { IoElement } from '@io-gui/core';
export declare class IoBenchmarksDemo extends IoElement {
    #private;
    static get Style(): string;
    ready(): void;
    changed(): void;
    renderGroup(groupName: string, baselineIndex: Map<string, Record<string, number | string>>): import("@io-gui/core").VDOMElement;
}
export declare const ioBenchmarksDemo: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
