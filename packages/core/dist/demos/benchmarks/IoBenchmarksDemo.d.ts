import { ReactiveElement } from '@io-gui/core';
type BenchmarkMetrics = Record<string, number | string | undefined>;
export declare class IoBenchmarksDemo extends ReactiveElement {
    #private;
    static get Style(): string;
    ready(): void;
    mutated(): void;
    renderGroup(groupName: string, baselineIndex: Map<string, BenchmarkMetrics>): import("@io-gui/core").VDOMElement;
}
export declare const ioBenchmarksDemo: (arg0: any) => import("@io-gui/core").VDOMElement;
export {};
