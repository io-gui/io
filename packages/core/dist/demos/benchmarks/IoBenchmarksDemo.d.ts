import { IoElement } from '@io-gui/core';
type BenchmarkMetrics = Record<string, number | string | undefined>;
export declare class IoBenchmarksDemo extends IoElement {
    #private;
    static get Style(): string;
    ready(): void;
    changed(): void;
    renderGroup(groupName: string, baselineIndex: Map<string, BenchmarkMetrics>): import("@io-gui/core").VDOMElement;
}
export declare const ioBenchmarksDemo: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
export {};
